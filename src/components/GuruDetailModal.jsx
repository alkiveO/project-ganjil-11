'use client';
import { X, Calendar, User } from 'lucide-react';
import AjukanModal from './AjukanModal';

export default function GuruDetailModal({ guru, siswaId, onClose, onSuccess }) {
  // Munculin semua jadwal (buat pamer dulu)
  const jadwalTersedia = guru.jadwal || [];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
        
        {/* Modal Kecil & Manis */}
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header Biru + Foto */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-5 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1.5 bg-white/20 rounded-full hover:bg-white/30 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden border-4 border-white">
                {guru.foto ? (
                  <img src={guru.foto} alt={guru.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-9 h-9 text-white" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold">{guru.name}</h3>
                <p className="text-xs opacity-90">Guru BK • NIP {guru.nip || '-'}</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-5 space-y-5">
            {/* Quote */}
            {guru.quote && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-xs text-blue-800 italic leading-relaxed">“{guru.quote}”</p>
              </div>
            )}

            {/* Jadwal Tersedia */}
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                Jadwal Tersedia
              </div>

              {jadwalTersedia.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {jadwalTersedia.map((j) => (
                    <span 
                      key={j.id}
                      className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-medium rounded-full"
                    >
                      {j.hari} • {j.jam_mulai.slice(0,5)}-{j.jam_selesai.slice(0,5)}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg text-center">
                  Tidak ada jadwal tersedia saat ini
                </p>
              )}
            </div>

            {/* Tombol Ajukan */}
            <AjukanModal
              guru={guru}
              siswaId={siswaId}
              jadwalList={jadwalTersedia}
              onSuccess={() => {
                onClose();
                onSuccess?.();
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}