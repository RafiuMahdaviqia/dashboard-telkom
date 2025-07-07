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
    <div className="bg-white shadow-md rounded-lg p-6 mt-8">
      <h2 className="text-xl font-semibold mb-4">Log Keamanan Akses BTS</h2>
      {initialData.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {initialData.map((log) => (
            <div key={log.id} className="border rounded-lg overflow-hidden">
              <div className="relative w-full h-48">
                <Image
                  src={log.image_url}
                  alt={`Akses pada ${log.created_at}`}
                  fill // Prop modern untuk menggantikan layout="fill"
                  className="object-contain" // Kelas Tailwind untuk menggantikan objectFit="cover"
                  unoptimized
                />
              </div>
              <div className="p-2 bg-gray-50 text-sm text-center">
                {/* Pemformatan tanggal dilakukan di sini (client-side) */}
                {format(new Date(log.created_at), 'dd MMM yyyy, HH:mm:ss')}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">Belum ada log keamanan yang tercatat.</p>
      )}
    </div>
  );
}