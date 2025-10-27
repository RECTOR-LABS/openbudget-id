# EXECUTION PLAN: Epic 7 - Advanced Analytics & Intelligence Dashboard

**Epic ID:** EPIC-07
**Last Updated:** 2025-10-27
**Overall Status:** ⏳ NOT STARTED
**Completion:** 0% (0/14 tasks completed)

---

## Epic Progress Dashboard

| Story | Status | Progress | Tasks Completed | Estimated | Actual | Variance |
|-------|--------|----------|-----------------|-----------|--------|----------|
| 7.1: Ministry Leaderboard | ⏳ Not Started | 0% | 0/3 | 8h | - | - |
| 7.2: Spending Trends Viz | ⏳ Not Started | 0% | 0/4 | 10h | - | - |
| 7.3: Anomaly Detection | ⏳ Not Started | 0% | 0/3 | 6h | - | - |
| 7.4: Export & Share | ⏳ Not Started | 0% | 0/4 | 4h | - | - |
| **TOTAL** | ⏳ | **0%** | **0/14** | **28h** | **-** | **-** |

---

## Prerequisites Check

| Prerequisite | Required From | Status | Notes |
|-------------|---------------|--------|-------|
| Public dashboard functional | EPIC-04 | ✅ | Homepage and project detail pages working |
| Historical data (2+ projects) | EPIC-03/04 | ✅ | Sample projects with milestones available |
| Community ratings (optional) | EPIC-06 | ⏳ | Can work without, but leaderboard better with ratings |
| PostgreSQL advanced features | EPIC-02 | ✅ | Materialized views support confirmed |
| Recharts library | New | ❌ | Need to install for charts |

---

## Story 7.1: Ministry Performance Leaderboard

**Story Status:** ⏳ Not Started
**Progress:** 0% (0/3 tasks)
**Target Completion:** Day 1 (8 hours)

### Task Tracker

| Task ID | Task Name | Status | Assignee | Est | Actual | Dependencies | Notes |
|---------|-----------|--------|----------|-----|--------|--------------|-------|
| 7.1.1 | Create ministry analytics materialized view | ⏳ | RECTOR | 3h | - | None | SQL + refresh function |
| 7.1.2 | Create leaderboard API endpoint | ⏳ | RECTOR | 2h | - | 7.1.1 | GET /api/analytics/leaderboard |
| 7.1.3 | Create Leaderboard component | ⏳ | RECTOR | 3h | - | 7.1.2 | React table with sorting |

### Task Details

#### ⏳ **Task 7.1.1: Create materialized view** (NOT STARTED)
- **File:** `database/schema.sql` (update)
- **Implementation Steps:**
  1. Create `ministry_performance` materialized view
  2. Calculate 5 metrics per ministry:
     - Completion rate (completed/total)
     - Budget accuracy (released/budget)
     - On-time release rate (released before deadline)
     - Average trust score (from ratings)
     - Total spending (sum of released)
  3. Create unique index on ministry (required for CONCURRENTLY refresh)
  4. Create refresh function for daily cron job
  5. Initial population: `REFRESH MATERIALIZED VIEW ministry_performance;`
- **Validation Checklist:**
  - [ ] Materialized view created successfully
  - [ ] Query `SELECT * FROM ministry_performance` returns data
  - [ ] All 5 metrics calculated correctly
  - [ ] Unique index exists (idx_ministry_performance_ministry)
  - [ ] Refresh function works: `SELECT refresh_ministry_performance();`
  - [ ] Query performance < 50ms (materialized, not real-time)

**SQL Migration:**
```bash
psql -d openbudget -f database/schema.sql

# Test refresh
psql -d openbudget -c "SELECT refresh_ministry_performance();"
psql -d openbudget -c "SELECT * FROM ministry_performance;"
```

**Setup Daily Cron (Production):**
```bash
# Refresh leaderboard daily at 2 AM
0 2 * * * psql -d openbudget -c "SELECT refresh_ministry_performance();"
```

---

#### ⏳ **Task 7.1.2: Create leaderboard API** (NOT STARTED)
- **File:** `app/api/analytics/leaderboard/route.ts` (NEW)
- **Implementation Steps:**
  1. Query ministry_performance materialized view
  2. Calculate overall_score (weighted average of 4 metrics)
  3. Sort by overall_score DESC
  4. Return JSON array of ministry stats
