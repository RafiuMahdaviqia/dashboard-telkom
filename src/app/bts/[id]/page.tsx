import VolumeChart from "@/components/VolumeChart";
import SecurityLog from "@/components/SecurityLog";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export const revalidate = 60;

// --- PERBAIKAN UTAMA ADA DI SINI ---
// Kita tidak perlu lagi mendefinisikan tipe 'PageProps' secara manual.
// Next.js secara otomatis akan menyediakan tipe yang benar.
// Kita langsung definisikan tipe props di dalam parameter fungsi.
// ------------------------------------
async function getVolumeData(btsId: string) {
  const { data, error } = await supabase
    .from('volume_tangki')
    .select('created_at, volume')
    .eq('bts_id', btsId)
    .order('created_at', { ascending: false })
    .limit(30);

  if (error) return [];
  return data.reverse(); 
}

async function getSecurityLogData(btsId: string) {
  const { data, error } = await supabase
    .from('log_keamanan')
    .select('*')
    .eq('bts_id', btsId)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) return [];
  return data;
}

async function getBtsDetails(btsId: string) {
    const { data, error } = await supabase
        .from('bts_sites')
        .select('name')
        .eq('id', btsId)
        .single();
    
    if (error) return { name: 'Tidak Ditemukan' };
    return data;
}

// ------------------------------------
// --- PERBAIKAN PADA PROPS KOMPONEN ---
export default async function BtsDetailPage({ params }: { params: { id: string } }) {
  const btsId = params.id;
  
  const volumeData = await getVolumeData(btsId);
  const securityLogData = await getSecurityLogData(btsId);
  const btsDetails = await getBtsDetails(btsId);

  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
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
      </main>
    </div>
  );
}