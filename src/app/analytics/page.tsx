'use client'

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from "next/link";

// Impor tipe data spesifik dari setiap komponen grafik
import DailyAnalyticsChart, { type DailyData } from '@/components/DailyAnalyticsChart';
import MonthlyAnalyticsChart, { type MonthlyData } from '@/components/MonthlyAnalyticsChart';
import YearlyAnalyticsChart, { type YearlyData } from '@/components/YearlyAnalyticsChart';
import { TrendingUp, TrendingDown, BarChart2 } from 'lucide-react';

type Tab = 'daily' | 'monthly' | 'yearly';
type BtsSite = { id: number; name: string };

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('daily');
  
  const [btsList, setBtsList] = useState<BtsSite[]>([]);
  const [selectedBts, setSelectedBts] = useState<number>(0);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, name: new Date(0, i).toLocaleString('id-ID', { month: 'long' }) }));
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  useEffect(() => {
    const fetchBtsList = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('bts_sites').select('id, name').order('name');
      if (data) setBtsList(data);
    };
    fetchBtsList();
  }, []);

  useEffect(() => {
    const getAnalyticsData = async () => {
      setLoading(true);
      const supabase = createClient();
      let rpcName = '';
      let params: { p_bts_id: number, p_year?: number, p_month?: number } = { p_bts_id: selectedBts };

      if (activeTab === 'daily') {
        rpcName = 'get_monthly_volume_average';
        params = { ...params, p_year: selectedYear, p_month: selectedMonth };
      } else if (activeTab === 'monthly') {
        rpcName = 'get_monthly_volume_average_by_year';
        params = { ...params, p_year: selectedYear };
      } else {
        rpcName = 'get_yearly_volume_average';
      }

      const { data, error } = await supabase.rpc(rpcName, params);

      if (error) {
        console.error("Gagal mengambil data analitik:", error);
        setAnalyticsData([]);
      } else {
        setAnalyticsData(data || []);
      }
      setLoading(false);
    };

    getAnalyticsData();
  }, [activeTab, selectedMonth, selectedYear, selectedBts]);

  const stats = useMemo(() => {
    if (!analyticsData || analyticsData.length === 0) {
      return { average: 0, highest: 0, lowest: 0 };
    }
    const volumes = analyticsData.map(item => item.average_volume);
    const total = volumes.reduce((acc, vol) => acc + vol, 0);
    const average = total / volumes.length;
    const highest = Math.max(...volumes);
    const lowest = Math.min(...volumes);
    return { average, highest, lowest };
  }, [analyticsData]);

  const handleTabChange = (tab: Tab) => {
    setAnalyticsData([]);
    setActiveTab(tab);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
            <Link href="/" className="text-blue-500 hover:underline mb-4 block">&larr; Kembali ke Dashboard Utama</Link>
            <h1 className="text-3xl font-bold text-gray-900">Analisis Data Volume</h1>
            <p className="text-gray-500 mt-1">
                Menampilkan statistik rata-rata volume tangki berdasarkan periode dan lokasi.
            </p>
        </header>
        
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-6">
            <button onClick={() => handleTabChange('daily')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'daily' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Harian
            </button>
            <button onClick={() => handleTabChange('monthly')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'monthly' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Bulanan
            </button>
            <button onClick={() => handleTabChange('yearly')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'yearly' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Tahunan
            </button>
          </nav>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="flex items-center gap-2 p-4 bg-white rounded-xl shadow-md border">
            <label htmlFor="bts-select" className="font-semibold text-gray-800">Situs BTS:</label>
            <select id="bts-select" value={selectedBts} onChange={(e) => setSelectedBts(Number(e.target.value))} className="cursor-pointer rounded-lg border border-gray-300 bg-gray-50 p-2 text-gray-900">
              <option value={0}>Semua Situs</option>
              {btsList.map(bts => <option key={bts.id} value={bts.id}>{bts.name}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 p-4 bg-white rounded-xl shadow-md border">
            {activeTab !== 'yearly' && (
              <div className="flex items-center gap-2">
                <label htmlFor="year-select" className="font-semibold text-gray-800">Tahun:</label>
                <select id="year-select" value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="cursor-pointer rounded-lg border border-gray-300 bg-gray-50 p-2 text-gray-900">
                  {years.map(year => <option key={year} value={year}>{year}</option>)}
                </select>
              </div>
            )}
            {activeTab === 'daily' && (
              <div className="flex items-center gap-2 ml-4">
                <label htmlFor="month-select" className="font-semibold text-gray-800">Bulan:</label>
                <select id="month-select" value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))} className="cursor-pointer rounded-lg border border-gray-300 bg-gray-50 p-2 text-gray-900">
                  {months.map(month => <option key={month.value} value={month.value}>{month.name}</option>)}
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full"><BarChart2 className="h-6 w-6 text-blue-600" /></div>
            <div>
              <p className="text-sm text-gray-500">Volume Rata-rata</p>
              <p className="text-2xl font-bold text-gray-900">{stats.average.toFixed(2)} L</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full"><TrendingUp className="h-6 w-6 text-green-600" /></div>
            <div>
              <p className="text-sm text-gray-500">Volume Tertinggi</p>
              <p className="text-2xl font-bold text-gray-900">{stats.highest.toFixed(2)} L</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4">
            <div className="bg-red-100 p-3 rounded-full"><TrendingDown className="h-6 w-6 text-red-600" /></div>
            <div>
              <p className="text-sm text-gray-500">Volume Terendah</p>
              <p className="text-2xl font-bold text-gray-900">{stats.lowest.toFixed(2)} L</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md">
            {loading ? (
                 <div className="flex justify-center items-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
            ) : (
                <>
                  {activeTab === 'daily' && 
                    <DailyAnalyticsChart data={analyticsData as DailyData[]} month={selectedMonth} year={selectedYear} />
                  }
                  {activeTab === 'monthly' && 
                    <MonthlyAnalyticsChart data={analyticsData as MonthlyData[]} year={selectedYear} />
                  }
                  {activeTab === 'yearly' && 
                    <YearlyAnalyticsChart data={analyticsData as YearlyData[]} />
                  }
                </>
            )}
        </div>
      </main>
    </div>
  );
}