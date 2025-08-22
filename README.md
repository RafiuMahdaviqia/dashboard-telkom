# Dashboard Monitoring BTS (Proyek untuk PT Telkom)

## Deskripsi
Aplikasi web ini adalah sebuah dashboard terpusat yang dibangun untuk memantau infrastruktur BTS secara *real-time*. Fitur utama termasuk monitoring volume tangki, log keamanan visual dengan deteksi lokasi, dan filter data historis.

---

---

## Fitur Utama
-   **Visualisasi Daftar BTS**: Menampilkan semua situs BTS dalam format kartu (grid) yang responsif.
-   **Dashboard Detail Per-BTS**: Halaman dinamis untuk setiap BTS yang menampilkan data spesifik.
-   **Grafik Real-Time**: Grafik volume tangki yang diperbarui secara otomatis setiap ada data baru masuk dari perangkat IoT.
-   **Log Keamanan Real-Time**: Galeri foto log keamanan yang juga diperbarui secara langsung.
-   **Filter Data Historis**: Fitur untuk memfilter data volume berdasarkan tanggal yang dipilih.
-   **Peta Lokasi Interaktif**: Menampilkan lokasi BTS pada peta Google yang disematkan.

---

## Tumpukan Teknologi (Tech Stack)
-   **Framework**: Next.js (dengan App Router)
-   **Bahasa**: TypeScript
-   **Styling**: Tailwind CSS
-   **Backend**: Supabase (Database PostgreSQL, Storage, Realtime)
-   **Deployment**: Vercel

---

## Cara Menjalankan Secara Lokal

1.  **Clone repository ini:**
    ```bash
    git clone [https://github.com/RafiuMahdaviqia/dashboard-telkom.git](https://github.com/RafiuMahdaviqia/dashboard-telkom.git)
    cd dashboard-telkom
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Buat file `.env.local`** di direktori utama dan isi dengan kredensial Supabase Anda:
    ```
    NEXT_PUBLIC_SUPABASE_URL=https://koymufimdkiemcgqnqff.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtveW11ZmltZGtpZW1jZ3FucWZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MDg0MDcsImV4cCI6MjA2NzQ4NDQwN30.FK245MjyQNokhP7lstTATphXWzM85mqx1iod82N5_po
    ```

4.  **Jalankan server pengembangan:**
    ```bash
    npm run dev
    ```

5.  Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## Link Deployment
Aplikasi ini sudah di-deploy dan dapat diakses melalui:
**[dashboard-telkom.vercel.app](https://dashboard-telkom.vercel.app)**
