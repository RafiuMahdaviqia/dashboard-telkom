import BtsListWrapper from "@/components/BTSListWrapper";

export default function HomePage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900">
            Pusat Monitoring BTS
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Pilih salah satu situs untuk melihat detail monitoring secara real-time.
          </p>
        </header>
        
        <BtsListWrapper />
        
      </main>
    </div>
  );
}