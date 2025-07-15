'use server'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  // Tambahkan pesan ke URL
  return redirect('/login?message=Logout berhasil!')
}