- **Validation Checklist:**
  - [ ] GET /api/analytics/leaderboard returns data
  - [ ] Response includes all metrics (9 fields per ministry)
  - [ ] Sorted by overall_score (highest first)
  - [ ] Response time < 100ms (materialized view)
  - [ ] CORS headers allow public access

**Testing:**
```bash
curl http://localhost:3000/api/analytics/leaderboard | jq

# Expected response:
# [
#   {
#     "ministry": "Kementerian Kesehatan",
#     "total_projects": 5,
#     "completed_projects": 3,
#     "completion_rate": 60.00,
#     "total_budget": 5000000000,
#     "total_released": 3000000000,
#     "budget_accuracy": 60.00,
#     "avg_trust_score": 4.2,
#     "total_ratings": 15,
#     "ontime_release_rate": 75.00,
#     "overall_score": 68.50
#   },
#   ...
# ]
```

---

#### ⏳ **Task 7.1.3: Create Leaderboard component** (NOT STARTED)
- **File:** `app/analytics/page.tsx` (NEW)
- **Implementation Steps:**
  1. Create /analytics route
  2. Fetch leaderboard data from API
  3. Render sortable table with 7 columns
  4. Color-code rankings (green/yellow/red badges)
  5. Add sorting dropdown (8 options)
  6. Responsive design (horizontal scroll on mobile)
- **Validation Checklist:**
  - [ ] Visit http://localhost:3000/analytics
  - [ ] Leaderboard table displays all ministries
  - [ ] Click ministry name → navigates to filtered project list
  - [ ] Sorting dropdown changes order
  - [ ] Color-coded badges display correctly:
    - Green: top 25%
    - Yellow: middle 50%
    - Red: bottom 25%
  - [ ] Responsive on mobile (table scrolls horizontally)
  - [ ] Loading state shows while fetching
  - [ ] Empty state if no data

**Navigation:**
```typescript
// Add to app/page.tsx header
<Link href="/analytics" className="text-white hover:underline">
  Analytics
</Link>
```

---

### Story 7.1 Completion Criteria
- [ ] Leaderboard displays all ministries
- [ ] 5 metrics calculated accurately
- [ ] Sortable by any metric
- [ ] Color-coded performance indicators
- [ ] Query performance < 100ms

---

## Story 7.2: Spending Trends Visualization

**Story Status:** ⏳ Not Started
**Progress:** 0% (0/4 tasks)
**Target Completion:** Day 2-3 (10 hours)

### Task Tracker

| Task ID | Task Name | Status | Assignee | Est | Actual | Dependencies | Notes |
|---------|-----------|--------|----------|-----|--------|--------------|-------|
| 7.2.1 | Install Recharts | ⏳ | RECTOR | 0.5h | - | None | npm install |
| 7.2.2 | Create analytics API endpoints | ⏳ | RECTOR | 3h | - | None | Trends, budget charts |
| 7.2.3 | Create SpendingTrendsChart | ⏳ | RECTOR | 3h | - | 7.2.1, 7.2.2 | Line chart |
| 7.2.4 | Create MinistryBudgetChart | ⏳ | RECTOR | 3.5h | - | 7.2.1, 7.2.2 | Horizontal bar chart |

### Task Details

#### ⏳ **Task 7.2.1: Install Recharts** (NOT STARTED)
- **Command:**
```bash
cd frontend
npm install recharts
npm install --save-dev @types/recharts
```
- **Validation:**
  - [ ] Package installed successfully
  - [ ] Import works: `import { LineChart } from 'recharts';`
  - [ ] No version conflicts

---

#### ⏳ **Task 7.2.2: Create analytics API endpoints** (NOT STARTED)
- **File:** `app/api/analytics/trends/route.ts` (NEW)
- **Endpoints:**
  1. GET /api/analytics/trends?type=spending&period=monthly
     - Returns monthly spending aggregation
  2. GET /api/analytics/trends?type=ministry_budget
     - Returns budget/released by ministry
  3. Optional filters: ministry, date_range
- **Validation:**
  - [ ] Spending endpoint returns monthly data
  - [ ] Ministry budget endpoint returns per-ministry data
  - [ ] Filter by ministry works
  - [ ] Query performance < 200ms (aggregations)

**Testing:**
```bash
# Monthly spending
curl "http://localhost:3000/api/analytics/trends?type=spending&period=monthly" | jq

# Ministry budget
curl "http://localhost:3000/api/analytics/trends?type=ministry_budget" | jq
```

