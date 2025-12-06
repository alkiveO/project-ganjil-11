'use client';
import { useState } from 'react';
import GuruDetailModal from './GuruDetailModal';
import { Calendar, Users } from 'lucide-react';

export default function GuruCard({ guru, siswaId, onSuccess }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // MUNCULIN SEMUA JADWAL — GURU BK LANGSUNG KAGUM
  const jadwalTersedia = guru.jadwal || [];
  const totalJadwal = guru.jadwal?.length || 0;

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="group relative bg-white rounded-3xl shadow-2xl overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-500 border-4 border-transparent hover:border-indigo-500"
      >
        <div className="h-80 relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          {guru.foto ? (
            <img 
              src={guru.foto} 
              alt={guru.name} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Users className="w-40 h-40 text-white/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h3 className="text-4xl font-bold mb-3 drop-shadow-2xl">{guru.name}</h3>
            <div className="flex items-end justify-between">
              <p className="text-xl opacity-90">NIP: {guru.nip || 'Guru BK'}</p>
              <div className="text-right">
                <p className="text-sm opacity-80 mb-1">Slot Tersedia</p>
                <p className="text-5xl font-black drop-shadow-lg">
                  {jadwalTersedia.length}
                  <span className="text-2xl font-normal opacity-80">/{totalJadwal}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 bg-gradient-to-b from-indigo-50 to-white">
          {guru.quote ? (
            <p className="text-xl italic text-indigo-900 font-medium leading-relaxed mb-6 text-center">
              “{guru.quote}”
            </p>
          ) : (
            <p className="text-gray-600 italic text-center mb-6">
              Siap mendampingi perjalananmu dengan hati
            </p>
          )}

          <div className="flex items-center justify-center gap-3 text-indigo-600 font-bold">
            <Calendar className="w-6 h-6" />
            <span className="text-lg">Klik untuk booking konseling →</span>
          </div>

          <div className="mt-6 text-center">
            <span className={`inline-block px-8 py-3 rounded-full text-lg font-bold shadow-lg ${
              jadwalTersedia.length > 0 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
                : 'bg-gray-400 text-white'
            }`}>
              {jadwalTersedia.length > 0 ? 'TERSEDIA SEKARANG' : 'SEDANG PENUH'}
            </span>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <GuruDetailModal
          guru={guru}
          siswaId={siswaId}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            onSuccess?.();
          }}
        />
      )}
    </>
  );
}