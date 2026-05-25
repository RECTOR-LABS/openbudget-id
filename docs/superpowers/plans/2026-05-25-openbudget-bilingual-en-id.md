# OpenBudget Bilingual EN/ID Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert OpenBudget from Indonesian-first to bilingual (EN default + ID toggle) using `next-intl` for UI strings and `_en` suffix columns for database content, while removing the dead `VideoCarousel` showcase section.

**Architecture:** `next-intl` middleware with prefix routing (`/` = English, `/id/*` = Indonesian). All locale-aware pages move under `app/[locale]/`. API routes read locale from cookie/header and select `_en` columns when locale is English (with NULL-fallback to original). Static FX rate (1 USD = 16,000 IDR) for English-mode USD hints. Pitch-deck video section deleted entirely.

**Tech Stack:** Next.js 14.2.15 (App Router), `next-intl` (new), TypeScript strict, PostgreSQL (Neon prod, local dev), Tailwind, framer-motion, pnpm.

**Spec:** `docs/superpowers/specs/2026-05-25-openbudget-bilingual-en-id-design.md`

**Working directory for all steps:** `/Users/rector/local-dev/openbudget-garuda-spark`

---

## Pre-flight verification

Before starting Task 1, confirm:
- Git status is clean on `main` (commit `ce18931` or later).
- `pnpm` available at the frontend directory: `cd frontend && pnpm --version` returns a version number.
- Production DB connection works: pull `DATABASE_URL` via `cd frontend && vercel env pull .env.vercel.production --environment=production --scope=rectors-projects`, then `psql "<the URL>" -c "SELECT 1"` returns `1`. If a local Postgres named `openbudget` also exists (per project CLAUDE.md), feel free to apply migrations there first and then to prod — otherwise apply directly to Neon prod and skip the local-first step in Tasks 17/18.
- Production deploy currently works: `curl -sI https://openbudget.rectorspace.com` returns `HTTP/2 200`.

---

## Task 1: Install and configure `next-intl`

**Files:**
- Modify: `frontend/package.json`
- Create: `frontend/i18n.ts`
- Create: `frontend/messages/en.json`
- Create: `frontend/messages/id.json`
- Modify: `frontend/next.config.js` (or `.mjs` — verify which exists)

- [ ] **Step 1: Install `next-intl`**

```bash
cd frontend && pnpm add next-intl@latest
```

Expected: package added to `dependencies` in `package.json`, no peer dependency warnings beyond the existing ones.

- [ ] **Step 2: Create `frontend/i18n.ts` (next-intl request config)**

```typescript
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['en', 'id'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locale)) notFound();
  return {
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 3: Create empty `frontend/messages/en.json` and `frontend/messages/id.json`**

Both files start as:

```json
{}
```

- [ ] **Step 4: Wire next-intl into `next.config.js`**

First check which config file exists:

```bash
ls frontend/next.config.* 2>/dev/null
```

Open the existing file (`.js` or `.mjs`) and wrap the default export with `createNextIntlPlugin`:

For `.mjs`:
```javascript
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ...existing config...
};

export default withNextIntl(nextConfig);
```

For `.js`:
```javascript
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ...existing config...
};

module.exports = withNextIntl(nextConfig);
```

- [ ] **Step 5: Verify build passes with no functional change yet**

```bash
cd frontend && pnpm build
```

Expected: build succeeds. No locale routing yet (no middleware), so the app still serves Indonesian content at all routes.

- [ ] **Step 6: Commit**

```bash
git add frontend/package.json frontend/pnpm-lock.yaml frontend/i18n.ts frontend/messages/en.json frontend/messages/id.json frontend/next.config.*
git commit -m "chore: install next-intl and add empty message dictionaries"
```

---

## Task 2: Add locale routing middleware

**Files:**
- Create or modify: `frontend/middleware.ts`

- [ ] **Step 1: Check if a middleware file already exists**

```bash
ls frontend/middleware.ts frontend/middleware.js frontend/src/middleware.ts 2>/dev/null
```

If one exists (likely from NextAuth), read its contents — we'll need to compose locale routing with the existing auth gate.

- [ ] **Step 2: Write the locale-aware middleware**

If no existing middleware, create `frontend/middleware.ts`:

```typescript
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
});

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
```

If there IS an existing middleware (e.g., NextAuth gating `/admin/*`), compose them. The pattern is:

```typescript
import createIntlMiddleware from 'next-intl/middleware';
import { withAuth } from 'next-auth/middleware';
import { locales, defaultLocale } from './i18n';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
});

const authMiddleware = withAuth(
  function onSuccess(req) {
    return intlMiddleware(req);
  },
  {
    callbacks: { authorized: ({ token }) => token != null },
    pages: { signIn: '/api/auth/signin' },
  },
);

export default function middleware(req: NextRequest) {
  const isAdminRoute = /^(\/(en|id))?\/admin(\/|$)/.test(req.nextUrl.pathname);
  if (isAdminRoute) {
    return (authMiddleware as unknown as (r: NextRequest) => Response | NextResponse)(req);
  }
  return intlMiddleware(req);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
```

`localePrefix: 'as-needed'` means English (the default) has no prefix (`/`), while Indonesian uses `/id/*`.

- [ ] **Step 3: Run dev server to verify routing works**

```bash
cd frontend && pnpm dev
```

In another terminal:
```bash
curl -sI http://localhost:3000/ | head -5
curl -sI http://localhost:3000/id | head -5
```

Expected: `200 OK` for both. (Visiting `/` still serves Indonesian content because no pages are under `[locale]/` yet.)

Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add frontend/middleware.ts
git commit -m "feat: add next-intl locale routing middleware (en default, /id prefix)"
```

---

## Task 3: Move root layout to support `[locale]` segment

**Files:**
- Modify: `frontend/app/layout.tsx` (minimize to bare HTML root)
- Create: `frontend/app/[locale]/layout.tsx` (locale-aware layout with `NextIntlClientProvider`)

- [ ] **Step 1: Read the current `frontend/app/layout.tsx` and identify what's there**

```bash
wc -l frontend/app/layout.tsx
```

Components/providers/fonts/metadata that depend on locale go in `[locale]/layout.tsx`. Things that are global (e.g., font imports, base HTML structure) stay in root `layout.tsx`.

- [ ] **Step 2: Strip `frontend/app/layout.tsx` to the absolute minimum**

```typescript
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OpenBudget.ID - Transparent Government Spending',
  description: 'Making every public fund traceable, auditable, and transparent — powered by Solana.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
```

(No `<html>` or `<body>` here — those move to `[locale]/layout.tsx` so the `lang` attribute can reflect the active locale.)

- [ ] **Step 3: Create `frontend/app/[locale]/layout.tsx`**

```typescript
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n';
// Re-import whatever providers/fonts/global components were previously in app/layout.tsx
// (NextAuthProvider, SolanaWalletProvider, Header, Footer, etc.)

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as Locale)) notFound();

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {/* Existing providers (NextAuth, Solana wallet, etc.) wrap here */}
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

Re-add whatever providers and global components (`<Header />`, `<Footer />`, font imports, etc.) the previous `app/layout.tsx` had — inside `<body>`, wrapping `{children}` appropriately.

- [ ] **Step 4: Verify build**

```bash
cd frontend && pnpm build
```

Expected: build fails because pages outside `[locale]/` won't render (no layout). That's OK — we'll fix it in Task 4 by moving pages. If you want to verify before Task 4, manually move just `app/page.tsx` → `app/[locale]/page.tsx` and rebuild.

- [ ] **Step 5: Commit**

```bash
git add frontend/app/layout.tsx frontend/app/[locale]/layout.tsx
git commit -m "feat: split root layout into bare root + locale-aware [locale]/layout.tsx"
```

---

## Task 4: Move all public pages under `app/[locale]/`

**Files:**
- Move: `frontend/app/page.tsx` → `frontend/app/[locale]/page.tsx`
- Move: `frontend/app/projects/page.tsx` → `frontend/app/[locale]/projects/page.tsx`
- Move: `frontend/app/projects/[id]/page.tsx` → `frontend/app/[locale]/projects/[id]/page.tsx`
- Move: `frontend/app/analytics/page.tsx` → `frontend/app/[locale]/analytics/page.tsx`
- Move: `frontend/app/api-docs/page.tsx` → `frontend/app/[locale]/api-docs/page.tsx`
- Move: `frontend/app/pitch-deck/page.tsx` → `frontend/app/[locale]/pitch-deck/page.tsx`
- Move: all of `frontend/app/admin/**/*` → `frontend/app/[locale]/admin/**/*`

