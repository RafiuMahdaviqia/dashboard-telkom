'use client'

import Link from "next/link"
import { toast } from "react-hot-toast"
import { signOut } from "@/app/actions"
import { LogOut, ShieldAlert } from "lucide-react" // <-- Impor ikon

type UserNavProps = {
  email: string | undefined
}

export default function UserNav({ email }: UserNavProps) {
  
  const handleLogoutClick = () => {
    toast.custom((t) => (
      // --- PERUBAHAN PADA TAMPILAN TOAST DI SINI ---
      <div
        className={`${
          // Animasi masuk dan keluar yang lebih halus
          t.visible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
        } transform transition-all duration-300 max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              {/* Ikon peringatan */}
              <ShieldAlert className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-base font-medium text-gray-900">
                Konfirmasi Logout
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Anda yakin akan keluar dari sesi ini?
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col border-l border-gray-200">
          {/* Tombol Yakin (lebih menonjol) */}
          <button
            onClick={async () => {
              toast.dismiss(t.id)
              await signOut()
              toast.success('Berhasil logout!')
            }}
            className="w-full border-b border-gray-200 p-4 flex items-center justify-center text-sm font-medium text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Yakin
          </button>
          {/* Tombol Tidak */}
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full p-4 flex items-center justify-center text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
          >
            Tidak
          </button>
        </div>
      </div>
    ))
  }

  return email ? (
    <div className="flex items-center gap-4">
      <span className="hidden text-sm sm:block text-gray-300">{email}</span>
      <button 
        onClick={handleLogoutClick}
        className="flex items-center gap-2 rounded-md bg-gray-800 px-3 py-2 text-sm text-white hover:bg-gray-700"
      >
        <LogOut className="h-4 w-4" /> {/* Ikon pada tombol logout */}
        Logout
      </button>
    </div>
  ) : (
    <Link href="/login" className="rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700">
      Login
    </Link>
  )
}