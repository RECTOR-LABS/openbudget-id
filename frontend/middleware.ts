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
    callbacks: { authorized: ({ token }) => token != null },
    pages: { signIn: '/auth/signin' },
  }
);

export default function middleware(req: NextRequest): Response | NextResponse {
  const isAdminRoute = /^(\/(en|id))?\/admin(\/|$)/.test(req.nextUrl.pathname);
  if (isAdminRoute) {
    return (authMiddleware as unknown as (r: NextRequest) => Response | NextResponse)(req);
  }
  return handleI18nRouting(req);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
