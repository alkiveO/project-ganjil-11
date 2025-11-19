// app/api/admin/guru/route.js
import { NextResponse } from 'next/server';
import { getConnection, query } from '@/lib/db';
import bcrypt from 'bcryptjs';

// === POST: TAMBAH GURU ===
export async function POST(request) {
  let connection;
  try {
    const { name, email, nip, password } = await request.json();

    // Validasi
    if (!name?.trim() || !email?.trim() || !nip?.trim() || !password) {
      return NextResponse.json(
        { error: 'Semua field wajib diisi!' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password minimal 6 karakter!' },
        { status: 400 }
      );
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.toLowerCase().trim();
    const trimmedNip = nip.trim();

    // Cek duplikat
    const [existingEmail] = await query('SELECT id FROM users WHERE email = ?', [trimmedEmail]);
    if (existingEmail) {
      return NextResponse.json({ error: 'Email sudah digunakan!' }, { status: 400 });
    }

    const [existingNip] = await query('SELECT user_id FROM guru_profiles WHERE nip = ?', [trimmedNip]);
    if (existingNip) {
      return NextResponse.json({ error: 'NIP sudah digunakan!' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    connection = await getConnection();
    await connection.beginTransaction();

    const [userResult] = await connection.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [trimmedName, trimmedEmail, hashedPassword, 'guru']
    );

    const userId = userResult.insertId;

    await connection.execute(
      'INSERT INTO guru_profiles (user_id, nip) VALUES (?, ?)',
      [userId, trimmedNip]
    );

    await connection.commit();

    return NextResponse.json({
      success: true,
      message: `Guru ${trimmedName} berhasil ditambah!`,
      login: { email: trimmedEmail, password }
    });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error tambah guru:', error);
    return NextResponse.json(
      { error: 'Gagal menambah guru. Cek database.' },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}

// === GET: AMBIL SEMUA GURU (BUAT REFRESH) ===
export async function GET() {
  try {
    const rawGurus = await query(`
      SELECT 
        u.id, u.name, gp.nip,
        j.id AS jadwal_id,
        j.hari, j.jam_mulai, j.jam_selesai
      FROM users u
      JOIN guru_profiles gp ON u.id = gp.user_id
      LEFT JOIN jadwal j ON u.id = j.guru_id
      WHERE u.role = 'guru'
      ORDER BY u.name, j.hari
    `);

    // GROUPING JADWAL PER GURU
    const gurusMap = new Map();
    rawGurus.forEach(row => {
      const guruId = row.id;
      if (!gurusMap.has(guruId)) {
        gurusMap.set(guruId, {
          id: row.id,
          name: row.name,
          nip: row.nip,
          jadwal: []
        });
      }
      if (row.jadwal_id) {
        gurusMap.get(guruId).jadwal.push({
          id: row.jadwal_id,
          hari: row.hari,
          jam_mulai: row.jam_mulai,
          jam_selesai: row.jam_selesai
        });
      }
    });

    const gurus = Array.from(gurusMap.values());

    return NextResponse.json({ gurus }, { status: 200 });

  } catch (error) {
    console.error('Error fetch gurus:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data guru' },
      { status: 500 }
    );
  }
}