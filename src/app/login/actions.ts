'use server'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

// Definisikan tipe untuk state yang dikembalikan
type FormState = {
  message: string;
}

// Gunakan tipe FormState untuk prevState
export async function login(prevState: FormState, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return {
      message: 'Email atau password salah.',
    }
  }
  return redirect('/?message=Login berhasil!')
}