'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, School, Hash } from 'lucide-react';

export default function RegisterForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    nis: '',
    kelas: ''
  });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    setSuccess(false);

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setSuccess(true);
      setMsg('Berhasil daftar! Silakan login.');
      setTimeout(() => router.push('/login'), 2000);
    } else {
      setSuccess(false);
      setMsg(data.error || 'Gagal daftar');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* SUCCESS / ERROR ALERT */}
      {msg && (
        <div
          className={`px-5 py-3.5 rounded-2xl text-sm text-center font-medium shadow-sm animate-pulse transition-all ${
            success
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700'
              : 'bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-700'
          }`}
        >
          {msg}
        </div>
      )}

      {/* NAMA */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-blue-500 group-focus-within:text-blue-600 transition-colors">
          <User className="w-5 h-5" />
        </div>
        <input
          name="name"
          type="text"
          placeholder="Nama Lengkap"
          value={form.name}
          onChange={handleChange}
          className="w-full pl-14 pr-5 py-4 bg-gradient-to-r from-blue-50/70 to-indigo-50/70 border border-blue-200/50 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300 placeholder:text-blue-400/70 font-medium text-gray-800 shadow-inner"
          required
        />
      </div>

      {/* EMAIL */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-blue-500 group-focus-within:text-blue-600 transition-colors">
          <Mail className="w-5 h-5" />
        </div>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full pl-14 pr-5 py-4 bg-gradient-to-r from-blue-50/70 to-indigo-50/70 border border-blue-200/50 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300 placeholder:text-blue-400/70 font-medium text-gray-800 shadow-inner"
          required
        />
      </div>

      {/* PASSWORD */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-blue-500 group-focus-within:text-blue-600 transition-colors">
          <Lock className="w-5 h-5" />
        </div>
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full pl-14 pr-5 py-4 bg-gradient-to-r from-blue-50/70 to-indigo-50/70 border border-blue-200/50 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300 placeholder:text-blue-400/70 font-medium text-gray-800 shadow-inner"
          required
        />
      </div>

      {/* NIS */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-blue-500 group-focus-within:text-blue-600 transition-colors">
          <Hash className="w-5 h-5" />
        </div>
        <input
          name="nis"
          type="text"
          placeholder="NIS"
          value={form.nis}
          onChange={handleChange}
          className="w-full pl-14 pr-5 py-4 bg-gradient-to-r from-blue-50/70 to-indigo-50/70 border border-blue-200/50 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300 placeholder:text-blue-400/70 font-medium text-gray-800 shadow-inner"
          required
        />
      </div>

      {/* KELAS */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-blue-500 group-focus-within:text-blue-600 transition-colors">
          <School className="w-5 h-5" />
        </div>
        <input
          name="kelas"
          type="text"
          placeholder="Kelas"
          value={form.kelas}
          onChange={handleChange}
          className="w-full pl-14 pr-5 py-4 bg-gradient-to-r from-blue-50/70 to-indigo-50/70 border border-blue-200/50 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300 placeholder:text-blue-400/70 font-medium text-gray-800 shadow-inner"
          required
        />
      </div>

      {/* TOMBOL DAFTAR */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-4 rounded-2xl font-bold text-white text-lg transition-all duration-500 flex items-center justify-center relative overflow-hidden ${
          loading
            ? 'bg-gradient-to-r from-blue-400 to-indigo-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-100'
        }`}
      >
        <span className="relative z-10">
          {loading ? 'Mendaftar...' : 'Daftar'}
        </span>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
        )}
      </button>

      {/* LINK LOGIN */}
      <p className="text-center text-sm text-blue-600 mt-4">
        Sudah punya akun?{' '}
        <a href="/login" className="font-bold hover:text-indigo-700 transition-colors">
          Login disini
        </a>
      </p>
    </form>
  );
}