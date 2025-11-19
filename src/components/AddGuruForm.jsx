// src/components/AddGuruForm.jsx
'use client';

import { useState } from 'react';

export default function AddGuruForm({ onSuccess }) {
  const [form, setForm] = useState({ name: '', email: '', nip: '', password: '' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    // Validasi password minimal 6 karakter
    if (form.password.length < 6) {
      setMsg('Password minimal 6 karakter!');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/guru', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        setMsg(`Guru ${form.name} berhasil ditambah!`);
        setForm({ name: '', email: '', nip: '', password: '' });
        onSuccess?.();
      } else {
        setMsg(data.error || 'Gagal menambah guru');
      }
    } catch (err) {
      setMsg('Error jaringan. Cek koneksi.');
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(''), 5000);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-blue-700">Tambah Guru BK</h3>
        <p className="text-sm text-blue-600">Isi data lengkap, termasuk password</p>
      </div>

      {msg && (
        <div className={`p-4 rounded-xl text-sm font-medium mb-6 shadow-sm ${
          msg.includes('berhasil') 
            ? 'bg-green-100 text-green-700 border border-green-200' 
            : 'bg-red-100 text-red-700 border border-red-200'
        }`}>
          {msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-2">Nama Lengkap</label>
            <input
              type="text"
              name="name"
              placeholder="Nama Guru"
              value={form.name}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all text-blue-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all text-blue-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-700 mb-2">NIP</label>
            <input
              type="text"
              name="nip"
              placeholder="NIP"
              value={form.nip}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all text-blue-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Minimal 6 karakter"
              value={form.password}
              onChange={handleChange}
              required
              minLength="6"
              disabled={loading}
              className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all text-blue-900"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 shadow-md ${
            loading
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
          }`}
        >
          {loading ? 'Menambahkan...' : 'Tambah Guru BK'}
        </button>
      </form>
    </div>
  );
}