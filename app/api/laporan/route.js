// app/api/laporan/route.js
import { query } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createNotification } from "@/lib/notifikasi";
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "guru") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { pengajuan_id, isi_laporan, motivasi } = await req.json();

  if (!pengajuan_id || !isi_laporan) {
    return new Response(JSON.stringify({ error: "Laporan wajib diisi" }), { status: 400 });
  }

  try {
    const [pengajuan] = await query(
      "SELECT siswa_id, topik FROM pengajuan_konseling WHERE id = ? AND guru_id = ?",
      [pengajuan_id, session.user.id]
    );

    if (!pengajuan) {
      return new Response(JSON.stringify({ error: "Pengajuan tidak ditemukan" }), { status: 404 });
    }

    const filename = `laporan_${pengajuan_id}_${Date.now()}.txt`;
    const filepath = path.join(process.cwd(), 'public', 'laporan', filename);
    await writeFile(filepath, `Isi Laporan:\n${isi_laporan}\n\nMotivasi:\n${motivasi || '-'}`);

    const result = await query(
      "INSERT INTO laporan_konseling (pengajuan_id, guru_id, siswa_id, hasil, catatan, file_path) VALUES (?, ?, ?, ?, ?, ?)",
      [pengajuan_id, session.user.id, pengajuan.siswa_id, isi_laporan, motivasi || null, `/laporan/${filename}`]
    );

    // Update status jadi selesai
    await query("UPDATE pengajuan_konseling SET status = 'selesai' WHERE id = ?", [pengajuan_id]);

    // Kirim notif ke siswa
    await createNotification(
      pengajuan.siswa_id,
      "Konseling Selesai",
      `Laporan konseling "${pengajuan.topik}" telah selesai. Download PDF di dashboard.`
    );

    return new Response(JSON.stringify({ success: true, laporan_id: result.insertId }), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Gagal simpan laporan" }), { status: 500 });
  }
}