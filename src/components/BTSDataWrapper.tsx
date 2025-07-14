'use client'

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import VolumeChart from "./VolumeChart";
import SecurityLog from "./SecurityLog";
import LocationMap from "./LocationMap";

// Definisikan tipe data yang kita harapkan
type VolumeData = { created_at: string; volume: number };
type SecurityLogData = { id: number; created_at: string; image_url: string };
type BtsDetailsData = { name: string; latitude?: number | null; longitude?: number | null; };

// Fungsi untuk mendapatkan tanggal hari ini dalam format YYYY-MM-DD
const getTodayDateString = () => new Date().toISOString().split('T')[0];

export default function BtsDataWrapper() {
  const params = useParams();
  const btsId = params.id as string;

  // State untuk menyimpan semua data
  const [volumeData, setVolumeData] = useState<VolumeData[]>([]);
  const [securityLogData, setSecurityLogData] = useState<SecurityLogData[]>([]);
  const [btsDetails, setBtsDetails] = useState<BtsDetailsData>({ name: 'Memuat...' });
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());

  useEffect(() => {
    if (!btsId) return;

    // Fungsi untuk mengambil data awal dan update real-time
    const fetchData = async () => {
      // Hanya tampilkan loading spinner saat pengambilan data pertama kali
      if (volumeData.length === 0) {
        setLoading(true);
      }
      
      const startDate = `${selectedDate}T00:00:00.000Z`;
      const endDate = `${selectedDate}T23:59:59.999Z`;

      const getBtsDetails = supabase.from('bts_sites').select('name, latitude, longitude').eq('id', btsId).single();
      const getVolumeData = supabase.from('volume_tangki').select('created_at, volume').eq('bts_id', btsId).gte('created_at', startDate).lte('created_at', endDate).order('created_at', { ascending: true });
      const getSecurityLogData = supabase.from('log_keamanan').select('*').eq('bts_id', btsId).order('created_at', { ascending: false }).limit(10); // Ambil 10 log terakhir

      const [detailsResult, volumeResult, securityResult] = await Promise.all([
        getBtsDetails,
        getVolumeData,
        getSecurityLogData,
      ]);
      
      if (detailsResult.data) setBtsDetails(detailsResult.data);
      else setBtsDetails({ name: 'Tidak Ditemukan' });

      if (volumeResult.data) setVolumeData(volumeResult.data);
      else setVolumeData([]);

      if (securityResult.data) setSecurityLogData(securityResult.data);
      
      setLoading(false);
    };

    fetchData();

    // Setup channel real-time
    const channel = supabase.channel(`realtime-bts-channel-${btsId}`)
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        // Ambil ulang semua data saat ada perubahan apapun untuk menjaga konsistensi
        fetchData();
      })
      .subscribe();

    // Fungsi cleanup
    return () => {
      supabase.removeChannel(channel);
    };
    
  }, [btsId, selectedDate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-gray-600">Memuat data...</p>
      </div>
    );
  }

  return (
    <>
      <header className="mb-8">
        <Link href="/" className="text-blue-500 hover:underline mb-4 block">&larr; Kembali ke Daftar BTS</Link>
        <h1 className="text-3xl font-bold text-gray-800">
            Dashboard Monitoring: {btsDetails.name}
        </h1>
        <p className="text-gray-500 mt-1">
            Menampilkan data volume tangki dan log keamanan secara real-time.
        </p>
      </header>
      
      <div className="mb-6 flex items-center gap-3 p-4 bg-white rounded-xl shadow-md border border-gray-200 w-full md:w-auto md:max-w-sm">
          <label htmlFor="date-filter" className="font-semibold text-gray-800 flex-shrink-0">
            Pilih Tanggal:
          </label>
          <input 
            type="date"
            id="date-filter"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 p-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
      </div>

      <div className="flex flex-col gap-8">
        {/* Baris pertama: Grafik (lebar penuh) */}
        <VolumeChart initialData={volumeData} />

        {/* Baris kedua: Grid untuk Peta dan Log Keamanan */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Kolom pertama (2/3 lebar): Log Keamanan */}
            <div className="lg:col-span-2">
                <SecurityLog initialData={securityLogData} />
            </div>

            {/* Kolom kedua (1/3 lebar): Peta Lokasi */}
            <div className="lg:col-span-1">
                <LocationMap latitude={btsDetails.latitude} longitude={btsDetails.longitude} />
            </div>
        </div>
      </div>
    </>
  );
}