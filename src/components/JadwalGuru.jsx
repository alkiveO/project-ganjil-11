// src/components/JadwalGuru.jsx — FONT HITAM EDITION (UPDATED: AUTO REFRESH!)
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // ← BARIS BARU 1
import { Calendar, Clock, Plus, X, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function JadwalGuru({ guruId }) {
  const router = useRouter(); // ← BARIS BARU 2
  const [open, setOpen] = useState(false);
  const [hari, setHari] = useState('');
  const [jamMulai, setJamMulai] = useState('');
  const [jamSelesai, setJamSelesai] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [jadwalList, setJadwalList] = useState([]);

  const hariList = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  const loadJadwal = async () => {
    const res = await fetch(`/api/guru/jadwal?guru_id=${guruId}`);
    const data = await res.json();
    setJadwalList(data);
  };

  useEffect(() => {
    loadJadwal();
  }, [guruId]);

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

      if (res.ok) {
        setMsg('Jadwal berhasil ditambahkan!');
        setHari(''); setJamMulai(''); setJamSelesai('');
        
        router.refresh(); // ← BARIS BARU 3 (INI AJA YANG BERUBAH BRO!!)

        setTimeout(() => {
          setOpen(false);
          setMsg('');
        }, 1200);
      } else {
        const data = await res.json();
        setMsg(data.error || 'Gagal menambahkan jadwal');
      }
    } catch (err) {
        setMsg('Terjadi kesalahan jaringan');
    } finally {
      setLoading(false);
    }
  };

  const toggleSlot = async (id, currentTersedia) => {
    setLoading(true);
    await fetch('/api/guru/jadwal', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, tersedia: !currentTersedia })
    });
    loadJadwal();
    router.refresh(); // Bonus: toggle juga refresh biar statistik update
    setLoading(false);
  };

  // SEMUA YANG DI BAWAH INI 1000% SAMA PERSIS KAYAK ASLINYA
  return (
    <>
      {/* Tombol Buka Modal */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-full hover:from-blue-700 hover:to-indigo-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-bold"
      >
        <Plus className="w-5 h-5" />
        Atur Jadwal Konseling
      </button>

      {/* Daftar Jadwal */}
      {jadwalList.length > 0 && (
        <div className="mt-8 bg-white rounded-3xl shadow-xl p-8 border border-blue-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Calendar className="w-7 h-7 text-gray-700" />
            Jadwal Saya Saat Ini
          </h3>

          <div className="space-y-4">
            {jadwalList.map(j => (
              <div
                key={j.id}
                className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${
                  j.tersedia
                    ? 'bg-emerald-50 border-emerald-300 shadow-md'
                    : 'bg-red-50 border-red-300 opacity-80'
                }`}
              >
                <div className="flex items-center gap-5 text-gray-900">
                  <div className="font-bold text-lg">{j.hari}</div>

                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-5 h-5" />
                    <span className="font-medium">
                      {j.jam_mulai.substring(0,5)} – {j.jam_selesai.substring(0,5)}
                    </span>
                  </div>

                  <span className="text-sm font-medium px-3 py-1 rounded-full bg-white">
                    {j.tersedia ? 'Tersedia' : 'Tidak Tersedia'}
                  </span>
                </div>

                <button
                  onClick={() => toggleSlot(j.id, j.tersedia)}
                  disabled={loading}
                  className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all transform hover:scale-105 text-white ${
                    j.tersedia
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-emerald-500 hover:bg-emerald-600'
                  }`}
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  {j.tersedia ? 'Nonaktifkan' : 'Aktifkan Lagi'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Tambah */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Tambah Jadwal Baru</h3>
              <button onClick={() => setOpen(false)} className="text-gray-600 hover:text-black">
                <X className="w-7 h-7" />
              </button>
            </div>

            {msg && (
              <div className={`p-4 rounded-xl mb-5 flex items-center gap-3 text-sm font-medium ${
                msg.includes('berhasil') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {msg.includes('berhasil') ? <CheckCircle /> : <AlertCircle />}
                {msg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 text-gray-900">
              <div>
                <label className="block text-sm font-bold mb-3">Pilih Hari</label>

                <div className="grid grid-cols-3 gap-3">
                  {hariList.map(h => {
                    const isExist = jadwalList.some(j => j.hari === h);
                    return (
                      <label
                        key={h}
                        className={`p-4 rounded-xl border-2 text-center cursor-pointer transition-all ${
                          hari === h
                            ? 'border-blue-600 bg-blue-100 text-blue-800 font-bold'
                            : isExist
                            ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'border-gray-300 hover:border-blue-400'
                        }`}
                      >
                        <input
                          type="radio"
                          name="hari"
                          value={h}
                          checked={hari === h}
                          onChange={(e) => setHari(e.target.value)}
                          disabled={isExist}
                          className="sr-only"
                        />
                        {h}
                        {isExist && <div className="text-xs mt-1">Sudah ada</div>}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Jam Mulai</label>
                  <input
                    type="time"
                    value={jamMulai}
                    onChange={(e) => setJamMulai(e.target.value)}
                    required
                    className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Jam Selesai</label>
                  <input
                    type="time"
                    value={jamSelesai}
                    onChange={(e) => setJamSelesai(e.target.value)}
                    required
                    className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading || !hari || !jamMulai || !jamSelesai}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 rounded-xl font-bold hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {loading ? 'Menyimpan...' : 'Simpan Jadwal'}
                </button>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-8 py-4 bg-gray-100 rounded-xl font-bold hover:bg-gray-200 text-gray-900"
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