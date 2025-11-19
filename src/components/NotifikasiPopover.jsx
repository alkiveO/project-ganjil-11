// src/components/NotifikasiPopover.jsx
'use client';

import { useState } from 'react';
import { Bell, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export default function NotifikasiPopover({ initialNotifs = [], unreadCount = 0 }) {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState(initialNotifs);
  const [loading, setLoading] = useState(false);

  const markAsRead = async () => {
    setLoading(true);
    try {
      await fetch('/api/notifikasi/read', { method: 'POST' });
      setNotifs(notifs.map(n => ({ ...n, is_read: true })));
    } catch (error) {
      console.error("Gagal tandai dibaca:", error);
    }
    setLoading(false);
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Baru saja';
    if (minutes < 60) return `${minutes} menit lalu`;
    if (hours < 24) return `${hours} jam lalu`;
    if (days < 7) return `${days} hari lalu`;
    return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="relative">
      {/* ICON NOTIFIKASI — SIMPLE, BIRU, HOVER HALUS, NO BACKGROUND PUTIH */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-blue-100 transition-all duration-200 group"
      >
        <Bell className="w-6 h-6 text-blue-600 group-hover:text-blue-700 transition" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse shadow-md">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* POPOVER — PREMIUM, ANIMATED, BLING PRO */}
      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          {/* Popover Card */}
          <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-blue-100 z-50 overflow-hidden animate-in fade-in zoom-in duration-300">
            
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  <h3 className="font-bold text-lg">Notifikasi</h3>
                  {unreadCount > 0 && (
                    <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                      {unreadCount} baru
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAsRead}
                    disabled={loading}
                    className="text-xs font-medium hover:underline flex items-center gap-1"
                  >
                    {loading ? (
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    Tandai Dibaca
                  </button>
                )}
              </div>
            </div>

            {/* Notif List */}
            <div className="max-h-96 overflow-y-auto">
              {notifs.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                    <Bell className="w-8 h-8 text-blue-500" />
                  </div>
                  <p className="text-gray-500 text-sm">Belum ada notifikasi.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifs.map((n) => (
                    <div
                      key={n.id}
                      className={`p-4 transition-all hover:bg-blue-50 ${
                        !n.is_read ? 'bg-blue-50 border-l-4 border-blue-600' : 'bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                          !n.is_read ? 'bg-blue-600 animate-pulse' : 'bg-gray-300'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className={`font-semibold text-sm ${!n.is_read ? 'text-blue-900' : 'text-gray-800'}`}>
                            {n.judul}
                          </p>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{n.isi}</p>
                          <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                            <Clock className="w-3 h-3" />
                            <span>{formatTime(n.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 text-center border-t">
              <button
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-blue-700 hover:text-blue-900 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </>
      )}

      {/* Tailwind Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoom-in {
          from { transform: scale(0.95); }
          to { transform: scale(1); }
        }
        .animate-in {
          animation: fade-in 0.25s ease-out, zoom-in 0.25s ease-out;
        }
      `}</style>
    </div>
  );
}