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
├── app/
│   ├── (public pages)         # Home, projects/[id], analytics, pitch-deck, api-docs
│   ├── admin/                 # Protected ministry dashboard
│   └── api/
│       ├── projects/          # Project CRUD + publish
│       ├── milestones/        # Milestone CRUD + release
│       ├── comments/          # Public comments (Epic 6)
│       ├── ratings/           # Trust score ratings (Epic 6)
│       ├── watchlist/         # Project subscriptions (Epic 6)
│       ├── issues/            # Issue reporting (Epic 6)
│       └── analytics/         # Leaderboard, trends, anomalies (Epic 7)
├── components/
│   ├── (core UI)              # Header, Footer, ProjectCard, etc.
│   ├── CommentSection.tsx     # Q&A system (Epic 6)
│   ├── TrustScoreRating.tsx   # Star ratings (Epic 6)
│   ├── WatchlistButton.tsx    # Email notifications (Epic 6)
│   └── IssueReportModal.tsx   # Report suspicious spending (Epic 6)
└── lib/                       # Utilities, Anchor client, DB pool

database/
├── schema.sql                 # Core tables (Epic 1-4)
├── schema-epic6-7.sql         # Engagement + analytics tables
└── mock-data-epic6.sql        # Demo data (18 comments, 75 ratings, etc.)

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

**EPIC 6 COMPLETE - Citizen Engagement Features:**
- ✅ **Database Schema:** 4 new tables (comments, issues, project_subscriptions, project_ratings)
- ✅ **Comments System:**
  - GET/POST /api/comments - Public Q&A with threading support (parent_comment_id)
  - CommentSection component - Form + list with ministry response badges
  - Rate limiting: 5 comments per 24 hours per email
  - 1000 character limit per comment
- ✅ **Trust Score Ratings:**
  - GET/POST /api/ratings - 1-5 star ratings with averages
  - TrustScoreRating component - Interactive star selection with breakdown bars
  - Upsert logic: one rating per email per project (can update)
  - Optional 500-char comments
- ✅ **Project Watchlist:**
  - GET/POST/DELETE /api/watchlist - Email notification subscriptions
  - WatchlistButton component - Modal form with frequency selection
  - Notification types: instant, daily, weekly (TODO: Resend integration)
- ✅ **Issue Reporting:**
  - GET/POST /api/issues - Report suspicious spending
  - IssueReportModal component - 5 issue types with severity levels
  - Issue types: budget_mismatch, missing_proof, delayed_release, fraudulent_claim, other
  - 10-2000 character description requirement
- ✅ **Integration:** All 4 components added to /projects/[id] page
- ✅ **Mock Data:** 18 comments, 75 ratings, 15 watchlist entries, 9 reported issues

**EPIC 7 COMPLETE - Analytics & Intelligence:**
- ✅ **Materialized View:** ministry_performance with 12 calculated metrics
  - Sub-100ms query performance via pre-aggregation
  - REFRESH CONCURRENTLY support with unique index
  - Auto-refresh function: refresh_ministry_performance()
  - Tracks: completion_rate, budget_accuracy, release_rate, avg_trust_score, etc.
- ✅ **Ministry Leaderboard:**
  - GET /api/analytics/leaderboard - Overall scores (weighted average)
  - Weights: completion_rate (25%), budget_accuracy (30%), release_rate (25%), trust_score (20%)
  - Sorted by overall performance score
- ✅ **Spending Trends:**
  - GET /api/analytics/trends - Time-series data with date grouping
  - Supports: daily, weekly, monthly, yearly views
  - Metrics: project_count, total_budget, total_released, release_rate
- ✅ **Anomaly Detection:**
  - GET /api/analytics/anomalies - 4 rule-based patterns
  - Pattern 1: Low release rate (>100B budget, <30% released)
  - Pattern 2: Missing proof (released milestones without documentation)
  - Pattern 3: Over-allocated (milestone sum > total budget)
  - Pattern 4: Low trust score (≥3 ratings with avg <2.5 stars)
