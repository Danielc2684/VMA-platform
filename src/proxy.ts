import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

const ADMIN_ROLES = new Set(['ADMIN', 'MANAGER', 'SUPER_ADMIN'])
const CLIENT_ROLES = new Set(['CLIENT', 'VIEWER'])

export async function proxy(request: NextRequest): Promise<NextResponse> {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh the session — must happen before any auth checks.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  const isAdminRoute = pathname.startsWith('/admin')
  const isPortalRoute = pathname.startsWith('/portal')
  const isProtectedRoute = isAdminRoute || isPortalRoute

  // Unauthenticated user trying to access a protected route → login
  if (!user && isProtectedRoute) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Authenticated user — role-based routing
  if (user && isProtectedRoute) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = (profile?.role as string | undefined) ?? 'CLIENT'

    // CLIENT/VIEWER trying to access /admin → portal dashboard
    if (isAdminRoute && CLIENT_ROLES.has(role)) {
      const portalUrl = request.nextUrl.clone()
      portalUrl.pathname = '/portal/dashboard'
      return NextResponse.redirect(portalUrl)
    }

    // ADMIN/MANAGER/SUPER_ADMIN trying to access /portal → admin dashboard
    if (isPortalRoute && ADMIN_ROLES.has(role)) {
      const adminUrl = request.nextUrl.clone()
      adminUrl.pathname = '/admin/dashboard'
      return NextResponse.redirect(adminUrl)
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
