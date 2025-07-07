'use client'

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabaseClient';

type VolumeData = {
  created_at: string;
  volume: number;
};

type VolumeChartProps = {
  initialData: VolumeData[];
};

export default function VolumeChart({ initialData }: VolumeChartProps) {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const channel = supabase
      .channel('realtime_volume_channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'volume_tangki' },
        (payload) => {
          setData((currentData) => [...currentData, payload.new as VolumeData]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const formattedData = data.map(item => ({
    time: format(new Date(item.created_at), 'HH:mm'),
    volume: item.volume,
  }));

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Grafik Volume Tangki</h2>
        <div className="h-96"> {/* Memberi tinggi tetap pada container grafik */}
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="time" tick={{ fill: '#6b7280' }} fontSize={12} />
                    <YAxis tick={{ fill: '#6b7280' }} fontSize={12} />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: '#ffffff', 
                            border: '1px solid #e0e0e0',
                            borderRadius: '0.5rem'
                        }}
                    />
                    <Legend verticalAlign="top" align="right" />
                    <Line 
                        type="monotone" 
                        dataKey="volume" 
                        name="Volume (Liter)" 
                        stroke="#4f46e5" // Warna Indigo
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6, fill: '#4f46e5' }} 
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
}