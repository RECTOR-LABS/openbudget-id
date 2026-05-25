# OpenBudget — Bilingual EN/ID Site (English Default, Indonesian Toggle)

**Date:** 2026-05-25
**Owner:** RECTOR (with CIPHER pair-collaboration)
**Status:** Design approved — pending user spec review → implementation
**Prior work:** [2026-05-23-openbudget-vercel-plus-henrik-pitch-design.md](2026-05-23-openbudget-vercel-plus-henrik-pitch-design.md)

---

## 1. Goal

Convert the OpenBudget site from Indonesian-first to **bilingual (English/Indonesian) with English as the default locale and a user-controlled toggle**.

The current site presents Indonesian UI and Indonesian database content at `/`, with a dedicated English pitch surface at `/international` and `/international/brief`. Outside that pitch surface, a non-Indonesian visitor (e.g., Henrik or his Danish contact) cannot browse the actual public dashboard, project detail pages, analytics, or admin demo flow in a language they read fluently.

The outcome of this work: any visitor lands on English-by-default content for every route, can toggle to Indonesian via a header switch (`EN | ID`), and sees the corresponding locale's UI chrome **and** database content (project titles, descriptions, ministry names, comments, issues — all hand-translated for the demo data set).

---

## 2. Background & Context

### Project state at time of spec
- OpenBudget is live at `https://openbudget.rectorspace.com` on Vercel (`rectors-projects/openbudget`, Hobby tier) backed by Neon Postgres (Free tier, Singapore region).
- Public homepage, project list, project detail, analytics, admin dashboard, pitch-deck, API docs — all Indonesian-first UI.
- 30 demo projects, 10 ministries, 129 milestones, 18 comments, 9 issues — all Indonesian content seeded in Neon.
- `/international` (339 lines) and `/international/brief` (140 lines, print-optimized) are the only English surfaces. Built last session for Henrik's pitch.
- Existing locale helpers (`formatRupiah`, `formatDate`, `formatRelativeTime`, etc.) hardcode `'id-ID'` locale strings.
- Metadata in `app/layout.tsx` is already English (`"OpenBudget.ID - Transparent Government Spending"`). API responses are already English/locale-agnostic.

### Why English-by-default now
The pitch to Henrik was sent 2026-05-24. Whether he replied with a specific introduction or simply showed the site to someone in his network, the next click after `/international` (which is the pitch surface) is the **dashboard** — and a non-Indonesian-reading visitor currently sees Indonesian project titles, Indonesian ministry names, Indonesian milestone descriptions, and Indonesian footer chrome. The credibility of the demo collapses at the dashboard.

Making English the default flips this: any visitor (whether shared a direct project link or arriving at `/`) sees a fully functional English dashboard end-to-end. Indonesian audience preservation is handled via the toggle.

### Indonesian audience preservation
Indonesia's gov/tech circles have strong English literacy, but the Indonesian-first experience is part of the platform's origin story (Garuda Spark, Komdigi/Ekraf validation, Bahasa accessibility). Stripping Indonesian entirely would undermine that narrative. The bilingual approach preserves it as a click away (`/id`) while reorienting the default to international visitors.

---

## 3. Constraints

| # | Constraint | Source |
|---|---|---|
| C1 | Vercel personal account `rectors-projects` only — NEVER Arbital | Memory: `infra-account-isolation.md` |
| C2 | Cloudflare personal account only — NEVER Arbital | Memory: `infra-account-isolation.md` |
| C3 | No AI attribution in commits (no `Co-Authored-By: Claude`, no robot emoji) | Global CLAUDE.md |
| C4 | Existing `/international` and `/international/brief` stay outside the bilingual system — they remain dedicated English pitch artifacts | This session, Section 5 |
| C5 | YouTube video referenced by `VideoCarousel` is gone — the entire video showcase section + `VideoCarousel` component get removed, not preserved | This session, follow-up |
| C6 | DB is treated as disposable cache (per CLAUDE.md "Blockchain as Single Source of Truth"). Schema changes don't need rollback plans — re-run scripts from scratch if needed | CLAUDE.md |
| C7 | Static FX rate (1 USD = 16,000 IDR) for USD-hint display only — no live FX API | This session, Section 3 |
| C8 | Real user-submitted content (future comments, future issues) stays in whatever language the user wrote — only the demo seed data is hand-translated | This session, Section 2 |

