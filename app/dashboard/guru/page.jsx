// app/dashboard/guru/page.jsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { query } from "@/lib/db";
import PengajuanCard from "../../../src/components/PengajuanCard";
import JadwalGuru from "../../../src/components/JadwalGuru";
import HistoryKonseling from "../../../src/components/HistoryKonseling"; // PAKAI YANG UDAH DIPERBAIKI
import NotifikasiPopover from "../../../src/components/NotifikasiPopover";
import NotifikasiData from "../../../src/components/NotifikasiData";
import LogoutButton from "../../../src/components/LogoutButton";
import Image from 'next/image';
import { Bell, Calendar, FileText, Clock, UserCheck } from 'lucide-react';

export const revalidate = 0;

export default async function GuruDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "guru") {
    return <p className="p-6">Akses ditolak. Hanya Guru.</p>;
  }

  const guruId = session.user.id;

  // 1. AMBIL NAMA GURU DARI DB
  const [guruProfile] = await query(`
    SELECT u.name
    FROM users u
    WHERE u.id = ?
  `, [guruId]);

  const displayName = guruProfile?.name || session.user.name || "Guru";

  // 2. PENGAJUAN SISWA KE GURU INI
  const pengajuan = await query(`
    SELECT 
      p.id, p.topik, p.deskripsi, p.status, p.created_at,
      u.name AS siswa_name, sp.nis, sp.kelas
    FROM pengajuan_konseling p
    JOIN users u ON p.siswa_id = u.id
    JOIN siswa_profiles sp ON u.id = sp.user_id
    WHERE p.guru_id = ?
    ORDER BY p.created_at DESC
  `, [guruId]);

  // 3. JADWAL GURU
  const jadwal = await query(`
    SELECT id, hari, jam_mulai, jam_selesai
    FROM jadwal
    WHERE guru_id = ?
    ORDER BY FIELD(hari, 'Senin','Selasa','Rabu','Kamis','Jumat','Sabtu')
  `, [guruId]);

  // 4. RIWAYAT KONSELING (HANYA YANG SELESAI & DIBUAT GURU INI)
  const history = await query(`
    SELECT 
      p.id, p.topik, p.created_at,
      u.name AS siswa_name, sp.nis, sp.kelas,
      l.hasil, l.catatan, l.file_path
    FROM pengajuan_konseling p
    JOIN users u ON p.siswa_id = u.id
    JOIN siswa_profiles sp ON u.id = sp.user_id
    JOIN laporan_konseling l ON p.id = l.pengajuan_id
    WHERE p.guru_id = ? AND p.status = 'selesai'
    ORDER BY p.created_at DESC
    LIMIT 5
  `, [guruId]);

  // 5. NOTIFIKASI
  const { notifs, unread } = await NotifikasiData();

  // STATISTIK
  const totalPengajuan = pengajuan.length;
  const pengajuanBaru = pengajuan.filter(p => p.status === 'menunggu').length;
  const konselingSelesai = history.length;

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
              <h1 className="text-xl font-bold text-blue-700">BLing Guru</h1>
              <p className="text-xs text-blue-600">Bimbingan Konseling Digital</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <NotifikasiPopover initialNotifs={notifs} unreadCount={unread} />
            <LogoutButton />
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">

          {/* HEADER - PERSONAL DENGAN NAMA GURU */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-blue-700 mb-3">
              Halo, {displayName}!
            </h1>
            <p className="text-xl text-blue-600 max-w-3xl mx-auto">
              Pantau pengajuan siswa, atur jadwal, dan kelola riwayat konseling dengan mudah.
            </p>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition transform hover:scale-105">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="w-7 h-7 text-blue-600" />
              </div>
              <p className="text-sm text-blue-600 font-medium">Total Pengajuan</p>
              <p className="text-3xl font-bold text-blue-700">{totalPengajuan}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition transform hover:scale-105">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Bell className="w-7 h-7 text-orange-600" />
              </div>
              <p className="text-sm text-blue-600 font-medium">Menunggu Konfirmasi</p>
              <p className="text-3xl font-bold text-orange-700">{pengajuanBaru}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition transform hover:scale-105">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <UserCheck className="w-7 h-7 text-green-600" />
              </div>
              <p className="text-sm text-blue-600 font-medium">Konseling Selesai</p>
              <p className="text-3xl font-bold text-green-700">{konselingSelesai}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition transform hover:scale-105">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-7 h-7 text-purple-600" />
              </div>
              <p className="text-sm text-blue-600 font-medium">Jadwal Aktif</p>
              <p className="text-3xl font-bold text-purple-700">{jadwal.length}</p>
            </div>
          </div>

          {/* JADWAL GURU */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-blue-700">Jadwal Konseling</h2>
                <p className="text-blue-600">Atur ketersediaan Anda untuk siswa</p>
              </div>
              <JadwalGuru guruId={guruId} existingJadwal={jadwal} />
            </div>

            {jadwal.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 text-blue-300 mx-auto mb-4" />
                <p className="text-blue-500 font-medium">Belum ada jadwal. Atur sekarang!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {jadwal.map((j) => (
                  <div
                    key={j.id}
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 hover:shadow-md transition"
                  >
                    <p className="font-bold text-blue-700 text-lg">{j.hari}</p>
                    <p className="text-blue-600 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {j.jam_mulai.slice(0, 5)} - {j.jam_selesai.slice(0, 5)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PENGAJUAN BARU */}
          <div className="mb-12">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-blue-700 mb-6">Pengajuan Baru</h2>
              {pengajuan.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-blue-300 mx-auto mb-4" />
                  <p className="text-blue-500 font-medium">Belum ada pengajuan baru.</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {pengajuan.map((p) => (
                    <PengajuanCard key={p.id} pengajuan={p} guruId={guruId} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIWAYAT KONSELING (5 TERAKHIR) */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-blue-700 mb-6">
              Riwayat Konseling (5 Terakhir)
            </h2>
            <HistoryKonseling history={history} />
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