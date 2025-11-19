// app/api/admin/users/[id]/route.js
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function DELETE(request, context) {
  try {
    // 1. TUNGGU params (Promise)
    const params = await context.params;
    const id = params?.id;

    if (!id) {
      return NextResponse.json(
        { error: 'ID user tidak ditemukan!' },
        { status: 400 }
      );
    }

    const userId = parseInt(id, 10);
    if (isNaN(userId) || userId <= 0) {
      return NextResponse.json(
        { error: 'ID user tidak valid!' },
        { status: 400 }
      );
    }

    // 2. CEK SESSION
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized — Hanya admin!' },
        { status: 401 }
      );
    }

    // 3. NGGAK BOLEH HAPUS DIRI SENDIRI
    if (userId === session.user.id) {
      return NextResponse.json(
        { error: 'Tidak bisa kick diri sendiri!' },
        { status: 400 }
      );
    }

    // 4. HAPUS DATA TERKAIT
    await query('DELETE FROM siswa_profiles WHERE user_id = ?', [userId]);
    await query('DELETE FROM guru_profiles WHERE user_id = ?', [userId]);
    // await query('DELETE FROM konseling_records WHERE user_id = ?', [userId]);

    // 5. HAPUS USER
    const result = await query('DELETE FROM users WHERE id = ?', [userId]);
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'User tidak ditemukan!' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'User berhasil dikick!' },
      { status: 200 }
    );

  } catch (error) {
    console.error('DELETE USER ERROR:', error);
    return NextResponse.json(
      { error: 'Gagal hapus user', details: error.message },
      { status: 500 }
    );
  }
}