'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { useState, useEffect } from 'react' // Impor useEffect
import { login } from './actions'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'react-hot-toast' // Impor toast

const initialState = {
  message: '',
}

function LoginButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      className="mt-2 w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      aria-disabled={pending}
      disabled={pending}
    >
      {pending ? 'Mencoba login...' : 'Log in'}
    </button>
  )
}

export function LoginForm() {
  const [state, formAction] = useActionState(login, initialState)
  const [showPassword, setShowPassword] = useState(false)

  // --- TAMBAHAN UNTUK MEMICU TOAST SAAT ADA ERROR ---
  useEffect(() => {
    if (state?.message) {
      toast.error(state.message, {
        icon: '🚨',
        style: {
          borderRadius: '10px',
          background: '#333', // Latar belakang gelap
          color: '#fff',      // Teks putih
        },
      });
    }
  }, [state]); // Jalankan efek ini setiap kali 'state' berubah

  return (
    <form action={formAction} className="flex w-full flex-col gap-4">
      <div>
        <label className="text-sm font-medium text-black" htmlFor="email">
          Email
        </label>
        <input
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-black"
          id="email"
          name="email"
          placeholder="nama@email.com"
          required
        />
      </div>
      
      <div>
        <label className="text-sm font-medium text-black" htmlFor="password">
          Password
        </label>
        <div className="relative">
          <input
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-black"
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-800"
            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>
      
      <LoginButton />

      {/* Pesan error di bawah form sekarang kita HAPUS */}
    </form>
  )
}