---

## 4. Approach Chosen

**Approach A — `next-intl` library + `_en` suffix columns in DB.**

Considered and rejected:
- **B — Custom JSON dictionary + `_en` columns:** Smaller bundle, no external dep, but reinvents translations/plurals/dates without ICU MessageFormat. Maintenance burden grows for marginal gain.
- **C — `next-intl` + dedicated `translations` table:** Cleaner data model for future languages (Mandarin, Arabic), but JOIN overhead on every project/milestone query and overkill for two locales on a hackathon-stage project.

`next-intl` is the de-facto Next.js 14 App Router i18n library (Vercel-endorsed, server-component compatible, prefix-based routing built-in, type-safe message keys). `_en` columns match the project's "DB is a cache" philosophy — no JOINs, no extra tables, query stays one-line.

---

## 5. Architecture & Routing (Section 1 — APPROVED)

### Library
`next-intl` (latest stable). Added to `frontend/package.json`.

### URL structure (prefix routing)
- `/` → English (default, no prefix)
- `/id` → Indonesian homepage
- `/id/projects/[id]` → Indonesian project detail
- `/id/admin` → Indonesian admin dashboard
- Same pattern for every public route (`projects`, `projects/[id]`, `analytics`, `admin/*`, `pitch-deck`, `api-docs`).

### Middleware
`next-intl`'s `createMiddleware` handles locale detection and prefix routing.
- Cookie name: `NEXT_LOCALE` (default for `next-intl`). Persists user's choice across visits.
- Locale precedence: cookie > URL prefix > default (`en`).
- Switching toggles redirects to the locale-mapped equivalent of the current page.

