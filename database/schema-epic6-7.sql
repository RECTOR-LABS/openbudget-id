-- ============================================================================
-- OpenBudget.ID - Database Schema for Epic 6 & 7
-- ============================================================================
-- Epic 6: Citizen Engagement & Accountability
-- Epic 7: Advanced Analytics & Intelligence Dashboard
-- ============================================================================

-- ============================================================================
-- EPIC 6: CITIZEN ENGAGEMENT
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Story 6.1: Public Comments & Questions System
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  milestone_id UUID REFERENCES milestones(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  author_email VARCHAR(255) NOT NULL,
  author_name VARCHAR(255) NOT NULL,
  content TEXT NOT NULL CHECK (char_length(content) >= 1 AND char_length(content) <= 1000),
  is_ministry_response BOOLEAN DEFAULT FALSE,
  is_flagged BOOLEAN DEFAULT FALSE,
  is_hidden BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  -- Ensure either project_id OR milestone_id is set (but not both)
  CONSTRAINT comment_target_check CHECK (
    (project_id IS NOT NULL AND milestone_id IS NULL) OR
    (project_id IS NULL AND milestone_id IS NOT NULL)
  )
);

-- Indexes for comments
CREATE INDEX IF NOT EXISTS idx_comments_project ON comments(project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_milestone ON comments(milestone_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_comments_flagged ON comments(is_flagged) WHERE is_flagged = TRUE;
CREATE INDEX IF NOT EXISTS idx_comments_author_date ON comments(author_email, created_at);

-- ----------------------------------------------------------------------------
-- Story 6.2: Issue Reporting System
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  milestone_id UUID REFERENCES milestones(id) ON DELETE CASCADE,
  reporter_email VARCHAR(255) NOT NULL,
  reporter_name VARCHAR(255) NOT NULL,
  issue_type VARCHAR(50) NOT NULL CHECK (issue_type IN ('budget_mismatch', 'missing_proof', 'delayed_release', 'fraudulent_claim', 'other')),
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL CHECK (char_length(description) >= 10 AND char_length(description) <= 2000),
  severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'dismissed')),
  admin_response TEXT,
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for issues
CREATE INDEX IF NOT EXISTS idx_issues_project ON issues(project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_issues_milestone ON issues(milestone_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_issues_status ON issues(status) WHERE status != 'resolved';
CREATE INDEX IF NOT EXISTS idx_issues_severity ON issues(severity, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_issues_type ON issues(issue_type);

-- ----------------------------------------------------------------------------
-- Story 6.3: Project Watchlist & Email Notifications
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS project_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  notification_frequency VARCHAR(20) DEFAULT 'instant' CHECK (notification_frequency IN ('instant', 'daily', 'weekly')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  -- One subscription per email per project
  UNIQUE (project_id, email)
);

-- Indexes for subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_project ON project_subscriptions(project_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_email ON project_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_subscriptions_active ON project_subscriptions(is_active) WHERE is_active = TRUE;

-- ----------------------------------------------------------------------------
-- Story 6.4: Community Trust Score Ratings
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS project_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT CHECK (comment IS NULL OR char_length(comment) <= 500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  -- One rating per email per project
  UNIQUE (project_id, email)
);

-- Indexes for ratings
CREATE INDEX IF NOT EXISTS idx_ratings_project ON project_ratings(project_id);
CREATE INDEX IF NOT EXISTS idx_ratings_rating ON project_ratings(rating);
CREATE INDEX IF NOT EXISTS idx_ratings_created ON project_ratings(created_at DESC);

-- ============================================================================
-- EPIC 7: ADVANCED ANALYTICS & INTELLIGENCE
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Story 7.1: Ministry Performance Leaderboard (Materialized View)
-- ----------------------------------------------------------------------------

-- Drop existing materialized view if it exists (for re-creation)
DROP MATERIALIZED VIEW IF EXISTS ministry_performance CASCADE;

-- Create materialized view for ministry analytics
CREATE MATERIALIZED VIEW ministry_performance AS
SELECT
  p.recipient_name as ministry,
  COUNT(p.id) as total_projects,
  COUNT(p.id) FILTER (WHERE p.status = 'completed') as completed_projects,
  ROUND(
    COUNT(p.id) FILTER (WHERE p.status = 'completed')::numeric / NULLIF(COUNT(p.id), 0) * 100,
    2
  ) as completion_rate,
  SUM(CAST(p.total_amount AS BIGINT)) as total_budget,
  SUM(CAST(p.total_released AS BIGINT)) as total_released,
  ROUND(
    SUM(CAST(p.total_released AS BIGINT))::numeric / NULLIF(SUM(CAST(p.total_amount AS BIGINT)), 0) * 100,
    2
  ) as budget_accuracy,
  ROUND(AVG(r.rating), 2) as avg_trust_score,
  COUNT(DISTINCT r.email) as total_ratings,
  -- On-time release rate (milestones released) - simplified without deadline
  ROUND(
    COUNT(m.id) FILTER (WHERE m.is_released = TRUE)::numeric /
    NULLIF(COUNT(m.id), 0) * 100,
    2
  ) as release_rate,
  MAX(p.created_at) as last_project_date
FROM projects p
LEFT JOIN project_ratings r ON r.project_id = p.id
LEFT JOIN milestones m ON m.project_id = p.id
WHERE p.status != 'draft'
GROUP BY p.recipient_name;

-- Create unique index (required for CONCURRENTLY refresh)
CREATE UNIQUE INDEX IF NOT EXISTS idx_ministry_performance_ministry ON ministry_performance(ministry);

-- Create refresh function for daily cron job
CREATE OR REPLACE FUNCTION refresh_ministry_performance()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY ministry_performance;
END;
$$ LANGUAGE plpgsql;

-- Initial population
REFRESH MATERIALIZED VIEW ministry_performance;

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

-- Create generic trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to new tables
DROP TRIGGER IF EXISTS update_comments_updated_at ON comments;
CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_issues_updated_at ON issues;
CREATE TRIGGER update_issues_updated_at
  BEFORE UPDATE ON issues
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON project_subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON project_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ratings_updated_at ON project_ratings;
CREATE TRIGGER update_ratings_updated_at
  BEFORE UPDATE ON project_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify all tables exist
SELECT
  'comments' as table_name, COUNT(*) as row_count FROM comments
UNION ALL
SELECT 'issues', COUNT(*) FROM issues
UNION ALL
SELECT 'project_subscriptions', COUNT(*) FROM project_subscriptions
UNION ALL
SELECT 'project_ratings', COUNT(*) FROM project_ratings;

-- Verify materialized view
SELECT * FROM ministry_performance;

-- ============================================================================
-- NOTES
-- ============================================================================
-- 1. Run this migration: psql -d openbudget -f database/schema-epic6-7.sql
-- 2. Refresh materialized view daily with cron:
--    0 2 * * * psql -d openbudget -c "SELECT refresh_ministry_performance();"
-- 3. Epic 6 tables support all citizen engagement features
-- 4. Epic 7 materialized view provides sub-100ms analytics queries
-- ============================================================================
