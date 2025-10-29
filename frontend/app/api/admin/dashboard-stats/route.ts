import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/admin/dashboard-stats - Get ministry-specific dashboard statistics
export async function GET() {
  try {
    // Get authenticated session
    const session = await getServerSession(authOptions);

    console.log('[dashboard-stats] Session check:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      hasUserId: !!session?.user?.id,
      userEmail: session?.user?.email,
    });

    if (!session?.user?.id) {
      console.log('[dashboard-stats] Unauthorized: No session or user ID');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get ministry name from user account
    const userResult = await query(
      'SELECT ministry_name FROM ministry_accounts WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'Ministry account not found' }, { status: 404 });
    }

    const ministryName = userResult.rows[0].ministry_name;

    if (!ministryName) {
      return NextResponse.json({ error: 'Ministry not assigned' }, { status: 400 });
    }

    // 1. Project Statistics
    const projectStatsResult = await query(
      `SELECT
        COUNT(*) as total_projects,
        COUNT(*) FILTER (WHERE status = 'published') as published_projects,
        COUNT(*) FILTER (WHERE status = 'draft') as draft_projects,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_projects,
        ROUND(
          COUNT(*) FILTER (WHERE status = 'completed')::NUMERIC /
          NULLIF(COUNT(*) FILTER (WHERE status = 'published'), 0) * 100,
          2
        ) as completion_rate
      FROM projects
      WHERE recipient_name = $1`,
      [ministryName]
    );

    const projectStats = {
      total_projects: parseInt(projectStatsResult.rows[0].total_projects) || 0,
      published_projects: parseInt(projectStatsResult.rows[0].published_projects) || 0,
      draft_projects: parseInt(projectStatsResult.rows[0].draft_projects) || 0,
      completed_projects: parseInt(projectStatsResult.rows[0].completed_projects) || 0,
      completion_rate: parseFloat(projectStatsResult.rows[0].completion_rate) || 0,
    };

    // 2. Budget Insights
    const budgetResult = await query(
      `SELECT
        COALESCE(SUM(CAST(total_amount AS BIGINT)), 0) as total_allocated,
        COALESCE(SUM(CAST(total_released AS BIGINT)), 0) as total_released,
        ROUND(
          COALESCE(SUM(CAST(total_released AS BIGINT)), 0)::NUMERIC /
          NULLIF(SUM(CAST(total_amount AS BIGINT)), 0) * 100,
          2
        ) as budget_utilization
      FROM projects
      WHERE recipient_name = $1 AND status = 'published'`,
      [ministryName]
    );

    const budgetInsights = {
      total_allocated: budgetResult.rows[0].total_allocated?.toString() || '0',
      total_released: budgetResult.rows[0].total_released?.toString() || '0',
      budget_utilization: parseFloat(budgetResult.rows[0].budget_utilization) || 0,
    };

    // 3. Citizen Engagement
    const engagementResult = await query(
      `SELECT
        COALESCE(AVG(r.rating), 0) as avg_trust_score,
        COUNT(DISTINCT c.id) as total_comments,
        COUNT(DISTINCT s.id) as total_subscribers,
        COUNT(DISTINCT i.id) as total_issues
      FROM projects p
      LEFT JOIN project_ratings r ON r.project_id = p.id
      LEFT JOIN comments c ON c.project_id = p.id
      LEFT JOIN project_subscriptions s ON s.project_id = p.id
      LEFT JOIN issues i ON i.project_id = p.id
      WHERE p.recipient_name = $1 AND p.status = 'published'`,
      [ministryName]
    );

    const citizenEngagement = {
      avg_trust_score: parseFloat(engagementResult.rows[0].avg_trust_score) || 0,
      total_comments: parseInt(engagementResult.rows[0].total_comments) || 0,
      total_subscribers: parseInt(engagementResult.rows[0].total_subscribers) || 0,
      total_issues: parseInt(engagementResult.rows[0].total_issues) || 0,
    };

    // 4. Issue Severity Breakdown
    const issuesBreakdownResult = await query(
      `SELECT
        severity,
        COUNT(*) as count
      FROM issues i
      JOIN projects p ON p.id = i.project_id
      WHERE p.recipient_name = $1
      GROUP BY severity`,
      [ministryName]
    );

    const issuesBreakdown = issuesBreakdownResult.rows.reduce(
      (acc: Record<string, number>, row: Record<string, string>) => {
        acc[row.severity] = parseInt(row.count);
        return acc;
      },
      { low: 0, medium: 0, high: 0, critical: 0 } as Record<string, number>
    );

    // 5. Blockchain Verification Status
    const blockchainStatusResult = await query(
      `SELECT
        COUNT(*) FILTER (WHERE solana_account IS NOT NULL) as verified_count,
        COUNT(*) as total_published
      FROM projects
      WHERE recipient_name = $1 AND status = 'published'`,
      [ministryName]
    );

    const blockchainStatus = {
      verified_count: parseInt(blockchainStatusResult.rows[0].verified_count) || 0,
      total_published: parseInt(blockchainStatusResult.rows[0].total_published) || 0,
      verification_percentage:
        parseInt(blockchainStatusResult.rows[0].total_published) > 0
          ? Math.round(
              (parseInt(blockchainStatusResult.rows[0].verified_count) /
                parseInt(blockchainStatusResult.rows[0].total_published)) *
                100
            )
          : 0,
    };

    return NextResponse.json({
      ministry_name: ministryName,
      project_stats: projectStats,
      budget_insights: budgetInsights,
      citizen_engagement: citizenEngagement,
      issues_breakdown: issuesBreakdown,
      blockchain_status: blockchainStatus,
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('GET /api/admin/dashboard-stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}
