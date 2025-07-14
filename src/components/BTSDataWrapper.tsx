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

// --- FUNGSI INI YANG DIPERBAIKI ---
// Fungsi untuk mendapatkan tanggal hari ini dalam format YYYY-MM-DD
const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Bulan dimulai dari 0
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
// ---------------------------------

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

    const fetchData = async () => {
      if (volumeData.length === 0) {
        setLoading(true);
      }
      
      const startDate = `${selectedDate}T00:00:00.000Z`;
      const endDate = `${selectedDate}T23:59:59.999Z`;

      const getBtsDetails = supabase.from('bts_sites').select('name, latitude, longitude').eq('id', btsId).single();
      const getVolumeData = supabase.from('volume_tangki').select('created_at, volume').eq('bts_id', btsId).gte('created_at', startDate).lte('created_at', endDate).order('created_at', { ascending: true });
      const getSecurityLogData = supabase.from('log_keamanan').select('*').eq('bts_id', btsId).order('created_at', { ascending: false }).limit(10);

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

    const channel = supabase.channel(`realtime-bts-channel-${btsId}`)
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        fetchData();
      })
      .subscribe();

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
        <VolumeChart initialData={volumeData} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <SecurityLog initialData={securityLogData} />
            </div>
            <div className="lg:col-span-1">
                <LocationMap latitude={btsDetails.latitude} longitude={btsDetails.longitude} />
            </div>
        </div>
      </div>
    </>
  );
}