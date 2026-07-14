<!-- Satellite context file — extends the global hub (~/.claude/CLAUDE.md | ~/.pi/agent/AGENTS.md). Host-neutral; project-specific only. Do not duplicate hub standards here. -->

# OpenBudget.ID

> 🥈 2nd Place Winner — Garuda Spark Hackathon (Oct 2025), 1,500 USDC. Blockchain transparency platform enabling Indonesian ministries to record spending milestones immutably on Solana, allowing citizens to verify in real-time.

**Hackathon:** Garuda Spark — Blockchain for Good (Superteam Indonesia × Komdigi × Ekraf), 4-day sprint.
**Live:** https://openbudget.rectorspace.com
**Key principle:** Blockchain as invisible infrastructure, not interface.

## Architecture (Hybrid)

- **On-chain (Solana):** immutable spending records (source of truth)
- **Off-chain (PostgreSQL):** searchable metadata, user accounts (cache/index — disposable, rebuildable)
- **Bridge (Next.js API):** coordinates DB ↔ blockchain

**Critical workflow:** Ministry Action → DB (draft) → Blockchain (publish) → DB (update with tx refs).

**Blockchain as single source of truth:** DB is just a cache — can drift, can be deleted and rebuilt from blockchain. Self-healing: automatic recovery on `MilestoneAlreadyReleased` errors (query chain, find ReleaseFunds tx, heal DB), manual Verify button (🔍 synced/out-of-sync), manual Sync button (🔄).

## Tech Stack

- **Solana:** Agave 3.0.7, Anchor 0.32.1, Rust 1.90.0. Program `RECtBgp43nvj5inPVW7qo1YN95RwXaYDxLX4dvuJXFY` (devnet, 14/14 tests)
- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind
- **DB:** PostgreSQL 17.6 (18 indexes, all queries <1ms; materialized view for analytics <100ms)
- **Auth:** NextAuth 4.24.5 (Google OAuth, JWT 30-day) + Solana Wallet Adapter (Phantom, Solflare)

## Anchor Program (4 instructions)

`initialize_platform` · `initialize_project(project_id, title, ministry, total_budget)` · `add_milestone(project_id, index, description, amount)` · `release_funds(project_id, index, proof_url)` (one-way).

**Accounts:** `PlatformState` (48B: admin, project_count) · `Project` (267B: id, title, ministry, total_budget, **total_allocated**, **total_released**, milestone_count, created_at, authority) · `Milestone` (471B: project_id, index, description, amount, is_released, released_at, proof_url). Key design: `total_allocated` tracks milestone commitments, `total_released` tracks actual releases — prevents over-allocation while allowing planned milestones.

**PDA seeds:** `[b"project", id.as_bytes()]` — must match Rust + TypeScript exactly (mismatch = account not found).

**Errors:** ProjectIdTooLong, InvalidTitle, InvalidBudget, InsufficientBudget, UnauthorizedAccess, MilestoneAlreadyReleased.

## Directory Structure

```
solana-program/openbudget/programs/openbudget/src/{lib,state,instructions/}  # Anchor program
frontend/app/{public pages, admin/, api/{projects,milestones,comments,ratings,watchlist,issues,analytics}/}
frontend/components/{CommentSection,TrustScoreRating,WatchlistButton,IssueReportModal}.tsx
frontend/lib/{db,solana}.ts
database/{schema,schema-epic6-7,mock-data-epic6}.sql
docs/IMPLEMENTATION-PLAN.md
```

## Epic Status (all complete, 4-day sprint)

1. Blockchain Infrastructure (14/14 tests) · 2. Database & API (7 endpoints, 10 indexes) · 3. Admin Ministry Dashboard (NextAuth + wallet, real blockchain integration) · 4. Public Citizen Dashboard (search, filters, Indonesian localization) · 5. VPS deployment + demo video · 6. Citizen Engagement (comments, ratings, watchlist, issues) · 7. Analytics (leaderboard, trends, anomaly detection).

## API Routes

**Projects:** `POST/GET /api/projects` · `GET /api/projects/[id]` · `POST /api/projects/[id]/publish` (real wallet-signed)
**Milestones:** `POST/GET /api/milestones` · `POST /api/milestones/[id]/release` (accepts real `transaction_signature`)
**Epic 6:** `GET/POST /api/comments` (threading, 5/24h rate limit) · `/api/comments/[id]/replies` · `GET/POST /api/ratings` (1-5 star upsert, triggers materialized view refresh) · `GET/POST/DELETE /api/watchlist` · `GET/POST /api/issues` (5 types, 4 severity)
**Epic 7:** `GET /api/analytics/leaderboard` (weighted: completion 25%, budget_accuracy 30%, release 25%, trust 20%) · `GET /api/analytics/trends` (daily/weekly/monthly/yearly) · `GET /api/analytics/anomalies` (4 patterns: low release rate, missing proof, over-allocated, low trust)

## Database

Core: `ministry_accounts`, `projects` (blockchain_id max 32 chars for PDA, total_allocated, total_released), `milestones`. Epic 6: `comments` (threading), `project_ratings` (UNIQUE email+project), `project_subscriptions`, `issues`. Epic 7: `ministry_performance` materialized view (12 metrics, UNIQUE index for CONCURRENTLY refresh, `refresh_ministry_performance()`). 18 indexes. Pool: max 20 clients, 30s idle.

## Environment (frontend/.env.local)

`DATABASE_URL` · `NEXT_PUBLIC_SOLANA_PROGRAM_ID` · `NEXT_PUBLIC_SOLANA_RPC_URL` · `NEXT_PUBLIC_SOLANA_NETWORK` · `NEXTAUTH_URL` · `NEXTAUTH_SECRET` · `GOOGLE_CLIENT_ID` · `GOOGLE_CLIENT_SECRET`. Google OAuth redirect: `http://localhost:3000/api/auth/callback/google`.

**Program ID sync (3 places):** `Anchor.toml` · `lib.rs` `declare_id!` · `.env.local` `NEXT_PUBLIC_SOLANA_PROGRAM_ID` — all `RECtBgp43nvj5inPVW7qo1YN95RwXaYDxLX4dvuJXFY`.

## Performance

**Never query Solana for every request** (slow, expensive RPC). Use PostgreSQL for browsing/filtering; Solana only for verification links. Public devnet RPC rate-limits → production needs dedicated RPC (Helius/QuickNode).

## Deployment (VPS Docker)

VPS 176.222.53.185, SSH alias `openbudget`, user `openbudget`, repo `/home/openbudget/openbudget-garuda-spark`. Docker image `openbudget:latest`, container `openbudget-web`, network `kamal`, port `3100:3000`, `unless-stopped`. Env vars from `.kamal/secrets`.

```bash
./scripts/deploy.sh          # automated: push → SSH → pull → build → stop old → start new → logs
ssh openbudget "docker logs -f openbudget-web"
ssh openbudget "docker restart openbudget-web"
```

Branches: `main` (stable) · `dev` (testing) · `submission` (hackathon). Build ~50-60s, startup ~5s. Static page generation warnings during build expected (DB not accessible at build).

## Demo Scenario

Login → Create project → Publish to blockchain → Show tx hash → Public dashboard → Verify project appears → Release milestone → Click "Verify on Solana Explorer" → Prove immutability.