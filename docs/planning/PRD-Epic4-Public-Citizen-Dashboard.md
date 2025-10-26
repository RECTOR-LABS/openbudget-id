# PRD: Epic 4 - Public Citizen Dashboard

**Epic ID:** EPIC-04
**Epic Owner:** RECTOR
**Target Timeline:** Day 3 (4 hours)
**Dependencies:** EPIC-03 (requires published projects with blockchain data)
**Status:** Not Started

---

## Epic Overview

Build the public-facing dashboard where Indonesian citizens browse government projects, verify spending on Solana blockchain, and track milestone releases in real-time. No login required - transparent access for all.

**Success Criteria:**
- Public homepage with project list (filterable by ministry, status)
- Project detail pages showing milestones and spending breakdown
- "Verify on Solana Explorer" links for every blockchain transaction
- Search functionality (by project title, ministry)
- Responsive design with Indonesian localization (optional)
- Fast performance (< 2s page load, leveraging DB indexes)

**Key User Flows:**
1. **Browse Projects:** Visit homepage → See list of published projects → Filter by ministry
2. **View Detail:** Click project → See milestones, budget breakdown, release status
3. **Verify Transaction:** Click "View on Solana Explorer" → Redirect to devnet Explorer → See immutable on-chain proof
4. **Search:** Type ministry name → Filter projects instantly

---

## Story 4.1: Create Public Homepage

**Story ID:** STORY-4.1
**Priority:** Critical
**Estimated Effort:** 2 hours

### Description
Build the landing page that displays all published projects with filtering and search capabilities. Optimized for speed using database queries (not blockchain queries).

### Acceptance Criteria
- [ ] Homepage accessible at http://localhost:3000 (no auth required)
- [ ] Displays all projects with status = 'published'
- [ ] Shows project card with: title, ministry, total budget, released amount, progress bar
- [ ] Filter dropdowns: Ministry, Status (can be combined)
- [ ] Search input (filters by title or ministry name)
- [ ] Pagination (20 projects per page)
- [ ] Responsive grid layout (mobile-friendly)
- [ ] Page load time < 2s for 100 projects

### Tasks

#### Task 4.1.1: Create public homepage component
**File:** `frontend/app/page.tsx`
```typescript
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProjectCard from '@/components/ProjectCard';

export default function HomePage() {
  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState({ ministry: '', search: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, [filters]);

  const fetchProjects = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.ministry) params.append('ministry', filters.ministry);
    if (filters.search) params.append('search', filters.search);
    params.append('status', 'published');

    const res = await fetch(`/api/projects?${params}`);
    const data = await res.json();
    setProjects(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold">OpenBudget.ID</h1>
          <p className="text-xl mt-2">
            Transparansi Anggaran Pemerintah dengan Blockchain
          </p>
        </div>
      </header>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Cari proyek atau kementerian..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="flex-1 px-4 py-2 border rounded-lg"
          />
          <select
            value={filters.ministry}
            onChange={(e) => setFilters({ ...filters, ministry: e.target.value })}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">Semua Kementerian</option>
            <option value="kesehatan">Kementerian Kesehatan</option>
            <option value="pendidikan">Kementerian Pendidikan</option>
            <option value="perhubungan">Kementerian Perhubungan</option>
          </select>
        </div>

        {/* Project Grid */}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}

        {projects.length === 0 && !loading && (
          <div className="text-center text-gray-500 py-12">
            Tidak ada proyek ditemukan
          </div>
        )}
      </div>
    </div>
  );
}
```

---

#### Task 4.1.2: Create ProjectCard component
**File:** `frontend/components/ProjectCard.tsx` (NEW)
```typescript
import Link from 'next/link';

export default function ProjectCard({ project }: { project: any }) {
  const progress = (project.total_released / project.total_budget) * 100;

  return (
    <Link href={`/projects/${project.id}`}>
      <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {project.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4">{project.ministry}</p>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Anggaran:</span>
            <span className="font-semibold">
              Rp {(project.total_budget / 1_000_000).toFixed(1)}M
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Telah Direalisasikan:</span>
            <span className="font-semibold text-green-600">
              Rp {(project.total_released / 1_000_000).toFixed(1)}M
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
            <div
              className="bg-green-600 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 text-right">{progress.toFixed(0)}%</p>
        </div>

        <div className="mt-4 flex items-center text-blue-600 text-sm">
          <span>Lihat Detail</span>
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}
```

---

