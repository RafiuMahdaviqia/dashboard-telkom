'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

// Mendefinisikan tipe data yang akan diterima
type VolumeData = {
  created_at: string;
  volume: number;
};

// Mendefinisikan props yang akan diterima komponen
type VolumeChartProps = {
  initialData: VolumeData[];
};

// Terima props 'initialData' di sini
export default function VolumeChart({ initialData }: VolumeChartProps) {

  const formattedData = initialData.map(item => ({
    time: format(new Date(item.created_at), 'HH:mm'), 
    volume: item.volume,
  }));

  return (
    <div className="bg-white shadow-md rounded-lg p-6 h-96">
        <h2 className="text-xl font-semibold mb-4">Grafik Volume Tangki</h2>
        {formattedData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="volume" name="Volume (Liter)" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        ) : (
            <p className="text-center text-gray-500 mt-10">Belum ada data untuk ditampilkan.</p>
        )}
    </div>
  );
}