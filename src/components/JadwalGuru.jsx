// src/components/JadwalGuru.jsx
'use client';
import { useState } from 'react';
import { Calendar, Clock, Plus, X, CheckCircle, AlertCircle } from 'lucide-react';

export default function JadwalGuru({ guruId, existingJadwal = [] }) {
  const [open, setOpen] = useState(false);
  const [hari, setHari] = useState('');
  const [jamMulai, setJamMulai] = useState('');
  const [jamSelesai, setJamSelesai] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const hariList = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/jadwal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guru_id: guruId,
          hari,
          jam_mulai: jamMulai,
          jam_selesai: jamSelesai,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMsg('Jadwal berhasil ditambahkan!');
        setTimeout(() => {
          setOpen(false);
          window.location.reload();
        }, 1500);
      } else {
        setMsg(data.error || 'Gagal menambahkan jadwal');
      }
    } catch (err) {
      setMsg('Terjadi kesalahan jaringan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Tombol Buka Modal */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg transform hover:scale-105 font-medium text-sm"
      >
        <Plus className="w-4 h-4" />
        Atur Jadwal
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all animate-slideUp">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-blue-700">Atur Jadwal Konseling</h3>
                  <p className="text-sm text-blue-500">Pilih hari dan jam ketersediaan</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Alert */}
            {msg && (
              <div
                className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium mb-5 animate-pulse ${
                  msg.includes('berhasil')
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-red-100 text-red-700 border border-red-200'
                }`}
              >
                {msg.includes('berhasil') ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                {msg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Pilih Hari */}
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Hari
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {hariList.map((h) => {
                    const isTerjadwal = existingJadwal.some((j) => j.hari === h);
                    return (
                      <label
                        key={h}
                        className={`flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${
                          hari === h
                            ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold shadow-sm'
                            : isTerjadwal
                            ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                            : 'border-blue-200 bg-white hover:border-blue-400 hover:bg-blue-50 text-blue-600'
                        }`}
                      >
                        <input
                          type="radio"
                          name="hari"
                          value={h}
                          checked={hari === h}
                          onChange={(e) => setHari(e.target.value)}
                          disabled={isTerjadwal}
                          className="sr-only"
                        />
                        <span className="text-sm">
                          {h}
                          {isTerjadwal && (
                            <span className="block text-xs text-gray-500 mt-1">Terjadwal</span>
                          )}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Jam Mulai */}
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Jam Mulai
                </label>
                <input
                  type="time"
                  value={jamMulai}
                  onChange={(e) => setJamMulai(e.target.value)}
                  className="w-full p-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-blue-700 placeholder-blue-400"
                  required
                />
              </div>

              {/* Jam Selesai */}
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Jam Selesai
                </label>
                <input
                  type="time"
                  value={jamSelesai}
                  onChange={(e) => setJamSelesai(e.target.value)}
                  className="w-full p-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-blue-700 placeholder-blue-400"
                  required
                />
              </div>

              {/* Tombol Aksi */}
              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  disabled={loading || !hari || !jamMulai || !jamSelesai}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Simpan Jadwal
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Animasi CSS (bisa ditaruh di global CSS atau komponen) */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
}