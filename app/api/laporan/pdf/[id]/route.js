// app/api/laporan/pdf/[id]/route.js — VERSI FINAL + GURU NAME
import { query } from "@/lib/db";
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { NextResponse } from 'next/server';

const splitText = (text, maxWidth, font, fontSize) => {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    const width = font.widthOfTextAtSize(testLine, fontSize);
    if (width > maxWidth) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
};

export async function GET(request, { params: paramsPromise }) {
  const params = await paramsPromise;
  const { id } = params;

  if (!id || isNaN(id)) {
    return new Response("ID tidak valid", { status: 400 });
  }

  try {
    const results = await query(`
      SELECT 
        l.id,
        l.hasil,
        l.catatan,
        l.created_at,
        u.name AS siswa_name,
        sp.nis,
        sp.kelas,
        p.topik,
        g.name AS guru_name     -- 🔥 TAMBAH GURU NAME
      FROM laporan_konseling l
      JOIN pengajuan_konseling p ON l.pengajuan_id = p.id
      JOIN users u ON p.siswa_id = u.id
      LEFT JOIN siswa_profiles sp ON u.id = sp.user_id
      LEFT JOIN users g ON p.guru_id = g.id   -- 🔥 JOIN GURU BK
      WHERE l.pengajuan_id = ?
    `, [id]);

    const laporan = results[0];

    if (!laporan) {
      return new Response("Laporan tidak ditemukan", { status: 404 });
    }

    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([600, 900]);
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const blueColor = rgb(0.12, 0.25, 0.69);
    const greenColor = rgb(0.13, 0.55, 0.13);

    let y = height - 70;

    page.drawText('LAPORAN KONSELING', { x: 50, y, size: 28, font: fontBold, color: blueColor });
    y -= 60;

    const drawText = (label, value, bold = false) => {
      if (y < 100) { page = pdfDoc.addPage([600, 900]); y = height - 70; }
      page.drawText(`${label}:`, { x: 70, y, size: 12, font: bold ? fontBold : font });
      page.drawText(value ? String(value) : '-', { x: 160, y, size: 12, font });
      y -= 28;
    };

    drawText(
      'Tanggal',
      new Date(laporan.created_at).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      true
    );

    drawText('Siswa', `${laporan.siswa_name} (${laporan.nis || 'NIS tidak tersedia'})`, true);
    drawText('Kelas', laporan.kelas || '-', true);

    // 🔥 TAMPILKAN NAMA GURU BK
    drawText('Guru BK', laporan.guru_name || 'Tidak diketahui', true);

    drawText('Topik Permasalahan', laporan.topik, true);

    y -= 20;

    // Hasil Konseling
    if (y < 200) { page = pdfDoc.addPage([600, 900]); y = height - 70; }
    page.drawText('HASIL KONSELING', { x: 70, y, size: 16, font: fontBold, color: blueColor });
    y -= 35;

    const isiLines = splitText(laporan.hasil || 'Tidak ada catatan hasil konseling.', 480, font, 12);
    for (const line of isiLines) {
      if (y < 100) { page = pdfDoc.addPage([600, 900]); y = height - 70; }
      page.drawText(line, { x: 70, y, size: 12, font, color: rgb(0.1, 0.1, 0.1) });
      y -= 22;
    }

    // Motivasi
    if (laporan.catatan) {
      y -= 20;
      if (y < 150) { page = pdfDoc.addPage([600, 900]); y = height - 70; }
      page.drawText('KATA MOTIVASI & SARAN', { x: 70, y, size: 16, font: fontBold, color: greenColor });
      y -= 35;

      const lines = splitText(laporan.catatan, 480, font, 13);
      for (const line of lines) {
        if (y < 100) { page = pdfDoc.addPage([600, 900]); y = height - 70; }
        page.drawText(`"${line}"`, { x: 70, y, size: 13, font: fontBold, color: rgb(0, 0.4, 0) });
        y -= 28;
      }
    }

    // Footer
    page.drawText('BLing — Bimbingan Konseling Digital', {
      x: 70,
      y: 60,
      size: 10,
      font,
      color: rgb(0.5, 0.5, 0.5)
    });
    page.drawText('Dibuat dengan cinta untuk siswa terbaik', {
      x: 70,
      y: 45,
      size: 9,
      font,
      color: rgb(0.6, 0.6, 0.6)
    });

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="Laporan_Konseling_${laporan.siswa_name.replace(/\s+/g, '_')}_${id}.pdf"`,
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error) {
    console.error("Error generating PDF:", error);
    return new Response("Terjadi kesalahan saat membuat PDF", { status: 500 });
  }
}
