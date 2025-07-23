// File: src/app/layout.tsx

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chili Classifier",
  description: "Klasifikasi jenis cabai dengan AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Pindahkan background utama dan warna teks ke body */}
      <body className="bg-slate-50 text-slate-800 min-h-screen">
        <nav className="bg-white shadow-md sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-emerald-600 tracking-tight">
              <Image
                src="/grinchili.jpeg"
                alt="Chili Icon"
                width={44}
                height={44}
                className="w-8 h-8"
                priority
              />
              Chili Classifier
            </Link>
            <div className="flex gap-6 text-base font-medium">
              <Link href="/" className="text-slate-600 hover:text-emerald-500 transition">Home</Link>
              <Link href="/history" className="text-slate-600 hover:text-emerald-500 transition">History</Link>
              <Link href="/about" className="text-slate-600 hover:text-emerald-500 transition">About</Link>
            </div>
          </div>
        </nav>
        {/* Main tag ini hanya bertugas sebagai wrapper konten */}
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}