# EXECUTION PLAN: Epic 2 - Database & API Integration

**Epic ID:** EPIC-02
**Last Updated:** 2025-10-26
**Overall Status:** 🔴 Not Started (Blocked by EPIC-01)
**Completion:** 0% (0/11 tasks completed)

---

## Epic Progress Dashboard

| Story | Status | Progress | Tasks Completed | Estimated | Actual | Blocker |
|-------|--------|----------|-----------------|-----------|--------|---------|
| 2.1: Deploy PostgreSQL | 🔴 Not Started | 0% | 0/3 | 1h | - | - |
| 2.2: Project API Routes | 🔴 Not Started | 0% | 0/4 | 2h | - | Needs 2.1 |
| 2.3: Milestone API Routes | 🔴 Not Started | 0% | 0/2 | 2h | - | Needs 2.2 |
| 2.4: Blockchain Utilities | 🔴 Not Started | 0% | 0/1 | 1h | - | Needs EPIC-01 |
| 2.5: DB Optimization | 🔴 Not Started | 0% | 0/1 | 30m | - | Needs 2.1 |
| **TOTAL** | 🔴 | **0%** | **0/11** | **6.5h** | **-** | - |

---

## Prerequisites Check

| Prerequisite | Required From | Status | Notes |
|-------------|---------------|--------|-------|
| Solana Program Deployed | EPIC-01 | 🔴 | Need Program ID |
| Program ID Documented | EPIC-01 | 🔴 | Must sync to .env.local |
| Anchor IDL Generated | EPIC-01 | 🔴 | Need target/types/openbudget.ts |
| PostgreSQL Installed | - | ❓ | Check with `psql --version` |
| Next.js Dependencies | - | ❓ | Check package.json |

---

## Story 2.1: Deploy PostgreSQL Database

**Story Status:** 🔴 Not Started
**Progress:** 0% (0/3 tasks)
**Target Completion:** Day 1, Hour 9 (after Epic 1 completes)

### Task Tracker

| Task ID | Task Name | Status | Assignee | Est | Actual | Dependencies | Notes |
|---------|-----------|--------|----------|-----|--------|--------------|-------|
| 2.1.1 | Install PostgreSQL | 🔴 | RECTOR | 20m | - | None | macOS: brew or Postgres.app |
| 2.1.2 | Apply schema | 🔴 | RECTOR | 20m | - | 2.1.1 | Use database/schema.sql |
| 2.1.3 | Configure Next.js connection | 🔴 | RECTOR | 20m | - | 2.1.2 | Test with node script |

### Task Details

#### ✅ **Task 2.1.1: Install PostgreSQL**
- **Commands:**
  ```bash
  # Check if already installed
  psql --version

  # If not installed (choose one):
  brew install postgresql@16 && brew services start postgresql@16
  # OR download Postgres.app

  # Create database
  createdb openbudget
  ```
- **Validation Checklist:**
  - [ ] `psql --version` shows PostgreSQL 14+
  - [ ] `psql -d openbudget -c "SELECT 1"` returns 1
  - [ ] PostgreSQL service running (check Activity Monitor or `brew services list`)
- **Blockers:** None
- **Notes:** Postgres.app is easier for macOS, includes GUI

---

#### ✅ **Task 2.1.2: Apply schema**
- **Commands:**
  ```bash
  psql -U postgres -d openbudget -f database/schema.sql

  # Verify tables
  psql -d openbudget -c "\dt"
  psql -d openbudget -c "\di"  # Check indexes
  ```
- **Validation Checklist:**
  - [ ] 3 tables exist: users, projects, milestones
  - [ ] 6+ indexes created (check with \di)
  - [ ] Foreign keys enforced (try inserting milestone without project - should fail)
- **Blockers:** Task 2.1.1 must complete first
- **Notes:** If schema changes, create migration file instead of re-running

---

#### ✅ **Task 2.1.3: Configure Next.js connection**
- **File:** `frontend/.env.local`
  ```env
  DATABASE_URL=postgresql://postgres:password@localhost:5432/openbudget
  ```
