import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getLocaleFromRequest } from '@/lib/locale';

export const dynamic = 'force-dynamic';

// GET /api/analytics/projects-leaderboard - Per-project performance rankings
// Locale-aware: `title` and `ministry` fields use English translations when locale=en.
export async function GET(request: NextRequest) {
  try {
    const locale = getLocaleFromRequest(request);

    const result = await query(`
      SELECT
        p.id,
        p.title,
        p.title_en,
        p.recipient_name as ministry,
        p.recipient_name_en as ministry_en,
        p.total_amount as total_budget,
        p.total_released,

        -- Calculate completion rate (milestones)
        COALESCE(
          (SELECT COUNT(*)::FLOAT / NULLIF(COUNT(*), 0) * 100
           FROM milestones m
           WHERE m.project_id = p.id AND m.is_released = true),
          0
        ) as completion_rate,

        -- Calculate budget accuracy (total_released / total_amount * 100)
        CASE
          WHEN CAST(p.total_amount AS BIGINT) > 0 THEN
            ROUND(CAST(p.total_released AS NUMERIC) / CAST(p.total_amount AS NUMERIC) * 100, 2)
          ELSE 0
        END as budget_accuracy,

        -- Get average trust score
        COALESCE(
          (SELECT ROUND(AVG(rating), 2)
           FROM project_ratings pr
           WHERE pr.project_id = p.id),
          NULL
        ) as avg_trust_score,

        -- Get total ratings count
        COALESCE(
          (SELECT COUNT(*)
           FROM project_ratings pr
           WHERE pr.project_id = p.id),
          0
        ) as total_ratings,

        -- Get milestone count
        COALESCE(
          (SELECT COUNT(*)
           FROM milestones m
           WHERE m.project_id = p.id),
          0
        ) as total_milestones,

        -- Get released milestone count
        COALESCE(
          (SELECT COUNT(*)
           FROM milestones m
           WHERE m.project_id = p.id AND m.is_released = true),
          0
        ) as released_milestones,

        -- Calculate overall score (weighted average)
        ROUND(
          CAST((COALESCE(
            (SELECT COUNT(*)::FLOAT / NULLIF(COUNT(*), 0) * 100
             FROM milestones m
             WHERE m.project_id = p.id AND m.is_released = true),
            0
          ) * 0.25 +
          CASE
            WHEN CAST(p.total_amount AS BIGINT) > 0 THEN
              (CAST(p.total_released AS NUMERIC) / CAST(p.total_amount AS NUMERIC) * 100)
            ELSE 0
          END * 0.30 +
          CASE
            WHEN CAST(p.total_amount AS BIGINT) > 0 THEN
              (CAST(p.total_released AS NUMERIC) / CAST(p.total_amount AS NUMERIC) * 100)
            ELSE 0
          END * 0.25 +
          COALESCE(
            (SELECT AVG(rating) * 20  -- normalize 1-5 to 0-100
             FROM project_ratings pr
             WHERE pr.project_id = p.id),
            0
          ) * 0.20) AS NUMERIC)
        , 2) as overall_score,

        p.created_at

      FROM projects p
      WHERE p.status = 'published'
      ORDER BY overall_score DESC
      LIMIT 30
    `);

    // Apply locale selection and strip raw _en columns
    const projects = result.rows.map((row: Record<string, unknown>) => ({
      ...row,
      title: locale === 'en'
        ? ((row.title_en as string | null) ?? (row.title as string))
        : (row.title as string),
      ministry: locale === 'en'
        ? ((row.ministry_en as string | null) ?? (row.ministry as string))
        : (row.ministry as string),
      title_en: undefined,
      ministry_en: undefined,
    }));

    return NextResponse.json({
      projects,
    });
  } catch (error) {
    console.error('Error fetching projects leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects leaderboard' },
      { status: 500 }
    );
  }
}
