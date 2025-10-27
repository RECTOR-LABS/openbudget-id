# PRD: Epic 6 - Citizen Engagement & Accountability

**Epic ID:** EPIC-06
**Epic Owner:** RECTOR
**Target Timeline:** 3 days (24 hours total)
**Dependencies:** EPIC-04 (requires public dashboard with project detail pages)
**Status:** Not Started

---

## Epic Overview

Transform OpenBudget.ID from passive transparency platform into active civic engagement tool. Enable citizens to ask questions, report issues, follow projects, rate transparency, and hold ministries accountable through crowdsourced oversight.

**Success Criteria:**
- Citizens can comment/ask questions on any milestone or project
- Ministries receive email notifications for new questions and must respond
- Issue reporting system for suspicious spending patterns
- Watchlist feature with email notifications for followed projects
- Community trust scoring (1-5 stars) for project transparency
- Anonymous whistleblower portal with encrypted submissions (optional for MVP)

**Key User Flows:**
1. **Comment on Milestone:** View project detail → Click "Ask Question" on milestone → Submit comment → Ministry receives email
2. **Report Issue:** See suspicious spending → Click "Report Issue" → Describe concern → Flagged for review
3. **Follow Project:** Browse projects → Click "Follow" → Receive email when milestone released
4. **Rate Transparency:** View completed project → Rate 1-5 stars → See average community score
5. **Submit Tip:** Witness corruption → Access whistleblower portal → Submit encrypted evidence → Anonymous confirmation

---

## Story 6.1: Public Comments & Questions System

**Story ID:** STORY-6.1
**Priority:** Critical
**Estimated Effort:** 8 hours

### Description
Enable public discourse between citizens and ministries on every project and milestone. Citizens post questions/comments, ministries respond publicly. All interactions logged on-chain for transparency.

### Acceptance Criteria
- [ ] Comment form on project detail page and individual milestones
- [ ] Comments display with author name (from email), timestamp, replies
- [ ] Ministry officials can reply to comments (authenticated via NextAuth)
- [ ] Email notification to ministry when new comment posted
- [ ] Threaded replies (1 level: comment → ministry reply)
- [ ] Comment moderation (flag inappropriate, admin hide/delete)
- [ ] Comments stored in database, critical comments hashed on-chain (optional)
- [ ] Rate limiting (max 5 comments per user per day)

### Tasks

#### Task 6.1.1: Create comments database schema
**File:** `database/schema.sql` (update)
```sql
-- Comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  milestone_id UUID REFERENCES milestones(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  author_email VARCHAR(255) NOT NULL,
  author_name VARCHAR(255) NOT NULL,
  content TEXT NOT NULL CHECK (char_length(content) <= 1000),
  is_ministry_response BOOLEAN DEFAULT FALSE,
  is_flagged BOOLEAN DEFAULT FALSE,
  is_hidden BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_comments_project ON comments(project_id, created_at DESC);
CREATE INDEX idx_comments_milestone ON comments(milestone_id, created_at DESC);
CREATE INDEX idx_comments_parent ON comments(parent_comment_id);
CREATE INDEX idx_comments_flagged ON comments(is_flagged) WHERE is_flagged = TRUE;

-- Prevent spam: max 5 comments per email per day
CREATE INDEX idx_comments_author_date ON comments(author_email, created_at);
```

---

#### Task 6.1.2: Create comment API endpoints
**File:** `frontend/app/api/comments/route.ts` (NEW)
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { sendEmailNotification } from '@/lib/email';
import { getServerSession } from 'next-auth';

// GET /api/comments?project_id=xxx or milestone_id=xxx
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('project_id');
  const milestoneId = searchParams.get('milestone_id');

  if (!projectId && !milestoneId) {
    return NextResponse.json({ error: 'Missing filter' }, { status: 400 });
  }

  const filterField = projectId ? 'project_id' : 'milestone_id';
  const filterId = projectId || milestoneId;

  const result = await query(
    `SELECT c.*,
            COUNT(r.id) as reply_count
     FROM comments c
     LEFT JOIN comments r ON r.parent_comment_id = c.id
     WHERE c.${filterField} = $1
       AND c.parent_comment_id IS NULL
       AND c.is_hidden = FALSE
     GROUP BY c.id
     ORDER BY c.created_at DESC`,
    [filterId]
  );

  return NextResponse.json(result.rows);
}

