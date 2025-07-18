import type { NextConfig } from 'next';
import withPWAInit from 'next-pwa'; // 1. Impor next-pwa

// 2. Konfigurasi PWA
const withPWA = withPWAInit({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // Nonaktifkan PWA saat development
});

// 3. Gabungkan konfigurasi PWA dengan konfigurasi Next.js Anda
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'koymufimdkiemcgqnqff.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/security-images/**',
      },
      {
        protocol: 'https',
        hostname: 'koymufimdkiemcgqnqff.supabase.co',
        port: '',
        pathname: '/storage/v1/object/sign/security-images/**',
      },
    ],
  },
};

export default withPWA(nextConfig); // 4. Bungkus konfigurasi Anda