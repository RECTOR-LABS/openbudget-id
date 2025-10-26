# PRD: Epic 2 - Database & API Integration

**Epic ID:** EPIC-02
**Epic Owner:** RECTOR
**Target Timeline:** Day 1-2 (6 hours)
**Dependencies:** EPIC-01 (requires Program ID and deployed Solana program)
**Status:** Not Started

---

## Epic Overview

Build the off-chain data layer and API bridge that connects PostgreSQL with the Solana blockchain. This hybrid architecture enables fast queries for citizens while maintaining blockchain as the source of truth.

**Success Criteria:**
- PostgreSQL database deployed with complete schema (projects, milestones, users tables)
- Next.js API routes implement full CRUD operations
- API correctly publishes to blockchain and updates DB with transaction references
- Database queries optimized with indexes for public dashboard performance
- Data consistency maintained between DB (draft) → Blockchain (publish) → DB (update with tx refs)

**Critical Workflow:**
```
1. Ministry creates project (POST /api/projects) → DB insert (status=draft)
2. Ministry publishes (POST /api/projects/{id}/publish) → Blockchain tx → DB update (status=published, solana_account, creation_tx)
3. Ministry releases milestone (POST /api/milestones/{id}/release) → Blockchain tx → DB update (release_tx, released_at)
4. Citizen queries projects (GET /api/projects) → DB query (fast) → Returns data + blockchain verification links
```

---

## Story 2.1: Deploy PostgreSQL Database

**Story ID:** STORY-2.1
**Priority:** Critical
**Estimated Effort:** 1 hour

### Description
Deploy PostgreSQL locally, create database, apply schema with all tables, indexes, and constraints. Verify connection from Next.js.

### Acceptance Criteria
- [ ] PostgreSQL installed and running (macOS: Postgres.app or Homebrew)
- [ ] Database `openbudget` created
- [ ] Schema applied from `database/schema.sql` (projects, milestones, users tables)
- [ ] Indexes created on critical query columns
- [ ] Connection verified via `psql` and Next.js
- [ ] Environment variables configured in `frontend/.env.local`

### Tasks

#### Task 2.1.1: Install and initialize PostgreSQL
**Commands (macOS):**
```bash
# Option 1: Homebrew
brew install postgresql@16
brew services start postgresql@16

# Option 2: Postgres.app (download from postgresapp.com)

# Create database
createdb openbudget

# Verify connection
psql -d openbudget -c "SELECT version();"
```
**Acceptance:**
- Database created and accessible
- PostgreSQL service running

---

#### Task 2.1.2: Apply database schema
**Commands:**
```bash
psql -U postgres -d openbudget -f database/schema.sql
```

**Schema Verification:**
```sql
-- Check tables created
\dt

-- Verify indexes
\di

-- Check constraints
SELECT conname, contype FROM pg_constraint WHERE conrelid = 'projects'::regclass;
```

**Acceptance:**
- 3 tables exist: `users`, `projects`, `milestones`
- All indexes created (see schema.sql)
- Foreign key constraints enforced

---

#### Task 2.1.3: Configure Next.js database connection
**File:** `frontend/.env.local`
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/openbudget
```

**Test connection:**
```bash
cd frontend
npm install pg  # If not in package.json
node -e "const { Pool } = require('pg'); const pool = new Pool({ connectionString: process.env.DATABASE_URL }); pool.query('SELECT NOW()', (err, res) => { console.log(err || res.rows); pool.end(); })"
```

**Acceptance:**
- Connection succeeds, returns current timestamp
- No authentication errors

---

## Story 2.2: Create API Routes for Projects

**Story ID:** STORY-2.2
**Priority:** Critical
**Estimated Effort:** 2 hours

### Description
Implement Next.js API routes for project CRUD operations with blockchain publishing integration. These routes serve both admin dashboard and public views.

### Acceptance Criteria
- [ ] `POST /api/projects` - Create draft project (DB only)
- [ ] `GET /api/projects` - List projects (with filters: status, ministry)
- [ ] `GET /api/projects/[id]` - Get project detail with milestones
- [ ] `POST /api/projects/[id]/publish` - Publish to blockchain + update DB
- [ ] All routes return consistent JSON format with proper error handling
- [ ] Solana transaction signatures stored in DB after publish
- [ ] API tested with Postman/curl

### Tasks

#### Task 2.2.1: Setup database client utility
**File:** `frontend/lib/db.ts` (NEW)
```typescript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

