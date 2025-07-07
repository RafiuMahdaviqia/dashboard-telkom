import VolumeChart from "@/components/VolumeChart";
import SecurityLog from "@/components/SecurityLog"; // 1. Impor komponen baru
import { supabase } from "@/lib/supabaseClient";

export const revalidate = 60;

async function getVolumeData() {
  const { data, error } = await supabase
    .from('volume_tangki')
    .select('created_at, volume')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error("Error fetching volume data:", error);
    return [];
  }
  return data.reverse(); 
}

// 2. Buat fungsi baru untuk mengambil data log keamanan
async function getSecurityLogData() {
  const { data, error } = await supabase
    .from('log_keamanan')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(6); // Ambil 6 log terakhir

  if (error) {
    console.error("Error fetching security log:", error);
    return [];
  }
  return data;
}

export default async function HomePage() {
  // 3. Panggil kedua fungsi untuk mengambil semua data
  const volumeData = await getVolumeData();
  const securityLogData = await getSecurityLogData();

  return (
    <main className="container mx-auto p-4 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
        Dashboard Monitoring BTS
      </h1>

      <VolumeChart initialData={volumeData} />

      {/* 4. Tampilkan komponen log keamanan dengan datanya */}
      <SecurityLog initialData={securityLogData} />

    </main>
  );
}