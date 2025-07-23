"use client"

import Image from "next/image";

// Data untuk fitur agar mudah dikelola
const features = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
    ),
    title: "Identifikasi Cepat",
    description: "Unggah gambar cabai dan dapatkan hasil prediksi jenis beserta akurasinya secara instan.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a8 8 0 0 0 8-8"/><path d="M4 14a8 8 0 0 0 8 8"/><path d="M12 2h4v1.133a5.333 5.333 0 0 1 2.822 2.822V10h-2.267a5.333 5.333 0 0 0-2.822-2.822V2z"/><path d="M10 2v5.178A5.333 5.333 0 0 0 7.178 10H2v-4a4 4 0 0 1 4-4h4z"/></svg>
    ),
    title: "Riwayat Analisis",
    description: "Semua hasil identifikasi Anda tersimpan dengan rapi dan dapat diakses kapan saja.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5.5 22H18.5c.828 0 1.5-.672 1.5-1.5v-13c0-.828-.672-1.5-1.5-1.5H11L8.5 3H5.5C4.672 3 4 3.672 4 4.5v16c0 .828.672 1.5 1.5 1.5z"/><path d="M11 12H4.5"/><path d="m14 9-3 3 3 3"/></svg>
    ),
    title: "Desain Modern",
    description: "Antarmuka yang responsif, bersih, dan mudah digunakan di berbagai perangkat.",
  },
];

const technologies = ["Next.js", "React", "Tailwind CSS", "TypeScript", "Framer Motion", "Deep Learning"];

export default function AboutPage() {
  return (
    <div className="w-full flex items-start justify-center p-4 sm:p-6 lg:p-8">
      <section className="max-w-4xl w-full mx-auto bg-white rounded-2xl shadow-xl p-8">
        {/* Header Halaman */}
        <div className="text-center">
            <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center">
                <Image
                  src="/chili_about.png"
                  alt="Chili Green Icon"
                  width={200}
                  height={200}
                  className="w-52 h-52 object-contain"
                  priority
                />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Tentang Aplikasi</h1>
            <p className="text-slate-500 mt-2 max-w-2xl mx-auto">Informasi mengenai tujuan, fitur, dan teknologi di balik Chili Classifier.</p>
        </div>

        <hr className="my-8 border-slate-200" />

        {/* Konten */}
        <div className="space-y-10">
          
          {/* Bagian Tujuan */}
          <div>
            <h2 className="text-2xl font-bold text-slate-700 mb-3">Tujuan Aplikasi</h2>
            <p className="text-slate-600 leading-relaxed">
              Pernahkah Anda berdiri di pasar, bingung membedakan cabai rawit dan cabai setan? Atau seorang petani yang ingin memastikan jenis cabai yang ditanam sudah sesuai? Di dunia agrikultur yang kaya, informasi seringkali menjadi jurang pemisah.<br /><br />
              <b>Chili Classifier</b> hadir untuk menjembatani jurang tersebut. Kami percaya bahwa teknologi canggih seperti Kecerdasan Buatan (Artificial Intelligence) harus bisa diakses oleh semua orang, dari petani di ladang hingga koki di dapur.<br /><br />
              Hanya dengan satu foto, aplikasi kami memberikan kepastian instan. Sistem cerdas kami akan langsung mengenali apakah gambar di hadapan Anda adalah cabai atau bukan. Jika ya, aplikasi akan menampilkan nama jenis cabainya, lengkap dengan persentase akurasi untuk menunjukkan seberapa yakin sistem kami dengan hasilnya. Ini adalah bukti nyata bahwa teknologi dapat menyederhanakan pengetahuan kita tentang hasil bumi.
            </p>
          </div>

          {/* Bagian Fitur */}
          <div>
            <h2 className="text-2xl font-bold text-slate-700 mb-4">Fitur Utama</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature) => (
                <div key={feature.title} className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center">
                  <div className="mx-auto w-12 h-12 flex items-center justify-center bg-emerald-100 text-emerald-600 rounded-full mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-lg text-slate-800 mb-1">{feature.title}</h3>
                  <p className="text-sm text-slate-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Bagian Teknologi */}
          <div>
            <h2 className="text-2xl font-bold text-slate-700 mb-4">Teknologi yang Digunakan</h2>
            <div className="flex flex-wrap gap-3">
              {technologies.map((tech) => (
                <span key={tech} className="bg-slate-100 text-slate-700 font-medium px-4 py-1.5 rounded-full text-sm">
                  {tech}
                </span>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}