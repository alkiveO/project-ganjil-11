// app/dashboard/guru/page.jsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { query } from "@/lib/db";
import PengajuanCard from "../../../src/components/PengajuanCard";
import JadwalGuru from "../../../src/components/JadwalGuru";
import HistoryKonseling from "../../../src/components/HistoryKonseling";
import NotifikasiPopover from "../../../src/components/NotifikasiPopover";
import NotifikasiData from "../../../src/components/NotifikasiData";
import Image from 'next/image';
import Link from 'next/link';
import { Bell, Calendar, FileText, Clock, User, LogOut, Settings } from 'lucide-react';

export const revalidate = 0;

export default async function GuruDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "guru") {
    return <p className="p-6 text-center text-red-600 text-xl font-bold">Akses ditolak. Hanya Guru.</p>;
  }

  const guruId = session.user.id;

  // Ambil data guru + foto + quote
  const [guru] = await query(`
    SELECT u.name, u.email, gp.foto, gp.quote
    FROM users u
    LEFT JOIN guru_profiles gp ON u.id = gp.user_id
    WHERE u.id = ?
  `, [guruId]);

  const displayName = guru?.name || "Guru BK";
  const fotoProfil = guru?.foto || null;

  // Pengajuan, jadwal, riwayat (sama kayak sebelumnya)
  const pengajuan = await query(`
    SELECT p.id, p.topik, p.deskripsi, p.status, p.created_at,
    u.name AS siswa_name, sp.nis, sp.kelas
    FROM pengajuan_konseling p
    JOIN users u ON p.siswa_id = u.id
    JOIN siswa_profiles sp ON u.id = sp.user_id
    WHERE p.guru_id = ?
    ORDER BY p.created_at DESC
  `, [guruId]);

  const jadwal = await query(`
    SELECT id, hari, jam_mulai, jam_selesai
    FROM jadwal WHERE guru_id = ?
    ORDER BY FIELD(hari,'Senin','Selasa','Rabu','Kamis','Jumat','Sabtu')
  `, [guruId]);

  const history = await query(`
    SELECT p.id, p.topik, p.created_at, u.name AS siswa_name, sp.nis, sp.kelas,
    l.hasil, l.catatan, l.file_path
    FROM pengajuan_konseling p
    JOIN users u ON p.siswa_id = u.id
    JOIN siswa_profiles sp ON u.id = sp.user_id
    JOIN laporan_konseling l ON p.id = l.pengajuan_id
    WHERE p.guru_id = ? AND p.status = 'selesai'
    ORDER BY p.created_at DESC LIMIT 5
  `, [guruId]);

  const { notifs, unread } = await NotifikasiData();

  const totalPengajuan = pengajuan.length;
  const pengajuanBaru = pengajuan.filter(p => p.status === 'pending').length; // diperbaiki
  const konselingSelesai = history.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">

      {/* NAVBAR PREMIUM */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-lg z-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Image src="/logoTB.png" alt="Logo" width={44} height={44} className="rounded-full shadow-md" />
            <div>
              <h1 className="text-2xl font-bold text-blue-700">BLing Guru</h1>
              <p className="text-xs text-blue-600">Bimbingan Konseling Digital</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <NotifikasiPopover initialNotifs={notifs} unreadCount={unread} />

            {/* DROPDOWN PROFIL GURU */}
            <div className="relative group">
              <button className="flex items-center gap-3 p-2 rounded-full hover:bg-blue-50 transition-all">
                {fotoProfil ? (
                  <Image src={fotoProfil} alt={displayName} width={48} height={48} className="rounded-full ring-4 ring-blue-200" />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl ring-4 ring-blue-200">
                    {displayName.charAt(0)}
                  </div>
                )}
                <div className="text-left hidden md:block">
                  <p className="text-sm font-semibold text-blue-800">{displayName}</p>
                  <p className="text-xs text-blue-500">Guru BK</p>
                </div>
              </button>

              {/* DROPDOWN MENU */}
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-blue-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <Link href="/dashboard/guru/profile" className="flex items-center gap-3 px-5 py-4 hover:bg-blue-50 transition rounded-t-2xl">
                  <User className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-800">Profil Saya</span>
                </Link>
                <Link href="/login" className="flex items-center gap-3 px-5 py-4 hover:bg-red-50 transition rounded-b-2xl">
                  <LogOut className="w-5 h-5 text-red-600" />
                  <span className="font-medium text-red-600">Keluar</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-28 pb-16 px-6">
        <div className="max-w-7xl mx-auto">

          {/* HEADER */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 mb-3">
              Halo, {displayName}!
            </h1>
            <p className="text-xl text-blue-600 max-w-3xl mx-auto">
              Selamat datang di dashboard guru smk Taruna Bhakti
            </p>
          </div>

{/* STATISTIK — BERWARNA */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
  {[
    { icon: FileText, label: "Total Pengajuan", value: totalPengajuan, color: "blue" },
    { icon: Bell, label: "Menunggu Konfirmasi", value: pengajuanBaru, color: "yellow" },
    { icon: User, label: "Konseling Selesai", value: konselingSelesai, color: "green" },
    { icon: Calendar, label: "Jadwal Aktif", value: jadwal.length, color: "purple" },
  ].map((stat, i) => (
    <div
      key={i}
      className="bg-white p-8 rounded-3xl shadow-xl text-center hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-gray-100"
    >
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-${stat.color}-100`}
      >
        <stat.icon className={`w-8 h-8 text-${stat.color}-600`} />
      </div>

      <p className={`text-sm font-medium text-${stat.color}-600`}>
        {stat.label}
      </p>

      <p className={`text-4xl font-bold text-${stat.color}-700 mt-2`}>
        {stat.value}
      </p>
    </div>
  ))}
</div>


          {/* JADWAL GURU */}
          <div className="bg-white rounded-3xl shadow-xl p-10 mb-12 border border-blue-100">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-blue-800">Jadwal Konseling</h2>
                <p className="text-blue-600 mt-1">Atur ketersediaan Anda untuk siswa</p>
              </div>
              <JadwalGuru guruId={guruId} existingJadwal={jadwal} />
            </div>

            {jadwal.length === 0 ? (
              <div className="text-center py-16">
                <Clock className="w-20 h-20 text-blue-200 mx-auto mb-6" />
                <p className="text-xl font-medium text-blue-500">Belum ada jadwal tersedia</p>
                <p className="text-blue-400 mt-2">Klik tombol "Atur Jadwal" untuk menambahkan</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {jadwal.map((j) => (
                  <div key={j.id} className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all">
                    <p className="text-xl font-bold text-blue-800">{j.hari}</p>
                    <p className="text-3xl font-black text-blue-900 mt-3 flex items-center gap-2">
                      <Clock className="w-6 h-6" />
                      {j.jam_mulai.slice(0,5)} - {j.jam_selesai.slice(0,5)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PENGAJUAN & RIWAYAT — TETEP SAMA TAPI LEBIH RAPI */}
          <div className="grid lg:grid-cols-2 gap-10 mb-12">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-blue-100">
              <h2 className="text-2xl font-bold text-blue-800 mb-6">Pengajuan Baru</h2>
              {pengajuan.length === 0 ? (
                <p className="text-center text-blue-400 py-10">Belum ada pengajuan</p>
              ) : (
                <div className="space-y-4">
                  {pengajuan.map((p) => (
                    <PengajuanCard key={p.id} pengajuan={p} guruId={guruId} />
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-8 border border-blue-100">
              <h2 className="text-2xl font-bold text-blue-800 mb-6">Riwayat Konseling Terakhir</h2>
              <HistoryKonseling history={history} />
            </div>
          </div>

          {/* FOOTER */}
          <div className="text-center py-10">
            <p className="text-blue-600 font-medium">
              © 2025 <span className="font-bold text-blue-800"> SMK Taruna Bhakti</span> — BLing
            </p>
            <p className="text-sm text-blue-500 mt-2">Bimbingan Konseling Digital</p>
          </div>

        </div>
      </div>
    </div>
  );
}