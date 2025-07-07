'use client'

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabaseClient';

// Tipe data yang diterima komponen
type VolumeData = {
  created_at: string;
  volume: number;
};

// Tipe props yang diterima komponen
type VolumeChartProps = {
  initialData: VolumeData[];
};

export default function VolumeChart({ initialData }: VolumeChartProps) {
  // State untuk menyimpan data grafik, diisi pertama kali dengan data dari server
  const [data, setData] = useState(initialData);

  // useEffect untuk subscribe ke perubahan data real-time
  useEffect(() => {
    const channel = supabase
      .channel('realtime_volume_channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'volume_tangki',
        },
        (payload) => {
          // Menambahkan data baru ke state
          setData((currentData) => [...currentData, payload.new as VolumeData]);
        }
      )
      .subscribe();

    // Cleanup function untuk berhenti subscribe saat komponen tidak lagi ditampilkan
    return () => {
      supabase.removeChannel(channel);
    };
  }, []); // Array dependensi kosong agar hanya berjalan sekali

  // Memformat data untuk ditampilkan di grafik (dilakukan di client-side)
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
                    <Legend verticalAlign="top" height={36}/>
                      <Line type="monotone" dataKey="volume" name="Volume (Liter)" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        ) : (
            <p className="text-center text-gray-500 mt-10">Menunggu data masuk...</p>
        )}
    </div>
  );
}