export default pool;
```
**Acceptance:**
- File compiles without TypeScript errors
- Query helper logs execution time

---

#### Task 2.2.2: Implement POST /api/projects (create draft)
**File:** `frontend/app/api/projects/route.ts` (NEW)
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { nanoid } from 'nanoid';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, ministry, total_budget, ministry_id } = body;

    // Validation
    if (!title || !ministry || !total_budget) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate unique project ID
    const projectId = `${ministry.toUpperCase().slice(0, 6)}-${new Date().getFullYear()}-${nanoid(6)}`;

    // Insert into DB (status = draft)
    const result = await query(
      `INSERT INTO projects (id, title, ministry, total_budget, ministry_id, status, created_at)
       VALUES ($1, $2, $3, $4, $5, 'draft', NOW())
       RETURNING *`,
      [projectId, title, ministry, total_budget, ministry_id]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    console.error('Create project error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const ministry = searchParams.get('ministry');

    let queryText = 'SELECT * FROM projects WHERE 1=1';
    const params: any[] = [];

    if (status) {
      params.push(status);
      queryText += ` AND status = $${params.length}`;
    }

    if (ministry) {
      params.push(`%${ministry}%`);
      queryText += ` AND ministry ILIKE $${params.length}`;
    }

    queryText += ' ORDER BY created_at DESC';

    const result = await query(queryText, params);
    return NextResponse.json(result.rows);
  } catch (error: any) {
    console.error('List projects error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```
**Acceptance:**
- POST creates draft project in DB
- GET returns filtered projects list
- Both routes tested with curl

---

