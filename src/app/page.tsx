import VolumeChart from "@/components/VolumeChart";
import { supabase } from "@/lib/supabaseClient"; // Pastikan path ini benar

export const revalidate = 60; // Meminta Next.js untuk mengambil data ulang setiap 60 detik

async function getVolumeData() {
  // Mengambil 20 data terakhir dari tabel 'volume_tangki'
  const { data, error } = await supabase
    .from('volume_tangki')
    .select('created_at, volume') // Hanya pilih kolom yang dibutuhkan
    .order('created_at', { ascending: false }) // Urutkan dari yang terbaru
    .limit(20);

  if (error) {
    console.error("Error fetching volume data:", error);
    return []; // Kembalikan array kosong jika ada error
  }

  // Balik urutan array agar data tertua ada di depan untuk grafik
  return data.reverse(); 
}

export default async function HomePage() {
  const volumeData = await getVolumeData();

  return (
    <main className="container mx-auto p-4 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
        Dashboard Monitoring BTS
      </h1>

      {/* Mengirim data sungguhan ke komponen VolumeChart melalui props */}
      <VolumeChart initialData={volumeData} />

    </main>
  );
}