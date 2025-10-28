# OpenBudget.ID Seed Data Usage Guide

## Overview

The `seed.sql` script populates the OpenBudget.ID database with comprehensive demo data for the Garuda Spark hackathon.

## Seed Data Contents

### 📊 Database Entities
- **10 Ministries** with Google OAuth accounts
- **30 Projects** (all published status)
- **129 Milestones** (73 released, 56 pending)

### 💰 Total Budget
- **IDR 2,380,000,000,000** (2.38 Trillion)
- Average per ministry: IDR 238 Billion
- Average per project: IDR 79.3 Billion

### ✅ Milestone Distribution
- **Released:** 73 milestones (56.6%)
- **Pending:** 56 milestones (43.4%)

### 📈 Breakdown by Ministry

| # | Ministry | Budget | Projects | Milestones |
|---|----------|--------|----------|------------|
| 1 | Kemendikbudristek | IDR 150B | 3 | 13 |
| 2 | Kemenkes | IDR 255B | 3 | 13 |
| 3 | PUPR | IDR 355B | 3 | 13 |
| 4 | Kemenhub | IDR 195B | 3 | 12 |
| 5 | Kementan | IDR 130B | 3 | 12 |
| 6 | ESDM | IDR 335B | 3 | 13 |
| 7 | Kemenkeu | IDR 215B | 3 | 13 |
| 8 | Kemendagri | IDR 235B | 3 | 13 |
| 9 | Kemensos | IDR 245B | 3 | 12 |
| 10 | Kominfo | IDR 265B | 3 | 15 |

## Installation

### Prerequisites
- PostgreSQL 17.6+ running
- Database named `openbudget` created
- Schema applied (`database/schema.sql`)

### Apply Seed Data

```bash
# Navigate to project root
cd /Users/rz/local-dev/openbudget-garuda-spark

# Run seed script
psql -d openbudget -f database/seed.sql
```

Expected output:
```
BEGIN
TRUNCATE TABLE
TRUNCATE TABLE
TRUNCATE TABLE
INSERT 0 10
INSERT 0 30
INSERT 0 129
COMMIT
```

### Verify Installation

```sql
-- Check ministry count
SELECT COUNT(*) as ministry_count FROM ministry_accounts;
-- Expected: 10

-- Check projects
SELECT COUNT(*) as project_count, SUM(total_amount) as total_budget
FROM projects;
-- Expected: 30 projects, 2,380,000,000,000 total budget

-- Check milestones
SELECT
    COUNT(*) as total_milestones,
    SUM(CASE WHEN is_released THEN 1 ELSE 0 END) as released,
    SUM(CASE WHEN NOT is_released THEN 1 ELSE 0 END) as pending
FROM milestones;
-- Expected: 129 total, 73 released, 56 pending

-- Verify budget consistency
SELECT
    p.blockchain_id,
    p.title,
    p.total_amount as project_budget,
    p.total_allocated,
    p.total_released,
    SUM(m.amount) as milestones_sum,
    SUM(CASE WHEN m.is_released THEN m.amount ELSE 0 END) as released_sum
FROM projects p
LEFT JOIN milestones m ON p.id = m.project_id
GROUP BY p.id, p.blockchain_id, p.title, p.total_amount, p.total_allocated, p.total_released;
-- All rows should show: total_allocated = milestones_sum, total_released = released_sum
```

## Data Characteristics

### Ministry Accounts
- **google_id:** `mock-ministry-{1-10}@openbudget.demo`
- **email:** `{ministry-slug}@kementerian.go.id`
- **wallet_address:** NULL (can be added later)
- **Fixed UUIDs:** Sequential for easy reference

### Projects
- **blockchain_id:** `PROJ2025001` through `PROJ2025030`
- **status:** All set to `'published'`
- **solana_account:** NULL (demo mode)
- **creation_tx:** NULL (demo mode)
- **created_at:** Realistic dates from Sep 2024 to Feb 2025
- **total_allocated:** Sum of all milestone amounts
- **total_released:** Sum of released milestone amounts

### Milestones
- **index:** 0-based sequential (0, 1, 2, 3, 4)
- **is_released:** TRUE for completed, FALSE for pending
- **release_tx:** NULL (placeholder for real Solana tx signatures)
- **proof_url:** Placeholder format `https://proof.openbudget.id/PROJ2025XXX-MX-*.pdf`
- **released_at:** Realistic dates for released milestones (Sep 2024 - Feb 2025)

## Testing Scenarios

