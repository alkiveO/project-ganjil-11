// app/api/jadwal/route.js
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

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
        { error: `Hari ${hari} sudah ada jadwal!` },
        { status: 400 }
      );
    }

    // INSERT ke database
    const result = await query(
      `INSERT INTO jadwal (guru_id, hari, jam_mulai, jam_selesai) VALUES (?, ?, ?, ?)`,
      [guru_id, hari, jam_mulai, jam_selesai]
    );

    if (result.affectedRows > 0) {
      return NextResponse.json(
        { success: true, message: 'Jadwal berhasil disimpan!', id: result.insertId },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { error: 'Gagal menyimpan jadwal ke database' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API /api/jadwal ERROR:', error);
    return NextResponse.json(
      { error: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}