#### Task 2.2.3: Implement GET /api/projects/[id] (detail view)
**File:** `frontend/app/api/projects/[id]/route.ts` (NEW)
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Fetch project
    const projectResult = await query(
      'SELECT * FROM projects WHERE id = $1',
      [id]
    );

    if (projectResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Fetch milestones
    const milestonesResult = await query(
      'SELECT * FROM milestones WHERE project_id = $1 ORDER BY milestone_index',
      [id]
    );

    const project = projectResult.rows[0];
    project.milestones = milestonesResult.rows;

    return NextResponse.json(project);
  } catch (error: any) {
    console.error('Get project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

#### Task 2.2.4: Implement POST /api/projects/[id]/publish (blockchain integration)
**File:** `frontend/app/api/projects/[id]/publish/route.ts` (NEW)
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
// Import IDL and types

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { walletPublicKey } = body; // From wallet adapter

    // Fetch draft project
    const projectResult = await query(
      'SELECT * FROM projects WHERE id = $1 AND status = $2',
      [id, 'draft']
    );

    if (projectResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Project not found or already published' },
        { status: 404 }
      );
    }

    const project = projectResult.rows[0];

    // Initialize Solana connection
    const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL!);
    // ... setup Anchor program with wallet

    // Derive Project PDA
    const [projectPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('project'), Buffer.from(id)],
      new PublicKey(process.env.NEXT_PUBLIC_SOLANA_PROGRAM_ID!)
    );

    // Call initialize_project instruction
    // const tx = await program.methods
    //   .initializeProject(id, project.title, project.ministry, new BN(project.total_budget))
    //   .accounts({ ... })
    //   .rpc();

    // Placeholder transaction signature for now
    const txSignature = 'PLACEHOLDER_TX_SIG'; // Replace with actual tx after wallet integration

    // Update DB with blockchain references
    await query(
      `UPDATE projects
       SET status = $1, solana_account = $2, creation_tx = $3
       WHERE id = $4`,
      ['published', projectPda.toString(), txSignature, id]
    );

    return NextResponse.json({
      success: true,
      projectId: id,
      solanaAccount: projectPda.toString(),
      transactionSignature: txSignature,
    });
  } catch (error: any) {
    console.error('Publish project error:', error);
    return NextResponse.json(
      { error: 'Blockchain publish failed', details: error.message },
      { status: 500 }
    );
  }
}
```
**Acceptance:**
- Publishes project to Solana (when wallet connected)
- Updates DB with `solana_account` and `creation_tx`
- Returns transaction signature to frontend

---

## Story 2.3: Create API Routes for Milestones

**Story ID:** STORY-2.3
**Priority:** Critical
**Estimated Effort:** 2 hours

### Description
Implement milestone CRUD operations with blockchain release integration. Milestones are initially added as drafts, then released to blockchain with proof documents.

### Acceptance Criteria
- [ ] `POST /api/milestones` - Add milestone to project (DB only)
- [ ] `GET /api/milestones?project_id={id}` - List project milestones
- [ ] `POST /api/milestones/[id]/release` - Release funds to blockchain + update DB
- [ ] Milestone amounts validated against project budget
- [ ] Release transactions stored with proof URLs

### Tasks

#### Task 2.3.1: Implement POST /api/milestones (add milestone)
**File:** `frontend/app/api/milestones/route.ts` (NEW)
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { project_id, milestone_index, description, amount } = body;

    // Validate project exists and is published
    const projectResult = await query(
      'SELECT * FROM projects WHERE id = $1 AND status = $2',
      [project_id, 'published']
    );

    if (projectResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Project not found or not published' },
        { status: 404 }
      );
    }

    const project = projectResult.rows[0];

    // Check budget constraint
    const milestonesResult = await query(
      'SELECT SUM(amount) as total FROM milestones WHERE project_id = $1',
      [project_id]
    );
    const currentTotal = parseInt(milestonesResult.rows[0].total || '0');
    if (currentTotal + amount > project.total_budget) {
      return NextResponse.json(
        { error: 'Milestone amount exceeds remaining budget' },
        { status: 400 }
      );
    }

    // Insert milestone
    const result = await query(
      `INSERT INTO milestones (project_id, milestone_index, description, amount, is_released, created_at)
       VALUES ($1, $2, $3, $4, false, NOW())
       RETURNING *`,
      [project_id, milestone_index, description, amount]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    console.error('Create milestone error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const project_id = searchParams.get('project_id');

    if (!project_id) {
      return NextResponse.json(
        { error: 'project_id required' },
        { status: 400 }
      );
    }

    const result = await query(
      'SELECT * FROM milestones WHERE project_id = $1 ORDER BY milestone_index',
      [project_id]
    );

    return NextResponse.json(result.rows);
  } catch (error: any) {
    console.error('List milestones error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

#### Task 2.3.2: Implement POST /api/milestones/[id]/release
**File:** `frontend/app/api/milestones/[id]/release/route.ts` (NEW)
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Connection, PublicKey } from '@solana/web3.js';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { proof_url } = body;

    // Fetch milestone
    const milestoneResult = await query(
      'SELECT * FROM milestones WHERE id = $1 AND is_released = false',
      [id]
    );

    if (milestoneResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Milestone not found or already released' },
        { status: 404 }
      );
    }

    const milestone = milestoneResult.rows[0];

    // Derive Milestone PDA
    const [milestonePda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('milestone'),
        Buffer.from(milestone.project_id),
        Buffer.from([milestone.milestone_index]),
      ],
      new PublicKey(process.env.NEXT_PUBLIC_SOLANA_PROGRAM_ID!)
    );

    // Call release_funds instruction on Solana
    // const tx = await program.methods
    //   .releaseFunds(milestone.project_id, milestone.milestone_index, proof_url)
    //   .accounts({ ... })
    //   .rpc();

    const txSignature = 'PLACEHOLDER_RELEASE_TX'; // Replace with actual

    // Update DB
    await query(
      `UPDATE milestones
       SET is_released = true, released_at = NOW(), release_tx = $1, proof_url = $2
       WHERE id = $3`,
      [txSignature, proof_url, id]
    );

    return NextResponse.json({
      success: true,
      milestoneId: id,
      transactionSignature: txSignature,
    });
  } catch (error: any) {
    console.error('Release milestone error:', error);
    return NextResponse.json(
      { error: 'Release failed', details: error.message },
      { status: 500 }
    );
  }
}
```

