'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Inbox } from "lucide-react"; // Jangan lupa tambahkan import ikon

type MonthlyData = { month_name: string; average_volume: number; };
type ChartProps = { data: MonthlyData[]; year: number; }

export default function MonthlyAnalyticsChart({ data, year }: ChartProps) {
  // --- TAMBAHAN PENGECEKAN DATA ---
  if (!data || data.length === 0) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
      <Inbox className="h-12 w-12 mb-4" />
      <h3 className="text-lg font-semibold text-gray-700">Tidak Ada Data</h3>
      <p className="text-sm">Tidak ada catatan volume untuk periode yang Anda pilih.</p>
    </div>
  );
}

  const formattedData = data.map(item => ({
    month: item.month_name,
    'Rata-rata Volume': item.average_volume,
  }));

  const title = `Rata-rata Volume Bulanan - ${year}`;

  return (
    <div className="h-96 flex flex-col">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">{title}</h2>
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Rata-rata Volume" fill="#16a34a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}