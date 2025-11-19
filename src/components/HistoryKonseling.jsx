// src/components/HistoryKonseling.jsx
'use client';
export default function HistoryKonseling({ history }) {
  if (!history || history.length === 0) {
    return (
      <p className="text-gray-500 text-center py-6 text-sm">
        Belum ada riwayat konseling.
      </p>
    );
  }

  const handleDownload = async (id) => {
    try {
      const res = await fetch(`/api/laporan/pdf/${id}`);
      if (!res.ok) throw new Error("Gagal download");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `laporan_konseling_${id}.pdf`; // Nama file
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Gagal download PDF: " + error.message);
    }
  };

  return (
    <div className="space-y-4">
      {history.map((h, index) => (
        <div
          key={`${h.id}-${index}`}
          className="border rounded-xl p-5 bg-blue-50 border-blue-200 hover:shadow-md transition"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-semibold text-indigo-700 text-lg">{h.topik}</h4>
              <p className="text-sm text-gray-600">
                {h.siswa_name} • {h.nis} • {h.kelas}
              </p>
            </div>
            <p className="text-xs text-gray-500">
              {new Date(h.created_at).toLocaleDateString('id-ID')}
            </p>
          </div>

          {h.hasil && (
            <div className="mt-3">
              <p className="font-medium text-gray-800 text-sm">Hasil:</p>
              <p className="text-gray-700 text-sm">{h.hasil}</p>
            </div>
          )}

          {h.catatan && (
            <div className="bg-green-50 p-3 rounded-lg mt-3">
              <p className="font-medium text-green-700 text-sm">Motivasi:</p>
              <p className="text-green-800 text-sm italic">"{h.catatan}"</p>
            </div>
          )}

          {/* TOMBOL DOWNLOAD LANGSUNG */}
          <button
            onClick={() => handleDownload(h.id)}
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition mt-3"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2-2z" />
            </svg>
            Download PDF
          </button>
        </div>
      ))}
    </div>
  );
}