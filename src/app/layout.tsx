import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google"; // Menggunakan alias untuk kejelasan
import "./globals.css";
import UserNav from "@/components/UserNav";
import React from "react";
import { Toaster } from "react-hot-toast";
import { createClient } from "@/utils/supabase/server";
import { ToastNotifier } from "@/components/ToastNotifier";
import Link from 'next/link';

// Ganti nama variabel font agar tidak bentrok
const fontSans = FontSans({ 
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Dashboard Monitoring BTS",
  description: "Aplikasi monitoring untuk PT Telkom Indonesia",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // --- PERBAIKAN 1: Tambahkan 'await' di sini ---
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en">
      {/* --- PERBAIKAN 2: Gunakan nama variabel font yang benar --- */}
      <body className={fontSans.className}>
        <Toaster position="top-center" />
        <ToastNotifier />
        <header className="sticky top-0 z-10 w-full border-b border-gray-700 bg-black">
          <div className="container mx-auto flex h-16 items-center justify-between px-4 text-white">
            <div className="font-bold">Telkom Monitoring</div>
            <div className="flex items-center gap-4">
                {/* --- TAMBAHKAN LINK DI SINI --- */}
                <Link href="/analytics" className="text-sm text-gray-300 hover:text-white">
                  Analisis
                </Link>
                <div className="h-6 w-px bg-gray-700"></div> {/* Garis pemisah */}
                <UserNav email={user?.email} />
            </div>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}