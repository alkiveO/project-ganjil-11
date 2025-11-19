// app/api/pengajuan/status/route.js
import { query } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createNotification } from "@/lib/notifikasi";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "guru") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { pengajuan_id, status } = await req.json();

  if (!pengajuan_id || !['diterima', 'ditolak', 'selesai'].includes(status)) {
    return new Response(JSON.stringify({ error: "Data tidak valid" }), { status: 400 });
  }

  try {
    const [pengajuan] = await query(
      "SELECT siswa_id, topik FROM pengajuan_konseling WHERE id = ? AND guru_id = ?",
      [pengajuan_id, session.user.id]
    );

    if (!pengajuan) {
      return new Response(JSON.stringify({ error: "Pengajuan tidak ditemukan" }), { status: 404 });
    }

    await query(
      "UPDATE pengajuan_konseling SET status = ? WHERE id = ?",
      [status, pengajuan_id]
    );

    const [guru] = await query("SELECT name FROM users WHERE id = ?", [session.user.id]);
    const pesan = status === 'diterima'
      ? `Pengajuan "${pengajuan.topik}" diterima oleh ${guru.name}`
      : `Pengajuan "${pengajuan.topik}" ditolak oleh ${guru.name}`;

    await createNotification(pengajuan.siswa_id, `Pengajuan ${status}`, pesan);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Gagal update status" }), { status: 500 });
  }
}