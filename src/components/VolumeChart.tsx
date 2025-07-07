'use client' // Komponen ini interaktif, jadi kita tandai sebagai Client Component

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Contoh data dummy untuk ditampilkan di grafik
const dummyData = [
  { name: '08:00', volume: 400 },
  { name: '09:00', volume: 300 },
  { name: '10:00', volume: 600 },
  { name: '11:00', volume: 800 },
  { name: '12:00', volume: 700 },
];

export default function VolumeChart() {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 h-96">
        <h2 className="text-xl font-semibold mb-4">Grafik Volume Tangki (Data Dummy)</h2>
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dummyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="volume" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
    </div>
  );
}