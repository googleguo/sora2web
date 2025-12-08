import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"
import { locales, defaultLocale } from "@/lib/i18n/config"

function getLocale(request: NextRequest): string {
  // Check cookie first
  const localeCookie = request.cookies.get("NEXT_LOCALE")?.value

  if (localeCookie && locales.includes(localeCookie as any)) {
    return localeCookie
  }

  // Check Accept-Language header
  const acceptLanguage = request.headers.get("accept-language")

  if (acceptLanguage) {
    const preferredLocale = acceptLanguage.split(",")[0].split("-")[0].toLowerCase()

    if (locales.includes(preferredLocale as any)) {
      return preferredLocale
    }
  }

  return defaultLocale
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip middleware for API routes, static files, and Next.js internals
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.match(/\.(jpg|jpeg|png|gif|svg|ico|webp|js|css|woff|woff2|ttf|eot)$/)
  ) {
    return NextResponse.next()
  }

  const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)

  if (!pathnameHasLocale) {
    const locale = getLocale(request)
    const newUrl = new URL(`/${locale}${pathname}`, request.url)
    newUrl.search = request.nextUrl.search
    return NextResponse.redirect(newUrl)
  }

  return await updateSession(request)
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next/data).*)"],
}
