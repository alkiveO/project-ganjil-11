// src/components/ProfilSiswaForm.jsx → FINAL VERSION TERBAIK 2025
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Camera, User } from 'lucide-react';

export default function ProfilSiswaForm({ currentData }) {
  const router = useRouter();

  const [bio, setBio] = useState(currentData?.bio || '');
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(currentData?.foto || null);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFoto = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    const formData = new FormData();
    formData.append('bio', bio);
    if (foto) formData.append('foto', foto);

    try {
      const res = await fetch('/api/siswa/profile', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMsg('Profil berhasil diperbarui!');
        router.refresh();
        setTimeout(() => setMsg(''), 2500);
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
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">

      {/* PESAN SUKSES / ERROR */}
      {msg && (
        <div className={`mb-8 p-5 rounded-2xl text-center font-bold text-lg shadow-lg border-2 transition-all duration-300 ${
          msg.includes('berhasil')
            ? 'bg-blue-50 text-blue-700 border-blue-200'
            : 'bg-red-50 text-red-700 border-red-200'
        }`}>
          {msg}
        </div>
      )}

      {/* FOTO PROFIL — BULAT SEMPURNA 100% */}
      <div className="flex flex-col items-center mb-12">
        <div className="relative group">
          <div className="w-40 h-40 rounded-full overflow-hidden shadow-2xl border-8 border-white ring-4 ring-blue-100 bg-white">
            {preview ? (
              <Image
                src={preview}
                alt="Foto Profil"
                width={160}
                height={160}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <User className="w-20 h-20 text-white" />
              </div>
            )}
          </div>

          {/* Tombol Kamera */}
          <label className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-2xl cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95">
            <Camera className="w-5 h-5" />
            <input
              type="file"
              accept="image/*"
              onChange={handleFoto}
              className="hidden"
            />
          </label>
        </div>

        <p className="mt-5 text-sm font-medium text-blue-600">
          {preview ? "Klik kamera untuk ganti foto" : "Upload foto terbaikmu"}
        </p>
      </div>

      {/* BIO SINGKAT */}
      <div className="mb-10">
        <label className="block text-lg font-bold text-blue-800 mb-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold text-sm">
            i
          </div>
          Bio Singkat
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="XII RPL 1 • Ngoding sampe subuh • Future CEO • Pacar orang"
          rows={4}
          maxLength={160}
          className="w-full p-5 bg-white border-2 border-blue-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all text-blue-900 resize-none font-medium placeholder:text-blue-400 shadow-sm"
        />
        <div className="flex justify-between items-center mt-3 px-1">
          <p className="text-xs text-blue-500">Ceritain siapa kamu dalam 160 huruf</p>
          <p className="text-sm font-bold text-blue-600">{bio.length}/160</p>
        </div>
      </div>

      {/* TOMBOL SIMPAN */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-5 rounded-2xl font-bold text-xl text-white shadow-xl transition-all duration-300 transform ${
          loading
            ? 'bg-blue-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 active:shadow-lg'
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-3">
            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            Menyimpan...
          </span>
        ) : (
          'Simpan Profil'
        )}
      </button>

    </form>
  );
}