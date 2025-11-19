// app/page.tsx
import Image from "next/image";
import Link from "next/link";
import { Heart, Users, Briefcase, BookOpen, Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image
              src="/logoTB.png"
              alt="Logo SMK Taruna Bhakti"
              width={50}
              height={50}
              className="rounded-full"
            />
            <div>
              <h1 className="text-xl font-bold text-blue-700">BLing</h1>
              <p className="text-xs text-blue-600">Bimbingan Konseling Digital</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition text-sm font-medium"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="px-5 py-2 border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition text-sm font-medium"
            >
              Daftar
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-10">
            <Image
              src="/logoTB.png"
              alt="Logo SMK Taruna Bhakti"
              width={120}
              height={120}
              className="mx-auto rounded-full shadow-lg"
            />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-blue-700 mb-6">
            Selamat Datang di <span className="text-blue-900">BLing</span>
          </h1>
          <p className="text-xl text-blue-600 max-w-3xl mx-auto mb-10">
            Platform Bimbingan Konseling Digital untuk Siswa, Guru, dan Admin di <strong>SMK Taruna Bhakti</strong>. 
            Ajukan konseling, atur jadwal, dan pantau riwayat dengan mudah.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard/siswa"
              className="px-8 py-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition text-lg font-semibold shadow-lg"
            >
              Siswa: Ajukan Konseling
            </Link>
            <Link
              href="/dashboard/guru"
              className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-full hover:bg-blue-50 transition text-lg font-semibold shadow-lg"
            >
              Guru: Kelola Pengajuan
            </Link>
          </div>
        </div>
      </section>

      {/* FITUR SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-blue-700 mb-16">
            Fitur Unggulan BLing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* FITUR 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition transform hover:scale-105">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-blue-700 mb-3">Pilih Jadwal Sendiri</h3>
              <p className="text-blue-600">
                Siswa bisa memilih jadwal konseling sesuai ketersediaan guru.
              </p>
            </div>

            {/* FITUR 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition transform hover:scale-105">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-blue-700 mb-3">Notifikasi Real-time</h3>
              <p className="text-blue-600">
                Guru & siswa mendapat notifikasi saat pengajuan diterima/ditolak.
              </p>
            </div>

            {/* FITUR 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition transform hover:scale-105">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-blue-700 mb-3">Laporan PDF Otomatis</h3>
              <p className="text-blue-600">
                Guru bisa download laporan konseling dalam format PDF.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LAYANAN KONSELING SECTION */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-blue-700 mb-16">
            Jenis Layanan Konseling
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* PRIBADI */}
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition transform hover:scale-105">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <Heart className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-blue-700 mb-3">Konseling Pribadi</h3>
              <p className="text-blue-600">
                Bantu atasi masalah emosi, stres, atau kepercayaan diri.
              </p>
            </div>

            {/* SOSIAL */}
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition transform hover:scale-105">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-blue-700 mb-3">Konseling Sosial</h3>
              <p className="text-blue-600">
                Perbaiki hubungan dengan teman, keluarga, atau lingkungan.
              </p>
            </div>

            {/* KARIER */}
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition transform hover:scale-105">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <Briefcase className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-blue-700 mb-3">Konseling Karier</h3>
              <p className="text-blue-600">
                Bantu pilih jurusan, karier, atau persiapan kerja.
              </p>
            </div>

            {/* BELAJAR */}
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition transform hover:scale-105">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <BookOpen className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-blue-700 mb-3">Konseling Belajar</h3>
              <p className="text-blue-600">
                Tingkatkan motivasi, teknik belajar, dan prestasi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONI SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-blue-700 mb-16">
            Apa Kata Mereka?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* TESTIMONI 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="flex items-center mb-5">
                <div className="w-14 h-14 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold text-xl">
                  K
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-800">Kaysha Salsabila</h4>
                  <p className="text-sm text-blue-600">XI BRF 2</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Dengan BLing, saya bisa langsung ajukan konseling tanpa antri. Guru juga cepat respon!"
              </p>
            </div>

            {/* TESTIMONI 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="flex items-center mb-5">
                <div className="w-14 h-14 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold text-xl">
                  V
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-800">Gianna Vella</h4>
                  <p className="text-sm text-blue-600">XI BRF 2</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Jadwal konseling jadi lebih fleksibel. Saya bisa pilih waktu yang pas buat saya."
              </p>
            </div>

            {/* TESTIMONI 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="flex items-center mb-5">
                <div className="w-14 h-14 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold text-xl">
                  J
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-800">Joana Hyunika</h4>
                  <p className="text-sm text-blue-600">XI BRF 3</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Laporan PDF-nya rapi banget. Bisa buat bukti kalau saya sudah ikut konseling."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CANTIK PRO */}
      <footer className="bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* LOGO & INFO */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <Image
                  src="/logoTB.png"
                  alt="Logo SMK Taruna Bhakti"
                  width={60}
                  height={60}
                  className="rounded-full shadow-lg"
                />
                <div>
                  <h3 className="font-bold text-xl">SMK Taruna Bhakti</h3>
                  <p className="text-sm opacity-90">Yayasan Setiya Bhakti</p>
                </div>
              </div>
              <p className="text-sm opacity-80">
                Platform Bimbingan Konseling Digital untuk masa depan yang lebih baik.
              </p>
            </div>

            {/* KONTAK */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Kontak Kami</h4>
              <div className="space-y-3 text-sm opacity-90">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+62 30 0912 0830</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>info@smktarunabhakti.sch.id</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Jl. Kenangan No. 30, Depok</span>
                </div>
              </div>
            </div>

            {/* SOSIAL MEDIA: Facebook → YouTube → Instagram */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Ikuti Kami</h4>
              <div className="flex gap-3">
                {/* FACEBOOK */}
                <a
                  href="#"
                  className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition transform hover:scale-110"
                  title="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                {/* YOUTUBE */}
                <a
                  href="#"
                  className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition transform hover:scale-110"
                  title="YouTube"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M23.498 6.186a2.94 2.94 0 0 0-2.07-2.07C19.383 3.5 12 3.5 12 3.5s-7.383 0-9.428.616a2.94 2.94 0 0 0-2.07 2.07C0 8.23 0 12 0 12s0 3.77.502 5.814a2.94 2.94 0 0 0 2.07 2.07C4.617 20.5 12 20.5 12 20.5s7.383 0 9.428-.616a2.94 2.94 0 0 0 2.07-2.07C24 15.77 24 12 24 12s0-3.77-.502-5.814zM9.75 15.538V8.462L16.5 12l-6.75 3.538z" />
                  </svg>
                </a>
                {/* INSTAGRAM */}
                <a
                  href="#"
                  className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition transform hover:scale-110"
                  title="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
            {/* COPYRIGHT */}
            <div className="text-sm opacity-80 md:text-right">
              <p><span className="font-semibold">BLing</span></p>
              <p className="mt-1">Bimbingan Konseling Digital</p>
              <p className="mt-2 text-xs">All rights reserved.</p>
            </div>
          </div>

          {/* GARIS PEMISAH */}
          <div className="h-px bg-white/20 mb-6" />

          {/* CREDIT */}
            <p className="text-sm text-grey-600 text-center font-medium">
              © 2025 <span className="font-bold">SMK Taruna Bhakti</span> — BLing
            </p>
            <p className="text-xs text-gray-200  text-center mt-1">Bimbingan Konseling Digital</p>
        </div>
      </footer>
    </div>
  );
}