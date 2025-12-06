// src/components/PengajuanCard.jsx
import TerimaTolakModal from "./TerimaTolakModal";
import LaporanModal from "./LaporanModal";

export default function PengajuanCard({ pengajuan, guruId }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{pengajuan.topik}</h3>
          <p className="text-sm text-gray-600">
            {pengajuan.siswa_name} ({pengajuan.nis} - {pengajuan.kelas})
          </p>
          <p className="text-xs text-gray-500">
            {new Date(pengajuan.created_at).toLocaleString('id-ID')}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          pengajuan.status === 'pending' || pengajuan.status === 'menunggu' ? 'bg-yellow-100 text-yellow-700' :
          pengajuan.status === 'diterima' ? 'bg-green-100 text-green-700' :
          pengajuan.status === 'ditolak' ? 'bg-red-100 text-red-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          {pengajuan.status === 'pending' ? 'Menunggu' : 
           pengajuan.status === 'diterima' ? 'Diterima' :
           pengajuan.status === 'ditolak' ? 'Ditolak' : 'Selesai'}
        </span>
      </div>

      <p className="text-gray-700 mb-6">{pengajuan.deskripsi}</p>

      <div className="flex gap-3">
        {/* Tombol Kelola kalau masih pending/menunggu */}
        {(pengajuan.status === "pending" || pengajuan.status === "menunggu") && (
          <TerimaTolakModal pengajuanId={pengajuan.id} guruId={guruId} />
        )}

        {/* Tombol Isi Laporan kalau sudah diterima */}
        {pengajuan.status === "diterima" && (
          <LaporanModal pengajuan={pengajuan} guruId={guruId} />
        )}

        {/* Kalau selesai */}
        {pengajuan.status === "selesai" && (
          <div className="text-green-600 font-medium flex items-center gap-2">
            Laporan selesai
          </div>
        )}
      </div>
    </div>
  );
}