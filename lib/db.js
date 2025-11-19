// lib/db.js
import mysql from 'mysql2/promise';

console.log('DB CONNECTING TO:', {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  database: process.env.DB_NAME || 'konseling_sekolah'
});

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'konseling_sekolah',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function query(sql, params = []) {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('DB ERROR:', error.message);
    throw error;
  }
}

// TAMBAH INI! BUAT TRANSAKSI
export async function getConnection() {
  return await pool.getConnection();
}