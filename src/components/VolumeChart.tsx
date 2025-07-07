'use client'

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabaseClient'; // Impor client Supabase

// Tipe data tetap sama
type VolumeData = {
  created_at: string;
  volume: number;
};

type VolumeChartProps = {
  initialData: VolumeData[];
};

export default function VolumeChart({ initialData }: VolumeChartProps) {
  // 1. Gunakan 'useState' untuk menyimpan dan memperbarui data grafik
  const [data, setData] = useState(initialData);

  // 2. Gunakan 'useEffect' untuk "mendengarkan" perubahan di database
  useEffect(() => {
    // Membuat channel subscription
    const channel = supabase
      .channel('realtime_volume_channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT', // Hanya dengarkan event 'INSERT' (data baru)
          schema: 'public',
          table: 'volume_tangki',
        },
        (payload) => {
          console.log('Data baru diterima!', payload.new);
          // Menambahkan data baru ke state yang sudah ada
          setData((currentData) => [...currentData, payload.new as VolumeData]);
        }
      )
      .subscribe();

    // 3. Cleanup function: berhenti mendengarkan saat komponen dihancurkan
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]); // Dependensi array

  // Format data dari 'state', bukan lagi dari 'initialData'
  const formattedData = data.map(item => ({
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
            <p className="text-center text-gray-500 mt-10">Menunggu data masuk...</p>
        )}
    </div>
  );
}