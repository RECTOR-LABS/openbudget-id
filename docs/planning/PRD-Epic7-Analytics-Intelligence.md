# PRD: Epic 7 - Advanced Analytics & Intelligence Dashboard

**Epic ID:** EPIC-07
**Epic Owner:** RECTOR
**Target Timeline:** 3-4 days (28 hours total)
**Dependencies:** EPIC-04 (requires historical project data), EPIC-06 (benefits from community ratings)
**Status:** Not Started

---

## Epic Overview

Build sophisticated analytics layer that transforms raw spending data into actionable intelligence. Enable citizens, journalists, and researchers to discover patterns, compare ministries, detect anomalies, and export insights for advocacy work.

**Success Criteria:**
- Interactive analytics dashboard accessible at /analytics
- Ministry performance leaderboard with 5+ metrics
- Visual spending trends (charts: line, bar, pie) using Recharts
- AI-powered anomaly detection flagging suspicious patterns
- Export functionality (PDF reports, CSV data, embeddable widgets)
- Public REST API with rate limiting for researcher access
- Sub-second query performance using materialized views

**Key User Flows:**
1. **Compare Ministries:** Visit analytics → See leaderboard → Sort by on-time delivery → Identify best/worst performers
2. **Analyze Trends:** Select ministry → View spending over time → Identify budget increases/seasonality
3. **Detect Anomalies:** View flagged projects → See AI explanation (e.g., "10x budget jump") → Click to investigate
4. **Export Report:** Select ministry + date range → Click "Generate PDF" → Download transparency report
5. **API Access:** Register for API key → Query `/api/public/projects?ministry=xxx` → Build external dashboard

---

## Story 7.1: Ministry Performance Leaderboard

**Story ID:** STORY-7.1
**Priority:** Critical
**Estimated Effort:** 8 hours

### Description
Rank all ministries by transparency and performance metrics: on-time release rate, budget accuracy, completion rate, community trust score, total spending. Gamification encourages ministries to improve.

### Acceptance Criteria
- [ ] Leaderboard table with sortable columns
- [ ] Metrics calculated from database (not blockchain):
  - On-time Release Rate: % of milestones released before deadline
  - Budget Accuracy: % of (total_released / total_budget)
  - Completion Rate: % of projects with status = 'completed'
  - Avg Trust Score: From community ratings (Story 6.4)
  - Total Spending: Sum of total_released across all projects
- [ ] Color-coded rankings (green = top 25%, yellow = middle 50%, red = bottom 25%)
- [ ] Click ministry → filter to that ministry's projects
- [ ] Leaderboard updates daily (materialized view)

### Tasks

#### Task 7.1.1: Create ministry analytics materialized view
**File:** `database/schema.sql` (update)
```sql
-- Materialized view for performance (refreshed daily via cron)
CREATE MATERIALIZED VIEW ministry_performance AS
SELECT
  p.ministry,
  COUNT(p.id) as total_projects,
  COUNT(p.id) FILTER (WHERE p.status = 'completed') as completed_projects,
  ROUND(
    COUNT(p.id) FILTER (WHERE p.status = 'completed')::numeric / NULLIF(COUNT(p.id), 0) * 100,
    2
  ) as completion_rate,
  SUM(p.total_budget) as total_budget,
  SUM(p.total_released) as total_released,
  ROUND(
    SUM(p.total_released)::numeric / NULLIF(SUM(p.total_budget), 0) * 100,
    2
  ) as budget_accuracy,
  ROUND(AVG(r.rating), 2) as avg_trust_score,
  COUNT(DISTINCT r.email) as total_ratings,
  -- On-time release rate (milestones released before deadline)
  ROUND(
    COUNT(m.id) FILTER (WHERE m.is_released = TRUE AND m.released_at <= m.deadline)::numeric /
    NULLIF(COUNT(m.id) FILTER (WHERE m.is_released = TRUE), 0) * 100,
    2
  ) as ontime_release_rate
FROM projects p
LEFT JOIN project_ratings r ON r.project_id = p.id
LEFT JOIN milestones m ON m.project_id = p.id
WHERE p.status != 'draft'
GROUP BY p.ministry;

CREATE UNIQUE INDEX idx_ministry_performance_ministry ON ministry_performance(ministry);

-- Refresh function
CREATE OR REPLACE FUNCTION refresh_ministry_performance()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY ministry_performance;
END;
$$ LANGUAGE plpgsql;
```

---