---

#### ⏳ **Task 7.2.3: SpendingTrendsChart** (NOT STARTED)
- **File:** `components/analytics/SpendingTrendsChart.tsx` (NEW)
- **Features:**
  - Line chart showing spending over time
  - X-axis: months
  - Y-axis: rupiah (billions)
  - Tooltip with formatted values
  - Responsive (adjusts to container width)
- **Validation:**
  - [ ] Chart renders on analytics page
  - [ ] Data displays correctly (monthly points)
  - [ ] Hover shows tooltip with rupiah formatting
  - [ ] Responsive (shrinks on mobile)
  - [ ] Colors match brand (blue gradient)

---

#### ⏳ **Task 7.2.4: MinistryBudgetChart** (NOT STARTED)
- **File:** `components/analytics/MinistryBudgetChart.tsx` (NEW)
- **Features:**
  - Horizontal bar chart (better for long ministry names)
  - Two bars per ministry: total budget (blue), released (green)
  - Y-axis: ministry names
  - X-axis: rupiah (billions)
  - Legend showing budget vs released
- **Validation:**
  - [ ] Chart renders on analytics page
  - [ ] Ministry names readable on Y-axis
  - [ ] Two bars per ministry (budget + released)
  - [ ] Tooltip shows exact amounts
  - [ ] Legend displays correctly

---

### Story 7.2 Completion Criteria
- [ ] Line chart shows spending trends over time
- [ ] Bar chart compares ministries
- [ ] All charts responsive on mobile
- [ ] Tooltips display formatted rupiah
- [ ] Charts load in < 2s

---

## Story 7.3: AI-Powered Anomaly Detection

**Story Status:** ⏳ Not Started
**Progress:** 0% (0/3 tasks)
**Target Completion:** Day 3 (6 hours)

### Task Tracker

| Task ID | Task Name | Status | Assignee | Est | Actual | Dependencies | Notes |
|---------|-----------|--------|----------|-----|--------|--------------|-------|
| 7.3.1 | Create anomaly detection utility | ⏳ | RECTOR | 3h | - | None | Rule-based detection |
| 7.3.2 | Create anomalies API endpoint | ⏳ | RECTOR | 1h | - | 7.3.1 | GET /api/analytics/anomalies |
| 7.3.3 | Create AnomaliesTable component | ⏳ | RECTOR | 2h | - | 7.3.2 | React table |

### Task Details

#### ⏳ **Task 7.3.1: Anomaly detection utility** (NOT STARTED)
- **File:** `lib/anomaly-detection.ts` (NEW)
- **Detection Rules:**
  1. **Budget Jump:** > 300% increase from ministry average
  2. **Late Release:** Milestone released > 30 days past deadline
  3. **Missing Proof:** Milestone released without proof_url
  4. **Duplicate Milestone:** Same description in same project
- **Severity Levels:**
  - High: Budget jump, missing proof
  - Medium: Late release, duplicate milestone
  - Low: Minor delays (< 30 days)
- **Validation:**
  - [ ] detectAnomalies() returns array of anomalies
  - [ ] Budget jump detection works (test with outlier project)
  - [ ] Late release detection works (test with old milestone)
  - [ ] Missing proof detection works
  - [ ] Each anomaly has: type, severity, description, project_id

**Testing:**
```typescript
// In Node REPL or test file
import { detectAnomalies } from '@/lib/anomaly-detection';

const anomalies = await detectAnomalies();
console.log(anomalies);
// Expect: array of detected issues
```

---

#### ⏳ **Task 7.3.2: Create anomalies API** (NOT STARTED)
- **File:** `app/api/analytics/anomalies/route.ts` (NEW)
- **Implementation:**
  - Call detectAnomalies() utility
  - Return JSON array of anomalies
  - Optional: cache results (5 min TTL)
- **Validation:**
  - [ ] GET /api/analytics/anomalies returns data
  - [ ] Response time < 500ms (multiple queries)
  - [ ] Anomalies sorted by severity (high → low)

---

#### ⏳ **Task 7.3.3: AnomaliesTable component** (NOT STARTED)
- **File:** `components/analytics/AnomaliesTable.tsx` (NEW)
- **Features:**
  - Table with columns: Type, Severity, Description, Project Link
  - Color-coded severity badges (red, yellow, gray)
  - Click row → navigate to project detail
  - Filter by severity
