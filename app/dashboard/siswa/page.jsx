// app/dashboard/siswa/page.jsx
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { query } from "@/lib/db";
import GuruList from "../../../src/components/GuruList"; // HAPUS {}! DEFAULT IMPORT
import HistoryKonseling from "../../../src/components/HistoryKonseling";
import NotifikasiPopover from "../../../src/components/NotifikasiPopover";
import NotifikasiData from "../../../src/components/NotifikasiData";
import LogoutButton from "../../../src/components/LogoutButton";
import Image from 'next/image';
import { Users, Calendar, FileText, Bell } from 'lucide-react';

export const revalidate = 0;

export default async function SiswaDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "siswa") {
    return <p className="p-6">Akses ditolak. Hanya Siswa.</p>;
  }

  const siswaId = session.user.id;

  // 1. AMBIL NAMA SISWA DARI DB (siswa_profiles atau users)
  const [siswaProfile] = await query(`
    SELECT u.name
    FROM users u
    LEFT JOIN siswa_profiles sp ON u.id = sp.user_id
    WHERE u.id = ?
  `, [siswaId]);

  const displayName = siswaProfile?.name || session.user.name || "Siswa";

  // 2. DAFTAR GURU + JADWAL
  const rawGurus = await query(`
    SELECT 
      u.id, u.name, gp.nip,
      j.id AS jadwal_id,
      j.hari, j.jam_mulai, j.jam_selesai
    FROM users u
    JOIN guru_profiles gp ON u.id = gp.user_id
    LEFT JOIN jadwal j ON u.id = j.guru_id
    WHERE u.role = 'guru'
    ORDER BY u.name, j.hari
  `);

  const gurusMap = new Map();
  rawGurus.forEach(row => {
    const guruId = row.id;
    if (!gurusMap.has(guruId)) {
      gurusMap.set(guruId, {
        id: row.id,
        name: row.name,
        nip: row.nip,
        jadwal: []
      });
    }
    if (row.jadwal_id) {
      gurusMap.get(guruId).jadwal.push({
        id: row.jadwal_id,
        hari: row.hari,
        jam_mulai: row.jam_mulai,
        jam_selesai: row.jam_selesai
      });
    }
  });
  const gurus = Array.from(gurusMap.values());

  // 3. RIWAYAT KONSELING
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

  // 4. NOTIFIKASI
  const { notifs, unread } = await NotifikasiData();

  // STATISTIK
  const totalGuru = gurus.length;
  const totalPengajuan = history.length;
  const pengajuanMenunggu = history.filter(h => h.status === 'menunggu').length;
  const konselingSelesai = history.filter(h => h.status === 'selesai').length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image src="/logoTB.png" alt="Logo" width={40} height={40} className="rounded-full shadow-sm" />
            <div>
              <h1 className="text-xl font-bold text-blue-700">BLing Siswa</h1>
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

          {/* HEADER - CUMA NAMA */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-blue-700 mb-3">
              Halo, {displayName}!
            </h1>
            <p className="text-xl text-blue-600 max-w-3xl mx-auto">
              Selamat datang di Dashboard Konseling BLing
            </p>
            <p className="text-lg text-gray-700 mt-3">
              Ajukan konseling dengan mudah dan pilih guru dan jadwal yang tersedia.
            </p>
          </div>

          {/* STATISTIK */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition transform hover:scale-105">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-7 h-7 text-blue-600" />
              </div>
              <p className="text-sm text-blue-600 font-medium">Guru</p>
              <p className="text-3xl font-bold text-blue-700">{totalGuru}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition transform hover:scale-105">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Bell className="w-7 h-7 text-orange-600" />
              </div>
              <p className="text-sm text-blue-600 font-medium">Menunggu</p>
              <p className="text-3xl font-bold text-orange-700">{pengajuanMenunggu}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition transform hover:scale-105">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="w-7 h-7 text-green-600" />
              </div>
              <p className="text-sm text-blue-600 font-medium">Selesai</p>
              <p className="text-3xl font-bold text-green-700">{konselingSelesai}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition transform hover:scale-105">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-7 h-7 text-purple-600" />
              </div>
              <p className="text-sm text-blue-600 font-medium">Total</p>
              <p className="text-3xl font-bold text-purple-700">{totalPengajuan}</p>
            </div>
          </div>

          {/* DAFTAR GURU */}
          <div className="mb-12">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-blue-700 mb-6">Pilih Guru untuk Konseling</h2>
              <GuruList gurus={gurus} siswaId={siswaId} />
            </div>
          </div>

          {/* RIWAYAT KONSELING */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-blue-700 mb-6">Riwayat Konseling</h2>
            <HistoryKonseling history={history} />
          </div>

          {/* FOOTER */}
          <div className="mt-16 text-center">
            <p className="text-sm text-blue-600 font-medium">
              © 2025 <span className="font-bold">SMK Taruna Bhakti</span> — BLing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}