#### Task 4.1.3: Optimize API route for public queries
**File:** `frontend/app/api/projects/route.ts` (update GET handler)
```typescript
// Add search parameter support
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || 'published';
  const ministry = searchParams.get('ministry');
  const search = searchParams.get('search');

  let queryText = 'SELECT * FROM projects WHERE status = $1';
  const params: any[] = [status];

  if (ministry) {
    params.push(`%${ministry}%`);
    queryText += ` AND ministry ILIKE $${params.length}`;
  }

  if (search) {
    params.push(`%${search}%`);
    queryText += ` AND (title ILIKE $${params.length} OR ministry ILIKE $${params.length})`;
  }

  queryText += ' ORDER BY created_at DESC';

  const result = await query(queryText, params);
  return NextResponse.json(result.rows);
}
```

---

## Story 4.2: Create Project Detail Page

**Story ID:** STORY-4.2
**Priority:** Critical
**Estimated Effort:** 2 hours

### Description
Build individual project pages showing full spending breakdown, milestone timeline, and verification links to Solana Explorer.

### Acceptance Criteria
- [ ] Accessible at /projects/[id] (e.g., /projects/KEMENKES-2025-001)
- [ ] Shows project metadata: title, ministry, total budget, creation date
- [ ] Displays milestone list with: description, amount, release status, release date
- [ ] "View on Solana Explorer" button for:
  - Project creation transaction
  - Each milestone release transaction
- [ ] Visual timeline showing milestone progression
- [ ] Budget breakdown chart (total vs released)
- [ ] 404 page for non-existent projects
- [ ] Back to homepage button

### Tasks

#### Task 4.2.1: Create project detail page
**File:** `frontend/app/projects/[id]/page.tsx` (NEW)
```typescript
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getExplorerLink } from '@/lib/solana';

export default function ProjectDetailPage() {
  const params = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProject();
  }, []);

  const fetchProject = async () => {
    const res = await fetch(`/api/projects/${params.id}`);
    if (res.ok) {
      const data = await res.json();
      setProject(data);
    }
    setLoading(false);
  };

  if (loading) return <div>Loading...</div>;
  if (!project) return <div>Project not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Kembali ke Beranda
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
          <p className="text-gray-600 mt-2">{project.ministry}</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Project Info Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm text-gray-600">Total Anggaran</h3>
              <p className="text-2xl font-bold text-gray-900">
                Rp {(project.total_budget / 1_000_000_000).toFixed(2)}B
              </p>
            </div>
            <div>
              <h3 className="text-sm text-gray-600">Telah Direalisasikan</h3>
              <p className="text-2xl font-bold text-green-600">
                Rp {(project.total_released / 1_000_000_000).toFixed(2)}B
              </p>
            </div>
          </div>

          {/* Blockchain Verification */}
          {project.creation_tx && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700 mb-2">
                Proyek ini tercatat di Solana blockchain
              </p>
              <a
                href={getExplorerLink(project.creation_tx)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Verifikasi di Solana Explorer
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          )}
        </div>

        {/* Milestones */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Milestone Realisasi
          </h2>

          {project.milestones && project.milestones.length > 0 ? (
            <div className="space-y-6">
              {project.milestones.map((milestone: any) => (
                <div
                  key={milestone.id}
                  className="border-l-4 border-blue-600 pl-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {milestone.description}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Jumlah: Rp {(milestone.amount / 1_000_000).toFixed(1)}M
                      </p>
                      {milestone.is_released && milestone.released_at && (
                        <p className="text-sm text-green-600 mt-1">
                          Direalisasikan pada{' '}
                          {new Date(milestone.released_at).toLocaleDateString('id-ID')}
                        </p>
                      )}
                    </div>

                    <div>
                      {milestone.is_released ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          Direalisasikan
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>

                  {milestone.release_tx && (
                    <a
                      href={getExplorerLink(milestone.release_tx)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                    >
                      Verifikasi Transaksi →
                    </a>
                  )}

                  {milestone.proof_url && (
                    <a
                      href={milestone.proof_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:underline text-sm mt-2 ml-4 inline-block"
                    >
                      Lihat Dokumen Bukti →
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Belum ada milestone</p>
          )}
        </div>
      </main>
    </div>
  );
}
```

---

#### Task 4.2.2: Add Indonesian date formatting utility
**File:** `frontend/lib/utils.ts` (NEW or update)
```typescript
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
```

---

## Technical Dependencies

**Required:**
- EPIC-03 completed (sample projects published)
- Next.js 14 App Router
- Tailwind CSS for styling
- At least 2 sample projects with milestones in database

---

## Definition of Done

- [ ] Public homepage accessible without login
- [ ] Project list loads fast (< 2s)
- [ ] Filtering and search work correctly
- [ ] Project detail pages show complete data
- [ ] All Solana Explorer links functional
- [ ] Responsive design tested on mobile
- [ ] Indonesian localization (number/date formatting)
- [ ] Ready for Epic 5 (Deployment)
