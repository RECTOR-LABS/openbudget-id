-- 2026-05-25: Add _en columns for bilingual EN/ID support
-- Spec: docs/superpowers/specs/2026-05-25-openbudget-bilingual-en-id-design.md

BEGIN;

-- Add English columns alongside existing Indonesian columns
ALTER TABLE ministry_accounts
  ADD COLUMN IF NOT EXISTS ministry_name_en VARCHAR(255);

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS title_en VARCHAR(255),
  ADD COLUMN IF NOT EXISTS description_en TEXT,
  ADD COLUMN IF NOT EXISTS recipient_name_en VARCHAR(255);

ALTER TABLE milestones
  ADD COLUMN IF NOT EXISTS description_en TEXT;

ALTER TABLE comments
  ADD COLUMN IF NOT EXISTS content_en TEXT;

ALTER TABLE issues
  ADD COLUMN IF NOT EXISTS description_en TEXT;

ALTER TABLE project_ratings
  ADD COLUMN IF NOT EXISTS comment_en TEXT;

-- Rebuild ministry_performance materialized view to project recipient_name_en
DROP MATERIALIZED VIEW IF EXISTS ministry_performance CASCADE;

CREATE MATERIALIZED VIEW ministry_performance AS
SELECT
  p.recipient_name AS ministry,
  MAX(p.recipient_name_en) AS ministry_en,
  COUNT(p.id) AS total_projects,
  COUNT(p.id) FILTER (WHERE p.status = 'completed') AS completed_projects,
  ROUND(
    COUNT(p.id) FILTER (WHERE p.status = 'completed')::numeric / NULLIF(COUNT(p.id), 0) * 100,
    2
  ) AS completion_rate,
  SUM(CAST(p.total_amount AS BIGINT)) AS total_budget,
  SUM(CAST(p.total_released AS BIGINT)) AS total_released,
  ROUND(
    SUM(CAST(p.total_released AS BIGINT))::numeric / NULLIF(SUM(CAST(p.total_amount AS BIGINT)), 0) * 100,
    2
  ) AS budget_accuracy,
  ROUND(AVG(r.rating), 2) AS avg_trust_score,
  COUNT(DISTINCT r.email) AS total_ratings,
  ROUND(
    COUNT(m.id) FILTER (WHERE m.is_released = TRUE)::numeric /
    NULLIF(COUNT(m.id), 0) * 100,
    2
  ) AS release_rate,
  MAX(p.created_at) AS last_project_date
FROM projects p
LEFT JOIN project_ratings r ON r.project_id = p.id
LEFT JOIN milestones m ON m.project_id = p.id
WHERE p.status != 'draft'
GROUP BY p.recipient_name;

CREATE UNIQUE INDEX IF NOT EXISTS idx_ministry_performance_ministry ON ministry_performance(ministry);

REFRESH MATERIALIZED VIEW ministry_performance;

COMMIT;
