# CLAUDE.md

## Project Overview

**OpenBudget.ID** - Blockchain transparency platform for Garuda Spark hackathon (Oct 2025)
- **Purpose:** Indonesian ministries record spending milestones immutably on Solana, citizens verify in real-time
- **Stack:** Solana Agave 3.0.7 (Rust 1.90.0/Anchor 0.32.1) + Next.js 14 + PostgreSQL
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

## Blockchain as Single Source of Truth

**Core Architectural Principle:**

```
Blockchain (Solana) = Single Source of Truth (Immutable, Authoritative)
         ↓
Database (PostgreSQL) = Cache/Index (Fast queries, Disposable, Rebuildable)
```

**Key Design Decisions:**
- ✅ **Blockchain is ALWAYS the valid source** - Immutable, tamper-proof, authoritative
- ✅ **Database is just a cache** - Optimized for fast queries and search
- ✅ **Database can drift out of sync** - Network issues, Fast Refresh, bugs can cause inconsistency
- ✅ **When conflicts detected** - Query blockchain and heal database automatically
- ✅ **Database is expendable** - Can be deleted and rebuilt from blockchain at any time

**Implemented Self-Healing Features:**

1. **Automatic Recovery on Release Errors:**
   - When "MilestoneAlreadyReleased" error occurs during release
   - System queries blockchain to verify actual state
   - Fetches transaction history from milestone PDA
   - Finds ReleaseFunds transaction by parsing logs
   - Extracts real transaction signature
   - Updates database automatically with correct data
   - Shows success message and refreshes UI
   - **Result:** 100% automatic, no manual intervention needed

2. **Manual Verify Button (🔍 Verify):**
   - Queries blockchain for milestone release status
   - Compares with database state
   - Visual indicator: ✓ Synced (green) | ⚠ Out of Sync (red)
   - Available for every milestone
   - Instant verification without side effects

3. **Manual Sync Button (🔄 Sync):**
   - Appears when verification shows out-of-sync
   - Queries blockchain for actual state
   - Finds release transaction if milestone is released on-chain
   - Updates database to match blockchain
   - Confirms sync with success message
   - **Use case:** Manual recovery when self-healing didn't trigger