DO NOT MOVE:
- `frontend/app/api/**/*` (API routes stay top-level)
- `frontend/app/international/**/*` (dedicated English pitch surface, stays outside the bilingual system)

- [ ] **Step 1: Move public pages with `git mv`**

```bash
cd /Users/rector/local-dev/openbudget-garuda-spark/frontend
git mv app/page.tsx app/[locale]/page.tsx
git mv app/projects app/[locale]/projects
git mv app/analytics app/[locale]/analytics
git mv app/api-docs app/[locale]/api-docs
git mv app/pitch-deck app/[locale]/pitch-deck
git mv app/admin app/[locale]/admin
```

- [ ] **Step 2: Verify only these directories remain at the top of `frontend/app/`**

```bash
ls frontend/app/
```

Expected output should include: `[locale]/`, `api/`, `international/`, `layout.tsx`, `globals.css`, plus any `favicon.ico` or similar. No `page.tsx` (now under `[locale]/`).

- [ ] **Step 3: Update any internal absolute-path imports broken by the move**

```bash
cd frontend && pnpm typecheck
```

Fix any "cannot find module" errors. Most imports use `@/components/...` or `@/lib/...` which don't change. If any page imports a sibling page (rare), update the relative path.

- [ ] **Step 4: Run build**

```bash
cd frontend && pnpm build
```

Expected: build succeeds. All public routes are now `/` (renders English layout, Indonesian-content pages) and `/id/*` (renders the same pages with `lang="id"`).

- [ ] **Step 5: Smoke-test in browser**

```bash
cd frontend && pnpm dev
```

Visit `http://localhost:3000/`, `/id`, `/projects`, `/id/projects`, `/admin` (will redirect to login if NextAuth is gating), `/pitch-deck`, `/id/pitch-deck`. Each should render the existing Indonesian content without errors. (No translations applied yet.)

Stop the dev server.

- [ ] **Step 6: Commit**

```bash
git add frontend/app
git commit -m "refactor: move all locale-aware pages under app/[locale]/"
```

---

## Task 5: Add `LanguageToggle` component to `Header`

**Files:**
- Create: `frontend/components/LanguageToggle.tsx`
- Modify: `frontend/components/Header.tsx`

- [ ] **Step 1: Create `LanguageToggle` component**

`frontend/components/LanguageToggle.tsx`:

```typescript
'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchTo = (target: 'en' | 'id') => {
    if (target === locale) return;
    // Strip current locale prefix, then prepend target prefix (if target !== default)
    const stripped = pathname.replace(/^\/(en|id)(?=\/|$)/, '') || '/';
    const next = target === 'en' ? stripped : `/id${stripped === '/' ? '' : stripped}`;
    router.push(next);
  };

  return (
    <div className="flex items-center gap-1 text-sm font-medium">
      <button
        type="button"
        onClick={() => switchTo('en')}
        className={locale === 'en' ? 'text-gray-900 font-bold' : 'text-gray-500 hover:text-gray-700'}
        aria-pressed={locale === 'en'}
      >
        EN
      </button>
      <span className="text-gray-300">|</span>
      <button
        type="button"
        onClick={() => switchTo('id')}
        className={locale === 'id' ? 'text-gray-900 font-bold' : 'text-gray-500 hover:text-gray-700'}
        aria-pressed={locale === 'id'}
      >
        ID
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Import and render `LanguageToggle` in `Header.tsx`**

Read `frontend/components/Header.tsx` (9.0KB file). Find the right side of the header — typically near the existing "Admin Login" button or wallet connect button. Add `<LanguageToggle />` immediately before or after that element.

Sample diff (adapt based on actual layout):

```typescript
import { LanguageToggle } from './LanguageToggle';

// ...inside the right-aligned nav group...
<div className="flex items-center gap-4">
  <LanguageToggle />
  {/* existing admin-login / wallet-connect button */}
</div>
```

If the header has a mobile menu (hamburger), also add `<LanguageToggle />` inside the mobile menu panel.

- [ ] **Step 3: Verify build**

```bash
cd frontend && pnpm build
```

Expected: passes.

- [ ] **Step 4: Smoke-test toggle behavior**

```bash
cd frontend && pnpm dev
```

Visit `http://localhost:3000/projects`. Click `ID`. URL should change to `http://localhost:3000/id/projects`. Click `EN`. URL should change back to `http://localhost:3000/projects`. Content doesn't change yet (translations empty).

Test with query strings: visit `http://localhost:3000/projects?status=published`. Click `ID`. URL should become `/id/projects?status=published` (query preserved by `router.push` Next.js semantics — verify; if not, add explicit `+ window.location.search` to the `next` variable in `LanguageToggle`).

Stop the dev server.

- [ ] **Step 5: Commit**

```bash
git add frontend/components/LanguageToggle.tsx frontend/components/Header.tsx
git commit -m "feat: add EN|ID language toggle to header"
```

---

## Task 6: Translate `Header` and `Footer` strings

**Files:**
- Modify: `frontend/messages/en.json`
- Modify: `frontend/messages/id.json`
- Modify: `frontend/components/Header.tsx`
- Modify: `frontend/components/Footer.tsx`

- [ ] **Step 1: Extract Header strings into dictionaries**

Read `frontend/components/Header.tsx` and list every visible string (nav labels, button text, aria-labels). Add to `messages/id.json` under `header.*` namespace (Indonesian values = current strings) and to `messages/en.json` (English translations).

Example (adapt to actual contents):

`messages/id.json`:
```json
{
  "header": {
    "nav": {
      "home": "Beranda",
      "projects": "Daftar Proyek",
      "analytics": "Analitik",
      "apiDocs": "Dokumentasi API",
      "pitchDeck": "Pitch Deck"
    },
    "adminLogin": "Login Kementerian",
    "languageToggleAria": "Pilih bahasa"
  }
}
```

`messages/en.json`:
```json
{
  "header": {
    "nav": {
      "home": "Home",
      "projects": "Projects",
      "analytics": "Analytics",
      "apiDocs": "API Docs",
      "pitchDeck": "Pitch Deck"
    },
    "adminLogin": "Ministry Login",
    "languageToggleAria": "Choose language"
  }
}
```

- [ ] **Step 2: Replace hardcoded Header strings with `useTranslations`**

In `frontend/components/Header.tsx`:

```typescript
'use client';
import { useTranslations } from 'next-intl';
// ...

export default function Header() {
  const t = useTranslations('header');
  return (
    <header>
      {/* ... */}
      <nav>
        <Link href="/">{t('nav.home')}</Link>
        <Link href="/projects">{t('nav.projects')}</Link>
        <Link href="/analytics">{t('nav.analytics')}</Link>
        <Link href="/api-docs">{t('nav.apiDocs')}</Link>
        <Link href="/pitch-deck">{t('nav.pitchDeck')}</Link>
      </nav>
      <Link href="/admin">{t('adminLogin')}</Link>
      <LanguageToggle />
      {/* ... */}
    </header>
  );
}
```

Note: `next-intl` automatically prefixes internal links with the active locale via the `<Link>` from `next-intl/link` (use that import for locale-prefix awareness). If you're using the default `next/link`, manually prefix locale paths — but using `next-intl/link` is cleaner. Replace:

```typescript
import Link from 'next/link';
// →
import { Link } from '@/i18n/routing';  // (created in next step if needed)
```

Or use next-intl's wrapper. Refer to https://next-intl-docs.vercel.app/docs/routing/navigation for the official pattern.

- [ ] **Step 3: Apply same pattern to `frontend/components/Footer.tsx`**

Extract all 9+ Indonesian strings into `messages/{en,id}.json` under `footer.*` namespace. Replace inline strings with `useTranslations('footer')`.

`messages/id.json` additions (example structure):
```json
{
  "footer": {
    "tagline": "TRANSPARANSI BLOCKCHAIN",
    "description": "Platform transparansi anggaran pemerintah berbasis blockchain",
    "quickNav": "Navigasi Cepat",
    "links": {
      "home": "Beranda",
      "projects": "Daftar Proyek",
      "apiDocs": "Dokumentasi API",
      "adminPanel": "Panel Admin Kementerian"
    },
    "copyright": "© {year} OpenBudget.ID. Semua hak dilindungi."
  }
}
```

