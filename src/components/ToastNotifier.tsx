'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'react-hot-toast'

export function ToastNotifier() {
  const searchParams = useSearchParams()

  useEffect(() => {
    // Cek apakah ada parameter 'message' di URL
    const message = searchParams.get('message')
    if (message) {
      // Tampilkan notifikasi sukses dan hapus pesan dari URL
      toast.success(message)
      // Menghapus parameter dari URL agar tidak muncul lagi saat refresh
      window.history.replaceState(null, '', window.location.pathname)
    }

    // Cek apakah ada parameter 'error' di URL
    const error = searchParams.get('error')
    if (error) {
      toast.error(error)
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [searchParams])

  // Komponen ini tidak menampilkan apa-apa, hanya menjalankan logika
  return null
}