- **Test Script:**
  ```bash
  cd frontend
  npm install pg
  node -e "const { Pool } = require('pg'); require('dotenv').config({ path: '.env.local' }); const pool = new Pool({ connectionString: process.env.DATABASE_URL }); pool.query('SELECT NOW()', (err, res) => { console.log(err || res.rows[0]); pool.end(); })"
  ```
- **Validation Checklist:**
  - [ ] Script returns current timestamp
  - [ ] No "password authentication failed" error
  - [ ] DATABASE_URL added to .env.local
- **Blockers:** None
- **Notes:** Adjust username/password if using custom PostgreSQL user

---

### Story 2.1 Completion Criteria
- [ ] PostgreSQL running and accessible
- [ ] All tables and indexes created
- [ ] Next.js can connect to database

---

## Story 2.2: Create API Routes for Projects

**Story Status:** 🔴 Not Started
**Progress:** 0% (0/4 tasks)
**Target Completion:** Day 2, Hour 2

### Task Tracker

| Task ID | Task Name | Status | Assignee | Est | Actual | Dependencies | Notes |
|---------|-----------|--------|----------|-----|--------|--------------|-------|
| 2.2.1 | Setup DB client utility | 🔴 | RECTOR | 20m | - | 2.1.3 | Create lib/db.ts |
| 2.2.2 | Implement POST /api/projects | 🔴 | RECTOR | 30m | - | 2.2.1 | Create + List |
| 2.2.3 | Implement GET /api/projects/[id] | 🔴 | RECTOR | 30m | - | 2.2.2 | Detail view |
| 2.2.4 | Implement POST /api/projects/[id]/publish | 🔴 | RECTOR | 40m | - | 2.2.3, 2.4.1 | Blockchain bridge |

### Task Details

#### ✅ **Task 2.2.1: Setup DB client utility**
- **File:** `frontend/lib/db.ts` (NEW)
- **Validation Checklist:**
  - [ ] File created with Pool initialization
  - [ ] `query()` helper function with error logging
  - [ ] TypeScript types correct
  - [ ] Compiles: `npm run build` (or `tsc --noEmit`)
- **Blockers:** None
- **Notes:** Connection pool size = 20 is good for dev, adjust for production

---

#### ✅ **Task 2.2.2: Implement POST /api/projects**
- **Files:**
  - `frontend/app/api/projects/route.ts` (NEW)
  - Install: `npm install nanoid` for project ID generation
- **Validation Checklist:**
  - [ ] POST creates draft project in DB
  - [ ] GET lists all projects (no filters yet)
  - [ ] Test with curl:
    ```bash
    curl -X POST http://localhost:3000/api/projects \
      -H "Content-Type: application/json" \
      -d '{"title":"Test Project","ministry":"Ministry of Health","total_budget":1000000000,"ministry_id":"user123"}'

    curl http://localhost:3000/api/projects
    ```
  - [ ] Returns 201 status and project object
- **Blockers:** Task 2.2.1
- **Notes:** Ministry ID comes from NextAuth session (implement in Epic 3)

---

#### ✅ **Task 2.2.3: Implement GET /api/projects/[id]**
- **File:** `frontend/app/api/projects/[id]/route.ts` (NEW)
- **Validation Checklist:**
  - [ ] Returns project with nested milestones array
  - [ ] Test with curl:
    ```bash
    curl http://localhost:3000/api/projects/KEMENKES-2025-001
    ```
  - [ ] Returns 404 for non-existent project
- **Blockers:** Task 2.2.2
- **Notes:** This powers the public project detail page

---

#### ✅ **Task 2.2.4: Implement POST /api/projects/[id]/publish**
- **File:** `frontend/app/api/projects/[id]/publish/route.ts` (NEW)
- **Validation Checklist:**
  - [ ] Derives Project PDA correctly
  - [ ] Updates DB with `solana_account` and `creation_tx`
  - [ ] Returns transaction signature
  - [ ] Test with placeholder tx (actual blockchain call in Epic 3)
- **Blockers:** Tasks 2.2.3 and 2.4.1 (needs PDA helpers)
- **Notes:** Wallet integration happens in Epic 3 - use placeholder for now

---

### Story 2.2 Completion Criteria
- [ ] All 4 endpoints functional
- [ ] Tested with curl (200/201 responses)
- [ ] DB updates correctly after publish

