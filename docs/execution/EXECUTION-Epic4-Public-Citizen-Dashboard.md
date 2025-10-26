# EXECUTION PLAN: Epic 4 - Public Citizen Dashboard

**Epic ID:** EPIC-04
**Last Updated:** 2025-10-26
**Overall Status:** 🔴 Not Started (Blocked by EPIC-03)
**Completion:** 0% (0/5 tasks completed)

---

## Epic Progress Dashboard

| Story | Status | Progress | Tasks Completed | Estimated | Actual | Blocker |
|-------|--------|----------|-----------------|-----------|--------|---------|
| 4.1: Public Homepage | 🔴 Not Started | 0% | 0/3 | 2h | - | - |
| 4.2: Project Detail Page | 🔴 Not Started | 0% | 0/2 | 2h | - | Needs 4.1 |
| **TOTAL** | 🔴 | **0%** | **0/5** | **4h** | **-** | - |

---

## Prerequisites Check

| Prerequisite | Required From | Status | Notes |
|-------------|---------------|--------|-------|
| Admin dashboard functional | EPIC-03 | 🔴 | Need to publish sample projects |
| 2+ sample projects published | EPIC-03 | 🔴 | With milestones and blockchain tx |
| API routes tested | EPIC-02 | 🔴 | GET endpoints working |
| Solana Explorer links work | EPIC-02 | 🔴 | Test devnet links |

---

## Story 4.1: Public Homepage

**Story Status:** 🔴 Not Started
**Progress:** 0% (0/3 tasks)
**Target Completion:** Day 3, Hour 6

### Task Tracker

| Task ID | Task Name | Status | Assignee | Est | Actual | Dependencies | Notes |
|---------|-----------|--------|----------|-----|--------|--------------|-------|
| 4.1.1 | Create public homepage | 🔴 | RECTOR | 60m | - | None | app/page.tsx |
| 4.1.2 | Create ProjectCard component | 🔴 | RECTOR | 30m | - | 4.1.1 | Reusable card |
| 4.1.3 | Optimize API for public queries | 🔴 | RECTOR | 30m | - | None | Add search param |

### Task Details

#### ✅ **Task 4.1.1: Create homepage**
- **File:** `app/page.tsx`
- **Validation Checklist:**
  - [ ] Visit http://localhost:3000 (no auth required)
  - [ ] Shows published projects only
  - [ ] Filter dropdowns work (ministry)
  - [ ] Search input filters by title/ministry
  - [ ] Responsive grid layout (test mobile)
  - [ ] Loading state displays

---

#### ✅ **Task 4.1.2: ProjectCard component**
- **File:** `components/ProjectCard.tsx`
- **Validation:**
  - [ ] Card shows title, ministry, budget, released, progress bar
  - [ ] Clicking card navigates to /projects/[id]
  - [ ] Rupiah formatting correct (e.g., "Rp 5.0M")
  - [ ] Progress bar width matches calculation

---

#### ✅ **Task 4.1.3: Optimize API**
- **File:** `app/api/projects/route.ts` (update)
- **Validation:**
  - [ ] Test: `curl "http://localhost:3000/api/projects?search=kesehatan"`
  - [ ] Test: `curl "http://localhost:3000/api/projects?ministry=Kementerian%20Kesehatan"`
  - [ ] Query uses indexes (check EXPLAIN ANALYZE)

---

### Story 4.1 Completion Criteria
- [ ] Homepage loads all published projects
- [ ] Filters and search functional
- [ ] Fast performance (< 2s)

---

## Story 4.2: Project Detail Page

**Story Status:** 🔴 Not Started
**Progress:** 0% (0/2 tasks)
**Target Completion:** Day 3, Hour 8

### Task Tracker

| Task ID | Task Name | Status | Assignee | Est | Actual | Dependencies | Notes |
|---------|-----------|--------|----------|-----|--------|--------------|-------|
| 4.2.1 | Create project detail page | 🔴 | RECTOR | 90m | - | 4.1.1 | app/projects/[id]/page.tsx |
| 4.2.2 | Add Indonesian formatting | 🔴 | RECTOR | 30m | - | None | lib/utils.ts |

