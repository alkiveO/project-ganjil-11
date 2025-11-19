'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Mail, Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // FIX UTAMA: HARUS email: email, password: password
    const res = await signIn('credentials', {
      redirect: false,
      email: email,
      password: password,
    });

    if (res?.error) {
      setError('Email atau password salah!');
      console.error('Login gagal:', res.error);
      setLoading(false);
      return;
    }

    // CEK SESSION SETELAH LOGIN BERHASIL
    try {
      const sessionRes = await fetch('/api/auth/session');
      const session = await sessionRes.json();

      if (session?.user?.role === 'admin') {
        router.push('/dashboard/admin');
      } else if (session?.user?.role === 'siswa') {
        router.push('/dashboard/siswa');
      } else if (session?.user?.role === 'guru') {
        router.push('/dashboard/guru');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Gagal ambil session:', err);
      router.push('/dashboard');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 overflow-hidden relative">
      {/* ANIMATED BACKGROUND ORBS */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-4000"></div>
      </div>

      {/* GRID PATTERN */}
      <div className="absolute inset-0 bg-grid-blue-100/10 bg-[size:50px_50px] pointer-events-none"></div>

      {/* LOGIN CARD */}
      <div className="relative w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 border border-white/20 overflow-hidden">
          {/* GLASS EFFECT BORDER */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-3xl -z-10"></div>

          {/* LOGO + TITLE */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-5">
              <div className="relative group">
                <Image
                  src="/logoTB.png"
                  alt="Logo SMK Taruna Bhakti"
                  width={90}
                  height={90}
                  className="rounded-full shadow-xl ring-8 ring-blue-100/50 transition-all duration-500 group-hover:ring-blue-200/70 group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-400/20 to-purple-400/20 blur-xl -z-10 animate-pulse"></div>
              </div>
            </div>
            <h1 className="text-4xl font-bold font-serif bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              BLing
            </h1>
            <p className="text-blue-600 text-sm mt-2 font-medium">Bimbingan Konseling Digital</p>
          </div>

          {/* ERROR ALERT */}
          {error && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-700 px-5 py-3.5 rounded-2xl mb-6 text-sm text-center font-medium shadow-sm animate-pulse">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* EMAIL INPUT */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-blue-500 group-focus-within:text-blue-600 transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                placeholder="Email Anda"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-14 pr-5 py-4 bg-gradient-to-r from-blue-50/70 to-indigo-50/70 border border-blue-200/50 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300 placeholder:text-blue-400/70 font-medium text-gray-800 shadow-inner"
                required
                disabled={loading}
              />
            </div>

            {/* PASSWORD INPUT */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-blue-500 group-focus-within:text-blue-600 transition-colors">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-14 pr-5 py-4 bg-gradient-to-r from-blue-50/70 to-indigo-50/70 border border-blue-200/50 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300 placeholder:text-blue-400/70 font-medium text-gray-800 shadow-inner"
                required
                disabled={loading}
              />
            </div>

            {/* SUBMIT BUTTON */}
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
                {loading ? 'Memproses...' : 'Masuk'}
              </span>
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
              )}
            </button>
          </form>

          {/* FOOTER */}
          <div className="mt-10 text-center space-y-3">
            <p className="text-sm text-blue-600">
              Belum punya akun?{' '}
              <a href="/register" className="font-bold hover:text-indigo-700 transition-colors">
                Daftar disini
              </a>
            </p>
            <p className="text-xs text-blue-500/80 font-medium">
              © SMK Taruna Bhakti
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        .animate-pulse { animation: pulse 3s ease-in-out infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}