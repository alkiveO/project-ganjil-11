// src/components/HistoryKonseling.jsx
'use client';
import { Download } from 'lucide-react';

export default function HistoryKonseling({ history }) {
  if (!history || history.length === 0) {
    return <p className="text-gray-500 text-center py-6 text-sm">Belum ada riwayat konseling.</p>;
  }

  const handleDownload = (id) => {
    const link = document.createElement('a');
    link.href = `/api/laporan/pdf/${id}`;
    link.download = `Laporan_Konseling_${id}.pdf`;
    link.target = '_blank';
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statusClass = {
    pending: "bg-yellow-400 text-black",
    diterima: "bg-blue-500 text-white",
    ditolak: "bg-red-500 text-white",
    selesai: "bg-green-500 text-white",
  };

  return (
    <div className="space-y-4">
      {history.map((h) => (
        <div
          key={h.id}
          className="border rounded-xl p-5 bg-blue-50 border-blue-200 hover:shadow-md transition"
        >
          {/* HEADER */}
          <div className="flex justify-between items-start mb-2">

            <div>
              <h4 className="font-semibold text-indigo-700 text-lg">{h.topik}</h4>

              <p className="text-sm text-gray-600">
                {h.siswa_name} • {h.nis} • {h.kelas}
              </p>

              {h.guru_name && (
                <p className="text-xs text-gray-500 mt-1">
                  Dibimbing oleh:{" "}
                  <span className="font-medium text-gray-700">{h.guru_name}</span>
                </p>
              )}
            </div>

            <div className="text-right">
              {/* STATUS */}
              {h.status && (
                <span
                  className={`
                    text-xs px-3 py-1 rounded-full font-semibold 
                    ${statusClass[h.status] || "bg-gray-300 text-black"}
                  `}
                >
                  {h.status.toUpperCase()}
                </span>
              )}

              <p className="text-xs text-gray-500 mt-1">
                {new Date(h.created_at).toLocaleDateString("id-ID")}
              </p>
            </div>

          </div>

          {/* HASIL */}
          {h.hasil && (
            <div className="mt-3">
              <p className="font-medium text-gray-800 text-sm">Hasil:</p>
              <p className="text-gray-700 text-sm">{h.hasil}</p>
            </div>
          )}

          {/* MOTIVASI */}
          {h.catatan && (
            <div className="bg-green-50 p-3 rounded-lg mt-3">
              <p className="font-medium text-green-700 text-sm">Motivasi:</p>
              <p className="text-green-800 text-sm italic">"{h.catatan}"</p>
            </div>
          )}

          {/* BUTTON DOWNLOAD */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownload(h.id);
            }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 transition mt-4"
          >
            <Download className="w-5 h-5" />
            Download PDF
          </button>
        </div>
      ))}
    </div>
  );
}
