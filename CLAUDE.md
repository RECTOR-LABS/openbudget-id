# CLAUDE.md

## Project Overview

**OpenBudget.ID** - Blockchain transparency platform for Garuda Spark hackathon (Oct 2025)
- **Purpose:** Indonesian ministries record spending milestones immutably on Solana, citizens verify in real-time
- **Stack:** Solana (Rust/Anchor 0.29.0) + Next.js 14 + PostgreSQL
- **Key Principle:** Blockchain as invisible infrastructure, not interface

## Architecture

**Hybrid Pattern:**
- **On-Chain (Solana):** Immutable spending records (source of truth)
- **Off-Chain (PostgreSQL):** Searchable metadata, user accounts
- **Bridge (Next.js API):** Coordinates DB ↔ Blockchain

**Critical Workflow:**
```
Ministry Action → DB (draft) → Blockchain (publish) → DB (update with tx refs)
```

**Why Hybrid?**
- Blockchain queries slow/expensive → use DB for browsing
- DB can be tampered → blockchain for verification
- Citizens get fast UX + trustless verification

## Directory Structure

```
solana-program/openbudget/     # Anchor program
├── programs/openbudget/src/   # lib.rs (entry), state.rs, instructions/
└── Anchor.toml                # Program ID config

frontend/                      # Next.js 14 App Router
├── app/                       # Pages & API routes
├── components/                # React components
└── lib/                       # Utilities, Anchor client

database/schema.sql            # PostgreSQL schema
docs/IMPLEMENTATION-PLAN.md    # Full technical spec (reference this!)
```

## Current Status

**EARLY STAGE - Boilerplate Only:**
- ✅ Solana program initialized (only `initialize()` exists in `lib.rs`)
- ✅ Frontend scaffold (`app/layout.tsx`, `app/page.tsx` only)
- ✅ Database schema defined (not deployed)
- ❌ No Solana instructions implemented (need: `initialize_project`, `add_milestone`, `release_funds`)
- ❌ No wallet integration, API routes, dashboards

**Timeline:** 4 days to MVP
1. Day 1: Implement Solana program logic
2. Day 2: Admin dashboard (NextAuth + wallet adapter)
3. Day 3: Public dashboard + API routes
4. Day 4: Deploy to rectorspace.com + demo video

## Data Flows

**Project Publishing:**
1. Ministry login (Google OAuth) → Create project (draft in DB)
2. Connect wallet → Publish to blockchain (`initialize_project()` instruction)
3. Get tx signature → Update DB with `solana_account` + `creation_tx`, status = `published`

**Milestone Release:**
1. Ministry uploads proof → Signs `release_funds()` transaction
2. On-chain Milestone updated (`is_released = true`)
3. DB updated with `release_tx` + `released_at`

**Citizen Verification:**
1. Browse projects (DB query) → Click project detail → See milestones with tx hashes
2. Click "View on Solana Explorer" → Verify on-chain matches displayed data

## Critical Configuration

**Program ID Synchronization (MUST MATCH IN 3 PLACES):**
1. `solana-program/openbudget/Anchor.toml` → `[programs.devnet]`
2. `solana-program/openbudget/programs/openbudget/src/lib.rs` → `declare_id!()`
3. `frontend/.env.local` → `NEXT_PUBLIC_SOLANA_PROGRAM_ID`

**Mismatch = transactions fail!**

**PDA Seeds Must Match:**
```rust
// Rust: seeds = [b"project", id.as_bytes()]
// TypeScript: PublicKey.findProgramAddressSync([Buffer.from('project'), Buffer.from(id)], programId)
```
**Mismatch = account not found errors!**

## Environment Variables

**frontend/.env.local:**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/openbudget
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<openssl rand -base64 32>
GOOGLE_CLIENT_ID=<from console.cloud.google.com>
GOOGLE_CLIENT_SECRET=<from Google OAuth>
NEXT_PUBLIC_SOLANA_PROGRAM_ID=<from anchor deploy>
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_SOLANA_NETWORK=devnet
```

**Google OAuth redirect URI:** `http://localhost:3000/api/auth/callback/google`

## Anchor Program Structure

**Pattern for adding instructions:**
1. Define accounts in `state.rs` (`#[account] pub struct Project {...}`)
2. Create `instructions/` directory with separate files per instruction
3. Wire up in `lib.rs` (`#[program] pub mod openbudget {...}`)
4. After changes: `anchor test && anchor build && anchor deploy --provider.cluster devnet`
5. If Program ID changes, update in 3 places (see Critical Configuration)

**Reference:** `docs/IMPLEMENTATION-PLAN.md` has full Rust/TS code

## Database

**Apply schema:** `psql -U postgres -d openbudget -f database/schema.sql`

**Indexes (use these for queries):**
- `projects.ministry_id`, `projects.status`, `projects.created_at`
- `milestones.project_id`

**Manual migrations:** Create `migrations/*.sql` and apply with `psql -d openbudget -f migrations/...`

## Performance

**Critical:** ❌ NEVER query Solana for every request (slow, expensive RPC)
- ✅ Use PostgreSQL for browsing/filtering
- ✅ Use Solana only for verification links
- Public devnet RPC has rate limits → production needs dedicated RPC (Helius/QuickNode)

## Common Pitfalls

1. **Program ID mismatch:** Run `anchor keys list`, update 3 locations, rebuild
2. **Wallet connection fails:** Check `<WalletProvider>` wraps app, wallet on devnet
3. **PDA account not found:** Verify seeds match exactly (Rust vs TypeScript)
4. **DB connection error:** Check `.env.local` has `DATABASE_URL`, PostgreSQL running
5. **NextAuth error:** Generate `NEXTAUTH_SECRET` with `openssl rand -base64 32`

## Deployment

**Devnet:** `cd solana-program/openbudget && anchor deploy --provider.cluster devnet`
**Production VPS:** Check `~/.ssh/config` for host, deploy to `openbudget.rectorspace.com`

## Hackathon Context

**Deadline:** October 2025 (4-day sprint)

**Demo Requirements:**
- Devnet deployment with 2+ sample projects
- Public dashboard (no login) + Admin dashboard (Google OAuth)
- Verifiable transactions on Solana Explorer

**Demo Scenario:**
1. Login → Create project → Publish to blockchain → Show tx hash
2. Public dashboard → Verify project appears → Release milestone
3. Click "Verify on Solana Explorer" → Prove immutability

**Judging Focus:** Social impact (transparency), Solana integration, UX (no crypto jargon), feasibility

**MVP Limitations:**
- No actual fund transfer (symbolic records only)
- Proof documents = URLs (not IPFS)
- No role-based access control
- English only

---

**Target:** openbudget.rectorspace.com | **Reference:** docs/IMPLEMENTATION-PLAN.md