### Task Details

#### ✅ **Task 4.2.1: Create detail page**
- **File:** `app/projects/[id]/page.tsx`
- **Validation:**
  - [ ] Visit http://localhost:3000/projects/KEMENKES-2025-001
  - [ ] Shows project info (title, ministry, budget)
  - [ ] Displays all milestones with release status
  - [ ] "Verifikasi di Solana Explorer" button works → opens Explorer
  - [ ] Milestone release transaction links work
  - [ ] Back button returns to homepage
  - [ ] 404 for non-existent project

---

#### ✅ **Task 4.2.2: Indonesian formatting**
- **File:** `lib/utils.ts`
- **Validation:**
  - [ ] `formatRupiah(5000000000)` returns "Rp 5.000.000.000"
  - [ ] `formatDate(new Date())` returns "26 Oktober 2025"
  - [ ] Use in ProjectCard and detail page

---

### Story 4.2 Completion Criteria
- [ ] Detail pages show complete data
- [ ] All verification links work
- [ ] Indonesian localization applied

---

## Critical Path

```
4.1.1 (Homepage) → 4.1.2 (Card) → 4.2.1 (Detail page)
       ↓
  4.1.3 (API optimize)
       ↓
  4.2.2 (Formatting)
```

**Critical Path Time:** 4.1.1 (1h) + 4.1.2 (30m) + 4.2.1 (1.5h) + 4.2.2 (30m) = **3.5 hours**

---

## Testing Checklist

### Functional Testing
- [ ] Homepage loads without errors
- [ ] All published projects visible
- [ ] Filters update project list correctly
- [ ] Search finds projects by title and ministry
- [ ] Project cards clickable and navigate correctly
- [ ] Detail page shows project metadata
- [ ] Milestones display with correct status
- [ ] Explorer links open in new tab
- [ ] 404 page for invalid project IDs

### Performance Testing
- [ ] Homepage loads in < 2s (100 projects)
- [ ] Detail page loads in < 1s
- [ ] No unnecessary blockchain queries (all data from DB)
- [ ] Images/assets optimized

### Responsiveness Testing
- [ ] Test on mobile (375px width)
- [ ] Test on tablet (768px width)
- [ ] Test on desktop (1920px width)
- [ ] Navigation menu responsive
- [ ] Cards stack properly on mobile

---

## Risk Register

| Risk ID | Description | Impact | Probability | Mitigation | Owner |
|---------|-------------|--------|-------------|------------|-------|
| R14 | Slow page load if querying blockchain | 🔴 High | Medium | Use DB only, blockchain for verification | RECTOR |
| R15 | Indonesian formatting issues | 🟢 Low | Low | Test with Intl API, fallback to manual | RECTOR |
| R16 | No sample data to display | 🟡 Medium | Medium | Ensure Epic 3 creates 2+ projects | RECTOR |

---

## Blockers & Issues

| Blocker ID | Description | Story | Severity | Status | Resolution | Date |
|------------|-------------|-------|----------|--------|------------|------|
| B3 | Epic 4 blocked until sample projects exist | All | 🔴 High | Active | Need Epic 3 completion | 2025-10-26 |

---

## Handoff to Epic 5

**Prerequisites for Epic 5 Start:**
- ✅ Public dashboard fully functional
- ✅ All verification links tested
- ✅ Sample projects with complete data (title, milestones, transactions)
- ✅ Performance acceptable (< 2s page loads)

**Deliverables:**
1. **Public Homepage:** http://localhost:3000
2. **Project Detail Pages:** http://localhost:3000/projects/[id]
3. **API Endpoints:** All GET routes tested and working
4. **UI Components:** ProjectCard, filters, search

**Next Epic Owner:** RECTOR (Epic 5: Deployment & Demo)

---

**Last Updated:** 2025-10-26
**Next Review:** After Epic 3 sample data created
