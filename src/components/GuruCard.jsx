// src/components/GuruCard.jsx
import AjukanModal from "./AjukanModal";
import { Calendar, Clock } from 'lucide-react';

export default function GuruCard({ guru, siswaId, jadwalList = [], onSuccess }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
      <div className="flex items-center mb-4">
        <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center">
          <span className="text-blue-700 font-bold text-lg">
            {guru.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="font-bold text-blue-900 text-lg">{guru.name}</h3>
          <p className="text-sm text-blue-600">NIP: {guru.nip || '-'}</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <p className="text-sm font-semibold text-blue-700">Jadwal Tersedia</p>
        </div>

        {jadwalList.length > 0 ? (
          <div className="space-y-2">
            {jadwalList.map((j) => (
              <div
                key={j.id}
                className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 p-2.5 rounded-lg text-xs font-medium text-blue-800"
              >
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {j.hari}
                </span>
                <span>{j.jam_mulai.slice(0, 5)} - {j.jam_selesai.slice(0, 5)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">Belum ada jadwal</p>
        )}
      </div>

      <AjukanModal guru={guru} siswaId={siswaId} jadwalList={jadwalList} onSuccess={onSuccess} />
    </div>
  );
}