- **Validation:**
  - [ ] Table renders on analytics page
  - [ ] Anomalies display with correct severity colors
  - [ ] Click anomaly → navigates to project
  - [ ] Empty state if no anomalies detected

---

### Story 7.3 Completion Criteria
- [ ] 4 anomaly types detected
- [ ] Anomalies table displays on analytics page
- [ ] Severity badges color-coded
- [ ] Clicking anomaly navigates to project

---

## Story 7.4: Export & Share Functionality

**Story Status:** ⏳ Not Started
**Progress:** 0% (0/4 tasks)
**Target Completion:** Day 3-4 (4 hours)

### Task Tracker

| Task ID | Task Name | Status | Assignee | Est | Actual | Dependencies | Notes |
|---------|-----------|--------|----------|-----|--------|--------------|-------|
| 7.4.1 | Install PDF libraries | ⏳ | RECTOR | 0.5h | - | None | jspdf + autotable |
| 7.4.2 | Create PDF export utility | ⏳ | RECTOR | 2h | - | 7.4.1 | Generate report |
| 7.4.3 | Create CSV export utility | ⏳ | RECTOR | 1h | - | None | Export project data |
| 7.4.4 | Add export buttons to UI | ⏳ | RECTOR | 0.5h | - | 7.4.2, 7.4.3 | Analytics page |

### Task Details

#### ⏳ **Task 7.4.1: Install PDF libraries** (NOT STARTED)
- **Command:**
```bash
cd frontend
npm install jspdf jspdf-autotable
npm install --save-dev @types/jspdf
```
- **Validation:**
  - [ ] Packages installed
  - [ ] Import works: `import jsPDF from 'jspdf';`

---

#### ⏳ **Task 7.4.2: PDF export utility** (NOT STARTED)
- **File:** `lib/pdf-export.ts` (NEW)
- **Features:**
  - Generate ministry transparency report
  - Include logo, title, ministry name
  - Table with metrics (completion rate, budget, etc.)
  - Download as PDF file
- **Validation:**
  - [ ] Function generates PDF successfully
  - [ ] PDF contains ministry data
  - [ ] Table renders correctly
  - [ ] File downloads on click

---

#### ⏳ **Task 7.4.3: CSV export utility** (NOT STARTED)
- **File:** `lib/csv-export.ts` (NEW)
- **Features:**
  - Export projects as CSV
  - Columns: title, ministry, budget, released, status, creation_tx
  - UTF-8 encoding for Indonesian characters
- **Validation:**
  - [ ] CSV file downloads
  - [ ] Opens correctly in Excel/Google Sheets
  - [ ] Indonesian characters display correctly

---

#### ⏳ **Task 7.4.4: Add export buttons** (NOT STARTED)
- **File:** `app/analytics/page.tsx` (update)
- **Implementation:**
  - "Export PDF" button on leaderboard
  - "Download CSV" button for project data
  - Click triggers download
- **Validation:**
  - [ ] Buttons display on analytics page
  - [ ] PDF export downloads ministry report
  - [ ] CSV export downloads project data
  - [ ] Files open correctly

---

### Story 7.4 Completion Criteria
- [ ] PDF reports generate successfully
- [ ] CSV export functional
- [ ] Export buttons on analytics page
- [ ] Files download with correct names

---

## Critical Path

```
7.1.1 (Materialized View) → 7.1.2 (Leaderboard API) → 7.1.3 (Leaderboard UI)
                                    ↓
              7.2.1 (Install Recharts) → 7.2.2 (Trends API)
                                    ↓
              7.2.3 (Line Chart) + 7.2.4 (Bar Chart)
                                    ↓
              7.3.1 (Anomaly Detection) → 7.3.2 (API) → 7.3.3 (Table)
                                    ↓
              7.4.1 (Install PDF) → 7.4.2 (PDF Export) → 7.4.4 (Buttons)
                                    ↓
              7.4.3 (CSV Export) → 7.4.4 (Buttons)
```

**Critical Path Time:**
- Day 1: 7.1.1 (3h) + 7.1.2 (2h) + 7.1.3 (3h) = 8h
- Day 2: 7.2.1 (0.5h) + 7.2.2 (3h) + 7.2.3 (3h) + 7.2.4 (3.5h) = 10h
- Day 3: 7.3.1 (3h) + 7.3.2 (1h) + 7.3.3 (2h) + 7.4.1 (0.5h) + 7.4.2 (2h) = 8.5h
- Day 4: 7.4.3 (1h) + 7.4.4 (0.5h) + Testing (2h) = 3.5h
- **Total: 30 hours over 3-4 days**

