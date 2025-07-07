import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

// Tipe data untuk setiap situs BTS
type BtsSite = {
  id: number;
  name: string;
  location: string;
};

// Fungsi untuk mengambil daftar BTS dari database
async function getBtsSites(): Promise<BtsSite[]> {
  const { data, error } = await supabase
    .from('bts_sites')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error("Error fetching BTS sites:", error);
    return [];
  }
  return data;
}

export default async function BtsListPage() {
  const sites = await getBtsSites();

  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Daftar Situs BTS</h1>
          <p className="text-gray-500 mt-1">Pilih situs untuk melihat detail monitoring.</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sites.map((site) => (
            <Link 
              href={`/bts/${site.id}`} 
              key={site.id}
              className="block bg-white p-6 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300"
            >
              <h2 className="text-xl font-bold text-blue-600">{site.name}</h2>
              <p className="text-gray-600 mt-2">{site.location}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}