// POST /api/comments
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { project_id, milestone_id, content, author_email, author_name } = body;

  // Validation
  if (!content || content.length > 1000) {
    return NextResponse.json({ error: 'Invalid content length' }, { status: 400 });
  }

  // Rate limiting: check if user posted > 5 comments today
  const rateLimitCheck = await query(
    `SELECT COUNT(*) as count
     FROM comments
     WHERE author_email = $1
       AND created_at > NOW() - INTERVAL '24 hours'`,
    [author_email]
  );

  if (parseInt(rateLimitCheck.rows[0].count) >= 5) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Max 5 comments per day.' },
      { status: 429 }
    );
  }

  // Insert comment
  const result = await query(
    `INSERT INTO comments (project_id, milestone_id, author_email, author_name, content)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [project_id || null, milestone_id || null, author_email, author_name, content]
  );

  const comment = result.rows[0];

  // Send email notification to ministry
  const projectResult = await query(
    'SELECT title, ministry FROM projects WHERE id = $1',
    [project_id]
  );

  if (projectResult.rows.length > 0) {
    const project = projectResult.rows[0];
    await sendEmailNotification({
      to: 'ministry@example.com', // TODO: get from ministry_accounts
      subject: `New Question on ${project.title}`,
      html: `
        <p>A citizen posted a question on your project:</p>
        <p><strong>${project.title}</strong></p>
        <blockquote>${content}</blockquote>
        <p>From: ${author_name} (${author_email})</p>
        <p><a href="${process.env.NEXTAUTH_URL}/projects/${project_id}">View and respond</a></p>
      `,
    });
  }

  return NextResponse.json(comment, { status: 201 });
}
```

---

#### Task 6.1.3: Create CommentSection component
**File:** `frontend/components/CommentSection.tsx` (NEW)
```typescript
'use client';

import { useState, useEffect } from 'react';
import { formatRelativeTime } from '@/lib/utils';

export default function CommentSection({
  projectId,
  milestoneId
}: {
  projectId?: string;
  milestoneId?: string;
}) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    const params = new URLSearchParams();
    if (projectId) params.append('project_id', projectId);
    if (milestoneId) params.append('milestone_id', milestoneId);

    const res = await fetch(`/api/comments?${params}`);
    const data = await res.json();
    setComments(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: projectId,
          milestone_id: milestoneId,
          author_name: authorName,
          author_email: authorEmail,
          content: newComment,
        }),
      });

      if (res.ok) {
        setNewComment('');
        fetchComments();
      } else {
        const error = await res.json();
        alert(error.error);
      }
    } catch (err) {
      alert('Failed to post comment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Pertanyaan & Komentar
      </h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Nama Anda"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            required
            className="px-4 py-2 border rounded-lg"
          />
          <input
            type="email"
            placeholder="Email Anda"
            value={authorEmail}
            onChange={(e) => setAuthorEmail(e.target.value)}
            required
            className="px-4 py-2 border rounded-lg"
          />
        </div>

        <textarea
          placeholder="Ajukan pertanyaan atau berikan komentar..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          maxLength={1000}
          required
          rows={4}
          className="w-full px-4 py-2 border rounded-lg mb-2"
        />
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {newComment.length}/1000 karakter
          </span>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Mengirim...' : 'Kirim Komentar'}
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Belum ada komentar. Jadilah yang pertama bertanya!
          </p>
        ) : (
          comments.map((comment: any) => (
            <div key={comment.id} className="border-l-4 border-blue-600 pl-4 py-2">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-semibold text-gray-900">
                    {comment.author_name}
                  </span>
                  {comment.is_ministry_response && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      Resmi dari Kementerian
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {formatRelativeTime(comment.created_at)}
                </span>
              </div>
              <p className="text-gray-700">{comment.content}</p>

              {comment.reply_count > 0 && (
                <button className="text-blue-600 text-sm mt-2">
                  Lihat {comment.reply_count} balasan
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
```

---

## Story 6.2: Issue Reporting System

**Story ID:** STORY-6.2
**Priority:** High
**Estimated Effort:** 6 hours

### Description
Allow citizens to flag suspicious spending patterns (e.g., milestone released without proof, budget anomalies, delayed releases). Issues tracked in database and displayed on admin dashboard for ministry review.

### Acceptance Criteria
- [ ] "Report Issue" button on project detail page
- [ ] Issue form with category (budget anomaly, missing proof, delay, other)
- [ ] Issues stored in database with status (open, under review, resolved)
- [ ] Admin dashboard shows flagged issues
- [ ] Ministry can respond to issues publicly
- [ ] Email notification to issue reporter when ministry responds

### Tasks

#### Task 6.2.1: Create issues database schema
**File:** `database/schema.sql` (update)
```sql
CREATE TABLE issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  milestone_id UUID REFERENCES milestones(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL CHECK (category IN ('budget_anomaly', 'missing_proof', 'delay', 'duplicate', 'other')),
  description TEXT NOT NULL,
  reporter_email VARCHAR(255) NOT NULL,
  reporter_name VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'under_review', 'resolved', 'dismissed')),
  ministry_response TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP
);

CREATE INDEX idx_issues_project ON issues(project_id);
CREATE INDEX idx_issues_status ON issues(status);
```

---

#### Task 6.2.2: Create issue API endpoints
**File:** `frontend/app/api/issues/route.ts` (NEW)
```typescript
// Similar pattern to comments API
// GET /api/issues?project_id=xxx&status=open
// POST /api/issues - Create new issue
// PATCH /api/issues/[id] - Update issue status (ministry only)
```

---

#### Task 6.2.3: Create IssueReportModal component
**File:** `frontend/components/IssueReportModal.tsx` (NEW)
```typescript
// Modal with form:
// - Category dropdown
// - Description textarea
// - Reporter name/email
// - Submit button
```

---

## Story 6.3: Project Watchlist & Email Notifications

**Story ID:** STORY-6.3
**Priority:** High
**Estimated Effort:** 6 hours

### Description
Citizens can "follow" projects to receive email alerts when milestones are released or important updates occur. Subscription management via database.

### Acceptance Criteria
- [ ] "Follow Project" button on project detail page
- [ ] Unfollow option for subscribed users
- [ ] Email sent when milestone released (background job or API hook)
- [ ] Manage subscriptions page (view all followed projects)
- [ ] Unsubscribe link in emails

### Tasks

#### Task 6.3.1: Create subscriptions schema
**File:** `database/schema.sql` (update)
```sql
CREATE TABLE project_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(project_id, email)
);

CREATE INDEX idx_subscriptions_project ON project_subscriptions(project_id);
CREATE INDEX idx_subscriptions_email ON project_subscriptions(email);
```

---

#### Task 6.3.2: Create subscription API
**File:** `frontend/app/api/subscriptions/route.ts` (NEW)
```typescript
// POST /api/subscriptions - Subscribe to project
// DELETE /api/subscriptions/[id] - Unsubscribe
// GET /api/subscriptions?email=xxx - Get user's subscriptions
```

---

#### Task 6.3.3: Add email trigger on milestone release
**File:** `frontend/app/api/milestones/[id]/release/route.ts` (update)
```typescript
// After successful milestone release:
// 1. Query project_subscriptions for project_id
// 2. Send email to all active subscribers
// 3. Include milestone details and verification link
```

---

## Story 6.4: Community Trust Score

**Story ID:** STORY-6.4
**Priority:** Medium
**Estimated Effort:** 4 hours

### Description
Citizens rate project transparency (1-5 stars). Average displayed on project cards and detail pages. Helps surface well-managed vs problematic projects.

### Acceptance Criteria
- [ ] Star rating widget on completed projects (status = completed)
- [ ] Average rating displayed on project card
- [ ] Rating breakdown (histogram: 5★, 4★, 3★, 2★, 1★)
- [ ] One rating per email per project (prevent spam)

### Tasks

#### Task 6.4.1: Create ratings schema
**File:** `database/schema.sql` (update)
```sql
CREATE TABLE project_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(project_id, email)
);

CREATE INDEX idx_ratings_project ON project_ratings(project_id);
```

---

#### Task 6.4.2: Create rating API
**File:** `frontend/app/api/ratings/route.ts` (NEW)
```typescript
// POST /api/ratings - Submit rating (upsert: update if exists)
// GET /api/ratings?project_id=xxx - Get average and breakdown
```

---

#### Task 6.4.3: Create RatingWidget component
**File:** `frontend/components/RatingWidget.tsx` (NEW)
```typescript
// Interactive star rating (1-5 stars)
// Display average rating
// Show rating breakdown histogram
```

---

## Technical Dependencies

**Required:**
- EPIC-04 completed (public dashboard with project detail pages)
- Email service configured (Resend or SendGrid)
- NextAuth session management (from Epic 3)
- PostgreSQL with connection pool

**Email Service Setup:**
```bash
npm install resend
```

**Environment Variables:**
```env
RESEND_API_KEY=re_xxxxx
RESEND_FROM_EMAIL=noreply@openbudget.rectorspace.com
```

---

## Definition of Done

- [ ] Citizens can comment on projects/milestones
- [ ] Ministries receive email notifications for comments
- [ ] Issue reporting functional with status tracking
- [ ] Watchlist allows following projects
- [ ] Email notifications sent on milestone releases
- [ ] Trust score displayed on projects
- [ ] All API endpoints tested with curl/Postman
- [ ] Rate limiting prevents spam
- [ ] UI responsive on mobile
- [ ] Ready for Epic 7 (Analytics)
