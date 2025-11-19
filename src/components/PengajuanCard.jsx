// src/components/PengajuanCard.jsx
import TerimaTolakModal from "./TerimaTolakModal";
import LaporanModal from "./LaporanModal";

export default function PengajuanCard({ pengajuan, guruId }) {
  const statusColor = {
    pending: "bg-yellow-100 text-yellow-700",
    diterima: "bg-green-100 text-green-700",
    ditolak: "bg-red-100 text-red-700",
    selesai: "bg-blue-100 text-blue-700"
  }[pengajuan.status];

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
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
          {pengajuan.status.toUpperCase()}
        </span>
      </div>

      <p className="text-gray-700 mb-4">{pengajuan.deskripsi}</p>

      <div className="flex gap-2">
        {pengajuan.status === "pending" && (
          <TerimaTolakModal pengajuanId={pengajuan.id} guruId={guruId} />
        )}
        {pengajuan.status === "diterima" && (
          <LaporanModal pengajuan={pengajuan} guruId={guruId} />
        )}
      </div>
    </div>
  );
}