// app/api/siswa/profile/route.js → FINAL, BIO MODE + BULLETPROOF
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { query } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  
  // Cek login & role
  if (!session || session.user.role !== "siswa") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const bio = formData.get("bio")?.toString().trim() || ""; // GANTI quote → bio
    const foto = formData.get("foto");

    let fotoPath = null;

    // Proses upload foto (kalo ada)
    if (foto && foto instanceof File && foto.size > 0) {
      // Validasi tipe file
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!allowedTypes.includes(foto.type)) {
        return Response.json({ error: "Hanya boleh upload JPG, PNG, atau WebP!" }, { status: 400 });
      }

      // Batasi ukuran (max 5MB)
      if (foto.size > 5 * 1024 * 1024) {
        return Response.json({ error: "Ukuran foto maksimal 5MB!" }, { status: 400 });
      }

      const bytes = await foto.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${foto.name}`;
      fotoPath = `/uploads/siswa/${filename}`;

      // Pastikan folder ada
      const uploadDir = path.join(process.cwd(), "public", "uploads", "siswa");
      await mkdir(uploadDir, { recursive: true });

      // Simpan file
      await writeFile(path.join(uploadDir, filename), buffer);
    }

    // Simpan ke database — GANTI quote → bio
    await query(
      `INSERT INTO siswa_profiles (user_id, bio, foto) 
       VALUES (?, ?, ?) 
       ON DUPLICATE KEY UPDATE 
         bio = VALUES(bio), 
         foto = COALESCE(VALUES(foto), foto)`,
      [session.user.id, bio, fotoPath]
    );

    return Response.json({ success: true, message: "Profil berhasil diperbarui!" });

  } catch (error) {
    console.error("API Profil Siswa Error:", error);
    return Response.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}