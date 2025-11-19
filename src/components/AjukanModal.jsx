// src/components/AjukanModal.jsx
'use client';
import { useState, useRef, useEffect } from 'react';
import { X, Send, Calendar, FileText } from 'lucide-react';

export default function AjukanModal({ guru, siswaId, jadwalList = [], onSuccess }) {
  const [open, setOpen] = useState(false);
  const [topik, setTopik] = useState('');
  const [jadwalId, setJadwalId] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [loading, setLoading] = useState(false);
  const topikRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => topikRef.current?.focus(), 100); // Fokus halus
      setTopik('');
      setJadwalId('');
      setDeskripsi('');
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topik || !jadwalId) return;
    setLoading(true);
    try {
      await fetch('/api/pengajuan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siswa_id: siswaId, guru_id: guru.id, topik, deskripsi: deskripsi.trim(), jadwal_id: jadwalId })
      });
      setTimeout(() => { setOpen(false); onSuccess?.(); }, 800); // Tutup halus
    } catch {}
    setLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={jadwalList.length === 0}
        className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-1.5 shadow-sm transition-all duration-200 ease-in-out ${
          jadwalList.length === 0
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
        }`}
      >
        {jadwalList.length === 0 ? 'Jadwal Kosong' : (
          <>
            <Send className="w-4 h-4" />
            Ajukan
          </>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-blue-900">Ajukan ke {guru.name}</h3>
              <button onClick={() => setOpen(false)} className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-150">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* TOPIK — SUPER SMOOTH */}
              <div>
                <label className="text-sm font-semibold text-blue-800">Topik *</label>
                <div className="relative">
                  <select
                    ref={topikRef}
                    value={topik}
                    onChange={(e) => setTopik(e.target.value)}
                    className="mt-2 w-full px-4 py-3.5 bg-white border-2 border-blue-300 rounded-xl text-sm font-medium text-blue-900 
                               focus:border-blue-600 focus:outline-none appearance-none cursor-pointer
                               transition-all duration-200 ease-in-out"
                    required
                  >
                    <option value="">Pilih Topik</option>
                    <option value="pribadi">Masalah Pribadi</option>
                    <option value="sosial">Hubungan Sosial</option>
                    <option value="belajar">Kesulitan Belajar</option>
                    <option value="karier">Perencanaan Karier</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* JADWAL — SUPER SMOOTH */}
              <div>
                <label className="text-sm font-semibold text-blue-800 flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> Jadwal *
                </label>
                <div className="relative">
                  <select
                    value={jadwalId}
                    onChange={(e) => setJadwalId(e.target.value)}
                    className="mt-2 w-full px-4 py-3.5 bg-white border-2 border-blue-300 rounded-xl text-sm font-medium text-blue-900 
                               focus:border-blue-600 focus:outline-none appearance-none cursor-pointer
                               transition-all duration-200 ease-in-out"
                    required
                  >
                    <option value="">Pilih Jadwal</option>
                    {jadwalList.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.hari} | {j.jam_mulai.slice(0,5)} - {j.jam_selesai.slice(0,5)}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* DESKRIPSI */}
              <div>
                <label className="text-sm font-semibold text-blue-800 flex items-center gap-1">
                  <FileText className="w-4 h-4" /> Deskripsi
                </label>
                <textarea
                  placeholder="Opsional..."
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  rows={2}
                  maxLength={200}
                  className="mt-2 w-full px-4 py-3 border-2 border-blue-300 rounded-xl text-sm text-blue-900 placeholder-blue-400 resize-none 
                             focus:border-blue-600 focus:outline-none transition-all duration-200 ease-in-out"
                />
              </div>

              {/* TOMBOL — SMOOTH */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading || !topik || !jadwalId}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold text-sm shadow-md 
                             hover:shadow-lg disabled:opacity-50 transition-all duration-200 ease-in-out"
                >
                  {loading ? 'Mengirim...' : 'Kirim'}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-200 
                             transition-all duration-200 ease-in-out"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}