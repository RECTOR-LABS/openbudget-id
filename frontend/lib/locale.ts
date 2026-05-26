import { NextRequest } from 'next/server';

export type ApiLocale = 'en' | 'id';

/**
 * Resolves the active locale from a Next.js API request.
 *
 * Priority order:
 *   1. ?locale=X query param  — highest priority, useful for testing & direct linking
 *   2. NEXT_LOCALE cookie     — set by next-intl middleware on every page navigation
 *   3. Accept-Language header — browser preference (Indonesian if id-* present, else English)
 *   4. Default: 'en'
 *
 * The function only accepts 'en' and 'id'; any unrecognised value falls through
 * to the next source, keeping the system forward-compatible with future locales.
 */
export function getLocaleFromRequest(req: NextRequest): ApiLocale {
  // 1. Explicit ?locale= query param (highest priority — useful for testing and direct links)
  const queryLocale = req.nextUrl.searchParams.get('locale');
  if (queryLocale === 'en' || queryLocale === 'id') return queryLocale;

  // 2. NEXT_LOCALE cookie (set by next-intl middleware on page navigation)
  const cookieLocale = req.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale === 'en' || cookieLocale === 'id') return cookieLocale;

  // 3. Accept-Language header (Indonesian if id-* present anywhere in the tag list)
  const acceptLang = req.headers.get('accept-language') ?? '';
  if (/^id\b/i.test(acceptLang) || /,\s*id\b/i.test(acceptLang)) return 'id';

  // 4. Default to English
  return 'en';
}
