import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
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
        release_rate,
        last_project_date,
        -- Calculate overall score (weighted average)
        ROUND(
          (COALESCE(completion_rate, 0) * 0.25 +
           COALESCE(budget_accuracy, 0) * 0.30 +
           COALESCE(release_rate, 0) * 0.25 +
           COALESCE(avg_trust_score, 0) * 20 * 0.20) -- normalize 1-5 to 0-100
        , 2) as overall_score
      FROM ministry_performance
      ORDER BY overall_score DESC
    `);

    return NextResponse.json({
      leaderboard: result.rows,
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('GET /api/analytics/leaderboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard data' },
      { status: 500 }
    );
  }
}
