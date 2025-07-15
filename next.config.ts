import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Pola untuk URL Publik
      {
        protocol: 'https',
        hostname: 'koymufimdkiemcgqnqff.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/security-images/**',
      },
      // --- TAMBAHKAN POLA BARU INI UNTUK SIGNED URL ---
      {
        protocol: 'https',
        hostname: 'koymufimdkiemcgqnqff.supabase.co',
        port: '',
        pathname: '/storage/v1/object/sign/security-images/**',
      },
    ],
  },
};

export default nextConfig;