- ✅ **Analytics Dashboard:**
  - /app/analytics/page.tsx - Recharts LineChart integration (97.7 kB)
  - Leaderboard table with color-coded scores
  - Spending trends visualization with Indonesian locale
  - Anomaly alerts with severity indicators
  - Navigation link added to Header
- ✅ **Build:** TypeScript strict mode passing, 27 pages compiled

**Remaining Work:**
- ❌ Epic 5: VPS deployment + demo video

**Timeline:** Final stretch to MVP
1. ~~Day 1: Solana program + Database + API~~ ✅ COMPLETE (Epic 1 & 2)
2. ~~Day 2 Morning: Admin dashboard~~ ✅ COMPLETE (Epic 3)
3. ~~Day 2 Afternoon: Public dashboard~~ ✅ COMPLETE (Epic 4)
4. ~~Day 3: Citizen engagement + Analytics~~ ✅ COMPLETE (Epic 6 & 7)
5. Day 4: Deploy to rectorspace.com + demo video (Epic 5)

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

**Citizen Engagement (Epic 6):**
1. **Comments:** View project → Submit comment (rate limited: 5/24h) → Stored in DB → Ministry can respond
2. **Trust Score:** View project → Rate 1-5 stars + optional comment → Upsert to DB → Materialized view refreshed
3. **Watchlist:** View project → Subscribe with frequency → Stored in DB → Email notifications (TODO: Resend integration)
4. **Issue Reporting:** View project → Report suspicious spending → Stored in DB with severity → Ministry notified (TODO)

**Analytics & Intelligence (Epic 7):**
1. **Leaderboard:** Admin visits /analytics → Query materialized view → Display ranked ministries
2. **Trends:** Admin selects date range → API groups by period → Recharts visualizes spending over time
3. **Anomalies:** Background detection runs → 4 pattern checks → Flag suspicious projects → Display on dashboard
4. **Materialized View Refresh:** Rating submitted → refresh_ministry_performance() → Stats updated → Available for next query

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
- `docs/planning/PRD-Epic6-Citizen-Engagement.md` - Epic 6 requirements (comments, ratings, watchlist, issues)
- `docs/planning/PRD-Epic7-Analytics-Intelligence.md` - Epic 7 requirements (leaderboard, trends, anomalies)
- `docs/guides/GOOGLE-OAUTH-SETUP.md` - Google OAuth setup guide

## Database

**Status:** ✅ Deployed (PostgreSQL 17.6)

**Schema Applied:**
- Core: `psql -d openbudget -f database/schema.sql`
- Epic 6 & 7: `psql -d openbudget -f database/schema-epic6-7.sql`
- Mock data: `psql -d openbudget -f database/mock-data-epic6.sql`

**Core Tables (Epic 1-4):**
- `ministry_accounts` - User accounts (Google OAuth)
- `projects` - Budget projects with `blockchain_id` (max 32 chars for PDA), `total_allocated`, `total_released`
- `milestones` - Spending milestones linked to projects

**Epic 6 Tables (Citizen Engagement):**
- `comments` - Public Q&A with threading (parent_comment_id), ministry response flag
- `project_ratings` - 1-5 star trust scores (UNIQUE constraint per email+project)
- `project_subscriptions` - Watchlist with notification frequency (instant/daily/weekly)
- `issues` - Suspicious spending reports with 5 issue types and severity levels

**Epic 7 Analytics:**
- `ministry_performance` (materialized view) - Pre-aggregated ministry statistics
  - 12 calculated metrics: completion_rate, budget_accuracy, release_rate, avg_trust_score, etc.
  - UNIQUE index on ministry for CONCURRENTLY refresh
  - refresh_ministry_performance() function for scheduled updates

**Indexes (18 total, all verified):**
- Core: `idx_projects_ministry`, `idx_projects_status`, `idx_projects_created`, `idx_milestones_project`, `idx_milestones_released`
- Epic 6: `idx_comments_project`, `idx_comments_email`, `idx_ratings_project`, `idx_subscriptions_project`, `idx_issues_project`
- Epic 7: `idx_ministry_performance` (UNIQUE for concurrent refresh)
- Primary keys and unique constraints throughout

