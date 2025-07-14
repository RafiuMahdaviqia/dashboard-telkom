'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { HardDrive } from "lucide-react";

// Definisikan tipe data untuk BTS
type BtsSite = {
  id: number;
  name: string;
};

export default function BtsListWrapper() {
  const [btsList, setBtsList] = useState<BtsSite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Ambil data awal
    const fetchInitialData = async () => {
      const { data, error } = await supabase
        .from('bts_sites')
        .select('id, name')
        .order('id', { ascending: true });

    // Tambahkan pengecekan error ini
    if (error) {
    console.error("Gagal mengambil daftar BTS:", error);
    }

    if (data) {
    setBtsList(data);
    }
      setLoading(false);
    };

    fetchInitialData();

    // 2. Setup channel real-time untuk tabel bts_sites
    const channel = supabase
      .channel('realtime-bts-list')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bts_sites' },
        (payload) => {
          console.log('Perubahan pada daftar BTS terdeteksi!', payload);
          // Panggil ulang fungsi fetch untuk mendapatkan daftar terbaru
          fetchInitialData();
        }
      )
      .subscribe();

    // 3. Fungsi cleanup
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {btsList.map((bts) => (
        <Link
          href={`/bts/${bts.id}`}
          key={bts.id}
          className="group block p-6 bg-white rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 border border-gray-200"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <HardDrive className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-lg text-gray-800 group-hover:text-blue-600 transition-colors">
                {bts.name}
              </p>
              <p className="text-sm text-gray-500">
                ID: {bts.id}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}