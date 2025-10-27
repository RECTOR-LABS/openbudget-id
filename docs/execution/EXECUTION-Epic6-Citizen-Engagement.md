# EXECUTION PLAN: Epic 6 - Citizen Engagement & Accountability

**Epic ID:** EPIC-06
**Last Updated:** 2025-10-27
**Overall Status:** ⏳ NOT STARTED
**Completion:** 0% (0/13 tasks completed)

---

## Epic Progress Dashboard

| Story | Status | Progress | Tasks Completed | Estimated | Actual | Variance |
|-------|--------|----------|-----------------|-----------|--------|----------|
| 6.1: Comments & Questions | ⏳ Not Started | 0% | 0/3 | 8h | - | - |
| 6.2: Issue Reporting | ⏳ Not Started | 0% | 0/3 | 6h | - | - |
| 6.3: Watchlist & Notifications | ⏳ Not Started | 0% | 0/3 | 6h | - | - |
| 6.4: Community Trust Score | ⏳ Not Started | 0% | 0/4 | 4h | - | - |
| **TOTAL** | ⏳ | **0%** | **0/13** | **24h** | **-** | **-** |

---

## Prerequisites Check

| Prerequisite | Required From | Status | Notes |
|-------------|---------------|--------|-------|
| Public dashboard functional | EPIC-04 | ✅ | Homepage and project detail pages working |
| NextAuth configured | EPIC-03 | ✅ | Google OAuth for ministry responses |
| Email service (Resend/SendGrid) | New | ❌ | Needs setup for notifications |
| PostgreSQL connection pool | EPIC-02 | ✅ | Database ready for new tables |

---

## Story 6.1: Public Comments & Questions System

**Story Status:** ⏳ Not Started
**Progress:** 0% (0/3 tasks)
**Target Completion:** Day 1 (8 hours)

### Task Tracker

| Task ID | Task Name | Status | Assignee | Est | Actual | Dependencies | Notes |
|---------|-----------|--------|----------|-----|--------|--------------|-------|
| 6.1.1 | Create comments database schema | ⏳ | RECTOR | 2h | - | None | SQL migration |
| 6.1.2 | Create comment API endpoints | ⏳ | RECTOR | 3h | - | 6.1.1 | GET/POST /api/comments |
| 6.1.3 | Create CommentSection component | ⏳ | RECTOR | 3h | - | 6.1.2 | React component |

### Task Details

#### ⏳ **Task 6.1.1: Create comments schema** (NOT STARTED)
- **File:** `database/schema.sql` (update)
- **Implementation Steps:**
  1. Add `comments` table with project_id, milestone_id foreign keys
  2. Support threaded replies (parent_comment_id)
  3. Add moderation fields (is_flagged, is_hidden)
  4. Create indexes for performance (project, milestone, author)
  5. Add rate limiting index (author_email + created_at)
- **Validation Checklist:**
  - [ ] Table created with all columns
  - [ ] Foreign key constraints work (CASCADE on delete)
  - [ ] Indexes created (5 indexes total)
  - [ ] Rate limit check query < 10ms
  - [ ] Test insert/select queries successful

**SQL Migration:**
```bash
psql -d openbudget -f database/schema.sql
```

---

#### ⏳ **Task 6.1.2: Create comment API** (NOT STARTED)
- **File:** `app/api/comments/route.ts` (NEW)
- **Implementation Steps:**
  1. GET endpoint: fetch comments by project_id or milestone_id
  2. POST endpoint: create comment with validation
  3. Rate limiting: check author_email daily limit (5 comments)
  4. Email notification: send to ministry on new comment
  5. Error handling: 400 (bad request), 429 (rate limit)
- **Validation Checklist:**
  - [ ] GET /api/comments?project_id=xxx returns comments
  - [ ] GET /api/comments?milestone_id=xxx returns comments
  - [ ] POST /api/comments creates comment in DB
  - [ ] Rate limit enforced (6th comment rejected)
  - [ ] Email sent to ministry (check logs)
  - [ ] Threaded replies work (parent_comment_id)

**Testing:**
```bash
# Get comments for project
curl http://localhost:3000/api/comments?project_id=xxx

# Post comment
curl -X POST http://localhost:3000/api/comments \
  -H "Content-Type: application/json" \
  -d '{"project_id":"xxx","content":"Test","author_email":"test@test.com","author_name":"Test User"}'
```