---

## Story 2.3: Create API Routes for Milestones

**Story Status:** 🔴 Not Started
**Progress:** 0% (0/2 tasks)
**Target Completion:** Day 2, Hour 4

### Task Tracker

| Task ID | Task Name | Status | Assignee | Est | Actual | Dependencies | Notes |
|---------|-----------|--------|----------|-----|--------|--------------|-------|
| 2.3.1 | Implement POST /api/milestones | 🔴 | RECTOR | 60m | - | 2.2.2 | Add + List |
| 2.3.2 | Implement POST /api/milestones/[id]/release | 🔴 | RECTOR | 60m | - | 2.3.1, 2.4.1 | Blockchain release |

### Task Details

#### ✅ **Task 2.3.1: Implement POST /api/milestones**
- **File:** `frontend/app/api/milestones/route.ts` (NEW)
- **Validation Checklist:**
  - [ ] POST validates project exists and is published
  - [ ] Enforces budget constraint (sum of milestones ≤ project budget)
  - [ ] GET filters by project_id
  - [ ] Test with curl:
    ```bash
    curl -X POST http://localhost:3000/api/milestones \
      -H "Content-Type: application/json" \
      -d '{"project_id":"KEMENKES-2025-001","milestone_index":0,"description":"Phase 1","amount":300000000}'

    curl "http://localhost:3000/api/milestones?project_id=KEMENKES-2025-001"
    ```
  - [ ] Returns 400 if budget exceeded
- **Blockers:** Task 2.2.2
- **Notes:** milestone_index should be 0-based and sequential

---

#### ✅ **Task 2.3.2: Implement POST /api/milestones/[id]/release**
- **File:** `frontend/app/api/milestones/[id]/release/route.ts` (NEW)
- **Validation Checklist:**
  - [ ] Derives Milestone PDA correctly
  - [ ] Updates DB with `release_tx`, `released_at`, `proof_url`
  - [ ] Sets `is_released = true`
  - [ ] Test with curl:
    ```bash
    curl -X POST http://localhost:3000/api/milestones/1/release \
      -H "Content-Type: application/json" \
      -d '{"proof_url":"https://example.com/proof.pdf"}'
    ```
- **Blockers:** Task 2.3.1 and 2.4.1
- **Notes:** Actual blockchain call in Epic 3 with wallet

---

### Story 2.3 Completion Criteria
- [ ] Milestone creation and release endpoints working
- [ ] Budget validation enforced
- [ ] DB state consistent

---

## Story 2.4: Implement Blockchain Client Utilities

**Story Status:** 🔴 Not Started
**Progress:** 0% (0/1 task)
**Target Completion:** Day 2, Hour 5

### Task Tracker

| Task ID | Task Name | Status | Assignee | Est | Actual | Dependencies | Notes |
|---------|-----------|--------|----------|-----|--------|--------------|-------|
| 2.4.1 | Create Solana client utility | 🔴 | RECTOR | 60m | - | EPIC-01 (IDL) | lib/solana.ts |

### Task Details

#### ✅ **Task 2.4.1: Create Solana client utility**
- **Files:**
  - `frontend/lib/solana.ts` (NEW)
  - Copy IDL: `cp solana-program/openbudget/target/types/openbudget.ts frontend/idl/openbudget.json`
- **Validation Checklist:**
  - [ ] PROGRAM_ID from environment variable
  - [ ] PDA helpers: getPlatformPda(), getProjectPda(), getMilestonePda()
  - [ ] Test PDA derivation matches Rust:
    ```typescript
    import { getProjectPda } from '@/lib/solana';
    console.log(getProjectPda('KEMENKES-2025-001')[0].toString());
    // Should match Solana Explorer account
    ```
  - [ ] Explorer link helper works
- **Blockers:** EPIC-01 must be complete (need IDL and Program ID)
- **Notes:** IDL needs to be JSON format - convert TypeScript if needed

---

### Story 2.4 Completion Criteria
- [ ] Solana utilities ready for API routes
- [ ] PDA derivation verified against Rust
- [ ] Type-safe Anchor program client

---

## Story 2.5: Database Optimization

