'use client'

type LocationMapProps = {
  latitude?: number | null;
  longitude?: number | null;
};

export default function LocationMap({ latitude, longitude }: LocationMapProps) {
  if (!latitude || !longitude) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Lokasi BTS</h2>
            <p className="text-gray-500">Data lokasi tidak tersedia.</p>
        </div>
    );
  }

  // --- PERBAIKAN UTAMA DI SINI ---
  const embedMapUrl = `https://www.google.com/maps?q=${latitude},${longitude}&hl=id&z=15&output=embed`;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Lokasi BTS</h2>
      <div className="aspect-video w-full overflow-hidden rounded-lg border border-gray-300">
        <iframe
          src={embedMapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
}