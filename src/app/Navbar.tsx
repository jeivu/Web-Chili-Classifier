"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    // Kita bungkus semuanya dengan Fragment <> karena akan ada lebih dari satu elemen utama
    <>
      {/* Navbar Utama (tidak ada perubahan di sini) */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-emerald-600 tracking-tight" onClick={closeMenu}>
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

          <div className="hidden md:flex gap-6 text-base font-medium">
            <Link href="/" className="text-slate-600 hover:text-emerald-500 transition">Home</Link>
            <Link href="/history" className="text-slate-600 hover:text-emerald-500 transition">History</Link>
            <Link href="/about" className="text-slate-600 hover:text-emerald-500 transition">About</Link>
          </div>

          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-slate-600 hover:text-emerald-500 focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Panel Menu Mobile (sekarang di luar nav) */}
      <div
        // Menggunakan 'fixed' agar posisinya relatif terhadap viewport
        // z-40 agar berada di bawah navbar (z-50)
        className={`fixed top-0 left-0 right-0 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 md:hidden ${
          isMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        {/* Konten di dalam panel diberi padding atas agar tidak tertutup navbar */}
        <div className="flex flex-col items-center gap-6 pt-24 pb-8">
          <Link href="/" className="text-xl font-medium text-slate-700 hover:text-emerald-500" onClick={closeMenu}>Home</Link>
          <Link href="/history" className="text-xl font-medium text-slate-700 hover:text-emerald-500" onClick={closeMenu}>History</Link>
          <Link href="/about" className="text-xl font-medium text-slate-700 hover:text-emerald-500" onClick={closeMenu}>About</Link>
        </div>
      </div>
    </>
  );
}