**Performance:**
- Standard queries: < 1ms execution time
- Analytics queries: < 100ms via materialized view
- Rate limiting queries: < 5ms (24-hour window scans)

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

**Epic 6 - Citizen Engagement Endpoints:**
- `GET/POST /api/comments` - Public Q&A system
  - GET: Fetch comments by project_id or milestone_id
  - POST: Create comment with rate limiting (5 per 24h per email)
  - Supports threading via parent_comment_id
  - 1000 character limit
- `GET /api/comments/[id]/replies` - Fetch threaded replies to a comment
- `GET/POST /api/ratings` - Trust score ratings
  - GET: Fetch average ratings and breakdown (1-5 stars) for project
  - POST: Submit or update rating (upsert logic: one per email+project)
  - Triggers materialized view refresh on submission
  - Optional 500-char comment
- `GET/POST/DELETE /api/watchlist` - Project subscriptions
  - GET: Fetch user's watchlist by email
  - POST: Subscribe to project with notification frequency (instant/daily/weekly)
  - DELETE: Unsubscribe from project
  - TODO: Integrate with Resend for email notifications
- `GET/POST /api/issues` - Issue reporting
  - GET: Fetch issues by project_id, milestone_id, status, or severity
  - POST: Report suspicious spending with validation (10-2000 chars)
  - 5 issue types: budget_mismatch, missing_proof, delayed_release, fraudulent_claim, other
  - 4 severity levels: low, medium, high, critical

**Epic 7 - Analytics & Intelligence Endpoints:**
- `GET /api/analytics/leaderboard` - Ministry performance rankings
  - Queries ministry_performance materialized view
  - Returns 12 metrics + calculated overall_score
  - Weighted: completion_rate (25%), budget_accuracy (30%), release_rate (25%), trust_score (20%)
  - Sub-100ms performance via pre-aggregation
- `GET /api/analytics/trends` - Time-series spending data
  - Date grouping: daily, weekly, monthly, yearly
  - Metrics: project_count, total_budget, total_released, release_rate
  - Used for Recharts LineChart visualization
- `GET /api/analytics/anomalies` - Detect suspicious patterns
  - Pattern 1: low_release_rate (>100B budget, <30% released)
  - Pattern 2: missing_proof (released without documentation)
  - Pattern 3: over_allocated (milestone sum > total budget)
  - Pattern 4: low_trust_score (≥3 ratings, avg <2.5 stars)
  - Returns project details with anomaly descriptions

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

### Solana Program Deployment

**Devnet:** `cd solana-program/openbudget && anchor deploy --provider.cluster devnet`

### Production VPS Deployment

**Status:** ✅ Deployed to openbudget.rectorspace.com

**Infrastructure:**
- **VPS Host:** 176.222.53.185
- **SSH Host Alias:** `openbudget` (configured in `~/.ssh/config`)
- **User:** `openbudget`
- **Repository Path:** `/home/openbudget/openbudget-garuda-spark`
- **Deployment Method:** Docker + automated deployment script

**Docker Configuration:**
- **Image Name:** `openbudget:latest`
- **Container Name:** `openbudget-web`
- **Network:** `kamal`
- **Port Mapping:** `3100:3000` (host:container)
- **Restart Policy:** `unless-stopped`
- **Environment Variables:** Loaded from `.kamal/secrets`

**Deployment Workflow:**

1. **Automated Deployment (Recommended):**
   ```bash
   # From local machine on desired branch
   ./scripts/deploy.sh
   ```

   This script automatically:
   - Checks for uncommitted changes
   - Pushes current branch to GitHub
   - SSHs into VPS
   - Pulls latest code
   - Builds Docker image with git metadata
   - Stops old container
   - Starts new container with environment variables
   - Shows deployment logs