---

#### ⏳ **Task 6.1.3: CommentSection component** (NOT STARTED)
- **File:** `components/CommentSection.tsx` (NEW)
- **Implementation Steps:**
  1. Create comment form (name, email, textarea)
  2. Display comments list with timestamps
  3. Show ministry badge for official responses
  4. Add "Reply" button for threaded comments
  5. Integrate into project detail page
- **Validation Checklist:**
  - [ ] Comment form renders on project detail page
  - [ ] Submitting comment adds to database
  - [ ] Comment appears in list after submit
  - [ ] Ministry responses have badge
  - [ ] Rate limit message displays after 5 comments
  - [ ] Character count displays (0/1000)
  - [ ] Empty state shows when no comments

**Integration:**
```typescript
// In app/projects/[id]/page.tsx
import CommentSection from '@/components/CommentSection';

// Add after milestones section:
<CommentSection projectId={project.id} />
```

---

### Story 6.1 Completion Criteria
- [ ] Citizens can post comments on projects
- [ ] Ministries can reply to comments
- [ ] Email notifications sent to ministry
- [ ] Rate limiting prevents spam
- [ ] Comments display in chronological order

---

## Story 6.2: Issue Reporting System

**Story Status:** ⏳ Not Started
**Progress:** 0% (0/3 tasks)
**Target Completion:** Day 1-2 (6 hours)

### Task Tracker

| Task ID | Task Name | Status | Assignee | Est | Actual | Dependencies | Notes |
|---------|-----------|--------|----------|-----|--------|--------------|-------|
| 6.2.1 | Create issues database schema | ⏳ | RECTOR | 1.5h | - | None | SQL migration |
| 6.2.2 | Create issue API endpoints | ⏳ | RECTOR | 2.5h | - | 6.2.1 | GET/POST/PATCH |
| 6.2.3 | Create IssueReportModal | ⏳ | RECTOR | 2h | - | 6.2.2 | React modal |

### Task Details

#### ⏳ **Task 6.2.1: Create issues schema** (NOT STARTED)
- **File:** `database/schema.sql` (update)
- **Validation:**
  - [ ] Table created with category enum
  - [ ] Status field with CHECK constraint
  - [ ] Indexes on project_id and status
  - [ ] Foreign keys cascade on delete

---

#### ⏳ **Task 6.2.2: Create issue API** (NOT STARTED)
- **Files:**
  - `app/api/issues/route.ts` (NEW)
  - `app/api/issues/[id]/route.ts` (NEW)
- **Validation:**
  - [ ] GET /api/issues?project_id=xxx returns issues
  - [ ] POST /api/issues creates issue
  - [ ] PATCH /api/issues/[id] updates status (ministry only)
  - [ ] Email sent to reporter on ministry response

---

#### ⏳ **Task 6.2.3: IssueReportModal** (NOT STARTED)
- **File:** `components/IssueReportModal.tsx` (NEW)
- **Validation:**
  - [ ] Modal opens from "Report Issue" button
  - [ ] Category dropdown with 5 options
  - [ ] Description textarea with validation
  - [ ] Submit creates issue in database
  - [ ] Success message displays

---

### Story 6.2 Completion Criteria
- [ ] Issue reporting functional from project pages
- [ ] Admin dashboard shows flagged issues
- [ ] Ministry can respond to issues
- [ ] Reporter receives email notification

---

## Story 6.3: Project Watchlist & Email Notifications

**Story Status:** ⏳ Not Started
**Progress:** 0% (0/3 tasks)
**Target Completion:** Day 2 (6 hours)

### Task Tracker

| Task ID | Task Name | Status | Assignee | Est | Actual | Dependencies | Notes |
|---------|-----------|--------|----------|-----|--------|--------------|-------|
| 6.3.1 | Create subscriptions schema | ⏳ | RECTOR | 1h | - | None | SQL migration |
| 6.3.2 | Create subscription API | ⏳ | RECTOR | 2h | - | 6.3.1 | GET/POST/DELETE |
| 6.3.3 | Add email trigger on release | ⏳ | RECTOR | 3h | - | 6.3.2, Email setup | Update milestone API |

