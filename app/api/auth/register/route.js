// app/api/auth/register/route.js
import { query } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("REGISTER REQUEST:", body);

    const { name, email, password, nis, kelas } = body;

    // Validasi input
    if (!name || !email || !password || !nis || !kelas) {
      return new Response(
        JSON.stringify({ error: "Semua field wajib diisi" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Cek apakah email sudah terdaftar
    const existing = await query("SELECT id FROM users WHERE email = ?", [email]);
    console.log("EXISTING USER:", existing);

    if (Array.isArray(existing) && existing.length > 0) {
      return new Response(
        JSON.stringify({ error: "Email sudah digunakan" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // INSERT USER (FIX: password_hash → password)
    const result = await query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'siswa')",
      [name, email, hash]
    );
    console.log("INSERT USER RESULT:", result);

    if (!result || !result.insertId) {
      throw new Error("Gagal insert user ke database");
    }

    const userId = result.insertId;

    // INSERT PROFIL SISWA
    const profilResult = await query(
      "INSERT INTO siswa_profiles (user_id, nis, kelas) VALUES (?, ?, ?)",
      [userId, nis, kelas]
    );
    console.log("INSERT PROFIL RESULT:", profilResult);

    // Sukses
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Registrasi berhasil!" 
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return new Response(
      JSON.stringify({ 
        error: "Gagal daftar", 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }
}