`messages/en.json`:
```json
{
  "footer": {
    "tagline": "BLOCKCHAIN TRANSPARENCY",
    "description": "Blockchain-based government budget transparency platform",
    "quickNav": "Quick Navigation",
    "links": {
      "home": "Home",
      "projects": "Projects",
      "apiDocs": "API Docs",
      "adminPanel": "Ministry Admin Panel"
    },
    "copyright": "© {year} OpenBudget.ID. All rights reserved."
  }
}
```

For interpolated values (e.g., year), use next-intl's interpolation: `{t('footer.copyright', { year: new Date().getFullYear() })}`.

- [ ] **Step 4: Verify build + browser**

```bash
cd frontend && pnpm build && pnpm dev
```

Visit `/` and `/id`. Header nav and footer strings should swap between English and Indonesian on toggle. Stop dev server.

- [ ] **Step 5: Commit**

```bash
git add frontend/messages/ frontend/components/Header.tsx frontend/components/Footer.tsx
git commit -m "feat: translate Header and Footer strings via next-intl dictionaries"
```

---

## Task 7: Translate home page (`/`)

**Files:**
- Modify: `frontend/messages/en.json`, `frontend/messages/id.json`
- Modify: `frontend/app/[locale]/page.tsx`

- [ ] **Step 1: Extract all visible strings from `frontend/app/[locale]/page.tsx`**

Read the file and inventory every Indonesian string — hero copy, section headings, button labels, search/filter placeholders, empty-state text, etc.

Add to `messages/id.json` under `home.*`:

```json
{
  "home": {
    "hero": {
      "headline": "Transparansi Anggaran Negara, Di Ujung Jari Anda",
      "subhead": "Lihat setiap rupiah anggaran negara dilacak, diverifikasi, dan transparan."
    },
    "search": {
      "placeholder": "🔍 Cari Proyek",
      "ministryFilter": "🏛️ Filter Kementerian",
      "allMinistries": "Semua Kementerian"
    },
    "states": {
      "empty": "Tidak ada proyek ditemukan",
      "loading": "Memuat proyek..."
    },
    "internationalLink": ""
  }
}
```

(`internationalLink` is set in `messages/en.json` only; keep empty or `null` in `id.json`.)

Add to `messages/en.json` under `home.*` — translate everything to natural English.

```json
{
  "home": {
    "hero": {
      "headline": "Government Budget Transparency, At Your Fingertips",
      "subhead": "See every rupiah of the national budget tracked, verified, and transparent."
    },
    "search": {
      "placeholder": "🔍 Search Projects",
      "ministryFilter": "🏛️ Filter by Ministry",
      "allMinistries": "All Ministries"
    },
    "states": {
      "empty": "No projects found",
      "loading": "Loading projects..."
    },
    "internationalLink": "For international partners →"
  }
}
```

- [ ] **Step 2: Replace inline strings in `frontend/app/[locale]/page.tsx`**

```typescript
'use client';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
// ...

export default function HomePage() {
  const t = useTranslations('home');
  const locale = useLocale();
  // ...
  return (
    <main>
      <h1>{t('hero.headline')}</h1>
      <p>{t('hero.subhead')}</p>
      <input placeholder={t('search.placeholder')} />
      <select aria-label={t('search.ministryFilter')}>
        <option>{t('search.allMinistries')}</option>
        {/* ... */}
      </select>
      {projects.length === 0 && <p>{t('states.empty')}</p>}
      {locale === 'en' && (
        <Link href="/international" className="text-sm underline text-gray-600 mt-12 block">
          {t('internationalLink')}
        </Link>
      )}
    </main>
  );
}
```

Note: the `/international` cross-link only renders in English mode per the spec (Section 9).

- [ ] **Step 3: Verify in browser**

```bash
cd frontend && pnpm build && pnpm dev
```