### Task Details

#### ⏳ **Task 6.3.1: Create subscriptions schema** (NOT STARTED)
- **File:** `database/schema.sql` (update)
- **Validation:**
  - [ ] Table created with UNIQUE(project_id, email)
  - [ ] Indexes on project_id and email
  - [ ] is_active field for soft delete

---

#### ⏳ **Task 6.3.2: Create subscription API** (NOT STARTED)
- **File:** `app/api/subscriptions/route.ts` (NEW)
- **Validation:**
  - [ ] POST /api/subscriptions subscribes to project
  - [ ] DELETE /api/subscriptions/[id] unsubscribes
  - [ ] GET /api/subscriptions?email=xxx lists subscriptions

---

#### ⏳ **Task 6.3.3: Email trigger on release** (NOT STARTED)
- **File:** `app/api/milestones/[id]/release/route.ts` (update)
- **Implementation:**
  1. After successful milestone release
  2. Query project_subscriptions for project_id
  3. Send email to all active subscribers
  4. Include milestone details and verification link
- **Validation:**
  - [ ] Release milestone triggers email send
  - [ ] All subscribers receive email
  - [ ] Email contains project title, milestone, tx link
  - [ ] Unsubscribe link works

---

### Story 6.3 Completion Criteria
- [ ] "Follow Project" button functional
- [ ] Email sent when milestone released
- [ ] Users can manage subscriptions
- [ ] Unsubscribe link in emails works

---

## Story 6.4: Community Trust Score

**Story Status:** ⏳ Not Started
**Progress:** 0% (0/4 tasks)
**Target Completion:** Day 2-3 (4 hours)

### Task Tracker

| Task ID | Task Name | Status | Assignee | Est | Actual | Dependencies | Notes |
|---------|-----------|--------|----------|-----|--------|--------------|-------|
| 6.4.1 | Create ratings schema | ⏳ | RECTOR | 0.5h | - | None | SQL migration |
| 6.4.2 | Create rating API | ⏳ | RECTOR | 1.5h | - | 6.4.1 | GET/POST upsert |
| 6.4.3 | Create RatingWidget component | ⏳ | RECTOR | 1.5h | - | 6.4.2 | Star rating UI |
| 6.4.4 | Update ProjectCard with rating | ⏳ | RECTOR | 0.5h | - | 6.4.3 | Display avg rating |

### Task Details

#### ⏳ **Task 6.4.1: Create ratings schema** (NOT STARTED)
- **File:** `database/schema.sql` (update)
- **Validation:**
  - [ ] Table created with rating CHECK (1-5)
  - [ ] UNIQUE(project_id, email) prevents duplicates
  - [ ] Index on project_id for aggregation

---

#### ⏳ **Task 6.4.2: Create rating API** (NOT STARTED)
- **File:** `app/api/ratings/route.ts` (NEW)
- **Validation:**
  - [ ] POST /api/ratings upserts rating (update if exists)
  - [ ] GET /api/ratings?project_id=xxx returns average
  - [ ] Returns breakdown (5★: 10, 4★: 5, etc.)

---

#### ⏳ **Task 6.4.3: RatingWidget component** (NOT STARTED)
- **File:** `components/RatingWidget.tsx` (NEW)
- **Features:**
  - Interactive star rating (1-5 stars)
  - Display average rating
  - Show rating breakdown histogram
- **Validation:**
  - [ ] Stars clickable (1-5)
  - [ ] Submit rating updates database
  - [ ] Average rating displays
  - [ ] Histogram shows distribution

---

#### ⏳ **Task 6.4.4: Update ProjectCard** (NOT STARTED)
- **File:** `components/ProjectCard.tsx` (update)
- **Changes:**
  - Fetch average rating for each project
  - Display star rating on card
  - Show total ratings count
- **Validation:**
  - [ ] Rating displays on project cards
  - [ ] Only shows for completed projects

---

### Story 6.4 Completion Criteria
- [ ] Citizens can rate projects (1-5 stars)
- [ ] Average rating displays on cards
- [ ] Rating breakdown visible
- [ ] One rating per email per project enforced

---

## Critical Path