#### Task 7.1.2: Create leaderboard API endpoint
**File:** `frontend/app/api/analytics/leaderboard/route.ts` (NEW)
```typescript
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  const result = await query(`
    SELECT
      ministry,
      total_projects,
      completed_projects,
      completion_rate,
      total_budget,
      total_released,
      budget_accuracy,
      avg_trust_score,
      total_ratings,
      ontime_release_rate,
      -- Calculate overall score (weighted average)
      ROUND(
        (COALESCE(completion_rate, 0) * 0.3 +
         COALESCE(budget_accuracy, 0) * 0.25 +
         COALESCE(ontime_release_rate, 0) * 0.25 +
         COALESCE(avg_trust_score, 0) * 20 * 0.2) -- normalize 1-5 to 0-100
      , 2) as overall_score
    FROM ministry_performance
    ORDER BY overall_score DESC
  `);

  return NextResponse.json(result.rows);
}
```

---

#### Task 7.1.3: Create Leaderboard component
**File:** `frontend/app/analytics/page.tsx` (NEW)
```typescript
'use client';

import { useState, useEffect } from 'react';
import { formatRupiah, abbreviateNumber } from '@/lib/utils';

export default function AnalyticsPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [sortBy, setSortBy] = useState('overall_score');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    setLoading(true);
    const res = await fetch('/api/analytics/leaderboard');
    const data = await res.json();
    setLeaderboard(data);
    setLoading(false);
  };

  const sortedLeaderboard = [...leaderboard].sort((a, b) => {
    return (b[sortBy] || 0) - (a[sortBy] || 0);
  });

  const getRankColor = (index: number, total: number) => {
    const percentile = (index + 1) / total;
    if (percentile <= 0.25) return 'bg-green-100 text-green-800'; // Top 25%
    if (percentile <= 0.75) return 'bg-yellow-100 text-yellow-800'; // Middle 50%
    return 'bg-red-100 text-red-800'; // Bottom 25%
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold">Analytics Dashboard</h1>
          <p className="text-xl mt-2">
            Performa & Transparansi Kementerian
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Sorting Controls */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Urutkan berdasarkan:
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="overall_score">Skor Keseluruhan</option>
            <option value="completion_rate">Tingkat Penyelesaian</option>
            <option value="ontime_release_rate">Ketepatan Waktu</option>
            <option value="budget_accuracy">Akurasi Anggaran</option>
            <option value="avg_trust_score">Skor Kepercayaan</option>
            <option value="total_released">Total Realisasi</option>
          </select>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Peringkat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Kementerian
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Skor
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Proyek
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Penyelesaian
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Ketepatan Waktu
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Total Realisasi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Memuat data...
                  </td>
                </tr>
              ) : (
                sortedLeaderboard.map((ministry: any, index: number) => (
                  <tr
                    key={ministry.ministry}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${getRankColor(
                          index,
                          sortedLeaderboard.length
                        )}`}
                      >
                        #{index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {ministry.ministry}
                      </div>
                      <div className="text-sm text-gray-500">
                        {ministry.total_projects} proyek aktif
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {ministry.overall_score}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900">
                      {ministry.completed_projects}/{ministry.total_projects}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          ministry.completion_rate >= 75
                            ? 'bg-green-100 text-green-800'
                            : ministry.completion_rate >= 50
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {ministry.completion_rate}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          ministry.ontime_release_rate >= 80
                            ? 'bg-green-100 text-green-800'
                            : ministry.ontime_release_rate >= 60
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {ministry.ontime_release_rate || 0}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                      Rp {abbreviateNumber(ministry.total_released)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
```

---

## Story 7.2: Spending Trends Visualization

**Story ID:** STORY-7.2
**Priority:** High
**Estimated Effort:** 10 hours

### Description
Interactive charts showing spending patterns over time, budget distribution by ministry, project timelines, and milestone release trends. Built with Recharts for React integration.

### Acceptance Criteria
- [ ] Line chart: spending over time (monthly aggregation)
- [ ] Bar chart: budget by ministry (horizontal bars)
- [ ] Pie chart: sector breakdown (health, education, infrastructure, etc.)
- [ ] Timeline chart: project milestones (Gantt-style)
- [ ] Filter by date range, ministry, status
- [ ] Responsive charts on mobile
- [ ] Export chart as PNG image

### Tasks

#### Task 7.2.1: Install Recharts
**Command:**
```bash
cd frontend && npm install recharts
```

---

#### Task 7.2.2: Create analytics API endpoints
**File:** `frontend/app/api/analytics/trends/route.ts` (NEW)
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/analytics/trends?type=spending&period=monthly&ministry=xxx
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || 'spending';
  const period = searchParams.get('period') || 'monthly';
  const ministry = searchParams.get('ministry');

  if (type === 'spending') {
    // Monthly spending trend
    const result = await query(
      `SELECT
        DATE_TRUNC('month', m.released_at) as month,
        SUM(m.amount) as total_released,
        COUNT(m.id) as milestone_count
       FROM milestones m
       JOIN projects p ON m.project_id = p.id
       WHERE m.is_released = TRUE
         ${ministry ? 'AND p.ministry = $1' : ''}
       GROUP BY DATE_TRUNC('month', m.released_at)
       ORDER BY month ASC`,
      ministry ? [ministry] : []
    );

    return NextResponse.json(result.rows);
  }

  if (type === 'ministry_budget') {
    // Budget by ministry
    const result = await query(`
      SELECT
        ministry,
        SUM(total_budget) as total_budget,
        SUM(total_released) as total_released
      FROM projects
      WHERE status != 'draft'
      GROUP BY ministry
      ORDER BY total_budget DESC
    `);

    return NextResponse.json(result.rows);
  }

  return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
}
```

---

#### Task 7.2.3: Create SpendingTrendsChart component
**File:** `frontend/components/analytics/SpendingTrendsChart.tsx` (NEW)
```typescript
'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatRupiah, formatDate } from '@/lib/utils';

export default function SpendingTrendsChart({ data }: { data: any[] }) {
  const formattedData = data.map((d) => ({
    month: new Date(d.month).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }),
    total_released: d.total_released / 1_000_000_000, // Convert to billions
    milestone_count: d.milestone_count,
  }));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Tren Realisasi Anggaran (Miliar Rupiah)
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip
            formatter={(value: number) => `Rp ${value.toFixed(2)}B`}
            labelStyle={{ color: '#000' }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="total_released"
            stroke="#3b82f6"
            strokeWidth={2}
            name="Total Realisasi"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

---

#### Task 7.2.4: Create MinistryBudgetChart component
**File:** `frontend/components/analytics/MinistryBudgetChart.tsx` (NEW)
```typescript
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { abbreviateNumber } from '@/lib/utils';

export default function MinistryBudgetChart({ data }: { data: any[] }) {
  const formattedData = data.map((d) => ({
    ministry: d.ministry,
    budget: d.total_budget / 1_000_000_000, // Billions
    released: d.total_released / 1_000_000_000,
  }));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Anggaran per Kementerian (Miliar Rupiah)
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={formattedData} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="ministry" type="category" width={150} />
          <Tooltip formatter={(value: number) => `Rp ${value.toFixed(2)}B`} />
          <Legend />
          <Bar dataKey="budget" fill="#3b82f6" name="Total Anggaran" />
          <Bar dataKey="released" fill="#10b981" name="Direalisasikan" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
```

---

## Story 7.3: AI-Powered Anomaly Detection

**Story ID:** STORY-7.3
**Priority:** Medium
**Estimated Effort:** 6 hours

### Description
Use Claude API (or rule-based heuristics) to flag suspicious spending patterns: sudden budget increases, duplicate milestones, releases without proof, off-schedule milestones. Display flagged items on analytics dashboard.

### Acceptance Criteria
- [ ] Anomalies table showing flagged projects/milestones
- [ ] Detection rules:
  - Budget jump > 300% from previous project
  - Milestone released > 30 days late
  - Duplicate milestone descriptions
  - Release without proof_url
- [ ] AI explanation (optional): "This project's budget is 10x higher than similar projects"
- [ ] Click anomaly → navigate to project detail

### Tasks

#### Task 7.3.1: Create anomaly detection utility
**File:** `frontend/lib/anomaly-detection.ts` (NEW)
```typescript
import { query } from './db';

interface Anomaly {
  type: 'budget_jump' | 'late_release' | 'duplicate_milestone' | 'missing_proof';
  severity: 'low' | 'medium' | 'high';
  project_id: string;
  milestone_id?: string;
  description: string;
  detected_at: Date;
}

export async function detectAnomalies(): Promise<Anomaly[]> {
  const anomalies: Anomaly[] = [];

  // 1. Budget jumps (> 300% increase from ministry average)
  const budgetJumps = await query(`
    WITH ministry_avg AS (
      SELECT ministry, AVG(total_budget) as avg_budget
      FROM projects
      WHERE status != 'draft'
      GROUP BY ministry
    )
    SELECT p.id, p.title, p.ministry, p.total_budget, ma.avg_budget
    FROM projects p
    JOIN ministry_avg ma ON p.ministry = ma.ministry
    WHERE p.total_budget > ma.avg_budget * 3
  `);

  budgetJumps.rows.forEach((row) => {
    anomalies.push({
      type: 'budget_jump',
      severity: 'high',
      project_id: row.id,
      description: `Budget Rp${row.total_budget} adalah ${(row.total_budget / row.avg_budget).toFixed(1)}x lebih tinggi dari rata-rata kementerian`,
      detected_at: new Date(),
    });
  });

  // 2. Late releases (> 30 days past deadline)
  const lateReleases = await query(`
    SELECT m.id, m.project_id, m.description, m.released_at, m.deadline,
           EXTRACT(DAY FROM (m.released_at - m.deadline)) as days_late
    FROM milestones m
    WHERE m.is_released = TRUE
      AND m.deadline IS NOT NULL
      AND m.released_at > m.deadline + INTERVAL '30 days'
  `);

  lateReleases.rows.forEach((row) => {
    anomalies.push({
      type: 'late_release',
      severity: 'medium',
      project_id: row.project_id,
      milestone_id: row.id,
      description: `Milestone "${row.description}" terlambat ${row.days_late} hari`,
      detected_at: new Date(),
    });
  });

  // 3. Missing proof
  const missingProof = await query(`
    SELECT m.id, m.project_id, m.description
    FROM milestones m
    WHERE m.is_released = TRUE
      AND (m.proof_url IS NULL OR m.proof_url = '')
  `);

  missingProof.rows.forEach((row) => {
    anomalies.push({
      type: 'missing_proof',
      severity: 'high',
      project_id: row.project_id,
      milestone_id: row.id,
      description: `Milestone "${row.description}" direalisasikan tanpa dokumen bukti`,
      detected_at: new Date(),
    });
  });

  return anomalies;
}
```

---

#### Task 7.3.2: Create anomalies API endpoint
**File:** `frontend/app/api/analytics/anomalies/route.ts` (NEW)
```typescript
import { NextResponse } from 'next/server';
import { detectAnomalies } from '@/lib/anomaly-detection';

export async function GET() {
  const anomalies = await detectAnomalies();
  return NextResponse.json(anomalies);
}
```

---

#### Task 7.3.3: Create AnomaliesTable component
**File:** `frontend/components/analytics/AnomaliesTable.tsx` (NEW)
```typescript
// Table showing detected anomalies
// Columns: Type, Severity, Description, Project Link
// Color-coded severity badges
```

---

## Story 7.4: Export & Share Functionality

**Story ID:** STORY-7.4
**Priority:** Medium
**Estimated Effort:** 4 hours

### Description
Generate PDF transparency reports, export data as CSV, create embeddable widgets for news sites.

### Acceptance Criteria
- [ ] "Export PDF" button generates report with logo, charts, ministry data
- [ ] "Download CSV" exports project/milestone data
- [ ] Embeddable widget (iframe) showing ministry leaderboard
- [ ] Share links with pre-filled filters (e.g., /analytics?ministry=kesehatan)

### Tasks

#### Task 7.4.1: Install PDF generation library
**Command:**
```bash
npm install jspdf jspdf-autotable
```

---

#### Task 7.4.2: Create PDF export utility
**File:** `frontend/lib/pdf-export.ts` (NEW)
```typescript
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function generateMinistryReport(ministry: string, data: any) {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.text('OpenBudget.ID', 14, 20);
  doc.setFontSize(14);
  doc.text(`Laporan Transparansi: ${ministry}`, 14, 30);

  // Table
  autoTable(doc, {
    startY: 40,
    head: [['Metrik', 'Nilai']],
    body: [
      ['Total Proyek', data.total_projects],
      ['Tingkat Penyelesaian', `${data.completion_rate}%`],
      ['Skor Kepercayaan', data.avg_trust_score],
    ],
  });

  doc.save(`${ministry}-report.pdf`);
}
```

---

## Technical Dependencies

**Required:**
- EPIC-04 completed (historical data available)
- Recharts (npm install recharts)
- PostgreSQL materialized views
- Optional: Claude API for advanced anomaly detection (Anthropic SDK)

**Recharts Setup:**
```bash
npm install recharts
```

**Optional AI Enhancement:**
```bash
npm install @anthropic-ai/sdk
```

---

## Definition of Done

- [ ] Ministry leaderboard functional with 5+ metrics
- [ ] Interactive charts (line, bar, pie) rendering correctly
- [ ] Anomaly detection identifies 3+ anomaly types
- [ ] PDF export generates professional reports
- [ ] CSV export downloads project data
- [ ] All queries < 500ms (use materialized views)
- [ ] Analytics dashboard responsive on mobile
- [ ] Ready for production deployment
