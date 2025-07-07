import VolumeChart from "@/components/VolumeChart";
import SecurityLog from "@/components/SecurityLog";
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

async function getSecurityLogData() {
  const { data, error } = await supabase
    .from('log_keamanan')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(6);

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
    // Ganti latar belakang utama menjadi lebih lembut
    <div className="bg-slate-900 text-slate-300 min-h-screen">
      <main className="container mx-auto p-4 sm:p-8">
        {/* Buat judul lebih menonjol */}
        <h1 className="text-3xl font-bold mb-8 text-white">
          Dashboard Monitoring BTS
        </h1>
        
        {/* Gunakan Grid untuk layout responsif */}
          <div className="mb-8">
                <VolumeChart initialData={volumeData} />
              </div>

              <div>
                <SecurityLog initialData={securityLogData} />
              </div>
            </main>
          </div>
  );
}