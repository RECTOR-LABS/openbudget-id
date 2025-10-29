import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await query(`
      SELECT
        p.id,
        p.title,
        p.recipient_name as ministry,
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

    return NextResponse.json({
      projects: result.rows,
    });
  } catch (error) {
    console.error('Error fetching projects leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects leaderboard' },
      { status: 500 }
    );
  }
}
