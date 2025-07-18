import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import UserNav from "@/components/UserNav";
import React from "react";
import { Toaster } from "react-hot-toast";
import { createClient } from "@/utils/supabase/server";
import { ToastNotifier } from "@/components/ToastNotifier";
import Link from "next/link";

const fontSans = FontSans({ 
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Dashboard Monitoring BTS",
  description: "Aplikasi monitoring untuk PT Telkom Indonesia",
  manifest: "/manifest.json",
  themeColor: "#000000",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Telkom Mon",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <head>
        {/* Tag tambahan untuk Safari di iOS */}
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Telkom Mon" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={fontSans.className}>
        <Toaster position="top-center" />
        <ToastNotifier />
        <header className="sticky top-0 z-10 w-full border-b border-gray-700 bg-black">
          <div className="container mx-auto flex h-16 items-center justify-between px-4 text-white">
            <Link href="/" className="font-bold">Telkom Monitoring</Link>
            <div className="flex items-center gap-4">
                <Link href="/analytics" className="text-sm text-gray-300 hover:text-white">
                  Analisis
                </Link>
                <div className="h-6 w-px bg-gray-700"></div>
                <UserNav email={user?.email} />
            </div>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}