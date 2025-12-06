'use client';
import { useState } from 'react';
import { Search, Calendar, Users } from 'lucide-react';
import GuruDetailModal from './GuruDetailModal';

export default function GuruList({ gurus: initialGurus, siswaId }) {
  const [search, setSearch] = useState('');
  const [gurus, setGurus] = useState(initialGurus);
  const [selectedGuru, setSelectedGuru] = useState(null);
  const [loading, setLoading] = useState(false);

  const filteredGurus = gurus.filter(guru =>
    guru.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSuccess = async () => {
    setLoading(true);
    setSelectedGuru(null);
    try {
      const res = await fetch('/api/guru');
      if (res.ok) {
        const data = await res.json();
        setGurus(data.gurus || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-12">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-500 w-6 h-6" />
          <input
            type="text"
            placeholder="Cari nama guru BK..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-14 pr-6 py-5 bg-white border-2 border-blue-200 rounded-3xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all shadow-xl text-lg placeholder-blue-400"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <p className="text-lg text-blue-600 font-medium">Menyegarkan data...</p>
        </div>
      ) : filteredGurus.length === 0 ? (
        <div className="text-center py-20">
          <Users className="w-24 h-24 text-blue-300 mx-auto mb-6" />
          <p className="text-2xl text-blue-600 font-bold">
            {search ? 'Guru tidak ditemukan' : 'Belum ada guru BK tersedia'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {filteredGurus.map((guru) => {
            // PAKSA MUNCUL SEMUA JADWAL
            const jadwalTersedia = guru.jadwal || [];

            return (
              <div
                key={guru.id}
                onClick={() => setSelectedGuru(guru)}
                className="group relative bg-white rounded-3xl shadow-2xl overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-500 border-4 border-transparent hover:border-blue-500"
              >
                <div className="h-80 relative overflow-hidden">
                  {guru.foto ? (
                    <img src={guru.foto} alt={guru.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                      <Users className="w-40 h-40 text-white/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <h3 className="text-3xl font-bold mb-2">{guru.name}</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-lg opacity-90">NIP: {guru.nip || '-'}</p>
                      <span className={`px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 ${jadwalTersedia.length > 0 ? 'bg-emerald-500' : 'bg-red-500'} text-white`}>
                        <Calendar className="w-4 h-4" />
                        {jadwalTersedia.length} slot
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-gradient-to-b from-blue-50 to-white text-center">
                  {guru.quote ? (
                    <p className="text-lg italic text-blue-800 font-medium">" {guru.quote} "</p>
                  ) : (
                    <p className="text-gray-500 italic text-lg">Siap mendampingi perjalananmu</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedGuru && (
        <GuruDetailModal
          guru={selectedGuru}
          siswaId={siswaId}
          onClose={() => setSelectedGuru(null)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}