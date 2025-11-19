// src/components/GuruList.jsx
'use client';
import { useState } from 'react';
import GuruCard from './GuruCard';
import { Search, Users, AlertCircle } from 'lucide-react';

export default function GuruList({ gurus: initialGurus, siswaId }) {
  const [search, setSearch] = useState('');
  const [gurus, setGurus] = useState(initialGurus);
  const [error, setError] = useState('');

  const filteredGurus = gurus.filter(guru =>
    guru.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSuccess = async () => {
    setError('');
    try {
      const res = await fetch('/api/admin/guru'); // UBAH KE INI!
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      if (!data.gurus) throw new Error('Format data salah');

      setGurus(data.gurus);
    } catch (err) {
      console.error('Gagal refresh data:', err);
      setError('Gagal memuat ulang data guru. Coba lagi nanti.');
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="mb-6">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari nama guru..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-5 py-4 bg-white border border-blue-200 rounded-full focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all shadow-sm text-blue-700 placeholder-blue-400"
          />
        </div>
      </div>

      {filteredGurus.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-blue-300 mx-auto mb-4" />
          <p className="text-blue-500 font-medium">
            {search ? 'Guru tidak ditemukan.' : 'Belum ada guru tersedia.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGurus.map((guru) => (
            <GuruCard
              key={guru.id}
              guru={guru}
              siswaId={siswaId}
              jadwalList={guru.jadwal || []}
              onSuccess={handleSuccess}
            />
          ))}
        </div>
      )}
    </div>
  );
}