import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const startTime = Date.now();

    // Get ministry accounts count
    const ministriesResult = await query(
      'SELECT COUNT(*) as count FROM ministry_accounts'
    );
    const ministriesCount = parseInt(ministriesResult.rows[0].count);

    // Get projects statistics
    const projectsResult = await query(`
      SELECT
        COUNT(*) as total_projects,
        COUNT(*) FILTER (WHERE status = 'published') as published_projects,
        COUNT(*) FILTER (WHERE status = 'draft') as draft_projects,
        COUNT(*) FILTER (WHERE solana_account IS NOT NULL) as on_chain_projects,
        SUM(total_amount) as total_budget,
        SUM(total_allocated) as total_allocated,
        SUM(total_released) as total_released
      FROM projects
    `);
    const projectsStats = projectsResult.rows[0];

    // Get milestones statistics
    const milestonesResult = await query(`
      SELECT
        COUNT(*) as total_milestones,
        COUNT(*) FILTER (WHERE is_released = true) as released_milestones,
        COUNT(*) FILTER (WHERE is_released = false) as pending_milestones,
        SUM(amount) as total_milestone_budget,
        SUM(amount) FILTER (WHERE is_released = true) as released_amount
      FROM milestones
    `);
    const milestonesStats = milestonesResult.rows[0];

    // Get all published projects with blockchain data
    const projectsListResult = await query(`
      SELECT
        id,
        title,
        blockchain_id,
        solana_account,
        creation_tx,
        total_amount,
        total_allocated,
        total_released,
        status
      FROM projects
      WHERE status = 'published'
      ORDER BY created_at DESC
    `);

    // Get all milestones with release data
    const milestonesListResult = await query(`
      SELECT
        m.id,
        m.description,
        m.amount,
        m.is_released,
        m.release_tx,
        m.released_at,
        p.title as project_title,
        p.blockchain_id as project_blockchain_id
      FROM milestones m
      JOIN projects p ON m.project_id = p.id
      WHERE p.status = 'published'
      ORDER BY m.created_at DESC
    `);

    const queryTime = Date.now() - startTime;

    return NextResponse.json({
      database: {
        ministries: {
          total: ministriesCount,
        },
        projects: {
          total: parseInt(projectsStats.total_projects) || 0,
          published: parseInt(projectsStats.published_projects) || 0,
          draft: parseInt(projectsStats.draft_projects) || 0,
          on_chain: parseInt(projectsStats.on_chain_projects) || 0,
          total_budget: projectsStats.total_budget || '0',
          total_allocated: projectsStats.total_allocated || '0',
          total_released: projectsStats.total_released || '0',
        },
        milestones: {
          total: parseInt(milestonesStats.total_milestones) || 0,
          released: parseInt(milestonesStats.released_milestones) || 0,
          pending: parseInt(milestonesStats.pending_milestones) || 0,
          total_budget: milestonesStats.total_milestone_budget || '0',
          released_amount: milestonesStats.released_amount || '0',
        },
        projects_list: projectsListResult.rows,
        milestones_list: milestonesListResult.rows,
        query_time_ms: queryTime,
      },
    });
  } catch (error) {
    console.error('Error fetching system stats:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
