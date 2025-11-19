// src/components/LaporanModal.jsx
'use client';
import { useState } from 'react';
import GeneratePDFButton from './GeneratePDFButton';

export default function LaporanModal({ pengajuan, guruId }) {
  const [open, setOpen] = useState(false);
  const [isi, setIsi] = useState('');
  const [motivasi, setMotivasi] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [laporanId, setLaporanId] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setMsg('');

    const res = await fetch('/api/laporan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pengajuan_id: pengajuan.id,
        isi_laporan: isi,
        motivasi
      })
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setMsg('Laporan berhasil disimpan!');
      setLaporanId(data.laporan_id);
      setTimeout(() => {
        fetch('/api/pengajuan/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pengajuan_id: pengajuan.id, status: 'selesai' })
        });
        window.location.reload();
      }, 1500);
    } else {
      setMsg(data.error || 'Gagal simpan laporan');
    }
  };

  return (
    <>
      {/* TOMBOL BUKA MODAL */}
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm shadow-md hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6-4h6m-6 8h6m-9-8a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        Isi Laporan
      </button>

      {/* MODAL BACKDROP */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slideUp">
            {/* HEADER */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
              <h3 className="text-xl font-bold">Laporan Konseling</h3>
              <p className="text-blue-100 text-sm mt-1">Sesi dengan <span className="font-medium">{pengajuan.siswa_name}</span></p>
            </div>

            {/* BODY */}
            <div className="p-6 space-y-5">
              {/* PESAN STATUS */}
              {msg && (
                <div className={`p-4 rounded-xl text-sm font-medium shadow-sm transition-all ${
                  msg.includes('berhasil')
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  <div className="flex items-center gap-2">
                    {msg.includes('berhasil') ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                    {msg}
                  </div>
                </div>
              )}

              {/* TEXTAREA: ISI LAPORAN */}
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  Isi Laporan Konseling <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Tuliskan hasil konseling, observasi, dan rekomendasi..."
                  value={isi}
                  onChange={(e) => setIsi(e.target.value)}
                  className="w-full p-4 border border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all resize-none h-36 text-blue-900 placeholder-blue-400"
                  required
                />
              </div>

              {/* TEXTAREA: MOTIVASI */}
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  Kata Motivasi / Solusi
                </label>
                <textarea
                  placeholder="Berikan semangat atau saran tindak lanjut..."
                  value={motivasi}
                  onChange={(e) => setMotivasi(e.target.value)}
                  className="w-full p-4 border border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all resize-none h-28 text-blue-900 placeholder-blue-400"
                />
              </div>

              {/* TOMBOL AKSI */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={loading || !isi.trim()}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Simpan & Selesaikan
                    </>
                  )}
                </button>

                {laporanId && (
                  <GeneratePDFButton laporanId={laporanId} />
                )}

                <button
                  onClick={() => setOpen(false)}
                  className="flex-1 bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg hover:from-gray-400 hover:to-gray-500 transition-all duration-200"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}