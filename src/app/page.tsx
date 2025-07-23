// File: src/app/page.tsx (atau file halaman utama Anda)

"use client";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const DUMMY_RESULT = {
  name: "Cabai Rawit Merah",
  accuracy: 92,
  date: new Date().toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }),
};

export default function HomePage() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<typeof DUMMY_RESULT | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  // Kamera
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturing, setCapturing] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImage(ev.target?.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIdentify = async () => {
    if (!image) return;
    setLoading(true);

    let fileToSend: File | null = null;
    if (inputRef.current && inputRef.current.files && inputRef.current.files[0]) {
      fileToSend = inputRef.current.files[0];
    } else if (image.startsWith("data:")) {
      // Konversi dataURL ke File
      const arr = image.split(",");
      const match = arr[0].match(/:(.*?);/);
      const mime = match ? match[1] : "image/jpeg";
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      fileToSend = new File([u8arr], "capture.jpg", { type: mime });
    }
    if (!fileToSend) {
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', fileToSend);

    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      let resultObj;
      if (data.class === -1) {
        resultObj = {
          name: data.message || 'Bukan cabai',
          accuracy: Math.round(data.score * 100),
          date: new Date().toLocaleString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
      } else {
        const classMap: Record<number, string> = {
          0: 'Cabai Besar Hijau',
          1: 'Cabai Besar Merah',
          2: 'Cabai Keriting Hijau',
          3: 'Cabai Keriting Merah',
          4: 'Cabai Rawit Hijau',
          5: 'Cabai Rawit Merah',
        };
        resultObj = {
          name: classMap[data.class] || `Class ${data.class}`,
          accuracy: Math.round(data.score * 100),
          date: new Date().toLocaleString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
      }
      setResult(resultObj);

      // Kirim ke endpoint /history agar tersimpan di database
      const saveForm = new FormData();
      saveForm.append('image', fileToSend);
      saveForm.append('name', resultObj.name);
      saveForm.append('accuracy', resultObj.accuracy.toString());
      // Format date ke YYYY-MM-DD HH:mm:ss
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      const dateStr = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:00`;
      saveForm.append('date', dateStr);
      await fetch('http://localhost:5000/history', {
        method: 'POST',
        body: saveForm,
      });
    } catch (error) {
      setResult({ name: 'Error', accuracy: 0, date: '' });
    }
    setLoading(false);
  };
  
  const resetState = () => {
    setImage(null);
    setResult(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  // Kamera: buka modal dan mulai stream
  const openCamera = async () => {
    setCameraError(null);
    setShowCamera(true);
    setTimeout(async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        setCameraError("Tidak dapat mengakses kamera. Pastikan izin kamera sudah diberikan.");
      }
    }, 100);
  };

  // Kamera: capture gambar dari video
  const handleCapture = () => {
    if (!videoRef.current) return;
    setCapturing(true);
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg");
      setImage(dataUrl);
      setResult(null);
    }
    // Stop kamera
    if (video.srcObject) {
      (video.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
    }
    setShowCamera(false);
    setCapturing(false);
  };

  // Kamera: tutup modal dan stop kamera
  const closeCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
    }
    setShowCamera(false);
  };

  return (
    // Wrapper ini untuk memusatkan kartu di tengah halaman
    <div className="p-2 sm:p-4 lg:p-8">
      <section className="max-w-5xl w-full mx-auto bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-28 h-28 mb-4 flex items-center justify-center bg-white rounded-full shadow-lg">
            <Image
              src="/chili_api.png"
              alt="Chili Home Icon"
              width={112}
              height={112}
              className="w-28 h-28 rounded-full object-cover"
              priority
            />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-2 text-center tracking-tight">
            Klasifikasi Jenis Cabai
          </h1>
          <p className="text-lg text-slate-500 text-center max-w-xl">
            Unggah gambar cabai dan biarkan AI kami menganalisisnya untuk Anda. Dapatkan hasil instan dengan akurasi tinggi.
          </p>
        </div>

        {/* Konten Utama Responsive: 1 kolom di mobile, 2 kolom di desktop */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Kolom Kiri: Area Upload dan Tombol Aksi */}
          <div className="flex-1 flex flex-col items-center gap-6">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={inputRef}
              onChange={handleImageChange}
            />
            <div
              className="w-full h-48 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 bg-slate-50 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:border-emerald-400 hover:bg-emerald-50"
              onClick={() => inputRef.current?.click()}
            >
              <svg className="mb-3 text-slate-400" width="48" height="48" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5h10.5a2.25 2.25 0 002.25-2.25V11.25a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 11.25v6A2.25 2.25 0 006.75 19.5z"/></svg>
              <span className="text-slate-700 font-semibold text-center">{image ? "Ganti Gambar Lain" : "Klik untuk Unggah Gambar"}</span>
              <span className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP (maks. 5MB)</span>
            </div>
            <button
              type="button"
              onClick={openCamera}
              className="w-full py-2.5 text-base font-bold rounded-xl bg-gradient-to-r from-emerald-400 to-green-500 text-white shadow hover:from-emerald-500 hover:to-green-600 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M8 7V5a4 4 0 0 1 8 0v2" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="13.5" r="3" stroke="currentColor" strokeWidth="1.5"/></svg>
              Ambil dari Kamera
            </button>
            {/* Modal Kamera */}
            {showCamera && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center relative flex flex-col items-center">
                  <button onClick={closeCamera} className="absolute top-3 right-3 text-slate-400 hover:text-red-500 text-xl font-bold">&times;</button>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Ambil Gambar dari Kamera</h3>
                  {cameraError ? (
                    <div className="text-red-500 mb-4">{cameraError}</div>
                  ) : (
                    <video ref={videoRef} className="rounded-lg border border-slate-200 mb-4 w-full max-h-64 bg-black" autoPlay playsInline />
                  )}
                  <button
                    onClick={handleCapture}
                    disabled={capturing || !!cameraError}
                    className="mt-2 px-6 py-2 rounded-lg bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-colors disabled:opacity-60"
                  >
                    {capturing ? "Mengambil..." : "Capture"}
                  </button>
                </div>
              </div>
            )}
            <button
              onClick={handleIdentify}
              disabled={!image || loading}
              className="w-full py-3.5 text-lg font-bold rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin" width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="4" opacity="0.2"/><path d="M4 12a8 8 0 0 1 8-8" stroke="#fff" strokeWidth="4" strokeLinecap="round"/></svg>
                  Menganalisis...
                </span>
              ) : "Klasifikasi Sekarang"}
            </button>
          </div>
          {/* Kolom Kanan: Area Pratinjau dan Hasil */}
          <div className="flex-1 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border border-green-200 rounded-2xl p-6 flex flex-col items-center gap-4 shadow-lg w-full"
                >
                  <span className="font-semibold text-green-700">Hasil Prediksi Ditemukan!</span>
                  <Image
                    src={image!}
                    alt="Hasil cabai"
                    width={112}
                    height={112}
                    className="w-28 h-28 object-cover rounded-lg border-2 border-green-300 shadow-md"
                  />
                  <h3 className="text-3xl font-bold text-slate-800">{result.name}</h3>
                  <div className="flex items-center gap-2 bg-green-100 text-green-800 font-bold text-lg px-4 py-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    {result.accuracy}% Akurat
                  </div>
                  <p className="text-xs text-slate-400 mt-2">{result.date}</p>
                </motion.div>
              ) :
                image ? (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="relative group"
                  >
                    <Image
                      src={image}
                      alt="Preview cabai"
                      width={240}
                      height={240}
                      className="w-60 h-60 object-cover rounded-xl border-4 border-white shadow-lg transition-transform group-hover:scale-105"
                    />
                    <button
                      onClick={resetState}
                      className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 shadow-lg transition-all hover:bg-red-600 hover:scale-110"
                      title="Hapus gambar"
                    >
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6"/></svg>
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-slate-400"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-slate-300"><path d="M21 12.79c-1.17.02-2.3.26-3.37.72-.65.28-1.33.43-2.02.43-1.6 0-3.14-.65-4.24-1.76-1.1-1.1-1.76-2.64-1.76-4.24 0-.69.15-1.37.43-2.02.46-1.07.7-2.2.72-3.37L5 4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3.21z"></path><path d="M16 2.04c.18.64.29 1.31.29 2s-.11 1.36-.29 2"></path><path d="M21.96 10c-.64-.18-1.31-.29-2-.29s-1.36.11-2 .29"></path><path d="M16 2.04A9.91 9.91 0 0 0 12.04 2C6.49 2 2 6.49 2 12s4.49 10 10.04 10A9.91 9.91 0 0 0 22 11.96"></path><path d="m16 8 5-5"></path><path d="M16 3h5v5"></path></svg>
                    <p className="font-semibold">Pratinjau Gambar</p>
                    <p className="text-sm">Gambar yang Anda unggah akan tampil di sini</p>
                  </motion.div>
                )}
            </AnimatePresence>
          </div>
        </div>
      </section>
      {/* Bagian Cara Penggunaan & Jenis Cabai */}
      <div className="max-w-5xl w-full mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Cara Penggunaan Modern */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-6">
          <h2 className="text-xl font-bold text-emerald-700 flex items-center gap-2 mb-2">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2"/></svg>
            Cara Mengklasifikasi Cabai
          </h2>
          <div className="relative pl-6">
            {/* Stepper garis vertikal */}
            <div className="absolute left-3 top-6 bottom-0 w-0.5 bg-emerald-100" style={{zIndex:0}} />
            {/* Langkah-langkah */}
            {[
              { label: "Siapkan foto cabai yang ingin Anda identifikasi." },
              { label: "Klik area unggah gambar, lalu pilih foto cabai dari perangkat Anda." },
              { label: <>Tekan tombol <span className="font-semibold text-emerald-600">Klasifikasi Sekarang</span>.</> },
              { label: "Tunggu beberapa detik hingga hasil prediksi muncul di sebelah kanan." },
              { label: "Hasil identifikasi dan akurasi akan langsung tampil, serta otomatis tersimpan di riwayat." },
            ].map((step, idx, arr) => (
              <div key={idx} className="flex items-start gap-4 relative z-10 mb-2 last:mb-0">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${idx === 0 ? 'border-emerald-500 bg-emerald-50' : 'border-emerald-200 bg-white'} text-emerald-600 font-bold text-lg shadow-sm`}>{idx+1}</div>
                <div className="flex-1 bg-emerald-50 rounded-xl px-4 py-3 text-slate-700 shadow-sm border border-emerald-100">
                  {step.label}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Jenis Cabai Modern */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4">
          <h2 className="text-xl font-bold text-emerald-700 flex items-center gap-2 mb-2">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>
            Jenis Cabai yang Bisa Dikenali
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: "Cabai Rawit Merah", bg: "bg-gradient-to-r from-red-100 to-red-50", icon: "#e11d48" },
              { name: "Cabai Rawit Hijau", bg: "bg-gradient-to-r from-green-100 to-green-50", icon: "#22c55e" },
              { name: "Cabai Keriting Merah", bg: "bg-gradient-to-r from-pink-100 to-pink-50", icon: "#f43f5e" },
              { name: "Cabai Keriting Hijau", bg: "bg-gradient-to-r from-lime-100 to-lime-50", icon: "#84cc16" },
              { name: "Cabai Besar Merah", bg: "bg-gradient-to-r from-orange-100 to-orange-50", icon: "#fb7185" },
              { name: "Cabai Besar Hijau", bg: "bg-gradient-to-r from-emerald-100 to-emerald-50", icon: "#10b981" },
            ].map((c, idx) => (
              <div key={idx} className={`flex items-center gap-4 rounded-xl p-4 shadow-sm border border-slate-100 ${c.bg}`}>
                <span className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow border border-slate-200">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M7 17c-1.5-2.5-2-6.5 2-9 2.5-1.5 6.5-1.5 8 2 1.5 3.5-1.5 7-5 7" stroke={c.icon} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="11" stroke="#e5e7eb" strokeWidth="1.2" fill="none"/></svg>
                </span>
                <span className="font-semibold text-slate-800 text-base">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}