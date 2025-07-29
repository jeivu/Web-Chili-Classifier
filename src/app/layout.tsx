import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./Navbar"; // Impor komponen Navbar

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
      <body className="bg-slate-50 text-slate-800 min-h-screen">
        {/* Gunakan komponen Navbar di sini */}
        <Navbar />

        <main>
          {children}
        </main>
      </body>
    </html>
  );
}