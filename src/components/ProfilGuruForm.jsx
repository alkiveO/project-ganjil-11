// src/components/ProfilGuruForm.jsx   ← NAMANYA TETEP .jsx, AMAN!
'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ProfilGuruForm({ guruId, currentData }) {
  const [quote, setQuote] = useState(currentData?.quote || '');
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(currentData?.foto || null);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // HAPUS SEMUA : React.ChangeEvent<HTMLInputElement> → GANTI PAKE BIASA AJA
  const handleFoto = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // HAPUS : React.FormEvent → BIASA AJA
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    const formData = new FormData();
    formData.append('quote', quote);
    if (foto) formData.append('foto', foto);

    try {
      const res = await fetch('/api/guru/profile', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMsg('Profil berhasil diperbarui!');
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setMsg(data.error || 'Gagal update profil');
      }
    } catch (err) {
      setMsg('Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {msg && (
        <div className={`p-4 rounded-xl text-center font-bold text-lg shadow-lg border-2 ${
          msg.includes('berhasil')
            ? 'bg-green-100 text-green-700 border-green-300'
            : 'bg-red-100 text-red-700 border-red-300'
        }`}>
          {msg}
        </div>
      )}

      {/* Upload Foto */}
      <div>
        <label className="block text-sm font-bold text-blue-700 mb-3">Upload Foto Profil</label>
        <div className="flex items-center gap-6">
          {preview ? (
            <Image 
              src={preview} 
              alt="Preview" 
              width={120} 
              height={120} 
              className="rounded-full shadow-lg border-4 border-blue-100 object-cover" 
            />
          ) : (
            <div className="w-32 h-32 bg-gray-200 border-4 border-dashed rounded-full flex items-center justify-center">
              <span className="text-gray-500 text-xs">No Photo</span>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFoto}
            className="block w-full text-sm text-blue-600 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
          />
        </div>
      </div>

      {/* Quote */}
      <div>
        <label className="block text-sm font-bold text-blue-700 mb-3">Quote Motivasi</label>
        <textarea
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          placeholder="Contoh: Setiap masalah ada jalan keluarnya. Ayo kita cari bersama."
          rows={4}
          className="w-full p-4 border-2 border-blue-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-blue-900 resize-none"
        />
      </div>

      {/* Tombol Simpan */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-4 rounded-2xl font-bold text-xl text-white transition-all shadow-lg ${
          loading 
            ? 'bg-blue-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-2xl transform hover:scale-105'
        }`}
      >
        {loading ? 'Menyimpan...' : 'Simpan Profil'}
      </button>
    </form>
  );
}