import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import UserNav from "@/components/UserNav";
import React from "react";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = { title: "Dashboard Monitoring BTS" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="sticky top-0 z-10 w-full border-b border-gray-700 bg-black">
          <div className="container mx-auto flex h-16 items-center justify-between px-4 text-white">
            <div className="font-bold">Telkom Monitoring</div>
            <React.Suspense fallback={<div className="h-9 w-20 animate-pulse rounded-md bg-gray-800" />}>
              <UserNav />
            </React.Suspense>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}