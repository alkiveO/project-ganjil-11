// src/components/LaporanModal.jsx — VERSI BIRU PREMIUM & SUPER JELAS!
'use client';
import { useState } from 'react';
import { X, FileText, Sparkles } from 'lucide-react';

export default function LaporanModal({ pengajuan, guruId }) {
  const [open, setOpen] = useState(false);
  const [isi, setIsi] = useState('');
  const [motivasi, setMotivasi] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSubmit = async () => {
    if (!isi.trim()) return;

    setLoading(true);
    setMsg('');

    try {
      const res = await fetch('/api/laporan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pengajuan_id: pengajuan.id,
          isi_laporan: isi,
          motivasi: motivasi || null
        })
      });

      const data = await res.json();

      if (res.ok) {
        setMsg('Laporan berhasil disimpan!');

        await fetch('/api/pengajuan/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pengajuan_id: pengajuan.id,
            status: 'selesai'
          })
        });

        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        setMsg(data.error || 'Gagal menyimpan laporan');
      }
    } catch (err) {
      setMsg('Terjadi kesalahan jaringan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Tombol Trigger — Sekarang biru cantik */}
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 hover:scale-105"
      >
        <FileText className="w-4.5 h-4.5" />
        Isi Laporan
      </button>

      {/* Modal Biru Premium */}
      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-300">
            {/* Header Biru Gradient */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-t-3xl relative">
              <button
                onClick={() => setOpen(false)}
                className="absolute top-5 right-5 p-2 bg-white/20 rounded-full hover:bg-white/30 transition"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-2xl">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Laporan Konseling</h3>
                  <p className="text-blue-100 text-sm mt-1">
                    Siswa: <span className="font-bold text-lg">{pengajuan.siswa_name}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-7 space-y-6">
              {/* Status Message */}
              {msg && (
                <div className={`p-4 rounded-2xl font-bold text-sm border-2 flex items-center gap-3 ${
                  msg.includes('berhasil')
                    ? 'bg-blue-50 text-blue-800 border-blue-300'
                    : 'bg-red-50 text-red-800 border-red-300'
                }`}>
                  {msg.includes('berhasil') ? (
                    <Sparkles className="w-5 h-5 text-blue-600" />
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  )}
                  {msg}
                </div>
              )}

              {/* Hasil Konseling */}
              <div>
                <label className="block text-sm font-bold text-blue-900 mb-3">
                  Hasil Konseling <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={isi}
                  onChange={(e) => setIsi(e.target.value)}
                  placeholder="Tuliskan observasi, kesimpulan, dan rekomendasi secara lengkap..."
                  className="w-full p-5 border-2 border-gray-300 rounded-2xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all resize-none text-gray-900 placeholder-gray-500 font-medium leading-relaxed"
                  rows={7}
                  required
                />
              </div>

              {/* Kata Motivasi */}
              <div>
                <label className="block text-sm font-bold text-blue-900 mb-3">
                  Kata Motivasi / Saran untuk Siswa
                </label>
                <textarea
                  value={motivasi}
                  onChange={(e) => setMotivasi(e.target.value)}
                  placeholder="Contoh: 'Kamu sudah berani membuka diri, itu langkah besar! Terus semangat ya!'"
                  className="w-full p-5 border-2 border-gray-300 rounded-2xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all resize-none text-gray-900 placeholder-gray-500 font-medium leading-relaxed"
                  rows={5}
                />
              </div>

              {/* Tombol Aksi */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={loading || !isi.trim()}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 hover:scale-105 active:scale-95"
                >
                  {loading ? (
                    <>Menyimpan Laporan...</>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Simpan & Selesaikan Konseling
                    </>
                  )}
                </button>

                <button
                  onClick={() => setOpen(false)}
                  className="px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}