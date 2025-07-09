'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

// Definisikan tipe data yang diterima
type ChartData = {
  created_at: string;
  volume: number;
};

// Definisikan props yang diterima komponen
type VolumeChartProps = {
  initialData: ChartData[];
};

export default function VolumeChart({ initialData }: VolumeChartProps) {
  // Format data agar bisa dibaca oleh Recharts
  const formattedData = initialData.map(item => ({
    // Format timestamp menjadi 'HH:mm' untuk label sumbu X
    time: format(new Date(item.created_at), 'HH:mm'),
    Volume: item.volume, // 'Volume' akan menjadi nama di legenda grafik
  }));

  return (
    <div className="bg-white shadow-md rounded-xl p-6 h-96">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Grafik Volume Tangki</h2>
        {formattedData.length > 0 ? (
            <ResponsiveContainer width="100%" height="90%">
                <LineChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="time" tick={{ fill: '#6b7280' }} />
                    <YAxis tick={{ fill: '#6b7280' }} />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                            border: '1px solid #e0e0e0',
                            borderRadius: '0.5rem'
                        }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="Volume" stroke="#4f46e5" strokeWidth={2} activeDot={{ r: 8 }} dot={{ r: 4 }} />
                </LineChart>
            </ResponsiveContainer>
        ) : (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Data tidak cukup untuk menampilkan grafik.</p>
            </div>
        )}
    </div>
  );
}