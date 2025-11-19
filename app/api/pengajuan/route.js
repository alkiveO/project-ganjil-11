// app/api/pengajuan/route.js
import { query } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createNotification } from "@/lib/notifikasi";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "siswa") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { siswa_id, guru_id, topik, deskripsi, jadwal_id } = await req.json();

  // === VALIDASI INPUT ===
  if (!siswa_id || !guru_id || !topik || !deskripsi || !jadwal_id) {
    return new Response(JSON.stringify({ error: "Semua field wajib diisi" }), { status: 400 });
  }

  // Cek siswa_id sesuai session
  if (parseInt(siswa_id) !== session.user.id) {
    return new Response(JSON.stringify({ error: "Aksi tidak diizinkan" }), { status: 403 });
  }

  // === CEK GURU VALID ===
  const [guru] = await query(
    "SELECT u.id, u.name FROM users u WHERE u.id = ? AND u.role = 'guru'",
    [guru_id]
  );
  if (!guru) {
    return new Response(JSON.stringify({ error: "Guru tidak ditemukan" }), { status: 400 });
  }

  // === CEK JADWAL VALID ===
  const [jadwal] = await query(
    "SELECT id, hari, jam_mulai, jam_selesai FROM jadwal WHERE id = ? AND guru_id = ?",
    [jadwal_id, guru_id]
  );
  if (!jadwal) {
    return new Response(JSON.stringify({ error: "Jadwal tidak tersedia" }), { status: 400 });
  }

  // === CEK APAKAH JADWAL SUDAH DIAMBIL ===
  const [existing] = await query(
    "SELECT id FROM pengajuan_konseling WHERE jadwal_id = ? AND status IN ('pending', 'diterima')",
    [jadwal_id]
  );
  if (existing) {
    return new Response(JSON.stringify({ error: "Jadwal sudah diambil siswa lain" }), { status: 400 });
  }

  try {
    // === INSERT PENGAJUAN + JADWAL_ID ===
    await query(
      `INSERT INTO pengajuan_konseling 
       (siswa_id, guru_id, topik, deskripsi, jadwal_id) 
       VALUES (?, ?, ?, ?, ?)`,
      [siswa_id, guru_id, topik, deskripsi, jadwal_id]
    );

    // === AMBIL NAMA SISWA ===
    const [siswa] = await query("SELECT name FROM users WHERE id = ?", [siswa_id]);

    // === KIRIM NOTIFIKASI KE GURU ===
    await createNotification(
      guru_id,
      "Pengajuan Konseling Baru",
      `${siswa.name} mengajukan konseling: "${topik}"\nJadwal: ${jadwal.hari}, ${jadwal.jam_mulai.slice(0,5)} - ${jadwal.jam_selesai.slice(0,5)}`
    );

    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (error) {
    console.error("Error pengajuan:", error);
    return new Response(JSON.stringify({ error: "Gagal mengajukan konseling" }), { status: 500 });
  }
}