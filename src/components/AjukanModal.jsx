'use client';
import { useState, useEffect } from 'react';
import { X, Send, Heart, Users, BookOpen, Briefcase } from 'lucide-react';

const TOPIK_OPTIONS = [
  { value: "pribadi", label: "Masalah Pribadi", icon: Heart, color: "text-pink-600 bg-pink-50 border-pink-300" },
  { value: "sosial", label: "Hubungan Sosial", icon: Users, color: "text-purple-600 bg-purple-50 border-purple-300" },
  { value: "belajar", label: "Kesulitan Belajar", icon: BookOpen, color: "text-emerald-600 bg-emerald-50 border-emerald-300" },
  { value: "karier", label: "Perencanaan Karier", icon: Briefcase, color: "text-amber-600 bg-amber-50 border-amber-300" },
];

export default function AjukanModal({ guru, siswaId, jadwalList = [], onSuccess, trigger = "button" }) {
  const [open, setOpen] = useState(false);
  const [topik, setTopik] = useState('');
  const [jadwalId, setJadwalId] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
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
      const res = await fetch('/api/pengajuan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siswa_id: siswaId,
          guru_id: guru.id,
          topik,
          deskripsi: deskripsi.trim() || "-",   // FIX: ga boleh null lagi
          jadwal_id: jadwalId
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Pengajuan berhasil dikirim!");
        setOpen(false);
        onSuccess?.();
      } else {
        alert(data.error || "Gagal mengajukan!");
      }
    } catch (err) {
      alert("Error jaringan!");
    } finally {
      setLoading(false);
    }
  };

  // ... (bagian return UI sama persis kayak punya lo, ga usah diubah)
  return (
    <>
      {trigger === "button" && (
        <button
          onClick={() => setOpen(true)}
          disabled={jadwalList.length === 0}
          className={`px-8 py-3.5 rounded-2xl font-bold text-white shadow-lg transition-all duration-300 ${
            jadwalList.length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:shadow-xl hover:scale-105 active:scale-95'
          }`}
        >
          Ajukan Konseling
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xs overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-5 py-4 text-white relative">
              <button onClick={() => setOpen(false)} className="absolute top-3 right-3 p-1.5 bg-white/20 rounded-full hover:bg-white/30 transition">
                <X className="w-4 h-4" />
              </button>
              <h3 className="text-lg font-bold">Ajukan ke {guru.name}</h3>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 mb-2 block">Permasalahan</label>
                <div className="grid grid-cols-2 gap-2">
                  {TOPIK_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const selected = topik === opt.value;
                    return (
                      <label key={opt.value} className={`flex flex-col items-center py-3 px-2 rounded-xl border-2 cursor-pointer transition-all text-center ${selected ? `${opt.color} border-opacity-100 shadow-md` : 'border-gray-200 hover:border-gray-300'}`}>
                        <input type="radio" name="topik" value={opt.value} checked={selected} onChange={(e) => setTopik(e.target.value)} className="sr-only" required />
                        <Icon className="w-5 h-5 mb-1" />
                        <span className="text-[10px] font-medium leading-tight">{opt.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">Jadwal</label>
                <select value={jadwalId} onChange={(e) => setJadwalId(e.target.value)} className="w-full px-3 py-2.5 text-sm bg-white border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none text-gray-900 font-medium" required>
                  <option value="">Pilih jadwal</option>
                  {jadwalList.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.hari} {j.jam_mulai.slice(0,5)}-{j.jam_selesai.slice(0,5)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">Deskripsi (opsional)</label>
                <textarea
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-sm bg-white border-2 border-gray-300 rounded-lg resize-none focus:border-blue-600 focus:outline-none text-gray-900 placeholder-gray-400"
                  placeholder="Boleh diisi, boleh enggak..."
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={loading || !topik || !jadwalId}
                  className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-sm font-bold rounded-lg shadow hover:shadow-md transition disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {loading ? 'Mengirim...' : 'Kirim'} {!loading && <Send className="w-3.5 h-3.5" />}
                </button>
                <button type="button" onClick={() => setOpen(false)} className="px-5 py-2.5 bg-gray-100 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-200 transition">
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