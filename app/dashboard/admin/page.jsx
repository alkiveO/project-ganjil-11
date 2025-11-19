// app/dashboard/admin/page.jsx
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LogOut, Users, UserPlus, Search, AlertCircle } from 'lucide-react';
import AddGuruForm from '../../../src/components/AddGuruForm';
import DeleteUserButton from '../../../src/components/DeleteUserButton';
import Image from 'next/image';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session?.user?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (Array.isArray(data)) setUsers(data);
      else setUsers([]);
    } catch (err) {
      console.error('Gagal fetch:', err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.role === 'admin') fetchUsers();
  }, [session]);

  const filteredUsers = Array.isArray(users) ? users.filter(user => {
    const q = search.toLowerCase();
    return (
      user.name.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q) ||
      (user.nis && user.nis.toString().includes(q)) ||
      (user.nip && user.nip.toString().includes(q))
    );
  }) : [];

  const handleUserDeleted = (deletedId) => {
    setUsers(prev => prev.filter(u => u.id !== deletedId));
    setMsg('User berhasil dikick!');
    setTimeout(() => setMsg(''), 3000);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image
              src="/logoTB.png"
              alt="Logo SMK Taruna Bhakti"
              width={40}
              height={40}
              className="rounded-full shadow-sm"
            />
            <div>
              <h1 className="text-xl font-bold text-blue-700">BLing Admin</h1>
              <p className="text-xs text-blue-600">Bimbingan Konseling Digital</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/login')}
            className="flex items-center gap-2 px-5 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition text-sm font-medium shadow-md"
          >
            <LogOut className="w-4 h-4" />
            Keluar
          </button>
        </div>
      </nav>

      <div className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">

          {/* ALERT */}
          {msg && (
            <div className="fixed top-24 right-6 z-50 flex items-center gap-2 p-4 rounded-xl bg-green-100 text-green-700 text-sm font-medium shadow-lg animate-pulse">
              <AlertCircle className="w-5 h-5" />
              {msg}
            </div>
          )}

          {/* HEADER */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-blue-700 mb-3">
              Dashboard Admin
            </h1>
            <p className="text-xl text-blue-600 max-w-2xl mx-auto">
              Kelola pengguna, tambah guru BK, dan pantau aktivitas konseling di SMK Taruna Bhakti.
            </p>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition transform hover:scale-105">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-sm text-blue-600 font-medium">Total Pengguna</p>
              <p className="text-3xl font-bold text-blue-700">{users.length}</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition transform hover:scale-105">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-sm text-blue-600 font-medium">Siswa</p>
              <p className="text-3xl font-bold text-green-700">
                {users.filter(u => u.role === 'siswa').length}
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition transform hover:scale-105">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-sm text-blue-600 font-medium">Guru BK</p>
              <p className="text-3xl font-bold text-purple-700">
                {users.filter(u => u.role === 'guru').length}
              </p>
            </div>
          </div>

          {/* FORM TAMBAH GURU */}
          <div className="mb-12">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-blue-700">Tambah Guru BK</h2>
                <p className="text-blue-600">Isi data lengkap untuk membuat akun guru baru</p>
              </div>
              <AddGuruForm onSuccess={fetchUsers} />
            </div>
          </div>

          {/* SEARCH */}
          <div className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari nama, email, NIS, atau NIP..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-5 py-4 bg-white border border-blue-200 rounded-full focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all shadow-sm text-blue-700 placeholder-blue-400"
              />
            </div>
          </div>

          {/* TABEL */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-blue-100">
              <h2 className="text-2xl font-bold text-blue-700">Daftar Pengguna</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm font-semibold text-blue-700 bg-blue-50">
                    <th className="px-6 py-4">Nama</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">NIS/NIP</th>
                    <th className="px-6 py-4">Kelas</th>
                    <th className="px-6 py-4">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-t border-blue-50 hover:bg-blue-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-blue-900">{user.name}</td>
                      <td className="px-6 py-4 text-sm text-blue-600">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                          user.role === 'guru' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-blue-600">{user.nis || user.nip || '-'}</td>
                      <td className="px-6 py-4 text-sm text-blue-600">{user.kelas || '-'}</td>
                      <td className="px-6 py-4">
                        {user.id !== session.user.id ? (
                          <DeleteUserButton
                            userId={user.id}
                            userName={user.name}
                            onDelete={handleUserDeleted}
                          />
                        ) : (
                          <span className="text-xs text-blue-400 font-medium">Anda</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && (
                <div className="text-center py-16 text-blue-500">
                  <p className="text-lg font-medium">Tidak ada pengguna ditemukan.</p>
                </div>
              )}
            </div>
          </div>

          {/* FOOTER */}
          <div className="mt-16 text-center">
            <p className="text-sm text-blue-600 font-medium">
              © 2025 <span className="font-bold">SMK Taruna Bhakti</span> — BLing
            </p>
            <p className="text-xs text-blue-500 mt-1">Bimbingan Konseling Digital</p>
          </div>
        </div>
      </div>
    </div>
  );
}