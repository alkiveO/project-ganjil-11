// app/api/guru/profile/route.js — FINAL, AUTO BUAT FOLDER, ANTI ERROR
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { query } from "@/lib/db";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";

// Tambahin ini biar folder otomatis dibuat kalau belum ada
const ensureUploadDir = () => {
  const uploadDir = path.join(process.cwd(), "public/uploads/guru");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("Folder created: public/uploads/guru");
  }
};

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "guru") {
    return new Response("Unauthorized", { status: 401 });
  }

  const formData = await req.formData();
  const quote = formData.get("quote") || null;
  const foto = formData.get("foto");

  let fotoPath = null;

  if (foto && foto.size > 0) {
    ensureUploadDir(); // PASTIKAN FOLDER ADA

    const bytes = await foto.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Bersihin nama file dari spasi & karakter aneh
    const safeFilename = `${Date.now()}-${foto.name.replace(/[^a-zA-Z0-9.\-]/g, "_")}`;
    const filepath = path.join(process.cwd(), "public/uploads/guru", safeFilename);

    try {
      await writeFile(filepath, buffer);
      fotoPath = `/uploads/guru/${safeFilename}`;
      console.log("Foto berhasil diupload:", fotoPath);
    } catch (err) {
      console.error("Gagal upload foto:", err);
      return new Response("Gagal menyimpan foto", { status: 500 });
    }
  }

  try {
    await query(`
      INSERT INTO guru_profiles (user_id, quote, foto) 
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        quote = VALUES(quote),
        foto = COALESCE(?, foto)
    `, [session.user.id, quote, fotoPath, fotoPath]);
  } catch (err) {
    console.error("DB Error:", err);
    return new Response("Gagal menyimpan profil", { status: 500 });
  }

  return Response.json({ success: true, message: "Profil berhasil diperbarui!" });
}