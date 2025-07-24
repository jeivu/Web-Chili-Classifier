"use client";
import Link from "next/link";
import Image, { ImageProps } from "next/image";
import { useEffect, useState } from "react";
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale'; // Mengganti nama 'id' agar tidak bentrok

// Perbaikan 1: Mendefinisikan interface untuk tipe data riwayat
interface HistoryItem {
  id: string;
  image: string;
  name: string;
  accuracy: number;
  date: string;
}

// Perbaikan 2: Memperbaiki komponen ImageFallback dengan state dan props yang benar
const ImageFallback = ({ src, alt, ...props }: ImageProps) => {
  const [error, setError] = useState(false);

  // Jika src tidak valid atau terjadi error, gunakan URL fallback
  const finalSrc = !src || error ? "https://placehold.co/128x128/e2e8f0/475569?text=Error" : src;

  return (
    <Image
      src={finalSrc}
      alt={alt}
      {...props}
      onError={() => {
        setError(true);
      }}
    />
  );
};

export default function HistoryPage() {
  // Perbaikan 1: Menggunakan interface HistoryItem untuk state
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch("https://web-production-98ac.up.railway.app/history");
        const data: HistoryItem[] = await res.json();
        setHistory(data);
      } catch (err) {
        // Perbaikan 3: Menggunakan variabel 'err' untuk logging
        console.error("Gagal mengambil data riwayat:", err);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`https://web-production-98ac.up.railway.app/history/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal menghapus data");
      }
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
       // Perbaikan 3: Menggunakan variabel 'err' dengan tipe yang aman
      if (err instanceof Error) {
        alert(err.message);
        console.error("Error saat menghapus:", err);
      } else {
        alert("Terjadi kesalahan yang tidak diketahui saat menghapus data");
      }
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  }

  // Bagian JSX (tampilan) tidak ada perubahan signifikan, hanya penyesuaian tipe
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

  return (
    <div className="w-full flex items-start justify-center p-4 sm:p-6 lg:p-8">
      <section className="max-w-4xl w-full mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Riwayat Identifikasi</h1>
            <p className="text-slate-500 mt-1">Berikut adalah daftar semua identifikasi yang telah Anda lakukan.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="hidden sm:grid grid-cols-6 gap-4 border-b border-slate-200 pb-3 mb-3 text-left text-sm font-semibold text-slate-500">
              <div className="pl-4">ID</div>
              <div className="text-center">Foto</div>
              <div className="text-center">Hasil</div>
              <div className="text-center">Akurasi</div>
              <div className="text-center">Tanggal</div>
              <div className="text-center">Aksi</div>
            </div>
            <div className="flex flex-col gap-2">
              {history.map((item, idx) => (
                <div key={item.id} className="flex flex-col sm:grid sm:grid-cols-6 items-start sm:items-center gap-2 sm:gap-4 bg-slate-50 hover:bg-slate-100 rounded-lg p-2 transition-colors">
                  <div className="w-full pl-4 text-slate-700 font-mono text-xs sm:text-sm">{idx + 1}</div>
                  <div className="flex justify-center w-full">
                    <ImageFallback src={item.image} alt={item.name} width={64} height={64} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md border-2 border-white shadow-sm" />
                  </div>
                  <div className="text-left sm:text-center w-full">
                    <span className="font-semibold text-slate-700 text-base sm:text-lg">{item.name}</span>
                  </div>
                  <div className="text-left sm:text-center w-full">
                    <span className="text-emerald-700 font-bold text-base sm:text-lg">{item.accuracy}%</span>
                  </div>
                  <div className="text-sm text-slate-500 text-left sm:text-center w-full">{formatDate(item.date)}</div>
                  <div className="flex justify-center w-full">
                    <button className="bg-red-100 text-red-600 hover:bg-red-200 font-semibold px-3 py-1 rounded-lg text-xs sm:text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed" onClick={() => setConfirmId(item.id)} disabled={deletingId === item.id}>
                      {deletingId === item.id ? "Menghapus..." : "Hapus"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {confirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-4 text-red-500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Konfirmasi Hapus</h3>
            <p className="text-slate-600 mb-6">Apakah Anda yakin ingin menghapus riwayat ini? Tindakan ini tidak dapat dibatalkan.</p>
            <div className="flex justify-center gap-4">
              <button className="px-5 py-2 rounded-lg bg-slate-100 text-slate-600 font-semibold hover:bg-slate-200 transition-colors" onClick={() => setConfirmId(null)} disabled={deletingId === confirmId}>
                Batal
              </button>
              <button className="px-5 py-2 rounded-lg bg-red-500 text-white font-bold hover:bg-red-600 transition-colors disabled:opacity-60" onClick={() => handleDelete(confirmId)} disabled={deletingId === confirmId}>
                {deletingId === confirmId ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper untuk format tanggal, tidak ada perubahan
function formatDate(dateString: string) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Tanggal tidak valid";
  return format(date, "dd MMMM yyyy 'pukul' HH:mm", {
    locale: localeID,
  });
}