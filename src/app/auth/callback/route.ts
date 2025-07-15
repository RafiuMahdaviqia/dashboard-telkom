import { createClient } from '@/utils/supabase/server' // Pastikan ini path yang benar
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Jika berhasil, arahkan ke halaman reset password
      return NextResponse.redirect(`${origin}/reset-password`)
    }
  }

  // Jika gagal, kembali ke login dengan pesan error
  return NextResponse.redirect(`${origin}/login?message=Gagal melakukan autentikasi`)
}