Visit `/` and `/id`. Toggle. Confirm all home-page chrome swaps language. Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add frontend/messages/ frontend/app/[locale]/page.tsx
git commit -m "feat: translate home page strings (hero, search, states, international link)"
```

---

## Task 8: Translate projects list page (`/projects`) and `ProjectCard`

**Files:**
- Modify: `frontend/messages/en.json`, `frontend/messages/id.json`
- Modify: `frontend/app/[locale]/projects/page.tsx`
- Modify: `frontend/components/ProjectCard.tsx`

- [ ] **Step 1: Extract strings from `projects/page.tsx` and `ProjectCard.tsx`**

Add to dictionaries under `projects.list.*` and `projects.card.*`:

`messages/id.json` additions:
```json
{
  "projects": {
    "list": {
      "title": "Semua Proyek Anggaran",
      "subtitle": "Jelajahi transparansi anggaran negara",
      "states": {
        "loading": "Memuat...",
        "empty": "Tidak ada proyek ditemukan",
        "error": "Gagal memuat proyek"
      }
    },
    "card": {
      "budget": "Anggaran",
      "released": "Dirilis",
      "progress": "Kemajuan",
      "verified": "Terverifikasi Blockchain",
      "viewDetails": "Lihat Detail"
    }
  }
}
```

`messages/en.json`:
```json
{
  "projects": {
    "list": {
      "title": "All Budget Projects",
      "subtitle": "Explore government budget transparency",
      "states": {
        "loading": "Loading...",
        "empty": "No projects found",
        "error": "Failed to load projects"
      }
    },
    "card": {
      "budget": "Budget",
      "released": "Released",
      "progress": "Progress",
      "verified": "Blockchain Verified",
      "viewDetails": "View Details"
    }
  }
}
```

- [ ] **Step 2: Update `frontend/app/[locale]/projects/page.tsx`** to use `useTranslations('projects.list')`.

- [ ] **Step 3: Update `frontend/components/ProjectCard.tsx`** to use `useTranslations('projects.card')`.

- [ ] **Step 4: Verify build + browser walkthrough**

```bash
cd frontend && pnpm build && pnpm dev
```

Visit `/projects` and `/id/projects`. Confirm chrome swaps. Project titles still Indonesian (DB content is translated in Task 16). Stop dev server.

- [ ] **Step 5: Commit**

```bash
git add frontend/messages/ frontend/app/[locale]/projects/page.tsx frontend/components/ProjectCard.tsx
git commit -m "feat: translate projects list + ProjectCard strings"
```

---

## Task 9: Translate project detail page + engagement components

**Files:**
- Modify: `frontend/messages/en.json`, `frontend/messages/id.json`
- Modify: `frontend/app/[locale]/projects/[id]/page.tsx`
- Modify: `frontend/components/CommentSection.tsx`
- Modify: `frontend/components/TrustScoreRating.tsx`
- Modify: `frontend/components/WatchlistButton.tsx`
- Modify: `frontend/components/IssueReportModal.tsx`

- [ ] **Step 1: Extract project-detail strings to `projects.detail.*`**

Headings, milestone labels, status badges, "View on Solana Explorer" button, error states, 404 message, "Proof document" link text, etc.

Sample structure:
```json
{
  "projects": {
    "detail": {
      "notFound": "Proyek tidak ditemukan",
      "loadError": "Gagal memuat proyek",
      "milestones": {
        "title": "Milestones",
        "released": "Dirilis",
        "pending": "Menunggu",
        "amount": "Jumlah",
        "proofLink": "Lihat Bukti",
        "verifyOnExplorer": "Verifikasi di Solana Explorer"
      },
      "stats": {
        "totalBudget": "Total Anggaran",
        "totalReleased": "Total Dirilis",
        "completion": "Penyelesaian"
      }
    }
  }
}
```

English equivalents — keep technical terms natural ("View Proof", "Verify on Solana Explorer", "Total Budget", "Total Released", "Completion", "Milestones", "Released", "Pending").

- [ ] **Step 2: Extract engagement component strings**

For each of `CommentSection`, `TrustScoreRating`, `WatchlistButton`, `IssueReportModal`, create a sub-namespace under `engagement.*`:

```json
{
  "engagement": {
    "comments": {
      "title": "Komentar Publik",
      "placeholder": "Tulis komentar Anda...",
      "submit": "Kirim",
      "namePlaceholder": "Nama Anda",
      "emailPlaceholder": "Email Anda",
      "ministryResponse": "Tanggapan Kementerian",
      "rateLimited": "Anda telah mencapai batas komentar harian",
      "characterCount": "{count}/1000 karakter"
    },
    "ratings": {
      "title": "Skor Kepercayaan",
      "averageLabel": "Rata-rata",
      "totalRatings": "{count} penilaian",
      "yourRating": "Penilaian Anda",
      "submit": "Kirim Penilaian",
      "starsLabel": "{count} bintang"
    },
    "watchlist": {
      "subscribe": "Pantau Proyek Ini",
      "subscribed": "Berlangganan",
      "frequency": {
        "instant": "Instan",
        "daily": "Harian",
        "weekly": "Mingguan"
      },
      "modal": {
        "title": "Daftar Notifikasi",
        "submit": "Daftar"
      }
    },
    "issues": {
      "reportButton": "Laporkan Masalah",
      "modal": {
        "title": "Laporkan Pengeluaran Mencurigakan",
        "typeLabel": "Jenis Masalah",
        "types": {
          "budget_mismatch": "Anggaran Tidak Sesuai",
          "missing_proof": "Bukti Hilang",
          "delayed_release": "Pencairan Tertunda",
          "fraudulent_claim": "Klaim Penipuan",
          "other": "Lainnya"
        },
        "severityLabel": "Tingkat Keparahan",
        "severity": {
          "low": "Rendah",
          "medium": "Sedang",
          "high": "Tinggi",
          "critical": "Kritis"
        },
        "descriptionLabel": "Deskripsi (10-2000 karakter)",
        "submit": "Kirim Laporan"
      }
    }
  }
}
```

English version translates each value naturally — match tone of `/international` page (professional but accessible).

- [ ] **Step 3: Apply `useTranslations` to each component**

For `CommentSection.tsx`:
```typescript
import { useTranslations } from 'next-intl';
const t = useTranslations('engagement.comments');
// <button>{t('submit')}</button>
// <p>{t('characterCount', { count: content.length })}</p>
```

Repeat for `TrustScoreRating.tsx`, `WatchlistButton.tsx`, `IssueReportModal.tsx` with their respective namespaces.

- [ ] **Step 4: Verify build + browser**

```bash
cd frontend && pnpm build && pnpm dev
```

Visit a project detail page `/projects/[some-id]` and `/id/projects/[some-id]`. Toggle. Confirm comments form, rating widget, watchlist button, issue modal all swap language. (DB-side project title and milestone descriptions still Indonesian — that's Task 16.) Stop dev server.

- [ ] **Step 5: Commit**

```bash
git add frontend/messages/ frontend/app/[locale]/projects/[id]/page.tsx frontend/components/CommentSection.tsx frontend/components/TrustScoreRating.tsx frontend/components/WatchlistButton.tsx frontend/components/IssueReportModal.tsx
git commit -m "feat: translate project detail page + engagement components"
```

---

## Task 10: Translate analytics page

**Files:**
- Modify: `frontend/messages/en.json`, `frontend/messages/id.json`
- Modify: `frontend/app/[locale]/analytics/page.tsx`

- [ ] **Step 1: Extract analytics strings under `analytics.*`**

Section headings, chart axis labels, leaderboard column headers, anomaly type labels, time-range selector labels.

`messages/id.json`:
```json
{
  "analytics": {
    "title": "Analitik & Intelijen",
    "leaderboard": {
      "title": "Peringkat Kementerian",
      "columns": {
        "ministry": "Kementerian",
        "completionRate": "Tingkat Penyelesaian",
        "budgetAccuracy": "Akurasi Anggaran",
        "releaseRate": "Tingkat Pencairan",
        "trustScore": "Skor Kepercayaan",
        "overallScore": "Skor Keseluruhan"
      }
    },
    "trends": {
      "title": "Tren Pengeluaran",
      "ranges": {
        "daily": "Harian",
        "weekly": "Mingguan",
        "monthly": "Bulanan",
        "yearly": "Tahunan"
      }
    },
    "anomalies": {
      "title": "Deteksi Anomali",
      "patterns": {
        "low_release_rate": "Tingkat Pencairan Rendah",
        "missing_proof": "Bukti Hilang",
        "over_allocated": "Anggaran Berlebih",
        "low_trust_score": "Skor Kepercayaan Rendah"
      },
      "severity": {
        "low": "Rendah",
        "medium": "Sedang",
        "high": "Tinggi",
        "critical": "Kritis"
      }
    }
  }
}
```

`messages/en.json`: translate everything naturally.

- [ ] **Step 2: Replace inline strings with `useTranslations('analytics')`**

For Recharts axis labels and tooltips, pass translated strings via props rather than hardcoded text.

- [ ] **Step 3: Verify + commit**

```bash
cd frontend && pnpm build
git add frontend/messages/ frontend/app/[locale]/analytics/page.tsx
git commit -m "feat: translate analytics page (leaderboard, trends, anomalies)"
```

---

## Task 11: Translate API docs page

**Files:**
- Modify: `frontend/messages/en.json`, `frontend/messages/id.json`
- Modify: `frontend/app/[locale]/api-docs/page.tsx`

- [ ] **Step 1: Extract API docs strings under `apiDocs.*`**

Section headings, endpoint descriptions, code block captions, intro paragraph. Keep technical terms (`GET`, `POST`, JSON keys) untranslated. Translate prose around them.

- [ ] **Step 2: Apply `useTranslations('apiDocs')`**

- [ ] **Step 3: Verify + commit**

```bash
cd frontend && pnpm build
git add frontend/messages/ frontend/app/[locale]/api-docs/page.tsx
git commit -m "feat: translate API docs page chrome"
```

---

## Task 12: Translate admin dashboard + admin layout components

**Files:**
- Modify: `frontend/messages/en.json`, `frontend/messages/id.json`
- Modify: `frontend/app/[locale]/admin/page.tsx`
- Modify: admin layout/sidebar/header components under `frontend/components/admin/*`

- [ ] **Step 1: Identify admin layout components**

```bash
ls frontend/components/admin/
```

Read each (likely: `AdminLayout.tsx`, `AdminSidebar.tsx`, `AdminHeader.tsx`).

- [ ] **Step 2: Extract admin strings under `admin.*`**

```json
{
  "admin": {
    "dashboard": {
      "title": "Dasbor Admin",
      "quickActions": {
        "newProject": "Buat Proyek Baru",
        "manageProjects": "Kelola Proyek"
      },
      "stats": {
        "title": "Statistik Kementerian",
        "subtitle": "Ringkasan performa transparansi"
      },
      "emptyState": "Mulai dengan membuat proyek baru"
    },
    "sidebar": {
      "dashboard": "Dasbor",
      "projects": "Proyek",
      "newProject": "Proyek Baru",
      "settings": "Pengaturan",
      "systemInsights": "Wawasan Sistem"
    },
    "header": {
      "wallet": {
        "connect": "Hubungkan Wallet",
        "connected": "Terhubung",
        "disconnect": "Putuskan"
      },
      "signOut": "Keluar"
    }
  }
}
```

English equivalents.

- [ ] **Step 3: Apply `useTranslations` to each component**

- [ ] **Step 4: Verify + commit**

```bash
cd frontend && pnpm build
git add frontend/messages/ frontend/app/[locale]/admin/page.tsx frontend/components/admin/
git commit -m "feat: translate admin dashboard + layout components"
```

---

## Task 13: Translate admin/projects + admin/projects/new

**Files:**
- Modify: `frontend/messages/en.json`, `frontend/messages/id.json`
- Modify: `frontend/app/[locale]/admin/projects/page.tsx`
- Modify: `frontend/app/[locale]/admin/projects/new/page.tsx`
- Modify: `frontend/app/[locale]/admin/projects/[id]/page.tsx` (if exists)

- [ ] **Step 1: Inventory admin project page files**

```bash
find frontend/app/[locale]/admin/projects -type f -name '*.tsx'
```

- [ ] **Step 2: Extract strings under `admin.projects.*` and `admin.newProject.*`**

Form labels, button text, validation messages, status badges, milestone management UI, publish-to-blockchain flow text.

- [ ] **Step 3: Apply `useTranslations`**

- [ ] **Step 4: Verify + commit**

```bash
cd frontend && pnpm build
git add frontend/messages/ frontend/app/[locale]/admin/projects/
git commit -m "feat: translate admin projects pages (list, new, detail)"
```

---

## Task 14: Translate admin/settings (with DB refactor) + admin/system-insights

**Files:**
- Modify: `frontend/messages/en.json`, `frontend/messages/id.json`
- Modify: `frontend/app/[locale]/admin/settings/page.tsx` (also refactor to query DB)
- Modify: `frontend/app/[locale]/admin/system-insights/page.tsx`

- [ ] **Step 1: Read `admin/settings/page.tsx`**

Identify where the 10 ministry names are hardcoded.

- [ ] **Step 2: Refactor to query the DB**

Replace the hardcoded list with a `fetch('/api/ministry-accounts')` call (or a server-component DB query if the page is a server component). The list of ministries shown in the dropdown comes from `ministry_accounts` table — both `ministry_name` (for Indonesian) and `ministry_name_en` (for English, set in Task 17).

For an English-mode visitor, show `ministry_name_en`; for Indonesian, show `ministry_name`. The API endpoint will already handle this (per Task 19).

- [ ] **Step 3: Extract remaining UI strings under `admin.settings.*` and `admin.systemInsights.*`**

- [ ] **Step 4: Verify + commit**

```bash
cd frontend && pnpm build
git add frontend/messages/ frontend/app/[locale]/admin/settings/ frontend/app/[locale]/admin/system-insights/
git commit -m "feat: translate admin settings + system-insights; query ministries from DB"
```

---

## Task 15: Delete `VideoCarousel`, remove video showcase section, translate pitch-deck

**Files:**
- Delete: `frontend/components/VideoCarousel.tsx`
- Modify: `frontend/app/[locale]/pitch-deck/page.tsx`
- Modify: `frontend/messages/en.json`, `frontend/messages/id.json`

- [ ] **Step 1: Delete `VideoCarousel.tsx`**

```bash
git rm frontend/components/VideoCarousel.tsx
```

- [ ] **Step 2: Remove video section and import from `pitch-deck/page.tsx`**

Open `frontend/app/[locale]/pitch-deck/page.tsx`. Remove:
- The import line: `import VideoCarousel from '@/components/VideoCarousel';`
- The entire `<section>` block containing the `🎥 Demo Video` heading, animated background particles, and `<VideoCarousel />` mount. This is the section at original lines 296–347 (line numbers may shift after the move under `[locale]/`).

After removal, the section above it (previous section) flows directly into the next "Features Showcase" section.

- [ ] **Step 3: Check for any video-related assets in `frontend/public/` and remove if confirmed unused**

```bash
ls frontend/public/ | grep -iE "video|poster|thumb|youtube"
```

If any matches are found, verify they're only referenced from `VideoCarousel.tsx` (now deleted) with:
```bash
grep -r "filename-here" frontend/ --include='*.{ts,tsx,js,jsx}'
```

If no references remain, delete with `git rm`.

- [ ] **Step 4: Extract pitch-deck strings into `pitchDeck.*` namespace**

The page has ~1000 lines of dense Indonesian content. Use a structured namespace:

```json
{
  "pitchDeck": {
    "hero": {
      "headline": "Transparansi Anggaran Pemerintah Berbasis Blockchain",
      "badge": "🏆 Garuda Spark 2025",
      "subhead": "..."
    },
    "problem": {
      "title": "...",
      "cards": [
        { "title": "Kurangnya Transparansi", "desc": "..." }
      ]
    },
    "solution": {
      "title": "...",
      "steps": [
        { "title": "Kementerian Mendaftarkan Proyek", "desc": "..." }
      ]
    },
    "features": { /* ... */ },
    "hackathon": {
      "title": "🏆 Kesesuaian Hackathon",
      "items": [ /* ... */ ]
    },
    "cta": { /* ... */ }
  }
}
```

Indonesian dict gets all existing strings verbatim. English dict gets natural-English translations matching the tone of `/international` page.

For arrays of cards/steps, use `t.raw('pitchDeck.problem.cards')` to retrieve the array, then `.map()`.

- [ ] **Step 5: Replace inline strings in `pitch-deck/page.tsx`**

```typescript
'use client';
import { useTranslations } from 'next-intl';
// ...
export default function PitchDeckPage() {
  const t = useTranslations('pitchDeck');
  const problemCards = t.raw('problem.cards') as Array<{ title: string; desc: string }>;
  // ...
  return (
    <div>
      <h1>{t('hero.headline')}</h1>
      {/* ... */}
      <section>
        <h2>{t('problem.title')}</h2>
        {problemCards.map((card, i) => (
          <Card key={i} title={card.title} desc={card.desc} />
        ))}
      </section>
    </div>
  );
}
```

- [ ] **Step 6: Verify build + browser**

```bash
cd frontend && pnpm build && pnpm dev
```

Visit `/pitch-deck` and `/id/pitch-deck`. Verify:
- No video section visible
- No "VideoCarousel" reference in console
- Toggle swaps all chrome between English and Indonesian

Stop dev server.

- [ ] **Step 7: Commit**

```bash
git add frontend/messages/ frontend/app/[locale]/pitch-deck/page.tsx
git commit -m "feat: translate pitch-deck + remove dead video showcase section and VideoCarousel"
```

---

## Task 16: Add `lib/fx.ts` and update locale-aware formatters in `lib/utils.ts`

**Files:**
- Create: `frontend/lib/fx.ts`
- Modify: `frontend/lib/utils.ts`

- [ ] **Step 1: Create `frontend/lib/fx.ts`**

```typescript
export const IDR_PER_USD = 16_000;
export const FX_AS_OF = '2026-05-25';

