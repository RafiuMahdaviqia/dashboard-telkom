'use client'

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import VolumeChart from "./VolumeChart";
import SecurityLog from "./SecurityLog";

// Definisikan tipe data yang kita harapkan
type VolumeData = { created_at: string; volume: number };
type SecurityLogData = { id: number; created_at: string; image_url: string };
type BtsDetailsData = { name: string };

export default function BtsDataWrapper() {
  const params = useParams();
  const btsId = params.id as string;

  // State untuk menyimpan data
  const [volumeData, setVolumeData] = useState<VolumeData[]>([]);
  const [securityLogData, setSecurityLogData] = useState<SecurityLogData[]>([]);
  const [btsDetails, setBtsDetails] = useState<BtsDetailsData>({ name: 'Memuat...' });
  const [loading, setLoading] = useState(true);

  // --- PERBAIKAN UTAMA: SEMUA LOGIKA DISATUKAN DI SINI ---
  useEffect(() => {
    if (!btsId) return;

    // 1. Fungsi untuk mengambil data awal
    const fetchInitialData = async () => {
      setLoading(true);
      const getBtsDetails = supabase.from('bts_sites').select('name').eq('id', btsId).single();
      const getVolumeData = supabase.from('volume_tangki').select('created_at, volume').eq('bts_id', btsId).order('created_at', { ascending: true }).limit(30);
      const getSecurityLogData = supabase.from('log_keamanan').select('*').eq('bts_id', btsId).order('created_at', { ascending: false }).limit(5);

      const [detailsResult, volumeResult, securityResult] = await Promise.all([
        getBtsDetails,
        getVolumeData,
        getSecurityLogData,
      ]);
      
      if (detailsResult.data) setBtsDetails(detailsResult.data);
      else setBtsDetails({ name: 'Tidak Ditemukan' });

      if (volumeResult.data) setVolumeData(volumeResult.data);
      if (securityResult.data) setSecurityLogData(securityResult.data);
      
      setLoading(false);
    };

    fetchInitialData();

    // 2. Setup channel real-time setelah data awal diambil
    const channel = supabase.channel(`realtime-bts-channel-${btsId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'volume_tangki', filter: `bts_id=eq.${btsId}` }, (payload) => {
        console.log('Data volume baru diterima!', payload.new);
        setVolumeData((currentData) => [...currentData.slice(-29), payload.new as VolumeData]);
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'log_keamanan', filter: `bts_id=eq.${btsId}` }, (payload) => {
        console.log('Log keamanan baru diterima!', payload.new);
        setSecurityLogData((currentData) => [payload.new as SecurityLogData, ...currentData.slice(0, 4)]);
      })
      .subscribe();

    // 3. Fungsi cleanup untuk membersihkan subscription saat komponen dilepas
    return () => {
      supabase.removeChannel(channel);
    };
    
  }, [btsId]); // useEffect ini akan berjalan setiap kali btsId berubah

  // Tampilan loading, tidak ada perubahan
  if (loading) {
    return <div className="text-center p-10">Memuat data...</div>;
  }

  // Tampilan utama, tidak ada perubahan
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
      
      <div className="space-y-8">
        <VolumeChart initialData={volumeData} />
        <SecurityLog initialData={securityLogData} />
      </div>
    </>
  );
}