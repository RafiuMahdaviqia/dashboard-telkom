import { createClient } from '@/utils/supabase/middleware'
import { type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user && request.nextUrl.pathname !== '/login') {
    return Response.redirect(new URL('/login', request.url))
  }
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|login).*)'],
}