---

## Story 2.4: Implement Blockchain Client Utilities

**Story ID:** STORY-2.4
**Priority:** High
**Estimated Effort:** 1 hour

### Description
Create reusable utilities for interacting with the Solana program from Next.js API routes and frontend components.

### Acceptance Criteria
- [ ] Anchor program client initialized with IDL and Program ID
- [ ] PDA derivation helpers for Project and Milestone
- [ ] Transaction building utilities
- [ ] Error handling for Solana RPC failures
- [ ] Type-safe interfaces from Anchor IDL

### Tasks

#### Task 2.4.1: Create Solana client utility
**File:** `frontend/lib/solana.ts` (NEW)
```typescript
import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import { AnchorProvider, Program, Idl } from '@coral-xyz/anchor';
import idl from '@/idl/openbudget.json';

export const PROGRAM_ID = new PublicKey(process.env.NEXT_PUBLIC_SOLANA_PROGRAM_ID!);
export const RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL!;

export function getConnection(): Connection {
  return new Connection(RPC_URL, 'confirmed');
}

export function getProgram(provider: AnchorProvider): Program {
  return new Program(idl as Idl, PROGRAM_ID, provider);
}

// PDA Helpers
export function getPlatformPda(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('platform')],
    PROGRAM_ID
  );
}

export function getProjectPda(projectId: string): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('project'), Buffer.from(projectId)],
    PROGRAM_ID
  );
}

export function getMilestonePda(projectId: string, index: number): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('milestone'), Buffer.from(projectId), Buffer.from([index])],
    PROGRAM_ID
  );
}

// Explorer link helper
export function getExplorerLink(signature: string, type: 'tx' | 'address' = 'tx'): string {
  const cluster = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';
  const baseUrl = `https://explorer.solana.com/${type}/${signature}`;
  return cluster === 'devnet' ? `${baseUrl}?cluster=devnet` : baseUrl;
}
```

---

## Story 2.5: Database Optimization

**Story ID:** STORY-2.5
**Priority:** Medium
**Estimated Effort:** 30 minutes

### Description
Ensure database performance for public dashboard queries through proper indexing and query optimization.

### Acceptance Criteria
- [ ] Indexes created on frequently queried columns
- [ ] Query execution plans analyzed
- [ ] Slow query logging enabled
- [ ] Connection pooling configured

### Tasks

#### Task 2.5.1: Verify indexes (already in schema.sql)
**Verify these indexes exist:**
```sql
CREATE INDEX idx_projects_ministry ON projects(ministry_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX idx_milestones_project ON milestones(project_id);
```

#### Task 2.5.2: Test query performance
**Commands:**
```sql
EXPLAIN ANALYZE SELECT * FROM projects WHERE status = 'published' ORDER BY created_at DESC LIMIT 20;
EXPLAIN ANALYZE SELECT * FROM milestones WHERE project_id = 'KEMENKES-2025-001';
```
**Acceptance:**
- Queries use indexes (no Seq Scan on large tables)
- Execution time < 10ms for typical queries

---

## Technical Dependencies

**Required:**
- EPIC-01 completed (Program ID available)
- Node.js 18+ with npm
- PostgreSQL 14+
- Next.js 14 project initialized
- `@solana/web3.js`, `@coral-xyz/anchor`, `pg` packages

---

## Definition of Done

- [ ] PostgreSQL database running with complete schema
- [ ] All API routes implemented (projects: 4 endpoints, milestones: 3 endpoints)
- [ ] Blockchain integration placeholders ready for wallet connection
- [ ] Database queries optimized and tested
- [ ] API tested with curl/Postman (200/201 responses)
- [ ] Error handling covers validation and blockchain failures
- [ ] Ready for Epic 3 (Admin Dashboard integration)