**Story Status:** 🔴 Not Started
**Progress:** 0% (0/1 task)
**Target Completion:** Day 2, Hour 5.5

### Task Tracker

| Task ID | Task Name | Status | Assignee | Est | Actual | Dependencies | Notes |
|---------|-----------|--------|----------|-----|--------|--------------|-------|
| 2.5.1 | Verify indexes and test performance | 🔴 | RECTOR | 30m | - | 2.1.2 | Run EXPLAIN ANALYZE |

### Task Details

#### ✅ **Task 2.5.1: Verify indexes and test performance**
- **Commands:**
  ```sql
  -- Check indexes exist
  \di

  -- Test query plans
  EXPLAIN ANALYZE SELECT * FROM projects WHERE status = 'published' ORDER BY created_at DESC LIMIT 20;
  EXPLAIN ANALYZE SELECT * FROM milestones WHERE project_id = 'KEMENKES-2025-001';
  ```
- **Validation Checklist:**
  - [ ] All indexes from schema.sql present
  - [ ] Query plans show "Index Scan" (not "Seq Scan")
  - [ ] Execution time < 10ms for both queries
  - [ ] Connection pool configured in lib/db.ts (already done in 2.2.1)
- **Blockers:** Task 2.1.2
- **Notes:** If Seq Scan appears, check index names match query columns

---

### Story 2.5 Completion Criteria
- [ ] Indexes verified
- [ ] Query performance acceptable

---

## Critical Path & Dependencies

```
EPIC-01 (complete) → 2.4.1 (Solana utils) → 2.2.4, 2.3.2 (Blockchain routes)
                  ↓
            2.1.1 (PostgreSQL) → 2.1.2 (Schema) → 2.1.3 (Connection)
                                                ↓
                                           2.2.1 (DB client) → 2.2.2 → 2.2.3 → 2.2.4
                                                            ↓
                                                       2.3.1 → 2.3.2
                                                            ↓
                                                       2.5.1 (Optimization)
```

**Critical Path:** EPIC-01 → 2.4.1 → 2.1.1 → 2.1.2 → 2.1.3 → 2.2.1 → 2.2.2 → 2.2.3 → 2.2.4 → 2.3.1 → 2.3.2 = **~5.5 hours**

---

## Risk Register

| Risk ID | Description | Impact | Probability | Mitigation | Owner |
|---------|-------------|--------|-------------|------------|-------|
| R6 | PostgreSQL installation fails on macOS | 🟡 Medium | Low | Use Postgres.app as fallback | RECTOR |
| R7 | PDA derivation mismatch (TS ↔ Rust) | 🔴 High | Medium | Unit test PDA helpers, compare Explorer | RECTOR |
| R8 | Database connection pool exhaustion | 🟡 Medium | Low | Monitor pool size, add logging | RECTOR |
| R9 | Anchor IDL format incompatible | 🟡 Medium | Low | Check IDL version, use JSON format | RECTOR |

---

## Blockers & Issues

| Blocker ID | Description | Story | Severity | Status | Resolution | Date |
|------------|-------------|-------|----------|--------|------------|------|
| B1 | Epic 2 blocked until EPIC-01 completes | All | 🔴 High | Active | Awaiting Epic 1 delivery | 2025-10-26 |

---

## Handoff to Epic 3

**Prerequisites for Epic 3 Start:**
- ✅ Database deployed with all tables
- ✅ All API routes functional (7 endpoints)
- ✅ PDA helpers tested and verified
- ✅ Blockchain integration placeholders in place

**Deliverables for Integration:**
1. **API Endpoints:**
   - Projects: POST /api/projects, GET /api/projects, GET /api/projects/[id], POST /api/projects/[id]/publish
   - Milestones: POST /api/milestones, GET /api/milestones, POST /api/milestones/[id]/release
2. **Utilities:**
   - `lib/db.ts` - Database client
   - `lib/solana.ts` - Blockchain utilities
3. **Environment Variables:**
   - DATABASE_URL configured
   - NEXT_PUBLIC_SOLANA_PROGRAM_ID set

**Next Epic Owner:** RECTOR (Epic 3: Admin Ministry Dashboard)

---

**Last Updated:** 2025-10-26
**Next Review:** After Epic 1 completes
