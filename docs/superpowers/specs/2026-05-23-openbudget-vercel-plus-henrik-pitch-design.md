# OpenBudget — Vercel Re-Deployment + Henrik Pitch Pack

**Date:** 2026-05-23
**Owner:** RECTOR (with CIPHER pair-collaboration)
**Status:** Design approved — pending user spec review → implementation

---

## 1. Goal

Two coupled outcomes delivered in a single ~1-2 day push:

1. **Bring openbudget.rectorspace.com back online** via Vercel (previous VPS deployment torn down per commit `64ae4bc`, DNS removed, SSH alias removed)
2. **Equip Henrik** (RECTOR's friend, Denmark + Thailand based, yoga entrepreneur) with a self-contained materials pack so he can introduce OpenBudget to his network — including a *possible* Danish government contact

The pitch pack is the primary creative work; the deployment is the supporting infrastructure that makes the pack credible (live demo URL > slide deck pitch).

---

## 2. Background & Context

### Project state at time of spec
- OpenBudget = 2nd place winner, Garuda Spark Hackathon (Oct 2025), 1,500 USDC prize
- Validated by Indonesia's Ministry of Communication (Komdigi) + Ministry of Creative Economy (Ekraf)
- Built with Solana (Agave 3.0.7, Anchor 0.32.1) + Next.js 14 + PostgreSQL
- Currently offline since the "indefinite hiatus" commit; source code on `main` branch (commit `59d4c63`), clean working tree

### Henrik profile (informs pitch design)
- Friend of RECTOR (warm relationship, no formal business setup)
- Yoga business entrepreneur — non-technical, no crypto background
- Lives in Denmark and Thailand (international, NOT in Indonesia)
- Zero prior exposure to OpenBudget materials
- Wants to help RECTOR promote the project — acts as connector, not buyer
- Has a *possible* Denmark government connection (verbatim: "maybe") — opens the door to a foreign-aid transparency pitch via DANIDA-style use cases
- Timeline pressure: ASAP (1-2 days)

### Strategic implication of Henrik's profile
Henrik is a **connector, not a prospect.** The deliverable is therefore not a sales pitch *for Henrik* but a **briefing pack that makes Henrik fluent in OpenBudget** so he can recognize a fit when meeting the right person in his international network. Materials must work for two audience tiers simultaneously: friendly enough for wellness/foundation contacts, professional enough for a Danish government official.

---

## 3. Constraints

| # | Constraint | Source |
|---|---|---|
| C1 | Vercel personal account `rectors-projects` only — NEVER `vincents-projects-2bbb9bb8` (Arbital) | RECTOR explicit, saved to project memory |
| C2 | Cloudflare personal account (owns rectorspace.com) — NEVER Arbital CF | RECTOR explicit |
| C3 | No new video recording from RECTOR — text/visual assets only (existing video carousel in `/pitch-deck` may still be used) | RECTOR explicit |
| C4 | Domain: `openbudget.rectorspace.com` (existing, retained) | RECTOR explicit |
| C5 | Source: `main` branch, commit `59d4c63` (verified clean) | Verified by `git status` |
| C6 | Total cost target: $0/month (free tiers) for demo phase | Implicit — demo, no real revenue yet |
| C7 | Total wall-clock: 1-2 days | Henrik wants ASAP |

---

## 4. Positioning & Narrative (Section 1 — APPROVED)

### Core sentence
> **"Solana-powered budget transparency, battle-tested in Indonesia's national hackathon, ready for any institution that handles public money — including foreign aid."**

### 3-beat pitch structure (memorize-able, ~30 seconds spoken)

| Beat | Message |
|---|---|
| **1. Hook (Problem)** | "Anywhere money flows through institutions — government, foundations, NGOs, foreign aid — there's a trust gap. Reports are slow, easy to manipulate, and donors/citizens can't verify in real time." |
| **2. Proof (Solution)** | "OpenBudget puts every spending milestone on the Solana blockchain. Citizens see the actual transaction, can't be tampered with, queryable in real-time. Won 2nd place at Indonesia's national Garuda Spark hackathon (organized by Indonesia's Ministry of Communication & Ministry of Creative Economy)." |
| **3. Vision (Next Level)** | "Now we're looking for the next institution to deploy it for — and there's a particularly powerful fit: foreign aid agencies tracking their money through recipient countries." |

### Tone calibration
- Confident, not hype ("won 2nd place" not "AMAZING WIN!")
- Government-tone compatible (works for both yoga friend AND Danish gov official)
- No crypto jargon front-loaded ("blockchain" appears once, used as feature not buzzword)
- Concrete numbers (1,500 USDC prize, 2 Indonesian ministries, live deployed system)

### Credibility signals (lead with these)
1. Garuda Spark Hackathon — 2nd place
2. Endorsed by two Indonesian ministries (Komdigi + Ekraf)
3. Organized by Superteam Indonesia
4. Live, deployed, working system (not slide deck)
5. Open architecture on Solana (neutral public infrastructure, no vendor lock-in)

### What we are NOT positioning as
- ❌ A crypto / Web3 product
- ❌ A blockchain startup
- ❌ "Just a hackathon project"
- ✅ **Public-interest govtech that happens to use blockchain as the trust layer**

### The Denmark foreign-aid angle (key wedge)
Denmark already has world-class internal budget transparency, so OpenBudget's value to them is NOT internal — it's **DANIDA foreign aid transparency**. DANIDA sends ~$3B/year in aid; verifying recipient spending is a chronic problem. OpenBudget already won at the Indonesian government's own hackathon — the receiving side has validated it. Pitch: *"Use it to verify your aid to Indonesia (and similar recipients) is spent as promised."*

---

## 5. Vercel Deployment Plan (Section 2 — APPROVED)

### Target architecture

```
openbudget.rectorspace.com
   │
   │ (CNAME → cname.vercel-dns.com via personal Cloudflare)
   ▼
Vercel (Hobby tier, scope: rectors-projects)
   ├─ Next.js 14 frontend
   ├─ API routes (serverless functions)
   └─ Auto SSL, edge network
   │
   │ (DATABASE_URL injected via marketplace integration)
   ▼
Neon Postgres (free tier, via Vercel Marketplace)
   └─ Schema: schema.sql + schema-epic6-7.sql + mock-data-epic6.sql
   │
   │ (NEXT_PUBLIC_SOLANA_RPC_URL)
   ▼
Solana Devnet (public RPC)
   └─ Program: RECtBgp43nvj5inPVW7qo1YN95RwXaYDxLX4dvuJXFY (unchanged)
```

### Execution order (10 atomic steps)

| # | Step | Owner | Estimated time |
|---|---|---|---|
| 1 | `vercel link` repo to scope `rectors-projects` | RECTOR + CIPHER | 5 min |
| 2 | Provision Neon Postgres via Vercel Marketplace integration | CIPHER | 5 min |
| 3 | Apply schema (`schema.sql` + `schema-epic6-7.sql` + `mock-data-epic6.sql`) | CIPHER | 10 min |
| 4 | Set Vercel env vars (`NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID/SECRET`, Solana vars) | CIPHER | 5 min |
| 5 | Deploy from `main` (commit `59d4c63`) → `*.vercel.app` preview URL | CIPHER | 10 min |
| 6 | Smoke test on preview URL | CIPHER + RECTOR | 10 min |
| 7 | Update Google OAuth redirect URIs (add Vercel + custom domain) | RECTOR | 3 min |
| 8 | Bind `openbudget.rectorspace.com` in Vercel (auto SSL) | CIPHER | 5 min |
| 9 | Update Cloudflare DNS: `openbudget` CNAME → `cname.vercel-dns.com` | CIPHER | 5 min |
| 10 | Final smoke test on production domain | CIPHER + RECTOR | 10 min |

**Wall-clock estimate: ~60 min** (some parallelism, brief blocks waiting for RECTOR-side steps).

### Smoke test checklist (steps 6 and 10)
- Public homepage loads (search, ministry filter, project cards)
- Project detail page loads (milestones, blockchain verification links)
- Analytics dashboard loads (leaderboard, trends, Recharts visualization)
- API docs page loads
- Admin OAuth login (Google) works — RECTOR signs in
- Wallet connect (Phantom on devnet) works
- /pitch-deck page loads (Bahasa Indonesian, video carousel functions)

### Risks & mitigations

| Risk | Mitigation |
|---|---|
| Vercel cold starts on first request | Acceptable for demo (5-10s); can pre-warm via cron later if needed |
| Neon free-tier compute hours exhausted | 191.9 hrs/month — far exceeds demo traffic; alert if approaching |
| Google OAuth redirect URI mismatch causes login break | Step 7 explicit; verify in step 10 smoke test |
| DNS cutover causes brief downtime | Cloudflare DNS TTL low; cutover < 5 min; tolerable since site is currently offline anyway |
| Materialized view (`ministry_performance`) fails to create on Neon | Neon supports PostgreSQL materialized views; verify in step 3 |

### Out of scope (explicit deferrals)
- VPS decommission (leave dormant — no cost saving urgency)
- Mainnet migration (still devnet)
- Custom subdomain or rebrand to `openbudget.id`
- Updating CLAUDE.md to reflect Vercel infra (post-migration cleanup task)

---

## 6. Henrik Pack — Concrete Deliverables (Section 3 — APPROVED)

### URL path decision
`/international` (RECTOR-selected). English pitch page lives at `openbudget.rectorspace.com/international`. Print-optimized brief at `openbudget.rectorspace.com/international/brief`.

### Deliverables table

| # | Deliverable | Format | Location | Time estimate |
|---|---|---|---|---|
| 1 | Live demo | Live URL | `openbudget.rectorspace.com` (entire site) | Covered in §5 |
| 2 | English landing page | Next.js page | `frontend/app/international/page.tsx` | ~2 hrs |
| 3 | Print-optimized 1-page brief | Next.js page | `frontend/app/international/brief/page.tsx` | ~1 hr |
| 4a | Casual intro template | Markdown | `docs/pitch/intro-template-casual.md` | ~20 min |
| 4b | Formal intro template | Markdown | `docs/pitch/intro-template-formal.md` | ~20 min |
| 5 | Email follow-up template | Markdown | `docs/pitch/email-followup-template.md` | ~20 min |

**Total: ~4 hours of pitch work** (on top of ~1 hr deployment from §5).

### Deliverable 2 — `/international` landing page

Single-scroll, ~5 sections, ~1200 words. Structure:

| Section | Content |
|---|---|
| **Hero** | Headline: "Public budget transparency, verified on Solana." Sub: "Built and validated in Indonesia. Ready for the world." CTAs: [Try the live demo →] [Read the brief →] |
| **The Trust Gap (Problem)** | 3 cards: government budgets, NGO donations, foreign aid |
| **How OpenBudget Works (Solution)** | 4-step flow (Ministry registers project → Publishes to blockchain → Adds milestones → Citizens verify real-time). Translated from existing Bahasa pitch-deck. |
| **Proof** | Hackathon win prominent. Komdigi + Ekraf endorsement. Live demo screenshots. Tech stack one-liner. |
| **The Next Level (Vision)** | Use cases list: national budgets, foreign aid agencies, foundations/NGOs, religious institutions handling donations. Highlight DANIDA-style use case explicitly. |
| **Get in Touch** | Simple email CTA → rector@rectorspace.com |

**Tone reference points:** Code for America, GovTech.sg landing pages. NOT a typical crypto project landing page.

**Reuses:** Existing brand assets (`logo.svg`, color palette), `Header` and `Footer` components, the 4-step flow visual from `/pitch-deck` (translated to English).

### Deliverable 3 — `/international/brief` (print-optimized)

Same content as landing page but condensed to **single A4 page** with print-optimized CSS (`@media print` styles, large readable type, no nav chrome). User opens URL → Cmd+P → "Save as PDF" → clean shareable artifact.

Layout sections (top to bottom):
1. Logo + title
2. Headline (1 line)
3. THE PROBLEM (~80 words)
4. THE SOLUTION (~100 words + small diagram)
5. THE PROOF (bullet list of credibility signals)
6. THE NEXT LEVEL (~80 words, foreign-aid angle)
7. CONTACT (email + URL)

### Deliverable 4a — Casual intro template (`docs/pitch/intro-template-casual.md`)

For Henrik's wellness / friend / foundation contacts. ~60 words, conversational, low pressure. References the live demo URL and `/international` landing page.

### Deliverable 4b — Formal intro template (`docs/pitch/intro-template-formal.md`)

For Henrik's Danish government / professional contacts. ~110 words, professional tone, name-drops ministry endorsements as credibility, includes "happy to make a warm intro" closer. References the live demo URL and `/international` landing page.

### Deliverable 5 — Email follow-up template (`docs/pitch/email-followup-template.md`)

For when Henrik gets a warm reply and needs to escalate. ~150 words, includes subject line, more context, offer for a 20-min call. Optional but included for completeness.

### Explicit exclusions from v1
- No new video recording (RECTOR constraint)
- No custom Figma deck PDF (the existing `/pitch-deck` covers visual story; over-engineering for v1)
- No multi-language toggle on existing pages (separate English surfaces only)
- No form/CRM capture (Calendly, Tally) — just email CTA

---

## 7. Distribution & Handoff (Section 4 — APPROVED)

### Channel: WhatsApp (assumed)
Friend-to-friend with Henrik. Adjust to Telegram/email if actual channel differs.

### 3-message sequence RECTOR sends Henrik

**Message 1 — context + thank:**
> Hey Henrik! Thanks again for being open to spreading the word about OpenBudget. Put together a quick package for you so you can look at it whenever, and easily share if you meet the right person.

**Message 2 — the assets:**
> 🔗 Live demo: openbudget.rectorspace.com
> 🌍 What it's about (English): openbudget.rectorspace.com/international
> 📄 1-page brief (open + Cmd+P → Save as PDF): openbudget.rectorspace.com/international/brief

**Message 3 — the intro templates (inline paste):**
> When you meet someone who might be interested, here are two ready-to-copy intros depending on who you're talking to:
>
> Casual (friends/wellness folks):
> [paste content of intro-template-casual.md]
>
> Formal (gov/org folks — like that Denmark gov connection):
> [paste content of intro-template-formal.md]
>
> Take your time going through it. Any questions or confusing parts, please tell me — I'll improve the materials based on your feedback. JazakAllahu khairan, brother 🙏

### Why this format
- 3 messages, not one wall of text → WhatsApp UX
- Demo link first → "oh it's real" hook
- Templates pasted inline → Henrik long-presses + copies directly from chat, no detour
- Explicit feedback ask → Henrik becomes invested collaborator, not just courier
- Personal close → authentic voice

### Feedback loop after Henrik responds

| Henrik's reaction | RECTOR's move |
|---|---|
| Enthusiastic, "this is great" | Ask him to identify 1-2 specific people in his network it might fit, even if no intro yet |
| Lukewarm, "interesting" | Ask what was unclear or what would make it 10x more interesting. Refine. |
| Silent for a week | Soft follow-up: "no rush at all — any first reaction?" |
| Asks specific gov contact intro | Pivot to building a Denmark-specific pitch artifact within 24h |

### Success criteria

| Tier | Outcome |
|---|---|
| Minimum success | Henrik reads, doesn't ghost, gives directional feedback |
| Good success | Henrik shares with 1-2 specific people in his network |
| Great success | Henrik makes a warm intro (any tier of prospect) |
| Jackpot | Henrik connects RECTOR with a Danish gov contact who takes a meeting |

Don't optimize for jackpot. Optimize for clear, professional materials Henrik feels comfortable sharing. Jackpot follows from doing the basics well.

### Explicit exclusions from v1
- No analytics tracking on `/international` page
- No UTMs on Henrik's intro template links
- No Calendly link in CTA (email-only, lowest friction)
- No press kit / media-friendly artifacts

---

## 8. Summary of work units

| Track | Output | Estimated effort |
|---|---|---|
| **Track A: Vercel deployment** | Live site at openbudget.rectorspace.com | ~1 hr (mostly CIPHER) |
| **Track B: English landing page** | `/international` page | ~2 hrs (CIPHER) |
| **Track C: 1-page brief** | `/international/brief` page | ~1 hr (CIPHER) |
| **Track D: Intro templates** | 3 markdown files in `docs/pitch/` | ~1 hr (CIPHER) |
| **Track E: Henrik handoff message** | WhatsApp send by RECTOR | ~5 min (RECTOR, once everything else is done) |
| **Total** | | **~5-6 hrs CIPHER work, ~25-30 min RECTOR work** (includes `vercel link` selection, Google OAuth redirect update, Phantom wallet sign-in during smoke test, final smoke test review, WhatsApp send) |

---

## 9. Open questions / future work

- Should we add a contact form on `/international` instead of just email CTA? (Deferred to v2 based on Henrik feedback)
- Should the existing `/pitch-deck` page get a quiet English variant later? (Deferred — out of scope, single-page focus for v1)
- If Henrik routes to a Danish gov contact, do we need a DANIDA-specific landing variant? (Yes — but that's a v2 trigger, build it only when the warm intro arrives)
- What about mainnet deployment when first paid customer signs? (Out of scope for v1; well-documented future work in main CLAUDE.md)

---

## 10. Approval log

- Section 1 (Positioning) — RECTOR approved 2026-05-23 ("lgtm")
- Section 2 (Vercel Deployment) — RECTOR approved 2026-05-23 ("lgtm") with explicit guardrail amendment: personal accounts only
- Section 3 (Henrik Pack) — RECTOR approved 2026-05-23 ("lgtm")
- Section 4 (Distribution) — RECTOR approved 2026-05-23 ("lgtm")
- URL path decision: `/international` — RECTOR selected from 4 options

**Pending:** Final user review of this written spec → transition to writing-plans skill.
