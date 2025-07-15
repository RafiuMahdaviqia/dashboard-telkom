'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';

type LogData = {
  id: number;
  created_at: string;
  image_url: string;
};

type SecurityLogProps = {
  initialData: LogData[];
};

export default function SecurityLog({ initialData }: SecurityLogProps) {
  // Trik untuk menghindari hydration error pada format tanggal
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Saat render di server atau render awal di client, jangan tampilkan apa-apa
    // atau tampilkan skeleton loader untuk pengalaman pengguna yang lebih baik.
    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Log Keamanan Akses BTS</h2>
            <div className="h-32 w-full bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Log Keamanan Akses BTS</h2>
      {initialData && initialData.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {initialData.map((log, index) => (
            <div key={log.id} className="group relative flex flex-col rounded-lg overflow-hidden border border-gray-200 shadow-sm">
              <div className="relative w-full h-32 bg-gray-200 overflow-hidden">
                <Image
                  src={log.image_url}
                  alt={`Akses pada ${log.created_at}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  priority={index === 0}
                  onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x300/e2e8f0/94a3b8?text=Gagal+Muat'; }}
                />
              </div>
              <div className="absolute bottom-0 left-0 bg-black bg-opacity-60 text-white text-xs p-1 w-full text-center rounded-b-lg backdrop-blur-sm">
                 {/* Format tanggal langsung di sini, aman karena hanya render di client */}
                 <p>{format(new Date(log.created_at), 'dd MMM yyyy, HH:mm')}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-10">Belum ada log keamanan yang tercatat.</p>
      )}
    </div>
  );
}