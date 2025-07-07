import VolumeChart from "@/components/VolumeChart";
import SecurityLog from "@/components/SecurityLog";
import { supabase } from "@/lib/supabaseClient";

export const revalidate = 60;

// Fungsi ini sekarang akan mengambil data sungguhan dari Supabase
async function getVolumeData() {
  const { data, error } = await supabase
    .from('volume_tangki')
    .select('created_at, volume')
    .order('created_at', { ascending: false })
    .limit(30); // Ambil 30 data terakhir

  if (error) {
    console.error("Error fetching volume data:", error);
    return [];
  }
  // Balik urutan agar data tertua di depan untuk grafik
  return data.reverse(); 
}

async function getSecurityLogData() {
  const { data, error } = await supabase
    .from('log_keamanan')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error("Error fetching security log:", error);
    return [];
  }
  return data;
}

export default async function HomePage() {
  const volumeData = await getVolumeData();
  const securityLogData = await getSecurityLogData();

  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
                Dashboard Monitoring BTS
            </h1>
            <p className="text-gray-500 mt-1">
                Menampilkan data volume tangki dan log keamanan secara real-time.
            </p>
        </header>
        
        <div className="space-y-8">
          <VolumeChart initialData={volumeData} />
          <SecurityLog initialData={securityLogData} />
        </div>
      </main>
    </div>
  );
}