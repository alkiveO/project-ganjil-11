// app/api/admin/users/route.js
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    console.log('FETCHING USERS FROM DB...'); // DEBUG

    const users = await query(`
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.role, 
        u.created_at,
        COALESCE(sp.nis, '') AS nis,
        COALESCE(sp.kelas, '') AS kelas,
        COALESCE(gp.nip, '') AS nip
      FROM users u
      LEFT JOIN siswa_profiles sp ON u.id = sp.user_id
      LEFT JOIN guru_profiles gp ON u.id = gp.user_id
      WHERE u.role IN ('admin', 'guru', 'siswa')
      ORDER BY u.created_at DESC
    `);

    // CEK TIPE DATA
    if (!Array.isArray(users)) {
      console.error('QUERY TIDAK RETURN ARRAY:', users);
      return NextResponse.json([], { status: 200 });
    }

    if (users.length === 0) {
      console.log('DB KOSONG — TIDAK ADA USER');
      return NextResponse.json([], { status: 200 });
    }

    // FORMAT DATA AMAN
    const formatted = users.map(user => ({
      id: Number(user.id),
      name: user.name?.trim() || 'Tanpa Nama',
      email: user.email?.toLowerCase().trim() || '',
      role: user.role || 'unknown',
      nis: user.nis || null,
      kelas: user.kelas || null,
      nip: user.nip || null,
      created_at: user.created_at
    }));

    console.log(`BERHASIL AMBIL ${formatted.length} USER`);
    return NextResponse.json(formatted, { status: 200 });

  } catch (error) {
    console.error('API /admin/users ERROR:', error.message);
    return NextResponse.json(
      { error: 'Gagal mengambil data pengguna', details: error.message },
      { status: 500 }
    );
  }
}