// app/api/jadwal/route.js — VERSI ULTIMATE: POST + GET + PATCH
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const guru_id = searchParams.get('guru_id');

  if (!guru_id) {
    return NextResponse.json({ error: 'guru_id diperlukan' }, { status: 400 });
  }

  try {
    const rows = await query(
      `SELECT id, hari, jam_mulai, jam_selesai, tersedia 
       FROM jadwal 
       WHERE guru_id = ? 
       ORDER BY 
         FIELD(hari, 'Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'),
         jam_mulai`,
      [guru_id]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error('GET /api/jadwal error:', error);
    return NextResponse.json({ error: 'Gagal mengambil jadwal' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { guru_id, hari, jam_mulai, jam_selesai } = body;

    // Validasi input
    if (!guru_id || !hari || !jam_mulai || !jam_selesai) {
      return NextResponse.json(
        { error: 'Semua field wajib diisi!' },
        { status: 400 }
      );
    }

    // Validasi jam logika
    const mulai = new Date(`2000-01-01 ${jam_mulai}`);
    const selesai = new Date(`2000-01-01 ${jam_selesai}`);
    if (mulai >= selesai) {
      return NextResponse.json(
        { error: 'Jam mulai harus sebelum jam selesai!' },
        { status: 400 }
      );
    }

    // Cek apakah hari sudah ada jadwal (guru tidak boleh dobel)
    const cek = await query(
      `SELECT id FROM jadwal WHERE guru_id = ? AND hari = ?`,
      [guru_id, hari]
    );

    if (cek.length > 0) {
      return NextResponse.json(
        { error: `Hari ${hari} sudah ada jadwal! Hapus atau nonaktifkan dulu.` },
        { status: 400 }
      );
    }

    // INSERT jadwal baru (tersedia = 1 otomatis)
    const result = await query(
      `INSERT INTO jadwal (guru_id, hari, jam_mulai, jam_selesai, tersedia) 
       VALUES (?, ?, ?, ?, 1)`,
      [guru_id, hari, jam_mulai, jam_selesai]
    );

    return NextResponse.json({
      success: true,
      message: 'Jadwal berhasil ditambahkan!',
      id: result.insertId
    }, { status: 201 });

  } catch (error) {
    console.error('POST /api/jadwal ERROR:', error);
    return NextResponse.json(
      { error: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const { id, tersedia } = await request.json();

    if (!id || tersedia === undefined) {
      return NextResponse.json(
        { error: 'ID jadwal dan status tersedia diperlukan' },
        { status: 400 }
      );
    }

    const result = await query(
      `UPDATE jadwal SET tersedia = ? WHERE id = ?`,
      [tersedia ? 1 : 0, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Jadwal tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: tersedia ? 'Slot berhasil diaktifkan kembali!' : 'Slot dinonaktifkan'
    });

  } catch (error) {
    console.error('PATCH /api/jadwal ERROR:', error);
    return NextResponse.json(
      { error: 'Gagal update status jadwal' },
      { status: 500 }
    );
  }
}