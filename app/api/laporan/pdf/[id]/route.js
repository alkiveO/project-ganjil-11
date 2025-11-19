// app/api/laporan/pdf/[id]/route.js

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
    // JOIN DENGAN users DAN siswa_profiles
    const results = await query(`
      SELECT 
        l.id,
        l.hasil,
        l.catatan,
        l.created_at,
        u.name AS siswa_name,
        sp.nis,
        sp.kelas,
        p.topik
      FROM laporan_konseling l
      JOIN pengajuan_konseling p ON l.pengajuan_id = p.id
      JOIN users u ON l.siswa_id = u.id
      LEFT JOIN siswa_profiles sp ON u.id = sp.user_id
      WHERE l.id = ?
    `, [id]);

    const laporan = results[0];

    if (!laporan) {
      return new Response("Laporan tidak ditemukan", { status: 404 });
    }

    console.log("PDF DATA:", laporan); // DEBUG

    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([600, 800]);
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const blueColor = rgb(30 / 255, 64 / 255, 175 / 255);
    const greenColor = rgb(34 / 255, 139 / 255, 34 / 255);
    const darkGreen = rgb(0.2, 0.5, 0.2);

    let y = height - 50;

    // Judul
    page.drawText('LAPORAN KONSELING', { x: 50, y, size: 24, font: fontBold, color: blueColor });
    y -= 50;
    page.drawLine({ start: { x: 50, y: y + 5 }, end: { x: width - 50, y: y + 5 }, thickness: 2, color: blueColor });
    y -= 30;

    const drawText = (label, value, isBold = false) => {
      const text = value ? String(value) : '-';
      page.drawText(label + ':', { x: 50, y, size: 12, font: isBold ? fontBold : font });
      page.drawText(text, { x: 120, y, size: 12, font });
      y -= 25;
    };

    drawText('Tanggal', new Date(laporan.created_at).toLocaleString('id-ID'), true);
    drawText('Siswa', `${laporan.siswa_name || '-'} (${laporan.nis || '-'})`, true);
    drawText('Kelas', laporan.kelas || '-', true);
    drawText('Topik', laporan.topik || '-', true);
    y -= 10;

    // Isi Laporan
    page.drawText('Isi Laporan:', { x: 50, y, size: 14, font: fontBold, color: blueColor });
    y -= 25;

    const isiLines = splitText(laporan.hasil || 'Tidak ada isi laporan.', 500, font, 12);
    for (const line of isiLines) {
      if (y < 100) {
        page = pdfDoc.addPage([600, 800]);
        y = height - 50;
      }
      page.drawText(line, { x: 50, y, size: 12, font });
      y -= 20;
    }

    // Motivasi
    if (laporan.catatan) {
      y -= 10;
      if (y < 100) {
        page = pdfDoc.addPage([600, 800]);
        y = height - 50;
      }
      page.drawText('Motivasi / Solusi:', { x: 50, y, size: 14, font: fontBold, color: greenColor });
      y -= 25;

      const motivasiLines = splitText(laporan.catatan, 500, font, 12);
      for (const line of motivasiLines) {
        if (y < 100) {
          page = pdfDoc.addPage([600, 800]);
          y = height - 50;
        }
        page.drawText(`"${line}"`, { x: 50, y, size: 12, font, color: darkGreen });
        y -= 20;
      }
    }

    // Footer
    page.drawText('— BLing: Bimbingan Konseling Digital —', {
      x: 50, y: 50, size: 10, font, color: rgb(0.5, 0.5, 0.5)
    });

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="laporan_konseling_${id}.pdf"`,
      },
    });

  } catch (error) {
    console.error("Error generating PDF:", error);
    return new Response("Error: " + error.message, { status: 500 });
  }
}