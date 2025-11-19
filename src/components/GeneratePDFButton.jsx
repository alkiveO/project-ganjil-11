// src/components/GeneratePDFButton.jsx
'use client';

export default function GeneratePDFButton({ laporanId }) {
  const handleDownload = () => {
    window.open(`/api/laporan/pdf/${laporanId}`, '_blank');
  };

  return (
    <button
      onClick={handleDownload}
      className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700"
    >
      Download PDF
    </button>
  );
}