import BtsDataWrapper from "@/components/BTSDataWrapper";

export default function BtsDetailPage() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {/* Panggil Client Component yang akan mengurus semuanya */}
        <BtsDataWrapper />
      </main>
    </div>
  );
}