import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { HardDrive } from 'lucide-react'; // Mengimpor ikon untuk hiasan

// Fungsi untuk mengambil DAFTAR semua BTS dari database
async function getBtsList() {
  const { data, error } = await supabase
    .from('bts_sites')
    .select('id, name');

  if (error) {
    console.error("Gagal mengambil daftar BTS:", error);
    return [];
  }
  return data;
}

export default async function HomePage() {
  const btsList = await getBtsList();

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900">
            Pusat Monitoring BTS
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Pilih salah satu situs untuk melihat detail monitoring secara real-time.
          </p>
        </header>
        
        {/* --- PERUBAHAN UTAMA DI SINI --- */}
        {btsList.length > 0 ? (
          // Menggunakan Grid Layout untuk memisahkan menjadi beberapa kolom
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
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Tidak ada data situs BTS yang ditemukan di database.</p>
          </div>
        )}
      </main>
    </div>
  );
}