**Benefits:**
- ✅ Works in development (with Fast Refresh interruptions)
- ✅ Works in production (with network glitches or database failures)
- ✅ Citizens ALWAYS see accurate data (blockchain = truth)
- ✅ Graceful degradation (database failure doesn't break app)
- ✅ Auditable and transparent (blockchain records are permanent)
- ✅ Production-ready for hackathon demo (no manual SQL needed)

**Future Enhancements:**
- **Background Sync Job:** Periodically verify all projects against blockchain
- **Automatic Verification on Page Load:** Check database matches blockchain on mount
- **Full Project Rebuild:** Button to rebuild entire project state from blockchain
- **Blockchain Explorer Integration:** Direct links to verify every transaction

**Demo Talking Points:**
> "Our system uses Solana blockchain as the single source of truth. The database is just a cache for fast queries. If data ever conflicts, we automatically query the blockchain and heal the database. This ensures citizens ALWAYS see accurate, immutable spending records. The database can fail, be corrupted, or deleted - we can always rebuild it from blockchain."

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

**EPIC 1 COMPLETE - Blockchain Infrastructure (37.5% faster):**
- ✅ **Tooling:** Solana Agave 3.0.7, Anchor 0.32.1, Rust 1.90.0
- ✅ Solana program deployed: `RECtBgp43nvj5inPVW7qo1YN95RwXaYDxLX4dvuJXFY`
- ✅ 14/14 tests passing on devnet
- ✅ 4 instructions: initialize_platform, initialize_project, add_milestone, release_funds
- ✅ Full validation and error handling

**EPIC 2 COMPLETE - Database & API Integration (77% faster):**
- ✅ PostgreSQL 17.6 deployed with optimized schema
- ✅ **Database Tables:** ministry_accounts, projects (with blockchain_id, total_allocated, total_released), milestones
- ✅ **10 Indexes:** All queries < 1ms execution time
- ✅ **7 API Endpoints Working:**
  - POST /api/projects - Create draft project
  - GET /api/projects - List projects with filters
  - GET /api/projects/[id] - Project details with milestones
  - POST /api/projects/[id]/publish - Publish to blockchain (real wallet signing)
  - POST /api/milestones - Create milestone with budget validation
  - GET /api/milestones - List milestones
  - POST /api/milestones/[id]/release - Release funds (real wallet signing)
- ✅ **Budget Validation:** Prevents over-allocation and double-release
- ✅ **Solana Utilities:** PDA helpers (getPlatformPda, getProjectPda, getMilestonePda), explorer links
- ✅ **Connection Pool:** Configured with transactions and error handling

**EPIC 3 COMPLETE - Admin Ministry Dashboard:**
- ✅ **NextAuth 4.24.5:** Google OAuth with session management (JWT, 30-day expiry)
- ✅ **Wallet Adapter:** Phantom & Solflare support with auto-connect
- ✅ **Admin UI Components:**
  - AdminLayout with protected routing
  - AdminHeader with user info, wallet button, sign-out
  - AdminSidebar with navigation and wallet status
  - Responsive Tailwind CSS design
- ✅ **Admin Pages:**
  - Dashboard with wallet status and quick actions
  - Projects list with status filters
  - Project detail with blockchain verification
  - New project form with validation
- ✅ **Real Blockchain Integration:**
  - Publish projects with wallet-signed initializeProject
  - Add milestones with wallet-signed addMilestone
  - Release funds with wallet-signed releaseFunds
  - On-chain verification via Solana Explorer
- ✅ **Protected Routes:** Middleware securing all /admin/* paths
- ✅ **Build:** TypeScript strict mode passing, 11/11 pages compiled

**EPIC 4 COMPLETE - Public Citizen Dashboard (25% faster):**
- ✅ **Public Homepage (/):**
  - No authentication required
  - Real-time search and dynamic ministry filter
  - Project status filtering (published only)
  - Responsive grid (1/2/3 columns)
  - Loading and empty states
- ✅ **ProjectCard Component:**
  - Budget display with millions formatting
  - Progress bar with percentage
  - Verified badge for blockchain projects
  - BigInt-safe calculations
- ✅ **Project Detail Page (/projects/[id]):**
  - Budget overview with stat cards
  - Timeline-style milestone display
  - Blockchain verification links
  - Proof document links
  - Indonesian date formatting
  - 404 error state
- ✅ **Indonesian Localization:**
  - formatRupiah() - IDR currency
  - formatDate() - Indonesian locale
  - formatRelativeTime() - Relative time
  - abbreviateNumber() - K/M/B notation
- ✅ **Optimized API Routes:**
  - Search by title or ministry (ILIKE)
  - Ministry filter support
  - Database queries only (< 10ms)
- ✅ **Build:** All pages compiled, performance targets met

**POST-EPIC 4 IMPROVEMENTS:**
- ✅ **Dynamic Ministry Filter:** Homepage filter now queries database for ministries with published projects (no hardcoded lists)
- ✅ **Fixed Milestone Release API:** Updated `/api/milestones/[id]/release` to accept real transaction signatures instead of generating placeholders
- ✅ **System Insights Page:** Added `/admin/system-insights` showing side-by-side database vs blockchain comparison for hackathon demo
- ✅ **API Enhancement:** Projects API now JOINs with ministry_accounts to return ministry names

**Remaining Work:**
- ❌ Epic 5: VPS deployment + demo video

**Timeline:** 1 day remaining to MVP
1. ~~Day 1: Solana program + Database + API~~ ✅ COMPLETE (Epic 1 & 2)
2. ~~Day 2 Morning: Admin dashboard~~ ✅ COMPLETE (Epic 3)
3. ~~Day 2 Afternoon: Public dashboard~~ ✅ COMPLETE (Epic 4)
4. Day 3: Deploy to rectorspace.com + demo video (Epic 5)

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

**Program ID Synchronization (✅ SYNCED IN ALL 3 PLACES):**
1. `solana-program/openbudget/Anchor.toml` → `[programs.devnet]` = `RECtBgp43nvj5inPVW7qo1YN95RwXaYDxLX4dvuJXFY`
2. `solana-program/openbudget/programs/openbudget/src/lib.rs` → `declare_id!("RECtBgp43nvj5inPVW7qo1YN95RwXaYDxLX4dvuJXFY")`
3. `frontend/.env.local` → `NEXT_PUBLIC_SOLANA_PROGRAM_ID=RECtBgp43nvj5inPVW7qo1YN95RwXaYDxLX4dvuJXFY`

**Explorer Link:** https://explorer.solana.com/address/RECtBgp43nvj5inPVW7qo1YN95RwXaYDxLX4dvuJXFY?cluster=devnet

**PDA Seeds Must Match:**
```rust
// Rust: seeds = [b"project", id.as_bytes()]
// TypeScript: PublicKey.findProgramAddressSync([Buffer.from('project'), Buffer.from(id)], programId)
```
**Mismatch = account not found errors!**

## Environment Variables

**frontend/.env.local:**
```env
# Database (✅ Configured)
DATABASE_URL=postgresql://rz@localhost:5432/openbudget

# Solana (✅ Configured)
NEXT_PUBLIC_SOLANA_PROGRAM_ID=RECtBgp43nvj5inPVW7qo1YN95RwXaYDxLX4dvuJXFY
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_SOLANA_NETWORK=devnet

# NextAuth (⏳ To be configured in Epic 3)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here-change-in-production

# Google OAuth (⏳ To be configured in Epic 3)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Google OAuth redirect URI:** `http://localhost:3000/api/auth/callback/google`

## Anchor Program Structure

**✅ Implemented Instructions:**
1. ✅ `initialize_platform` - Sets up global platform state
2. ✅ `initialize_project(project_id, title, ministry, total_budget)` - Creates budget project
3. ✅ `add_milestone(project_id, index, description, amount)` - Adds milestone with budget validation
4. ✅ `release_funds(project_id, index, proof_url)` - Releases funds (one-way operation)

**Account Structures (in `state.rs`):**
- `PlatformState` (48 bytes): admin, project_count
- `Project` (267 bytes): id, title, ministry, total_budget, **total_allocated**, **total_released**, milestone_count, created_at, authority
  - **Key Design:** `total_allocated` tracks milestone budget commitments, `total_released` tracks actual releases
  - This separation prevents over-allocation while allowing milestones to be planned before release
- `Milestone` (471 bytes): project_id, index, description, amount, is_released, released_at, proof_url

**Error Codes:** ProjectIdTooLong, InvalidTitle, InvalidBudget, InsufficientBudget, UnauthorizedAccess, MilestoneAlreadyReleased

**Test Coverage:** 14/14 tests passing (platform init, project creation with validation, milestone management, authority checks)

**References:**
- `EPIC1-COMPLETION-REPORT.md` - Epic 1 achievements and retrospective
- `docs/execution/EXECUTION-Epic1-Blockchain-Infrastructure.md` - Epic 1 implementation details
- `docs/execution/EXECUTION-Epic2-Database-API-Integration.md` - Epic 2 implementation details
- `docs/execution/EXECUTION-Epic3-Admin-Ministry-Dashboard.md` - Epic 3 implementation details
- `docs/guides/GOOGLE-OAUTH-SETUP.md` - Google OAuth setup guide

## Database

**Status:** ✅ Deployed (PostgreSQL 17.6)

**Schema Applied:** `psql -d openbudget -f database/schema.sql`

**Tables:**
- `ministry_accounts` - User accounts (Google OAuth)
- `projects` - Budget projects with `blockchain_id` (max 32 chars for PDA), `total_allocated`, `total_released`
- `milestones` - Spending milestones linked to projects

**Indexes (10 total, all verified):**
- `idx_projects_ministry`, `idx_projects_status`, `idx_projects_created`
- `idx_milestones_project`, `idx_milestones_released`
- Primary keys and unique constraints

**Performance:** All queries < 1ms execution time

**Connection:** Pool configured (max 20 clients, 30s idle timeout)

## API Routes

**Status:** ✅ All endpoints functional (tested with curl)

**Project Endpoints:**
- `POST /api/projects` - Create draft project (validates title, recipient, budget)
- `GET /api/projects?status=published&limit=20` - List projects with filters
- `GET /api/projects/[id]` - Get project with nested milestones array
- `POST /api/projects/[id]/publish` - Publish to blockchain
  - Generates `blockchain_id` (max 32 chars for PDA)
  - Derives Project PDA
  - Updates DB with solana_account, creation_tx, status='published'
  - ✅ Real wallet-signed transactions

**Milestone Endpoints:**
- `POST /api/milestones` - Create milestone
  - Validates project is published
  - Enforces budget constraint: `total_allocated + amount ≤ total_budget`
  - Updates project's `total_allocated`
  - Prevents duplicate milestone indexes
- `GET /api/milestones?project_id=[uuid]` - List milestones for project
- `POST /api/milestones/[id]/release` - Release milestone funds
  - **Request Body:** `{ proof_url, transaction_signature }`
  - `transaction_signature`: Real Solana transaction signature from client wallet
  - Validates project is published and milestone not already released
  - Derives Milestone PDA for reference
  - Updates DB with release_tx (real signature), released_at, proof_url, is_released=true
  - Updates project's `total_released`
  - Prevents double-release
  - ✅ Real wallet-signed transactions (client signs, API stores)

**Utilities:**
- `frontend/lib/db.ts` - PostgreSQL connection pool with transaction support
- `frontend/lib/solana.ts` - PDA helpers, explorer URLs, connection management

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
- Mixed Indonesian/English (public UI in Indonesian)

---

## Next Steps (Epic 5)

**Epic 5: Deployment & Demo** - Estimated 6 hours

**Deliverables:**
1. VPS deployment to openbudget.rectorspace.com
2. Create demo data (2+ published projects with milestones)
3. Record 3-minute demo video
4. Polish GitHub repository
5. Submit to Garuda Spark hackathon

**Prerequisites:**
- ✅ Epic 1: Solana program deployed and tested
- ✅ Epic 2: Database & API routes functional
- ✅ Epic 3: Admin dashboard with real blockchain integration
- ✅ Epic 4: Public dashboard with search and verification

**Key Tasks:**
- SSL certificate setup (Let's Encrypt)
- PM2 process management
- PostgreSQL production setup
- Environment variable configuration
- Demo video production (screen recording + narration)
- GitHub README polish

**Reference:** `docs/planning/PRD-Epic5-Deployment-Demo.md`

---

**Target:** openbudget.rectorspace.com | **Reference:** docs/IMPLEMENTATION-PLAN.md
