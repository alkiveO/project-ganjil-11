// app/register/page.tsx
import Image from 'next/image';
import { User, Mail, Lock, IdCard, School } from 'lucide-react';
import RegisterForm from '../../src/components/RegisterForm';

export const metadata = {
  title: "Daftar Siswa - BLing",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 overflow-hidden relative">
      {/* ANIMATED BACKGROUND ORBS */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-pulse [animation-delay:2s]"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-pulse [animation-delay:4s]"></div>
      </div>

      {/* GRID PATTERN */}
      <div className="absolute inset-0 bg-grid-blue-100/10 bg-[size:50px_50px] pointer-events-none"></div>

      {/* REGISTER CARD */}
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


          {/* FORM */}
          <RegisterForm />

          {/* FOOTER */}
          <div className="mt-3 text-center space-y-3">
            <p className="text-xs text-blue-500/80 font-medium">
              © SMK Taruna Bhakti
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}