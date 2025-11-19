// src/components/NotifikasiData.jsx
import { query } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function NotifikasiData() {
  const session = await getServerSession(authOptions);
  if (!session) return { notifs: [], unread: 0 };

  const notifs = await query(
    `SELECT id, judul, isi, is_read, created_at 
     FROM notifikasi 
     WHERE user_id = ? 
     ORDER BY created_at DESC 
     LIMIT 10`,
    [session.user.id]
  );

  const [unreadResult] = await query(
    "SELECT COUNT(*) as count FROM notifikasi WHERE user_id = ? AND is_read = FALSE",
    [session.user.id]
  );

  return {
    notifs,
    unread: unreadResult.count
  };
}