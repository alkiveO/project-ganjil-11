// app/dashboard/siswa/profile/page.jsx
import { getServerSession } from "next-auth";
import { authOptions } from "../../../api/auth/[...nextauth]/route";
import { query } from "@/lib/db";
import ProfilSiswaForm from "../../../../src/components/ProfilSiswaForm";
import Image from 'next/image';

export const revalidate = 0;

export default async function ProfilSiswa() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "siswa") {
    return <div className="p-10 text-center text-red-600 text-xl">Akses ditolak.</div>;
  }

  const siswaId = session.user.id;

  const [profile] = await query(`
    SELECT u.name, u.email, sp.nis, sp.kelas, sp.foto, sp.bio 
    FROM users u 
    LEFT JOIN siswa_profiles sp ON u.id = sp.user_id 
    WHERE u.id = ?
  `, [siswaId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-20 px-6">
      <div className="max-w-4xl mx-auto">

        {/* HEADER — sama dengan guru */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-blue-700 mb-4">Profil Siswa</h1>
        </div>

        {/* CARD PROFIL — sama dengan guru */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 border border-blue-100">
          <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">

            {/* FOTO PREVIEW — sama */}
            <div className="text-center">
              {profile?.foto ? (
                <Image
                  src={profile.foto}
                  alt={profile.name}
                  width={240}
                  height={240}
                  className="rounded-full shadow-xl border-8 border-blue-100 object-cover"
                />
              ) : (
                <div className="w-60 h-60 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-xl">
                  <span className="text-white text-6xl font-bold">
                    {profile?.name?.charAt(0) || "S"}
                  </span>
                </div>
              )}
              <p className="mt-4 text-sm text-blue-600 font-medium">
                {profile?.foto ? "Foto saat ini" : "Belum ada foto"}
              </p>
            </div>

            {/* INFO + FORM — disamakan total */}
            <div className="flex-1 space-y-6">

              {/* INFO SISWA */}
              <div>
                <h2 className="text-3xl font-bold text-blue-800">{profile?.name || "Siswa"}</h2>
                <p className="text-blue-600">NIS: {profile?.nis || "-"}</p>
                <p className="text-blue-600">Kelas: {profile?.kelas || "-"}</p>
                <p className="text-blue-500 text-sm">{profile?.email}</p>
              </div>

              {/* BIO — mirip quote guru */}
              <div className="bg-blue-50 p-6 rounded-2xl">
                {profile?.bio ? (
                  <p className="text-xl italic text-blue-800 font-medium leading-relaxed">
                    “{profile.bio}”
                  </p>
                ) : (
                  <p className="text-blue-500 italic">Belum ada bio, yuk isi dulu!</p>
                )}
              </div>

              {/* FORM — sama */}
              <div className="pt-6 border-t border-blue-100">
                <h3 className="text-xl font-bold text-blue-700 mb-4">Lengkapi Profilmu</h3>
                <ProfilSiswaForm siswaId={siswaId} currentData={profile} />
              </div>

            </div>
          </div>
        </div>

        {/* FOOTER — sama */}
        <div className="mt-16 text-center">
          <p className="text-sm text-blue-600 font-medium">
            © 2025 <span className="font-bold">SMK Taruna Bhakti</span> — BLing
          </p>
          <p className="text-xs text-blue-500 mt-1">Dibuat oleh: Alissya</p>
        </div>
      </div>
    </div>
  );
}
