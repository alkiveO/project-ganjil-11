// src/components/NotifikasiBadge.jsx
import { query } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function NotifikasiBadge() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const notifs = await query(
    "SELECT COUNT(*) as unread FROM notifikasi WHERE user_id = ? AND is_read = FALSE",
    [session.user.id]
  );

  const unread = notifs[0]?.unread || 0;
  if (unread === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
      {unread > 9 ? '9+' : unread}
    </span>
  );
}