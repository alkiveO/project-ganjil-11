// src/components/NotifikasiList.jsx
import { query } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function NotifikasiList() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const notifs = await query(
    `SELECT id, judul, isi, is_read, created_at 
     FROM notifikasi 
     WHERE user_id = ? 
     ORDER BY created_at DESC 
     LIMIT 5`,
    [session.user.id]
  );

  if (notifs.length === 0) {
    return <p className="text-sm text-gray-500">Belum ada notifikasi.</p>;
  }

  return (
    <div className="space-y-2 max-h-64 overflow-y-auto">
      {notifs.map((n) => (
        <div
          key={n.id}
          className={`p-3 rounded-lg text-sm transition ${
            n.is_read ? 'bg-gray-50' : 'bg-blue-50 border border-blue-200'
          }`}
        >
          <p className="font-medium text-indigo-700">{n.judul}</p>
          <p className="text-gray-600 text-xs">{n.isi}</p>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(n.created_at).toLocaleString('id-ID')}
          </p>
        </div>
      ))}
    </div>
  );
}