### Toggle UI
Small `EN | ID` switcher in the header, right side, near the wallet/login button. Active locale styled bold. Switching navigates client-side (uses next-intl's `useRouter` + `usePathname` to compute the new prefix-mapped URL). Query strings and hash fragments on the current URL are preserved during the swap.

### File reorganization
`app/[locale]/...` becomes the new root for all locale-aware pages.

Pages moving under `app/[locale]/`:
- `app/page.tsx` → `app/[locale]/page.tsx`
- `app/projects/page.tsx` → `app/[locale]/projects/page.tsx`
- `app/projects/[id]/page.tsx` → `app/[locale]/projects/[id]/page.tsx`
- `app/admin/**/*` → `app/[locale]/admin/**/*`
- `app/analytics/page.tsx` → `app/[locale]/analytics/page.tsx`
- `app/api-docs/page.tsx` → `app/[locale]/api-docs/page.tsx`
- `app/pitch-deck/page.tsx` → `app/[locale]/pitch-deck/page.tsx`

Routes staying at top level (locale-agnostic):
- `app/api/**/*` — API routes don't render UI; locale is read from `Accept-Language` header / cookie.
- `app/international/page.tsx`, `app/international/brief/page.tsx` — dedicated English pitch surfaces (not part of the bilingual toggle).
- OAuth callback routes — outside any locale wrapper.

### Layout consequences
- `app/layout.tsx` becomes a minimal root layout (HTML wrapper, fonts, providers that don't need locale).
- `app/[locale]/layout.tsx` is the locale-aware layout — sets `<html lang={locale}>`, provides next-intl's `NextIntlClientProvider` with the active locale's messages, renders Header/Footer.

---

## 6. Translation Surface (Section 2 — APPROVED)

### UI string dictionaries
Location: `frontend/messages/en.json` and `frontend/messages/id.json` (`next-intl` default).

Namespace structure (one top-level key per route or shared concern):
```json
{
  "header": {...},
  "footer": {...},
  "home": {...},
  "projects": { "list": {...}, "detail": {...} },
  "admin": { "dashboard": {...}, "projects": {...}, "newProject": {...}, "settings": {...}, "systemInsights": {...} },
  "analytics": {...},
  "pitchDeck": { "hero": {...}, "problem": {...}, "solution": {...}, "hackathon": {...}, ... },
  "apiDocs": {...},
  "common": { "buttons": {...}, "states": { "loading": "...", "empty": "...", "error": "..." } }
}
```

The Indonesian dictionary is built first by extracting current hardcoded strings page-by-page. The English dictionary is the hand translation. Both committed to git, both human-reviewable as diff.

### DB content — `_en` suffix columns

Schema additions (single migration):

| Table | New column | Type | Example |
|---|---|---|---|
| `ministry_accounts` | `name_en` | `TEXT` | `"Ministry of Finance"` (vs existing `name = "Kementerian Keuangan"`) |
| `projects` | `title_en` | `TEXT` | `"National School Digitalization Program 2025"` |
| `projects` | `description_en` | `TEXT` | (full English description) |
| `milestones` | `description_en` | `TEXT` | English milestone description |
| `comments` | `content_en` | `TEXT` | English version of demo comments (NULL for real user content) |
| `issues` | `description_en` | `TEXT` | English version of demo issue reports (NULL for real reports) |
| `project_ratings` | `comment_en` | `TEXT` | English version of demo rating comments (NULL for real user content) |

**No new tables. No translation pivot table.**

### API behavior
- Each affected GET endpoint reads the locale from the `Accept-Language` request header (set automatically by next-intl's middleware via cookie) or from a query param if needed for ISR.
- The SQL `SELECT` picks `title_en` vs `title` (etc.) based on locale.
- Fallback: `COALESCE(title_en, title)` for English requests means partial translations still render rather than returning NULL. Reverse for `id`.
- Endpoints affected: `/api/projects`, `/api/projects/[id]`, `/api/milestones`, `/api/comments`, `/api/issues`, `/api/ratings`, `/api/analytics/leaderboard`, `/api/analytics/trends`, `/api/analytics/anomalies`.
- **Note on `ministry_performance` materialized view:** The view does not need schema changes. The leaderboard API JOINs `ministry_accounts` post-query to fetch `name_en`. This keeps the view's refresh cost unchanged.

### Ministry name translations (curated)
The 10 ministries in `ministry_accounts` get hand-curated English names — not auto-translated, because these are real government entity names and accuracy matters.

| Indonesian (existing `name`) | English (new `name_en`) |
|---|---|
| Kementerian Keuangan | Ministry of Finance |
| Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi | Ministry of Education, Culture, Research, and Technology |
| Kementerian Kesehatan | Ministry of Health |
| Kementerian Pekerjaan Umum dan Perumahan Rakyat | Ministry of Public Works and Public Housing |
| Kementerian Perhubungan | Ministry of Transportation |
| Kementerian Pertanian | Ministry of Agriculture |
| Kementerian Energi dan Sumber Daya Mineral | Ministry of Energy and Mineral Resources |
| Kementerian Dalam Negeri | Ministry of Home Affairs |
| Kementerian Sosial | Ministry of Social Affairs |
| Kementerian Komunikasi dan Digital | Ministry of Communication and Digital Affairs |

(Final pass during implementation may adjust to match the official English names used by the Indonesian government on their own English-language sites.)

---

## 7. Currency & Date Formatting (Section 3 — APPROVED)

### Static FX constant
New file: `frontend/lib/fx.ts`

```typescript
export const IDR_PER_USD = 16_000;
export const FX_AS_OF = '2026-05-25';

export function formatUSDFromIDR(idr: bigint | number): string {
  // Returns abbreviated USD like "$3.1M" or "$62.5K"
}
```

Documented inline: this is a static rate for display context, not authoritative. Live rates would need an oracle and are out of scope for this work.

### Currency formatter (updates to `frontend/lib/utils.ts`)
Current: `formatRupiah(value): string` returns `"Rp 1.000.000.000"` (always Indonesian).

New: `formatRupiah(value, locale: 'en' | 'id'): string`
- `id` → unchanged: `"Rp 1.000.000.000"` (uses `Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' })`)
- `en` → `"Rp 1,000,000,000 (≈ $62.5K)"` (English thousands separator + USD hint)
- For amounts below ~Rp 1M (~$60 USD), drop the parenthetical hint — feels noisy at small scale.

Consumer hook: `useFormatCurrency()` reads active locale from next-intl's `useLocale()` and returns a curried formatter. Most components use this hook; a few call sites (server components) call `formatRupiah(value, locale)` directly.

### Date formatter
`formatDate(date, locale)`:
- `id` keeps `'id-ID'` (e.g., `"25 Mei 2026"`)
- `en` uses `'en-US'` (e.g., `"May 25, 2026"`)

Same pattern for `formatDateTime(date, locale)`.

### Relative time
`formatRelativeTime(date, locale)`:
- `id` keeps existing custom Indonesian output: `"baru saja"`, `"5 menit yang lalu"`, `"2 jam yang lalu"`.
- `en` adds an English branch: `"just now"`, `"5 minutes ago"`, `"2 hours ago"`.

Kept as a custom function rather than swapping to `Intl.RelativeTimeFormat` because the current function's exact output is referenced in tests/components and changing it has a wider blast radius than necessary.

### Number formatter
`formatNumber(value, locale)`: `Intl.NumberFormat(locale === 'en' ? 'en-US' : 'id-ID')`.
`abbreviateNumber(value, locale)`: K/M/B suffixes in English; raw numbers in Indonesian (abbreviation is rarely used in the Indonesian UI, so we don't invent `jt`/`m`/`T` suffixes unless a specific UI demands them).

---

## 8. Pitch-Deck Changes (Section 4 — APPROVED)

### Change A — Hide video showcase section
File: `frontend/app/[locale]/pitch-deck/page.tsx` (after the move under `[locale]/`).

Removed:
- Section block at lines 296–347 (original line numbers): the `🎥 Demo Video` heading, animated background particles, and `<VideoCarousel />` mount.
- Import on line 8: `import VideoCarousel from '@/components/VideoCarousel';`

### Change B — Delete `VideoCarousel` component
File: `frontend/components/VideoCarousel.tsx` — **deleted entirely** (confirmed by RECTOR).

Any video-thumbnail / poster image assets in `frontend/public/` that the component referenced are also deleted as part of this step (identified during implementation).

### Change C — Bilingual translation
The remaining ~1,000 lines of `pitch-deck/page.tsx` are dense Indonesian text inline.

Strings are extracted into `messages/{locale}.json` under a structured `pitchDeck.*` namespace:
```json
"pitchDeck": {
  "hero": { "badge": "...", "headline": "...", "subhead": "..." },
  "problem": { "title": "...", "cards": [{ "title": "...", "desc": "..." }, ...] },
  "solution": { "title": "...", "steps": [...] },
  "features": [...],
  "hackathon": { "title": "...", "items": [...] },
  "cta": { ... }
}
```

English translation matches the tone of the existing `/international` page: formal but accessible, foreign-aid framing where relevant.

---

## 9. Header, Footer, Admin, `/international` Relationship (Section 5 — APPROVED)

### Header
File: `frontend/components/Header.tsx`

- Add `EN | ID` toggle, right side of the header, before the wallet/login button. Active locale styled bold; inactive styled muted.
- Toggle uses `useLocale()` + `useRouter()` + `usePathname()` from `next-intl/client` to compute the locale-swapped equivalent of the current URL and navigate.
- All nav labels — "Home" / "Beranda", "Projects" / "Proyek", "Analytics" / "Analitik", "Admin Login" / "Login Kementerian" — pulled from `messages/{locale}.json` under `header.*`.
- Mobile menu (if it exists; verified during exploration) also gets translated labels + toggle.

### Footer
File: `frontend/components/Footer.tsx`

- Currently 9 Indonesian strings inline. All extracted into `footer.*`.
- Year, copyright line, "Powered by Solana" stay locale-agnostic (these are brand/legal, not UI copy).

### Admin routes
- All admin pages live under `[locale]/admin/*`. Ministry users see the toggle and can switch on demand.
- All admin UI strings extracted into `admin.*` namespace.
- The 10 hardcoded ministry names in `app/[locale]/admin/settings/page.tsx` get refactored — the page should query the `ministry_accounts` table instead of hardcoding. This was already a latent improvement; doing it now lets `name_en` flow through naturally.

### `/international` and `/international/brief`
- **No changes this session.** They stay outside `[locale]/` as dedicated English pitch artifacts.
- One additive change: in the new English homepage (`/`), add a small footer or banner link: `"For international partners →"` linking to `/international`. Indonesian homepage (`/id`) does not show this link.

---

## 10. Migration, Testing, Risks (Section 6 — APPROVED)

### Implementation order (gated steps)

| Step | Description | Verification |
|---|---|---|
| 1 | Install `next-intl`, configure middleware, move existing pages under `app/[locale]/`. Empty dictionaries. | Both `/` and `/id` route to homepage; existing Indonesian content still shows (dictionaries empty = passthrough). `pnpm build` passes. |
| 2 | Add `EN | ID` toggle to Header. | Clicking toggle changes URL prefix, persists across navigation, doesn't break the page. |
| 3 | Extract UI strings into `messages/id.json`, then translate to `messages/en.json`. Page-by-page: home → projects list → project detail → analytics → admin (5 subpages) → pitch-deck → footer. | Each page renders correctly in both locales after its extraction. |
| 4 | DB migration: `database/migrations/2026-05-25-add-en-columns.sql` — adds all `_en` columns with `ALTER TABLE`. | Run against Neon (prod) and any local devs. `\d projects` shows new columns. |
| 5 | DB backfill: `database/backfill-en-content.sql` — hand-translated values for 10 ministries, 30 projects, 129 milestones, 18 comments, 9 issues. | Spot-check a few rows after running. |
| 6 | API routes read locale-aware columns via `COALESCE(*_en, *)` pattern. | Hit each affected endpoint with both `id` and `en` cookies; verify response content matches locale. |
| 7 | Update `formatRupiah`/`formatDate`/`formatRelativeTime`/etc. signatures. Add `lib/fx.ts`. Update all call sites. | Pages render numbers/dates in active locale's format. |
| 8 | Pitch-deck: delete `VideoCarousel.tsx`, remove video showcase section, translate `pitchDeck.*` namespace. | `/pitch-deck` and `/id/pitch-deck` render fully, no video section, no console errors. |
| 9 | Add cross-link from English `/` → `/international`. | Link visible only in English mode, lands on `/international`. |
| 10 | Deploy to Vercel `rectors-projects/openbudget`. | Smoke-test on `openbudget.rectorspace.com`: toggle, project pages, admin pages, analytics. |

### Testing approach
- TypeScript strict build (`pnpm build` in `frontend/`) after each major step.
- Manual browser walkthrough — both locales — of every public route:
  - `/`, `/id`, `/projects/[id]`, `/id/projects/[id]`, `/analytics`, `/id/analytics`, `/pitch-deck`, `/id/pitch-deck`, `/admin`, `/id/admin`, `/admin/projects/new`, `/id/admin/projects/new`.
- Currency format check: `"Rp 50,000,000,000 (≈ $3.1M)"` on English project detail vs `"Rp 50.000.000.000"` on Indonesian.
- Toggle behavior check: from `/projects/abc` clicking ID lands on `/id/projects/abc` (not `/id`).
- No automated tests for translation strings themselves (translation quality is a human review concern, not a unit-test concern).

### Risks + mitigations

| Risk | Mitigation |
|---|---|
| `next-intl` route move breaks existing deep links | Single PR / single deploy. Vercel preview URL tested before promotion. Old URLs (`/projects/[id]`) now serve English content — that's intentional. |
| Missing translation key at runtime | `next-intl` build-time type checking catches missing keys when types are generated; `pnpm build` will fail. Untyped strings (e.g., dynamic interpolation) handled with explicit fallback to key name. |
| DB backfill row mismatch (e.g., wrong project gets wrong English title) | Hand-write backfill SQL with explicit `WHERE id = '<blockchain_id>'` per row; spot-check before merging. |
| Cookie leak between locales for same user | `NEXT_LOCALE` is a single value, last write wins. No leak — just user preference. |
| Admin OAuth callback breaks because of `[locale]` wrapper | OAuth route `/api/auth/callback/google` is OUTSIDE `[locale]/`. Verified in Section 5 design. |
| Static FX rate becomes stale | Documented inline as static. Tooltip on USD hint shows `FX_AS_OF` date. Update via single constant in `lib/fx.ts` later. |
| Translation drift over time as new UI strings are added | Build-time check via `next-intl`. PR review discipline. |

### Out of scope
- Live FX rates / price oracle.
- Auto-translation of user-submitted comments/issues (only demo seed translated).
- Additional languages (Mandarin, Arabic) — schema/architecture leaves room but no work planned.
- Rewriting admin to remove the hardcoded ministry list — only the targeted refactor in Section 9 (query DB instead of hardcoding). Broader admin cleanup is its own future task.
- Mainnet deployment, IPFS proof storage, real-fund transfers — separate post-hackathon initiatives.

---

## 11. Acceptance Criteria

- [ ] Visiting `https://openbudget.rectorspace.com/` shows English UI + English database content end-to-end.
- [ ] Visiting `https://openbudget.rectorspace.com/id` shows Indonesian UI + Indonesian database content end-to-end (matches current production behavior).
- [ ] Header toggle `EN | ID` visible on every public route. Clicking it swaps the URL prefix and content without errors.
- [ ] `/projects/[id]` in English mode displays English project title + description + milestone descriptions; in Indonesian mode displays the corresponding Indonesian versions.
- [ ] Currency in English mode shows `"Rp X,XXX,XXX,XXX (≈ $Y USD)"`. Indonesian mode shows `"Rp X.XXX.XXX.XXX"`.
- [ ] Date in English mode shows `"May 25, 2026"`. Indonesian mode shows `"25 Mei 2026"`.
- [ ] `/pitch-deck` (both locales) renders without the video showcase section. No reference to `VideoCarousel` anywhere in the codebase.
- [ ] `/international` and `/international/brief` unchanged. English homepage has a "For international partners →" link to `/international`.
- [ ] `pnpm build` passes with TypeScript strict mode.
- [ ] No console errors in browser dev tools across both locales.
- [ ] No regression in existing OAuth/admin flow.

---

## 12. Open Questions

None at spec-approval time. (Implementation may surface specific translation phrasings or edge cases that require RECTOR sign-off — those are handled inline during execution, not blocked at spec gate.)

---

## 13. References

- Prior session spec: [2026-05-23-openbudget-vercel-plus-henrik-pitch-design.md](2026-05-23-openbudget-vercel-plus-henrik-pitch-design.md)
- Prior session plan: [../plans/2026-05-23-openbudget-vercel-plus-henrik-pitch.md](../plans/2026-05-23-openbudget-vercel-plus-henrik-pitch.md)
- Project context: [CLAUDE.md](../../../CLAUDE.md), [~/.claude/CLAUDE.md](~/.claude/CLAUDE.md)
- `next-intl` documentation: https://next-intl-docs.vercel.app/
- Existing English pitch surface: `frontend/app/international/page.tsx`, `frontend/app/international/brief/page.tsx`
