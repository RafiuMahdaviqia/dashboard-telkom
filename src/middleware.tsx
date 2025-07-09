import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Mengambil data pengguna yang sedang login
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Jika pengguna tidak login DAN mencoba mengakses halaman selain /login,
  // alihkan mereka ke halaman login.
  if (!user && request.nextUrl.pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

// Konfigurasi untuk menentukan path mana saja yang akan dijaga oleh middleware
export const config = {
  matcher: [
    /*
    * Cocokkan semua path permintaan kecuali untuk:
    * - Path yang dimulai dengan /_next/static (file statis)
    * - Path yang dimulai dengan /_next/image (optimasi gambar)
    * - Path yang diakhiri dengan favicon.ico (file favicon)
    * - Path yang dimulai dengan /auth (jika ada rute API auth)
    */
    '/((?!_next/static|_next/image|favicon.ico|auth).*)',
  ],
}