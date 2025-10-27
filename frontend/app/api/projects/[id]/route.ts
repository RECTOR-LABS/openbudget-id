import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface MilestoneRow {
  id: string;
  project_id: string;
  index: number;
  description: string;
  amount: string;
  is_released: boolean;
  release_tx: string | null;
  proof_url: string | null;
  released_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * GET /api/projects/[id] - Get project details with nested milestones
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: 'Invalid project ID format' },
        { status: 400 }
      );
    }

    // Fetch project
    const projectResult = await query(
      `SELECT * FROM projects WHERE id = $1`,
      [id]
    );

    if (projectResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const project = projectResult.rows[0];

    // Fetch associated milestones
    const milestonesResult = await query<MilestoneRow>(
      `SELECT * FROM milestones WHERE project_id = $1 ORDER BY index ASC`,
      [id]
    );

    const milestones = milestonesResult.rows.map((row) => ({
      id: row.id,
      project_id: row.project_id,
      index: row.index,
      description: row.description,
      amount: row.amount,
      is_released: row.is_released,
      release_tx: row.release_tx,
      proof_url: row.proof_url,
      released_at: row.released_at,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));

    return NextResponse.json({
      project: {
        id: project.id,
        ministry_id: project.ministry_id,
        title: project.title,
        description: project.description,
        recipient_name: project.recipient_name,
        recipient_type: project.recipient_type,
        total_amount: project.total_amount,
        total_allocated: project.total_allocated || 0,
        total_released: project.total_released || 0,
        status: project.status,
        solana_account: project.solana_account,
        creation_tx: project.creation_tx,
        created_at: project.created_at,
        updated_at: project.updated_at,
        milestones,
      },
    });
  } catch (error) {
    console.error('Error fetching project details:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
