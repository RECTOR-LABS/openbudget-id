import createIntlMiddleware from 'next-intl/middleware';
import { withAuth } from 'next-auth/middleware';
import { defineRouting } from 'next-intl/routing';
import { locales, defaultLocale } from './i18n';
import { NextRequest, NextResponse } from 'next/server';

const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
});

const handleI18nRouting = createIntlMiddleware(routing);

const authMiddleware = withAuth(
  function onSuccess(req) {
    return handleI18nRouting(req);
  },
  {
    // authMiddleware only runs for admin routes (gated upstream in `middleware()`),
    // so any request reaching it must be authenticated.
    callbacks: { authorized: ({ token }) => token != null },
    pages: { signIn: '/auth/signin' },
  }
);

const adminRoutePattern = new RegExp(`^(/(${locales.join('|')}))?/admin(/|$)`);

// Routes that are intentionally outside the bilingual [locale] system.
// These are served directly by Next.js with no locale prefix.
const bypassI18nPattern = /^\/(international|auth)(\/|$)/;

export default function middleware(req: NextRequest): Response | NextResponse {
  const { pathname } = req.nextUrl;

  // Let dedicated English-only surfaces pass through without locale processing.
  if (bypassI18nPattern.test(pathname)) {
    return NextResponse.next();
  }

  if (adminRoutePattern.test(pathname)) {
    // next-auth's withAuth returns NextMiddlewareWithAuth which expects
    // (NextRequestWithAuth, NextFetchEvent). NextRequestWithAuth extends NextRequest,
    // so passing a plain NextRequest is structurally safe — next-auth attaches the
    // token before our onSuccess callback runs.
    return (authMiddleware as unknown as (r: NextRequest) => Response | NextResponse)(req);
  }

  return handleI18nRouting(req);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
