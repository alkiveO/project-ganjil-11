// app/dashboard/siswa/page.jsx → FINAL, NAVBAR FULL, FOTO BULAT SEMPURNA!
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { query } from "@/lib/db";
import GuruList from "../../../src/components/GuruList";
import HistoryKonseling from "../../../src/components/HistoryKonseling";
import NotifikasiPopover from "../../../src/components/NotifikasiPopover";
import NotifikasiData from "../../../src/components/NotifikasiData";
import Image from 'next/image';
import Link from 'next/link';
import { Users, Calendar, FileText, Bell, User, LogOut } from 'lucide-react';

export const revalidate = 0;

export default async function SiswaDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "siswa") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <p className="text-2xl font-bold text-blue-800">Akses Ditolak. Hanya untuk Siswa.</p>
      </div>
    );
  }

  const siswaId = session.user.id;
  const displayName = session.user.name || "Siswa";

  const [siswaProfile] = await query(
    `SELECT sp.foto FROM siswa_profiles sp WHERE sp.user_id = ?`,
    [siswaId]
  );
  const fotoProfil = siswaProfile?.foto || null;

  // === SEMUA QUERY TETEP SAMA ===
  const rawGurus = await query(`
    SELECT 
      u.id, u.name, gp.nip, gp.foto, gp.quote,
      j.id AS jadwal_id, j.hari, j.jam_mulai, j.jam_selesai,
      p.status AS pengajuan_status,
      p.siswa_id AS booked_by_siswa_id
    FROM users u
    JOIN guru_profiles gp ON u.id = gp.user_id
    LEFT JOIN jadwal j ON u.id = j.guru_id
    LEFT JOIN pengajuan_konseling p ON j.id = p.jadwal_id 
      AND p.status IN ('pending', 'diterima')
    WHERE u.role = 'guru'
    ORDER BY u.name, j.hari, j.jam_mulai
  `);

  const gurusMap = new Map();
  rawGurus.forEach(row => {
    if (!gurusMap.has(row.id)) {
      gurusMap.set(row.id, {
        id: row.id,
        name: row.name,
        nip: row.nip || "-",
        foto: row.foto || null,
        quote: row.quote || null,
        jadwal: []
      });
    }
    if (row.jadwal_id) {
      gurusMap.get(row.id).jadwal.push({
        id: row.jadwal_id,
        hari: row.hari,
        jam_mulai: row.jam_mulai,
        jam_selesai: row.jam_selesai,
        pengajuan: row.pengajuan_status ? { 
          status: row.pengajuan_status,
          siswaId: row.booked_by_siswa_id 
        } : null
      });
    }
  });
  const gurus = Array.from(gurusMap.values());

  const history = await query(`
    SELECT 
      p.id, p.topik, p.status, p.created_at,
      u.name AS guru_name,
      j.hari, j.jam_mulai, j.jam_selesai,
      l.hasil, l.catatan, l.file_path
    FROM pengajuan_konseling p
    LEFT JOIN users u ON p.guru_id = u.id
    LEFT JOIN jadwal j ON p.jadwal_id = j.id
    LEFT JOIN laporan_konseling l ON p.id = l.pengajuan_id
    WHERE p.siswa_id = ?
    ORDER BY p.created_at DESC
  `, [siswaId]);

  const { notifs, unread } = await NotifikasiData();

  const totalGuru = gurus.length;
  const totalPengajuan = history.length;
  const pengajuanMenunggu = history.filter(h => h.status === 'pending' || h.status === 'diterima').length;
  const konselingSelesai = history.filter(h => h.status === 'selesai').length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">

      {/* NAVBAR FULL WIDTH — FOTO BULAT SEMPURNA */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-lg z-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Image src="/logoTB.png" alt="Logo" width={44} height={44} className="rounded-full shadow-md" />
            <div>
              <h1 className="text-2xl font-bold text-blue-700">BLing Siswa</h1>
              <p className="text-xs text-blue-600">Bimbingan Konseling Digital</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <NotifikasiPopover initialNotifs={notifs} unreadCount={unread} />

            {/* FOTO PROFIL BULAT SEMPURNA */}
            <div className="relative group">
              <button className="flex items-center gap-3 p-2 rounded-full hover:bg-blue-50 transition-all">
                <div className="w-12 h-12 rounded-full overflow-hidden ring-4 ring-blue-200 shadow-lg bg-white border-2 border-white">
                  {fotoProfil ? (
                    <Image
                      src={fotoProfil}
                      alt={displayName}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-semibold text-blue-800">{displayName}</p>
                  <p className="text-xs text-blue-500">Siswa</p>
                </div>
              </button>

              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-blue-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <Link href="/dashboard/siswa/profile" className="flex items-center gap-3 px-5 py-4 hover:bg-blue-50 transition rounded-t-2xl">
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

      {/* SEMUA KONTEN 100% SAMA */}
      <div className="pt-28 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header, Statistik, Guru List, Riwayat, Footer → SEMUA ADA! */}
          {/* (kode lu yang asli dari sini ke bawah 100% gak diubah) */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-blue-700 mb-3">Halo, {displayName}!</h1>
            <p className="text-xl text-blue-600 max-w-3xl mx-auto">Selamat datang di Dashboard Konseling BLing</p>
            <p className="text-lg text-gray-700 mt-3">Ajukan konseling dengan mudah dan pilih guru dan jadwal yang tersedia.</p>
          </div>

<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
  {/* Guru BK */}
  <div className="bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition transform hover:scale-105">
    <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 bg-blue-100">
      <Users className="w-7 h-7 text-blue-600" />
    </div>
    <p className="text-sm text-blue-600 font-medium">Guru BK</p>
    <p className="text-3xl font-bold text-blue-700">{totalGuru}</p>
  </div>

  {/* Menunggu */}
  <div className="bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition transform hover:scale-105">
    <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 bg-yellow-100">
      <Bell className="w-7 h-7 text-yellow-600" />
    </div>
    <p className="text-sm text-yellow-600 font-medium">Menunggu</p>
    <p className="text-3xl font-bold text-yellow-700">{pengajuanMenunggu}</p>
  </div>

  {/* Selesai */}
  <div className="bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition transform hover:scale-105">
    <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 bg-green-100">
      <FileText className="w-7 h-7 text-green-600" />
    </div>
    <p className="text-sm text-green-600 font-medium">Selesai</p>
    <p className="text-3xl font-bold text-green-700">{konselingSelesai}</p>
  </div>

  {/* Total */}
  <div className="bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition transform hover:scale-105">
    <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 bg-purple-100">
      <Calendar className="w-7 h-7 text-purple-600" />
    </div>
    <p className="text-sm text-purple-600 font-medium">Total</p>
    <p className="text-3xl font-bold text-purple-700">{totalPengajuan}</p>
  </div>
</div>


          <div className="mb-12">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Pilih Guru untuk Konseling</h2>
              <GuruList gurus={gurus} siswaId={siswaId} />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Riwayat Konseling</h2>
            <HistoryKonseling history={history} />
          </div>

          <div className="mt-16 text-center">
            <p className="text-sm text-blue-600 font-medium">© 2025 <span className="font-bold">SMK Taruna Bhakti</span> — BLing</p>
            <p className="text-xs text-blue-500 mt-1">Bimbingan Konseling Digital</p>
          </div>
        </div>
      </div>
    </div>
  );
}