export function formatUSDFromIDR(idr: bigint | number): string {
  const idrNum = typeof idr === 'bigint' ? Number(idr) : idr;
  const usd = idrNum / IDR_PER_USD;
  const abs = Math.abs(usd);
  let formatted: string;
  if (abs >= 1_000_000_000) {
    formatted = `$${(usd / 1_000_000_000).toFixed(1)}B`;
  } else if (abs >= 1_000_000) {
    formatted = `$${(usd / 1_000_000).toFixed(1)}M`;
  } else if (abs >= 1_000) {
    formatted = `$${(usd / 1_000).toFixed(1)}K`;
  } else {
    formatted = `$${usd.toFixed(0)}`;
  }
  return formatted;
}

export const USD_HINT_THRESHOLD_IDR = 1_000_000;
```

- [ ] **Step 2: Update `frontend/lib/utils.ts` formatters**

Read the current file first:
```bash
wc -l frontend/lib/utils.ts
```

Replace `formatRupiah(value)` with a locale-aware version:

```typescript
import { formatUSDFromIDR, USD_HINT_THRESHOLD_IDR } from './fx';

export type Locale = 'en' | 'id';

export function formatRupiah(value: bigint | number | string, locale: Locale = 'id'): string {
  const num = typeof value === 'bigint' ? Number(value) : typeof value === 'string' ? Number(value) : value;
  if (locale === 'en') {
    const idrFormatted = `Rp ${num.toLocaleString('en-US')}`;
    if (num >= USD_HINT_THRESHOLD_IDR) {
      return `${idrFormatted} (≈ ${formatUSDFromIDR(num)})`;
    }
    return idrFormatted;
  }
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
}

export function formatDate(date: Date | string, locale: Locale = 'id'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
}

