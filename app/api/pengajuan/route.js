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

  const body = await req.json();
  const { siswa_id, guru_id, topik, deskripsi, jadwal_id } = body;

  // Parse ID jadi integer
  const siswaId = parseInt(siswa_id);
  const guruId = parseInt(guru_id);
  const jadwalId = parseInt(jadwal_id);

  // Validasi semua field wajib ada
  if (!siswaId || !guruId || !topik || !jadwalId || isNaN(siswaId) || isNaN(guruId) || isNaN(jadwalId)) {
    return new Response(JSON.stringify({ error: "Data tidak lengkap atau tidak valid" }), { status: 400 });
  }

  // Cek siswa_id sesuai session
  if (siswaId !== session.user.id) {
    return new Response(JSON.stringify({ error: "Aksi tidak diizinkan" }), { status: 403 });
  }

  // Cek guru ada dan role guru
  const [guru] = await query("SELECT id, name FROM users WHERE id = ? AND role = 'guru'", [guruId]);
  if (!guru) {
    return new Response(JSON.stringify({ error: "Guru tidak ditemukan" }), { status: 400 });
  }

  // Cek jadwal milik guru itu
  const [jadwal] = await query(
    "SELECT id, hari, jam_mulai, jam_selesai FROM jadwal WHERE id = ? AND guru_id = ?",
    [jadwalId, guruId]
  );
  if (!jadwal) {
    return new Response(JSON.stringify({ error: "Jadwal tidak valid atau bukan milik guru ini" }), { status: 400 });
  }

  // Anti spam: satu siswa cuma boleh ajuin sekali per jadwal (pending)
  const [sudahAjukan] = await query(
    "SELECT id FROM pengajuan_konseling WHERE siswa_id = ? AND jadwal_id = ? AND status = 'pending'",
    [siswaId, jadwalId]
  );
  if (sudahAjukan) {
    return new Response(JSON.stringify({ error: "Kamu sudah mengajukan jadwal ini sebelumnya" }), { status: 400 });
  }

  try {
    // Insert pengajuan — deskripsi boleh kosong → kasih fallback
    const deskripsiFinal = (deskripsi?.trim() || "-");

    await query(
      `INSERT INTO pengajuan_konseling 
       (siswa_id, guru_id, topik, deskripsi, jadwal_id, status, created_at)
       VALUES (?, ?, ?, ?, ?, 'pending', NOW())`,
      [siswaId, guruId, topik, deskripsiFinal, jadwalId]
    );

    // Ambil nama siswa
    const [siswa] = await query("SELECT name FROM users WHERE id = ?", [siswaId]);

    // Kirim notif ke guru
    await createNotification(
      guruId,
      "Pengajuan Konseling Baru",
      `${siswa.name} mengajukan konseling: "${topik}"\nJadwal: ${jadwal.hari} ${jadwal.jam_mulai.slice(0,5)}-${jadwal.jam_selesai.slice(0,5)}`
    );

    return new Response(JSON.stringify({ success: true, message: "Pengajuan berhasil!" }), { status: 201 });

  } catch (error) {
    console.error("Error pengajuan:", error);
    return new Response(JSON.stringify({ error: "Gagal menyimpan pengajuan" }), { status: 500 });
  }
}