---

## Technical Architecture

### Database Layer
```
PostgreSQL
├── Materialized Views (ministry_performance)
│   └── Refreshed daily via cron
├── Aggregation Queries (spending trends)
│   └── DATE_TRUNC, SUM, COUNT
└── Anomaly Detection Queries
    └── Statistical outliers (AVG, STDDEV)
```

### API Layer
```
Next.js API Routes
├── /api/analytics/leaderboard (materialized view)
├── /api/analytics/trends (aggregations)
├── /api/analytics/anomalies (detection rules)
└── Response time < 500ms (cached)
```

### Frontend Layer
```
React Components
├── Leaderboard (sortable table)
├── Charts (Recharts)
│   ├── LineChart (spending trends)
│   └── BarChart (ministry comparison)
├── AnomaliesTable (flagged issues)
└── Export Buttons (PDF, CSV)
```

---

## Performance Optimization

### Materialized Views
- Refresh daily (not real-time) → fast queries
- CONCURRENTLY refresh → no downtime
- Indexed by ministry → O(1) lookup

### Query Optimization
- Use aggregations (SUM, AVG) not row-by-row
- DATE_TRUNC for monthly grouping
- Limit results (top 20 ministries)

### Caching Strategy
- API responses cached 5 minutes (stale-while-revalidate)
- Materialized view reduces DB load
- Client-side caching with React Query (optional)

---

## Testing Checklist

### Functional Testing
- [ ] Leaderboard displays all ministries
- [ ] Sorting changes order correctly
- [ ] Charts render with real data
- [ ] Anomalies detected and displayed
- [ ] PDF export generates report
- [ ] CSV export downloads data

### Performance Testing
- [ ] Leaderboard query < 100ms
- [ ] Trends query < 200ms
- [ ] Anomaly detection < 500ms
- [ ] Charts render in < 2s
- [ ] Materialized view refresh < 10s

### Responsiveness Testing
- [ ] Leaderboard scrollable on mobile
- [ ] Charts resize on mobile
- [ ] Export buttons accessible on mobile

---

## Risk Register

| Risk ID | Description | Impact | Probability | Mitigation | Status |
|---------|-------------|--------|-------------|------------|--------|
| R21 | Slow aggregation queries | 🔴 High | Medium | Use materialized views, index DATE_TRUNC | ⏳ |
| R22 | Charts don't render on Safari | 🟡 Medium | Low | Test Recharts browser compatibility | ⏳ |
| R23 | PDF generation memory issues | 🟡 Medium | Low | Limit report size, use streaming | ⏳ |
| R24 | Anomaly false positives | 🟢 Low | Medium | Tune detection thresholds, manual review | ⏳ |

---

## Blockers & Issues

| Blocker ID | Description | Story | Severity | Status | Resolution | Date |
|------------|-------------|-------|----------|--------|------------|------|
| B6 | Epic 7 blocked until Epic 4 complete | All | 🔴 High | ✅ Resolved | Epic 4 completed 2025-10-27 | 2025-10-27 |
| B7 | Insufficient data for trends | 7.2 | 🟡 Medium | ⏳ Pending | Need 2+ months historical data | - |
| B8 | Recharts not installed | 7.2 | 🔴 High | ⏳ Pending | npm install recharts | - |

---

## Handoff to Production

**Prerequisites for Deployment:**
- ✅ Epic 7 complete (analytics dashboard functional)
- ✅ All charts rendering correctly
- ✅ Export features tested
- ✅ Performance acceptable (< 500ms queries)

**Deliverables:**
1. Analytics dashboard at /analytics
2. Ministry performance leaderboard
3. Interactive spending charts (line, bar)
4. Anomaly detection table
5. PDF/CSV export functionality

**Production Setup:**
```bash
# Setup daily cron for materialized view refresh
crontab -e
# Add: 0 2 * * * psql -d openbudget -c "SELECT refresh_ministry_performance();"

# Verify Recharts installed
cd frontend && npm install recharts jspdf jspdf-autotable
```

---

**Last Updated:** 2025-10-27
**Status:** NOT STARTED - Ready to begin after Epic 6 completion