export function formatDateTime(date: Date | string, locale: Locale = 'id'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString(locale === 'en' ? 'en-US' : 'id-ID', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

export function formatRelativeTime(date: Date | string, locale: Locale = 'id'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const diffMs = Date.now() - d.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHr = Math.floor(diffMs / 3_600_000);
  const diffDay = Math.floor(diffMs / 86_400_000);
  const diffMonth = Math.floor(diffMs / (30 * 86_400_000));
  const diffYear = Math.floor(diffMs / (365 * 86_400_000));

  if (locale === 'en') {
    if (diffMin < 1) return 'just now';
    if (diffHr < 1) return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
    if (diffDay < 1) return `${diffHr} hour${diffHr === 1 ? '' : 's'} ago`;
    if (diffMonth < 1) return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`;
    if (diffYear < 1) return `${diffMonth} month${diffMonth === 1 ? '' : 's'} ago`;
    return `${diffYear} year${diffYear === 1 ? '' : 's'} ago`;
  }
  // Indonesian (existing)
  if (diffMin < 1) return 'baru saja';
  if (diffHr < 1) return `${diffMin} menit yang lalu`;
  if (diffDay < 1) return `${diffHr} jam yang lalu`;
  if (diffMonth < 1) return `${diffDay} hari yang lalu`;
  if (diffYear < 1) return `${diffMonth} bulan yang lalu`;
  return `${diffYear} tahun yang lalu`;
}

export function formatNumber(value: number | bigint, locale: Locale = 'id'): string {
  const num = typeof value === 'bigint' ? Number(value) : value;
  return new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'id-ID').format(num);
}

export function abbreviateNumber(value: number | bigint, locale: Locale = 'id'): string {
  const num = typeof value === 'bigint' ? Number(value) : value;
  if (locale === 'en') {
    const abs = Math.abs(num);
    if (abs >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`;
    if (abs >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (abs >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toFixed(0);
  }
  return formatNumber(num, 'id');
}
```

- [ ] **Step 3: Find all call sites and update them**

```bash
grep -rn "formatRupiah\|formatDate\|formatRelativeTime\|formatNumber\|abbreviateNumber" frontend/app frontend/components frontend/lib --include='*.{ts,tsx}'
```

For each call site:
- If in a Client Component: import `useLocale` from `next-intl` and pass it: `formatRupiah(amount, locale)`.
- If in a Server Component: get locale from the route's `params.locale` or `getLocale()` from `next-intl/server`.
- Existing zero-arg calls (`formatRupiah(amount)`) will continue to work as Indonesian via the default arg, so call sites can be migrated incrementally — but for this task migrate ALL of them so behavior is consistent.

- [ ] **Step 4: Verify build**

```bash
cd frontend && pnpm typecheck && pnpm build
```

Expected: zero TypeScript errors.

- [ ] **Step 5: Smoke-test currency formatting**

```bash
cd frontend && pnpm dev
```

Visit a project detail page in English mode (`/projects/[id]`). Verify large amounts render as `"Rp 50,000,000,000 (≈ $3.1M)"`. Visit `/id/projects/[id]` and verify same amount renders as `"Rp 50.000.000.000"`. Stop dev server.

- [ ] **Step 6: Commit**

```bash
git add frontend/lib/fx.ts frontend/lib/utils.ts frontend/app frontend/components
git commit -m "feat: locale-aware currency/date/number formatters + static FX rate for USD hints"
```

---

## Task 17: DB migration — add `_en` columns and rebuild materialized view

**Files:**
- Create: `database/migrations/2026-05-25-add-en-columns.sql`

- [ ] **Step 1: Write the migration SQL**

```sql
-- 2026-05-25: Add _en columns for bilingual EN/ID support
-- Spec: docs/superpowers/specs/2026-05-25-openbudget-bilingual-en-id-design.md

BEGIN;

-- Add English columns alongside existing Indonesian columns
ALTER TABLE ministry_accounts
  ADD COLUMN IF NOT EXISTS ministry_name_en VARCHAR(255);

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS title_en VARCHAR(255),
  ADD COLUMN IF NOT EXISTS description_en TEXT,
  ADD COLUMN IF NOT EXISTS recipient_name_en VARCHAR(255);

ALTER TABLE milestones
  ADD COLUMN IF NOT EXISTS description_en TEXT;

ALTER TABLE comments
  ADD COLUMN IF NOT EXISTS content_en TEXT;

ALTER TABLE issues
  ADD COLUMN IF NOT EXISTS description_en TEXT;

ALTER TABLE project_ratings
  ADD COLUMN IF NOT EXISTS comment_en TEXT;

-- Rebuild ministry_performance materialized view to project recipient_name_en
DROP MATERIALIZED VIEW IF EXISTS ministry_performance CASCADE;

CREATE MATERIALIZED VIEW ministry_performance AS
SELECT
  p.recipient_name AS ministry,
  MAX(p.recipient_name_en) AS ministry_en,
  COUNT(p.id) AS total_projects,
  COUNT(p.id) FILTER (WHERE p.status = 'completed') AS completed_projects,
  ROUND(
    COUNT(p.id) FILTER (WHERE p.status = 'completed')::numeric / NULLIF(COUNT(p.id), 0) * 100,
    2
  ) AS completion_rate,
  SUM(CAST(p.total_amount AS BIGINT)) AS total_budget,
  SUM(CAST(p.total_released AS BIGINT)) AS total_released,
  ROUND(
    SUM(CAST(p.total_released AS BIGINT))::numeric / NULLIF(SUM(CAST(p.total_amount AS BIGINT)), 0) * 100,
    2
  ) AS budget_accuracy,
  ROUND(AVG(r.rating), 2) AS avg_trust_score,
  COUNT(DISTINCT r.email) AS total_ratings,
  ROUND(
    COUNT(m.id) FILTER (WHERE m.is_released = TRUE)::numeric /
    NULLIF(COUNT(m.id), 0) * 100,
    2
  ) AS release_rate,
  MAX(p.created_at) AS last_project_date
FROM projects p
LEFT JOIN project_ratings r ON r.project_id = p.id
LEFT JOIN milestones m ON m.project_id = p.id
WHERE p.status != 'draft'
GROUP BY p.recipient_name;

CREATE UNIQUE INDEX IF NOT EXISTS idx_ministry_performance_ministry ON ministry_performance(ministry);

REFRESH MATERIALIZED VIEW ministry_performance;

COMMIT;
```

- [ ] **Step 2: Apply against local Postgres if you have one**

```bash
psql "$DATABASE_URL" -f database/migrations/2026-05-25-add-en-columns.sql
```

Expected: `BEGIN`, multiple `ALTER TABLE` confirmations, `DROP MATERIALIZED VIEW`, `CREATE MATERIALIZED VIEW`, `CREATE INDEX`, `REFRESH MATERIALIZED VIEW`, `COMMIT`.

Verify columns exist:
```bash
psql "$DATABASE_URL" -c "\d projects" | grep _en
psql "$DATABASE_URL" -c "\d ministry_accounts" | grep _en
psql "$DATABASE_URL" -c "SELECT column_name FROM information_schema.columns WHERE table_name = 'ministry_performance';"
```

Expected: each `_en` column present; materialized view has `ministry_en` column.

- [ ] **Step 3: Apply against Neon production**

```bash
# Pull production DATABASE_URL from Vercel
cd frontend && vercel env pull .env.vercel.production --environment=production --scope=rectors-projects
PROD_DB_URL=$(grep '^DATABASE_URL=' .env.vercel.production | cut -d'=' -f2- | sed 's/^"//;s/"$//')

# Apply migration
psql "$PROD_DB_URL" -f ../database/migrations/2026-05-25-add-en-columns.sql
```

Verify on prod:
```bash
psql "$PROD_DB_URL" -c "\d projects" | grep _en
```

- [ ] **Step 4: Commit (migration file only — `.env.vercel.production` is gitignored)**

```bash
git add database/migrations/2026-05-25-add-en-columns.sql
git commit -m "feat(db): add _en columns and rebuild ministry_performance view for bilingual support"
```

---

## Task 18: DB backfill — hand-translate seed data

**Files:**
- Create: `database/backfill-en-content.sql`

- [ ] **Step 1: Read existing seed data to learn each row's Indonesian content**

```bash
psql "$DATABASE_URL" -c "SELECT id, ministry_name FROM ministry_accounts ORDER BY ministry_name;"
psql "$DATABASE_URL" -c "SELECT id, title, recipient_name FROM projects ORDER BY created_at;"
psql "$DATABASE_URL" -c "SELECT id, project_id, index, description FROM milestones ORDER BY project_id, index LIMIT 30;"
psql "$DATABASE_URL" -c "SELECT id, content FROM comments LIMIT 20;"
psql "$DATABASE_URL" -c "SELECT id, description FROM issues LIMIT 15;"
psql "$DATABASE_URL" -c "SELECT id, comment FROM project_ratings WHERE comment IS NOT NULL LIMIT 30;"
```

Save the outputs as scratch material to translate.

- [ ] **Step 2: Write `database/backfill-en-content.sql`**

For each row, write an `UPDATE ... WHERE id = '<uuid>'` with the hand-translated English value.

Structure:

```sql
-- 2026-05-25: Backfill English content for bilingual support
-- Translations are hand-curated for accuracy on government entity names

BEGIN;

-- ============================================================================
-- ministry_accounts.ministry_name_en
-- ============================================================================

UPDATE ministry_accounts SET ministry_name_en = 'Ministry of Finance'
  WHERE ministry_name = 'Kementerian Keuangan';

UPDATE ministry_accounts SET ministry_name_en = 'Ministry of Education, Culture, Research, and Technology'
  WHERE ministry_name = 'Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi';

UPDATE ministry_accounts SET ministry_name_en = 'Ministry of Health'
  WHERE ministry_name = 'Kementerian Kesehatan';

UPDATE ministry_accounts SET ministry_name_en = 'Ministry of Public Works and Public Housing'
  WHERE ministry_name = 'Kementerian Pekerjaan Umum dan Perumahan Rakyat';

UPDATE ministry_accounts SET ministry_name_en = 'Ministry of Transportation'
  WHERE ministry_name = 'Kementerian Perhubungan';

UPDATE ministry_accounts SET ministry_name_en = 'Ministry of Agriculture'
  WHERE ministry_name = 'Kementerian Pertanian';

UPDATE ministry_accounts SET ministry_name_en = 'Ministry of Energy and Mineral Resources'
  WHERE ministry_name = 'Kementerian Energi dan Sumber Daya Mineral';

UPDATE ministry_accounts SET ministry_name_en = 'Ministry of Home Affairs'
  WHERE ministry_name = 'Kementerian Dalam Negeri';

UPDATE ministry_accounts SET ministry_name_en = 'Ministry of Social Affairs'
  WHERE ministry_name = 'Kementerian Sosial';

UPDATE ministry_accounts SET ministry_name_en = 'Ministry of Communication and Digital Affairs'
  WHERE ministry_name = 'Kementerian Komunikasi dan Digital';

-- ============================================================================
-- projects.recipient_name_en (mirrors ministry_name_en via recipient_name)
-- ============================================================================

UPDATE projects SET recipient_name_en = 'Ministry of Finance'
  WHERE recipient_name = 'Kementerian Keuangan';
-- ... repeat for all 10 ministry mappings, applied to projects.recipient_name

-- ============================================================================
-- projects.title_en + description_en (30 rows, hand-translated)
-- ============================================================================

UPDATE projects SET
  title_en = 'National School Digitalization Program 2025',
  description_en = 'A nationwide initiative to upgrade school IT infrastructure...'
WHERE title = 'Program Digitalisasi Sekolah Nasional 2025';

-- ... 29 more UPDATEs for each project

-- ============================================================================
-- milestones.description_en (129 rows, hand-translated)
-- ============================================================================

UPDATE milestones SET description_en = '...' WHERE id = '<uuid>';
-- ... repeat per milestone

-- ============================================================================
-- comments.content_en (18 rows, hand-translated demo content)
-- ============================================================================

UPDATE comments SET content_en = '...' WHERE id = '<uuid>';
-- ... repeat per demo comment

-- ============================================================================
-- issues.description_en (9 rows, hand-translated)
-- ============================================================================

UPDATE issues SET description_en = '...' WHERE id = '<uuid>';
-- ... repeat per demo issue

-- ============================================================================
-- project_ratings.comment_en (~30+ rows with non-null comment, hand-translated)
-- ============================================================================

UPDATE project_ratings SET comment_en = '...' WHERE id = '<uuid>';
-- ... repeat per demo rating with comment

-- Refresh materialized view so ministry_en propagates
REFRESH MATERIALIZED VIEW ministry_performance;

COMMIT;
```

Important notes for translation:
- Match the tone of `/international` page (formal but accessible).
- Government program names: aim for descriptive equivalents, not literal translations. "Program Vaksinasi Nasional 2025" → "National Vaccination Program 2025" (not "2025 National Vaccination Programme" or other variants).
- Keep numeric figures, dates, dollar amounts identical.
- For comments and issue reports (citizen voices), preserve sentiment and concern — these are citizens reporting suspicions, so they should sound like real citizen voices in English.

- [ ] **Step 3: Run backfill against local DB**

```bash
psql "$DATABASE_URL" -f database/backfill-en-content.sql
```

- [ ] **Step 4: Spot-check a few rows**

```bash
psql "$DATABASE_URL" -c "SELECT title, title_en FROM projects LIMIT 5;"
psql "$DATABASE_URL" -c "SELECT ministry_name, ministry_name_en FROM ministry_accounts;"
psql "$DATABASE_URL" -c "SELECT ministry, ministry_en FROM ministry_performance LIMIT 5;"
```

Expected: every row has both Indonesian and English populated.

- [ ] **Step 5: Run against Neon production**

```bash
psql "$PROD_DB_URL" -f database/backfill-en-content.sql
```

Spot-check production:
```bash
psql "$PROD_DB_URL" -c "SELECT title, title_en FROM projects LIMIT 5;"
```

- [ ] **Step 6: Commit**

```bash
git add database/backfill-en-content.sql
git commit -m "feat(db): backfill English translations for all demo seed data"
```

---

## Task 19: Update API routes for locale-aware column reads

**Files:**
- Modify: `frontend/app/api/projects/route.ts`
- Modify: `frontend/app/api/projects/[id]/route.ts`
- Modify: `frontend/app/api/milestones/route.ts`
- Modify: `frontend/app/api/comments/route.ts`
- Modify: `frontend/app/api/issues/route.ts`
- Modify: `frontend/app/api/ratings/route.ts`
- Modify: `frontend/app/api/analytics/leaderboard/route.ts`
- Modify: `frontend/app/api/analytics/trends/route.ts`
- Modify: `frontend/app/api/analytics/anomalies/route.ts`
- Modify: `frontend/app/api/ministry-accounts/route.ts` (if it exists; create if Task 14 needs it)
- Create: `frontend/lib/locale.ts` — small helper to read locale from request

- [ ] **Step 1: Create locale helper**

`frontend/lib/locale.ts`:

```typescript
import { NextRequest } from 'next/server';

export type ApiLocale = 'en' | 'id';

export function getLocaleFromRequest(req: NextRequest): ApiLocale {
  // 1. Explicit ?locale=X query param (highest priority for testing)
  const queryLocale = req.nextUrl.searchParams.get('locale');
  if (queryLocale === 'en' || queryLocale === 'id') return queryLocale;

  // 2. NEXT_LOCALE cookie (set by next-intl middleware)
  const cookieLocale = req.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale === 'en' || cookieLocale === 'id') return cookieLocale;

  // 3. Accept-Language header (Indonesian if id-* present, else English)
  const acceptLang = req.headers.get('accept-language') ?? '';
  if (/^id\b/i.test(acceptLang) || /,\s*id\b/i.test(acceptLang)) return 'id';

  // 4. Default
  return 'en';
}
```

- [ ] **Step 2: Update `projects/route.ts` GET to be locale-aware**

```typescript
import { getLocaleFromRequest } from '@/lib/locale';

export async function GET(request: NextRequest) {
  const locale = getLocaleFromRequest(request);
  // ... existing param parsing ...

  let queryText = `
    SELECT
      p.*,
      COALESCE(p.title_en, p.title) AS title_localized,
      COALESCE(p.description_en, p.description) AS description_localized,
      COALESCE(p.recipient_name_en, p.recipient_name) AS recipient_name_localized,
      ma.ministry_name,
      COALESCE(ma.ministry_name_en, ma.ministry_name) AS ministry_name_localized,
      COUNT(m.id) AS milestone_count_actual
    FROM projects p
    LEFT JOIN ministry_accounts ma ON p.ministry_id = ma.id
    LEFT JOIN milestones m ON p.id = m.project_id
  `;
  // ... existing WHERE conditions ...
  queryText += ` GROUP BY p.id, ma.ministry_name, ma.ministry_name_en ORDER BY p.created_at DESC LIMIT $... OFFSET $...`;

  const result = await query(queryText, params);
  const projects = result.rows.map((row) => ({
    id: row.id,
    ministry_id: row.ministry_id,
    ministry: locale === 'en' ? row.ministry_name_localized : row.ministry_name,
    title: locale === 'en' ? row.title_localized : row.title,
    description: locale === 'en' ? row.description_localized : row.description,
    recipient_name: locale === 'en' ? row.recipient_name_localized : row.recipient_name,
    // ... rest of fields ...
  }));

  return NextResponse.json(projects);
}
```

Note: We always SELECT both columns via `COALESCE` so the API can pick at the end. Simpler than dynamic SQL. The `_localized` aliases make the JS mapping readable.

- [ ] **Step 3: Apply same pattern to `projects/[id]/route.ts`**

The detail endpoint nests `milestones[]`. Update both project fields and milestone descriptions:

```typescript
const projectQuery = `
  SELECT p.*,
    COALESCE(p.title_en, p.title) AS title_localized,
    COALESCE(p.description_en, p.description) AS description_localized,
    COALESCE(p.recipient_name_en, p.recipient_name) AS recipient_name_localized,
    ma.ministry_name,
    COALESCE(ma.ministry_name_en, ma.ministry_name) AS ministry_name_localized
  FROM projects p
  LEFT JOIN ministry_accounts ma ON p.ministry_id = ma.id
  WHERE p.id = $1
`;

const milestoneQuery = `
  SELECT *,
    COALESCE(description_en, description) AS description_localized
  FROM milestones
  WHERE project_id = $1
  ORDER BY index ASC
`;
```

Map to response based on `locale`.

- [ ] **Step 4: Apply same pattern to `comments/route.ts`, `issues/route.ts`, `ratings/route.ts`**

For each, add the `_en` `COALESCE` projection and select based on locale in the JS mapping.

- [ ] **Step 5: Apply to `analytics/leaderboard/route.ts`**

The view already has `ministry` and `ministry_en` columns. The API picks based on locale:

```typescript
const locale = getLocaleFromRequest(request);
const result = await query(`
  SELECT
    ministry,
    ministry_en,
    total_projects,
    completion_rate,
    budget_accuracy,
    release_rate,
    avg_trust_score,
    total_ratings
  FROM ministry_performance
  ORDER BY (completion_rate * 0.25 + budget_accuracy * 0.30 + release_rate * 0.25 + COALESCE(avg_trust_score * 20, 0) * 0.20) DESC NULLS LAST
`);

const leaderboard = result.rows.map(row => ({
  ministry: locale === 'en' ? (row.ministry_en ?? row.ministry) : row.ministry,
  total_projects: row.total_projects,
  completion_rate: row.completion_rate,
  // ...
}));
```

- [ ] **Step 6: Apply to `analytics/trends/route.ts` and `analytics/anomalies/route.ts`**

Trends groups by date but may also display project/ministry names. Anomalies returns project details — same `COALESCE` pattern.

- [ ] **Step 7: If `ministry-accounts/route.ts` exists, update it; if not, create one for the settings page**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getLocaleFromRequest } from '@/lib/locale';

export async function GET(request: NextRequest) {
  const locale = getLocaleFromRequest(request);
  const result = await query(`
    SELECT id, ministry_name, ministry_name_en
    FROM ministry_accounts
    ORDER BY ministry_name
  `);
  return NextResponse.json(
    result.rows.map(r => ({
      id: r.id,
      ministry_name: locale === 'en' ? (r.ministry_name_en ?? r.ministry_name) : r.ministry_name,
    }))
  );
}
```

- [ ] **Step 8: Verify with curl in both locales**

```bash
cd frontend && pnpm dev
```

```bash
curl -s 'http://localhost:3000/api/projects?limit=2' -H 'Cookie: NEXT_LOCALE=en' | jq '.[0].title'
curl -s 'http://localhost:3000/api/projects?limit=2' -H 'Cookie: NEXT_LOCALE=id' | jq '.[0].title'
```

Expected: first returns English title, second returns Indonesian title.

```bash
curl -s 'http://localhost:3000/api/analytics/leaderboard' -H 'Cookie: NEXT_LOCALE=en' | jq '.[0].ministry'
```

Expected: English ministry name.

Stop dev server.

- [ ] **Step 9: Commit**

```bash
git add frontend/lib/locale.ts frontend/app/api
git commit -m "feat(api): locale-aware reads of _en columns across all public endpoints"
```

---

## Task 20: End-to-end smoke test, build, and deploy

**Files:** (none modified — verification + deployment only)

- [ ] **Step 1: Full TypeScript strict check + build**

```bash
cd frontend && pnpm typecheck:strict && pnpm build
```

Expected: zero errors, zero warnings.

- [ ] **Step 2: Local smoke walkthrough**

```bash
pnpm dev
```

Visit each in both locales, in a clean browser session (Incognito) so cookies don't bleed between tests:

| Route (EN) | Route (ID) | What to verify |
|---|---|---|
| `/` | `/id` | Hero + search chrome in correct language; project cards show translated titles/ministries; English mode shows "For international partners →" link, Indonesian doesn't |
| `/projects` | `/id/projects` | List page chrome translated; project titles + ministry filter dropdown match locale |
| `/projects/[any-id]` | `/id/projects/[any-id]` | Project title, description, milestone descriptions, comments, issues all locale-correct; Rupiah formatting: `"Rp X,XXX,XXX (≈ $Y)"` for EN, `"Rp X.XXX.XXX"` for ID |
| `/analytics` | `/id/analytics` | Leaderboard rows show ministry names in correct locale; chart labels translated |
| `/pitch-deck` | `/id/pitch-deck` | All translated; NO video section visible; no console error about VideoCarousel |
| `/api-docs` | `/id/api-docs` | Chrome translated; code blocks unchanged |
| `/admin` | `/id/admin` | Login (or post-login dashboard if signed in) shows translated chrome |

Toggle test on each page: clicking `EN ↔ ID` should swap content without breaking. URL prefix changes, content swaps, query strings preserved.

`/international` test: this page is OUTSIDE the bilingual system. Verify it still renders unchanged.

Stop dev server.

- [ ] **Step 3: Deploy preview to Vercel**

```bash
cd frontend && vercel --scope=rectors-projects
```

Get the preview URL from the CLI output. Open it in Incognito. Run the same smoke walkthrough against the preview URL.

- [ ] **Step 4: Promote to production**

```bash
cd frontend && vercel --prod --scope=rectors-projects
```

Visit `https://openbudget.rectorspace.com/` and `https://openbudget.rectorspace.com/id`. Run the same checks.

- [ ] **Step 5: Final commit (changelog / deploy marker, optional)**

If there's an unstaged change (e.g., updated lockfile), commit:

```bash
git add -A
git commit -m "chore: lockfile + deploy marker for bilingual EN/ID release"
git push
```

If working tree is clean, push outstanding commits:

```bash
git push origin main
```

---

## Acceptance verification

Confirm each acceptance criterion from spec Section 11:

- [ ] Visiting `https://openbudget.rectorspace.com/` shows English UI + English database content end-to-end.
- [ ] Visiting `https://openbudget.rectorspace.com/id` shows Indonesian UI + Indonesian database content end-to-end.
- [ ] Header toggle `EN | ID` visible on every public route; clicking swaps URL prefix + content without errors.
- [ ] `/projects/[id]` (EN) shows English project title + description + milestone descriptions; `/id/projects/[id]` shows Indonesian.
- [ ] Currency (EN): `"Rp X,XXX,XXX,XXX (≈ $Y USD)"`. Currency (ID): `"Rp X.XXX.XXX.XXX"`.
- [ ] Date (EN): `"May 25, 2026"`. Date (ID): `"25 Mei 2026"`.
- [ ] `/pitch-deck` (both locales) renders without the video showcase section; no `VideoCarousel` references in the codebase.
- [ ] `/international` and `/international/brief` unchanged. English homepage has a "For international partners →" link to `/international`.
- [ ] `pnpm build` passes with TypeScript strict mode.
- [ ] No console errors in browser dev tools across both locales.
- [ ] No regression in existing OAuth/admin flow.

---

## Notes for executor

- **Subagent dispatch order:** Tasks 1–6 (foundation + Header/Footer) MUST run sequentially. Tasks 7–14 (page-by-page translations) share `messages/en.json` and `messages/id.json` — dispatch them sequentially (one subagent per task with review between) to avoid merge conflicts on the dictionary files. Task 16 (currency helpers) and Task 15 (pitch-deck) can interleave with translation tasks because Task 16 touches `lib/utils.ts` + `lib/fx.ts` (no dictionary changes) and Task 15 touches `pitchDeck.*` namespace (unique). Tasks 17–19 (DB migration + backfill + API updates) MUST run sequentially in that order. Task 20 (deploy) is final.
- **Translation quality:** Don't auto-translate. Read the existing Indonesian content, understand the intent, and write natural English that matches the tone of `/international/page.tsx`. Ministry program names: descriptive English equivalents, not transliterations.
- **Build between tasks:** Run `pnpm build` after each task. The plan assumes the build passes at every commit boundary. If a build breaks, stop and resolve before continuing.
- **Production DB write order:** Always run the migration (Task 17) BEFORE the backfill (Task 18). They are interdependent.
- **OAuth callback URL:** The existing pending Google Console redirect URI (`https://openbudget.rectorspace.com/api/auth/callback/google` per prior handoff) is independent of this work. Admin login won't fully work until RECTOR adds it, but the bilingual public site doesn't require it.
- **Spec drift:** If you discover during execution that the spec needs refinement (e.g., an extra column, an additional component), DO NOT silently change behavior — pause and flag to RECTOR. Update the spec, then continue.
