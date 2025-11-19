// lib/notifikasi.js
import { query } from "@/lib/db";

export async function createNotification(userId, judul, isi) {
  try {
    await query(
      "INSERT INTO notifikasi (user_id, judul, isi) VALUES (?, ?, ?)",
      [userId, judul, isi]
    );
  } catch (error) {
    console.error("Gagal buat notifikasi:", error);
  }
}