2. **Manual Deployment:**
   ```bash
   # SSH into VPS
   ssh openbudget

   # Navigate to repository
   cd openbudget-garuda-spark

   # Pull latest code
   git fetch origin
   git checkout <branch-name>
   git pull origin <branch-name>

   # Build and deploy
   cd frontend
   docker build -t openbudget:latest .
   docker stop openbudget-web
   docker rm openbudget-web

   # Load environment variables
   source .kamal/secrets

   # Run container
   docker run -d \
     --name openbudget-web \
     --restart unless-stopped \
     --network kamal \
     -p 3100:3000 \
     -e DATABASE_URL="$DATABASE_URL" \
     -e NEXT_PUBLIC_SOLANA_PROGRAM_ID="$NEXT_PUBLIC_SOLANA_PROGRAM_ID" \
     -e NEXT_PUBLIC_SOLANA_RPC_URL="$NEXT_PUBLIC_SOLANA_RPC_URL" \
     -e NEXT_PUBLIC_SOLANA_NETWORK="$NEXT_PUBLIC_SOLANA_NETWORK" \
     -e NEXTAUTH_URL="$NEXTAUTH_URL" \
     -e NEXTAUTH_SECRET="$NEXTAUTH_SECRET" \
     -e GOOGLE_CLIENT_ID="$GOOGLE_CLIENT_ID" \
     -e GOOGLE_CLIENT_SECRET="$GOOGLE_CLIENT_SECRET" \
     openbudget:latest
   ```

**Container Management Commands:**

```bash
# View running containers
ssh openbudget "docker ps | grep openbudget"

# View container logs (live)
ssh openbudget "docker logs -f openbudget-web"

# View last 50 log lines
ssh openbudget "docker logs --tail 50 openbudget-web"

# Restart container
ssh openbudget "docker restart openbudget-web"

# Stop container
ssh openbudget "docker stop openbudget-web"

# Check container resource usage
ssh openbudget "docker stats openbudget-web --no-stream"

# Execute commands inside container
ssh openbudget "docker exec -it openbudget-web sh"
```

**Branch Strategy:**
- **main** - Stable production branch
- **dev** - Development and testing
- **submission** - Hackathon submission branch (production deployment)

**Post-Deployment Verification:**
1. Visit https://openbudget.rectorspace.com
2. Check container status: `ssh openbudget "docker ps | grep openbudget"`
3. Monitor logs: `ssh openbudget "docker logs --tail 20 openbudget-web"`
4. Test key features:
   - Public homepage loads
   - Admin login (Google OAuth)
   - Project creation and blockchain publishing
   - Milestone release functionality

**Environment Variables Location:**
- VPS: `/home/openbudget/openbudget-garuda-spark/frontend/.kamal/secrets`
- Contains all production secrets (DATABASE_URL, API keys, etc.)

**Troubleshooting:**

1. **Container won't start:**
   ```bash
   ssh openbudget "docker logs openbudget-web"
   # Check for missing environment variables or build errors
   ```

2. **Database connection errors:**
   ```bash
   # Verify DATABASE_URL in .kamal/secrets
   ssh openbudget "cat openbudget-garuda-spark/frontend/.kamal/secrets | grep DATABASE_URL"

   # Test PostgreSQL connection
   ssh openbudget "psql <DATABASE_URL> -c 'SELECT 1'"
   ```

3. **Port conflicts:**
   ```bash
   # Check what's using port 3100
   ssh openbudget "lsof -i :3100"

   # Stop conflicting service or change port mapping
   ```

4. **Build errors during deployment:**
   ```bash
   # SSH into VPS and build manually to see full logs
   ssh openbudget
   cd openbudget-garuda-spark/frontend
   docker build -t openbudget:latest .
   ```

**Performance Notes:**
- Docker build time: ~50-60 seconds
- Container startup: ~5 seconds
- Static page generation warnings during build are expected (database not accessible during build)
- First request after deployment may take 2-3 seconds (cold start)

**Production URL:** https://openbudget.rectorspace.com

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
- ✅ Epic 6: Citizen engagement (comments, ratings, watchlist, issues)
- ✅ Epic 7: Analytics dashboard (leaderboard, trends, anomalies)

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