```
6.1.1 (Schema) → 6.1.2 (API) → 6.1.3 (Component)
                      ↓
Email Setup (Resend) → 6.3.3 (Email triggers)
                      ↓
6.2.1 (Issues Schema) → 6.2.2 (Issues API) → 6.2.3 (Modal)
                      ↓
6.3.1 (Subscriptions) → 6.3.2 (API) → 6.3.3 (Email)
                      ↓
6.4.1 (Ratings) → 6.4.2 (API) → 6.4.3 (Widget) → 6.4.4 (Update Card)
```

**Critical Path Time:**
- Day 1: Email setup (1h) + Story 6.1 (8h) + Story 6.2 (6h) = 15h
- Day 2: Story 6.3 (6h) + Story 6.4 (4h) = 10h
- **Total: 25 hours over 2-3 days**

---

## Email Service Setup

### Option 1: Resend (Recommended)

**Why Resend:**
- Modern API, easy integration
- Generous free tier (100 emails/day)
- Fast delivery, good deliverability
- React Email templates (optional)

**Setup Steps:**
```bash
# Install
npm install resend

# Get API key
# 1. Sign up at https://resend.com
# 2. Create API key
# 3. Verify domain (optional for production)
```

**Environment Variables:**
```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@openbudget.rectorspace.com
```

**Implementation:**
```typescript
// frontend/lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmailNotification({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to,
      subject,
      html,
    });
    console.log('Email sent:', data);
    return data;
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
}
```

### Option 2: SendGrid (Enterprise Alternative)

**Setup:**
```bash
npm install @sendgrid/mail
```

**Config:**
```typescript
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
```

---

## Testing Checklist

### Functional Testing
- [ ] Post comment on project → appears in list
- [ ] Post 6th comment → rate limit error
- [ ] Ministry replies to comment → badge displays
- [ ] Report issue → appears in admin dashboard
- [ ] Follow project → subscription created
- [ ] Release milestone → subscribers receive email
- [ ] Rate project → average updates on card
- [ ] Rate same project twice → rating updates (not duplicates)

### Email Testing
- [ ] Comment notification sent to ministry
- [ ] Issue response sent to reporter
- [ ] Milestone release sent to subscribers
- [ ] Unsubscribe link works
- [ ] Emails render correctly (HTML/plain text)

### Performance Testing
- [ ] Comment queries < 50ms (with indexes)
- [ ] Rating aggregation < 20ms (AVG query)
- [ ] Email sending async (doesn't block API response)
- [ ] Subscription lookup < 10ms

---

## Risk Register

| Risk ID | Description | Impact | Probability | Mitigation | Status |
|---------|-------------|--------|-------------|------------|--------|
| R17 | Email service rate limits | 🟡 Medium | Medium | Use Resend (100/day free), queue emails for production | ⏳ |
| R18 | Comment spam/abuse | 🟡 Medium | High | Rate limiting (5/day), moderation flags | ⏳ |
| R19 | No ministry responses | 🟢 Low | Medium | Email notifications, admin dashboard alerts | ⏳ |
| R20 | Low community engagement | 🟡 Medium | Medium | Gamification (trust scores), public visibility | ⏳ |

---

## Blockers & Issues

| Blocker ID | Description | Story | Severity | Status | Resolution | Date |
|------------|-------------|-------|----------|--------|------------|------|
| B4 | Epic 6 blocked until Epic 4 complete | All | 🔴 High | ✅ Resolved | Epic 4 completed 2025-10-27 | 2025-10-27 |
| B5 | Email service not configured | 6.1, 6.3 | 🔴 High | ⏳ Pending | Setup Resend account | - |

---

## Handoff to Epic 7

**Prerequisites for Epic 7 Start:**
- ✅ Epic 6 complete (community ratings available for analytics)
- ✅ Sufficient historical data (2+ weeks of comments/ratings)
- ✅ Email notifications functional (for API alerts)

**Deliverables:**
1. Comment system on all projects
2. Issue reporting with admin dashboard
3. Project watchlist with email notifications
4. Community trust scores (1-5 stars)

**Next Epic Owner:** RECTOR (Epic 7: Analytics & Intelligence)

---

**Last Updated:** 2025-10-27
**Status:** NOT STARTED - Ready to begin after Epic 5 deployment
