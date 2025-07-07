import VolumeChart from "@/components/VolumeChart"; // Mengimpor komponen grafik kita

export default function HomePage() {
  return (
    <main className="container mx-auto p-4 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
        Dashboard Monitoring BTS
      </h1>

      {/* Di sini kita menampilkan komponen grafik */}
      <VolumeChart />

      {/* Anda bisa menambahkan komponen lain di sini nanti, misal untuk log keamanan */}
    </main>
  );
}