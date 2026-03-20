import { NextResponse } from 'next/server'

let locales = ['th', 'en', 'zh']
let defaultLocale = 'th'

function getLocale(request) {
  // Check if there is any supported language in the Accept-Language header
  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage) {
    if (acceptLanguage.includes('zh')) return 'zh'
    if (acceptLanguage.includes('en')) return 'en'
  }
  return defaultLocale
}

export function middleware(request) {
  const { pathname } = request.nextUrl
  
  // Check if the pathname is missing a locale
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    // Skip static files, api routes, etc.
    if (
      pathname.startsWith('/api') ||
      pathname.startsWith('/_next') ||
      pathname.includes('.') ||
      pathname === '/favicon.ico'
    ) {
      return
    }

    const locale = getLocale(request)
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, request.url)
    )
  }
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!api|_next/static|_next/image|favicon.ico|logo.png).*)',
  ],
}