### 1. Public Dashboard Testing
```sql
-- Get all published projects (citizen view)
SELECT p.id, p.blockchain_id, p.title, m.ministry_name, p.total_amount
FROM projects p
JOIN ministry_accounts m ON p.ministry_id = m.id
WHERE p.status = 'published'
ORDER BY p.created_at DESC;
```

### 2. Ministry Dashboard Testing
```sql
-- Login as Kemendikbudristek
SELECT * FROM ministry_accounts WHERE ministry_name = 'Kemendikbudristek';
-- google_id: mock-ministry-1@openbudget.demo

-- Get ministry's projects
SELECT * FROM projects WHERE ministry_id = '11111111-1111-1111-1111-111111111111';
```

### 3. Project Detail Testing
```sql
-- View project with milestones
SELECT
    p.blockchain_id,
    p.title,
    p.total_amount,
    p.total_allocated,
    p.total_released,
    m.index,
    m.description,
    m.amount,
    m.is_released,
    m.released_at,
    m.proof_url
FROM projects p
LEFT JOIN milestones m ON p.id = m.project_id
WHERE p.blockchain_id = 'PROJ2025001'
ORDER BY m.index;
```

### 4. Verification Testing
```sql
-- Projects with blockchain verification
SELECT
    blockchain_id,
    title,
    solana_account,
    creation_tx
FROM projects
WHERE solana_account IS NOT NULL;
-- All NULL in seed data (for demo without blockchain integration)
```

## Customization

### Adding Real Solana Transactions

After deploying projects to blockchain, update with real data:

```sql
-- Update project with Solana account
UPDATE projects
SET
    solana_account = 'ABC123...XYZ',
    creation_tx = '5J7Kx...Signature'
WHERE blockchain_id = 'PROJ2025001';

-- Update milestone with release transaction
UPDATE milestones
SET release_tx = '2Hx9K...ReleaseSig'
WHERE project_id = (SELECT id FROM projects WHERE blockchain_id = 'PROJ2025001')
AND index = 0;
```

### Adding Wallet Addresses

```sql
-- Update ministry wallet address
UPDATE ministry_accounts
SET wallet_address = 'PublicKey123...XYZ'
WHERE ministry_name = 'Kemendikbudristek';
```

## Resetting Data

To completely reset and re-seed:

```bash
# Re-run seed script (includes TRUNCATE)
psql -d openbudget -f database/seed.sql
```

The script automatically:
1. Truncates all tables (with CASCADE)
2. Inserts fresh data
3. Maintains referential integrity

## Notes

- **Date Ranges:** Projects created from Sep 2024 to Feb 2025
- **Release Timeline:** Milestones released from Sep 2024 to Feb 2025
- **Blockchain IDs:** Short format (max 32 chars) for Solana PDA compatibility
- **UUID Format:** Fixed UUIDs for easy reference and testing
- **Production Ready:** Transaction-wrapped (BEGIN/COMMIT) for atomicity

## Demo Accounts

### Ministry Login Mapping

| Ministry | Google ID | Email | Projects |
|----------|-----------|-------|----------|
| Kemendikbudristek | mock-ministry-1@openbudget.demo | kemendikbudristek@kementerian.go.id | PROJ2025001-003 |
| Kemenkes | mock-ministry-2@openbudget.demo | kemenkes@kementerian.go.id | PROJ2025004-006 |
| PUPR | mock-ministry-3@openbudget.demo | pupr@kementerian.go.id | PROJ2025007-009 |
| Kemenhub | mock-ministry-4@openbudget.demo | kemenhub@kementerian.go.id | PROJ2025010-012 |
| Kementan | mock-ministry-5@openbudget.demo | kementan@kementerian.go.id | PROJ2025013-015 |
| ESDM | mock-ministry-6@openbudget.demo | esdm@kementerian.go.id | PROJ2025016-018 |
| Kemenkeu | mock-ministry-7@openbudget.demo | kemenkeu@kementerian.go.id | PROJ2025019-021 |
| Kemendagri | mock-ministry-8@openbudget.demo | kemendagri@kementerian.go.id | PROJ2025022-024 |
| Kemensos | mock-ministry-9@openbudget.demo | kemensos@kementerian.go.id | PROJ2025025-027 |
| Kominfo | mock-ministry-10@openbudget.demo | kominfo@kementerian.go.id | PROJ2025028-030 |

## Source

Generated from: `/database/MOCK-DATA.md`
- **Version:** 1.0
- **Generated:** October 28, 2025
- **For:** OpenBudget.ID Garuda Spark Hackathon Demo

---

**Last Updated:** October 28, 2025
