const { createClient } = require('@supabase/supabase-js');

// --- GANTI DENGAN KREDENSIAL ANDA ---
const supabaseUrl = 'https://koymufimdkiemcgqnqff.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtveW11ZmltZGtpZW1jZ3FucWZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MDg0MDcsImV4cCI6MjA2NzQ4NDQwN30.FK245MjyQNokhP7lstTATphXWzM85mqx1iod82N5_po';
// ------------------------------------

const supabase = createClient(supabaseUrl, supabaseKey);

// Fungsi untuk menghasilkan data volume acak
function generateRandomVolume(baseVolume) {
  // Menghasilkan angka antara -20 dan +5
  const change = Math.random() * 25 - 20;
  return Math.max(0, baseVolume + change); // Pastikan volume tidak negatif
}

async function seedData() {
  console.log('Memulai proses penambahan data...');

  const today = new Date();
  const btsIds = [1, 2, 3]; // ID BTS yang ingin diisi datanya

  // Loop untuk 7 hari ke depan
  for (let day = 0; day < 7; day++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + day);

    let lastVolume = 950; // Volume awal setiap hari

    // Loop untuk menambahkan 10 data per hari
    for (let i = 0; i < 10; i++) {
      const timestamp = new Date(currentDate);
      // Atur jam secara acak antara jam 8 pagi hingga 5 sore
      timestamp.setHours(8 + Math.floor(Math.random() * 9), Math.floor(Math.random() * 60), Math.floor(Math.random() * 60));

      lastVolume = generateRandomVolume(lastVolume);

      const dataToInsert = {
        created_at: timestamp.toISOString(),
        volume: lastVolume,
        bts_id: btsIds[Math.floor(Math.random() * btsIds.length)], // Pilih ID BTS secara acak
      };

      const { error } = await supabase
        .from('volume_tangki')
        .insert(dataToInsert);

      if (error) {
        console.error('Gagal menambahkan data:', error.message);
      } else {
        console.log(`Data berhasil ditambahkan untuk tanggal ${timestamp.toLocaleDateString()}`);
      }
    }
  }

  console.log('Proses selesai.');
}

seedData();