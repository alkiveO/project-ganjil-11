// app/api/notifikasi/read/route.js
import { query } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  try {
    await query("UPDATE notifikasi SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE", [session.user.id]);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Gagal update" }), { status: 500 });
  }
}