// src/components/TerimaTolakModal.tsx
'use client';

import { useState } from 'react';
import { Check, X, AlertCircle } from 'lucide-react';

interface Props {
  pengajuanId: number;
}

export default function TerimaTolakModal({ pengajuanId }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState<'success' | 'error' | ''>('');

  const handleAction = async (action: 'diterima' | 'ditolak') => {
    setLoading(true);
    setMsg('');
    setMsgType('');

    try {
      const res = await fetch('/api/pengajuan/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pengajuan_id: pengajuanId, status: action }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setMsg(action === 'diterima' ? 'Pengajuan diterima!' : 'Pengajuan ditolak.');
        setMsgType('success');
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setMsg(data.error || 'Gagal update');
        setMsgType('error');
      }
    } catch {
      setLoading(false);
      setMsg('Koneksi gagal');
      setMsgType('error');
    }
  };

  return (
    <>
      {/* TOMBOL KELOLA — BUTTON CANTIK, SESUAI BLING */}
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
      >
        Kelola
      </button>

      {/* MODAL — ELEGANT & PRO */}
      {open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold text-blue-700">Kelola Pengajuan</h3>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Message */}
            {msg && (
              <div
                className={`flex items-center gap-2 p-3 rounded-lg text-sm mb-4 ${
                  msgType === 'success'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                }`}
              >
                {msgType === 'success' ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                <span>{msg}</span>
              </div>
            )}

            {/* TOMBOL AKSI — KECIL, CANTIK, IKON + TEKS, HORIZONTAL */}
            <div className="flex gap-3">
              {/* TERIMA */}
              <button
                onClick={() => handleAction('diterima')}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 shadow-sm hover:shadow transition-all duration-200 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                Terima
              </button>

              {/* TOLAK */}
              <button
                onClick={() => handleAction('ditolak')}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 shadow-sm hover:shadow transition-all duration-200 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <X className="w-4 h-4" />
                )}
                Tolak
              </button>

              {/* BATAL */}
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2.5 bg-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-300 shadow-sm hover:shadow transition-all duration-200"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}