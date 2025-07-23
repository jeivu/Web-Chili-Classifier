"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

// Komponen untuk fallback jika gambar tidak ditemukan
const ImageFallback = ({ src, alt, ...props }: any) => {
  return (
    <Image
      src={src}
      alt={alt}
      {...props}
      onError={(e) => {
        e.currentTarget.srcset = "https://placehold.co/128x128/e2e8f0/475569?text=Error";
        e.currentTarget.src = "https://placehold.co/128x128/e2e8f0/475569?text=Error";
      }}
    />
  );
};

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [confirmId, setConfirmId] = useState<string | number | null>(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch("http://localhost:5000/history");
        const data = await res.json();
        setHistory(data);
      } catch (err) {
        setHistory([]);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  async function handleDelete(id: string | number) {
    setDeletingId(id);
    try {
      const res = await fetch(`http://localhost:5000/history/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal menghapus data");
      }
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan saat menghapus data");
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  }

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-20">
        <div className="text-center bg-white p-12 rounded-2xl shadow-xl max-w-lg w-full">
          <div className="mb-4 animate-pulse h-16 w-16 bg-slate-200 rounded-full mx-auto" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Memuat Riwayat...</h2>
        </div>
      </div>
    );
  }

  // Kondisi jika riwayat kosong
  if (!history || history.length === 0) {
    return (
      <div className="w-full flex justify-center items-center py-20">
        <div className="text-center bg-white p-12 rounded-2xl shadow-xl max-w-lg w-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-slate-300"><path d="M10 2h4"/><path d="M12 18a6 6 0 1 0-6-6 6 6 0 0 0 6 6z"/><path d="M12 14v-4"/><path d="M12 22a8 8 0 0 0 8-8"/><path d="M4 14a8 8 0 0 0 8 8"/></svg>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Belum Ada Riwayat</h2>
            <p className="text-slate-500 mb-6">Mulai identifikasi cabai pertama Anda di halaman utama.</p>
            <Link href="/" className="inline-block px-6 py-2.5 text-base font-bold rounded-lg bg-emerald-500 text-white shadow-lg hover:bg-emerald-600 transition-all">
                Mulai Identifikasi
            </Link>
        </div>
      </div>
    );
  }

  // Tampilan utama jika ada riwayat
  return (
    <div className="w-full flex items-start justify-center p-4 sm:p-6 lg:p-8">
      <section className="max-w-4xl w-full mx-auto bg-white rounded-2xl shadow-xl p-8">
        {/* Header Halaman */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Riwayat Identifikasi</h1>
                <p className="text-slate-500 mt-1">Berikut adalah daftar semua identifikasi yang telah Anda lakukan.</p>
            </div>
        </div>

        {/* Daftar Riwayat dalam Bentuk Tabel */}
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            {/* Header Tabel */}
            <div className="hidden sm:grid grid-cols-5 gap-4 border-b border-slate-200 pb-3 mb-3 text-left text-sm font-semibold text-slate-500">
              <div className="pl-4">ID</div>
              <div className="text-center">Foto</div>
              <div className="text-center">Hasil</div>
              <div className="text-center">Tanggal</div>
              <div className="text-center">Aksi</div>
            </div>
            {/* Isi Tabel */}
            <div className="flex flex-col gap-2">
              {history.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:grid sm:grid-cols-5 items-start sm:items-center gap-2 sm:gap-4 bg-slate-50 hover:bg-slate-100 rounded-lg p-2 transition-colors"
                >
                  {/* Kolom ID (Nomor Urut) */}
                  <div className="w-full pl-4 text-slate-700 font-mono text-xs sm:text-sm">{idx + 1}</div>
                  {/* Kolom Foto */}
                  <div className="flex justify-center w-full">
                    <ImageFallback
                      src={item.image}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md border-2 border-white shadow-sm"
                    />
                  </div>
                  {/* Kolom Hasil (Nama & Akurasi) */}
                  <div className="flex flex-col items-start sm:items-center w-full">
                    <span className="font-semibold text-slate-700 text-base sm:text-lg">{item.name} <span className="text-emerald-700 font-bold">{item.accuracy}%</span></span>
                  </div>
                  {/* Kolom Tanggal */}
                  <div className="text-sm text-slate-500 text-left sm:text-center w-full">{formatDate(item.date)}</div>
                  {/* Kolom Aksi (Hapus) */}
                  <div className="flex justify-center w-full">
                    <button
                      className="bg-red-100 text-red-600 hover:bg-red-200 font-semibold px-3 py-1 rounded-lg text-xs sm:text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      onClick={() => setConfirmId(item.id)}
                      disabled={deletingId === item.id}
                    >
                      {deletingId === item.id ? "Menghapus..." : "Hapus"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>
      {/* Modal Konfirmasi Hapus */}
      {confirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mx-auto mb-4 text-red-400"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Konfirmasi Hapus</h3>
            <p className="text-slate-600 mb-6">Apakah Anda yakin ingin menghapus riwayat ini? Tindakan ini tidak dapat dibatalkan.</p>
            <div className="flex justify-center gap-4">
              <button
                className="px-5 py-2 rounded-lg bg-slate-100 text-slate-600 font-semibold hover:bg-slate-200 transition-colors"
                onClick={() => setConfirmId(null)}
                disabled={deletingId === confirmId}
              >
                Batal
              </button>
              <button
                className="px-5 py-2 rounded-lg bg-red-500 text-white font-bold hover:bg-red-600 transition-colors disabled:opacity-60"
                onClick={() => handleDelete(confirmId)}
                disabled={deletingId === confirmId}
              >
                {deletingId === confirmId ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper untuk format tanggal
function formatDate(dateString: string) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}