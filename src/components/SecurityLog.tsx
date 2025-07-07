'use client'

import { format } from 'date-fns';
import Image from 'next/image';

// Tipe data yang diterima komponen
type LogData = {
  id: number;
  created_at: string;
  image_url: string;
};

// Tipe props yang diterima komponen
type SecurityLogProps = {
  initialData: LogData[];
};

export default function SecurityLog({ initialData }: SecurityLogProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Log Keamanan Akses BTS</h2>
      {initialData.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {initialData.map((log) => (
            <div key={log.id} className="flex flex-col rounded-lg overflow-hidden border border-gray-200 shadow-sm">
              {/* Bagian ini kita kembalikan untuk menampilkan gambar */}
              <div className="relative w-full h-32 bg-gray-200">
                <Image
                  src={log.image_url}
                  alt={`Akses pada ${log.created_at}`}
                  fill
                  className="object-cover" // Gunakan 'object-cover' agar gambar mengisi area
                  unoptimized
                  // Menambahkan fallback jika gambar gagal dimuat
                  onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x300/e2e8f0/94a3b8?text=Gagal+Muat'; }}
                />
              </div>
              {/* Area Timestamp */}
              <div className="p-2 bg-gray-50 text-sm text-center">
                <p className="text-gray-700">{format(new Date(log.created_at), 'dd MMM yyyy')}</p>
                <p className="text-gray-500">{format(new Date(log.created_at), 'HH:mm:ss')}</p>
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