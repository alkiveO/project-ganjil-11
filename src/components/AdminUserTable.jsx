// src/components/AdminUserTable.jsx
'use client';
import { useEffect, useState } from 'react';

export default function AdminUserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center py-8">Loading...</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="text-left text-sm font-semibold text-gray-700 border-b">
            <th className="pb-3">Nama</th>
            <th className="pb-3">Email</th>
            <th className="pb-3">Role</th>
            <th className="pb-3">NIS/Kelas</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-t hover:bg-gray-50">
              <td className="py-3">{user.name}</td>
              <td className="py-3 text-sm text-gray-600">{user.email}</td>
              <td className="py-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                  user.role === 'guru' ? 'bg-blue-100 text-blue-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {user.role}
                </span>
              </td>
              <td className="py-3 text-sm text-gray-600">
                {user.nis ? `${user.nis} / ${user.kelas}` : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}