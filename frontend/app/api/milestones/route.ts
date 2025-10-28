import { NextRequest, NextResponse } from 'next/server';
import { query, transaction } from '@/lib/db';
import { requireAuth } from '@/lib/api-auth';

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
 * POST /api/milestones - Create a new milestone
 * Validates that project exists, is published, and budget is not exceeded
 */
export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const auth = await requireAuth();
    if (!auth.authorized) {
      return auth.response;
    }

    const body = await request.json();
    const { project_id, milestone_index, description, amount } = body;

    // Validation
    if (!project_id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    if (milestone_index === undefined || milestone_index === null) {
      return NextResponse.json(
        { error: 'Milestone index is required' },
        { status: 400 }
      );
    }

    if (milestone_index < 0 || milestone_index > 255) {
      return NextResponse.json(
        { error: 'Milestone index must be between 0 and 255' },
        { status: 400 }
      );
    }

    if (!description || description.trim().length === 0) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    // Create milestone in a transaction with budget validation
    const result = await transaction(async (client) => {
      // Fetch project with lock
      const projectResult = await client.query(
        `SELECT * FROM projects WHERE id = $1 FOR UPDATE`,
        [project_id]
      );

      if (projectResult.rows.length === 0) {
        throw new Error('Project not found');
      }

      const project = projectResult.rows[0];

      // Authorization check - user can only add milestones to their ministry's projects
      if (project.ministry_id !== auth.userId) {
        throw new Error('Forbidden - You can only add milestones to your ministry projects');
      }

      // Validate project is published
      if (project.status !== 'published') {
        throw new Error('Project must be published before adding milestones');
      }

      // Calculate new total allocated
      const currentAllocated = BigInt(project.total_allocated || 0);
      const newAmount = BigInt(amount);
      const newTotalAllocated = currentAllocated + newAmount;
      const totalBudget = BigInt(project.total_amount);

      // Validate budget constraint
      if (newTotalAllocated > totalBudget) {
        throw new Error(
          `Budget exceeded: ${newTotalAllocated.toString()} > ${totalBudget.toString()}. ` +
          `Available: ${(totalBudget - currentAllocated).toString()}`
        );
      }

      // Check for duplicate index
      const duplicateCheck = await client.query(
        `SELECT id FROM milestones WHERE project_id = $1 AND index = $2`,
        [project_id, milestone_index]
      );

      if (duplicateCheck.rows.length > 0) {
        throw new Error(`Milestone with index ${milestone_index} already exists for this project`);
      }

      // Insert milestone
      const milestoneResult = await client.query(
        `INSERT INTO milestones (project_id, index, description, amount)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [project_id, milestone_index, description, amount]
      );

      // Update project's total_allocated
      await client.query(
        `UPDATE projects
         SET total_allocated = total_allocated + $1,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $2`,
        [amount, project_id]
      );

      return milestoneResult.rows[0];
    });

    return NextResponse.json(
      {
        message: 'Milestone created successfully',
        milestone: {
          id: result.id,
          project_id: result.project_id,
          index: result.index,
          description: result.description,
          amount: result.amount,
          is_released: result.is_released,
          release_tx: result.release_tx,
          proof_url: result.proof_url,
          released_at: result.released_at,
          created_at: result.created_at,
          updated_at: result.updated_at,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating milestone:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Return more specific error messages
    if (errorMessage.includes('not found')) {
      return NextResponse.json({ error: errorMessage }, { status: 404 });
    }
    if (errorMessage.includes('Budget exceeded') || errorMessage.includes('must be published') || errorMessage.includes('already exists')) {
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * GET /api/milestones - List milestones with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const project_id = searchParams.get('project_id');
    const is_released = searchParams.get('is_released');

    let queryText = `SELECT * FROM milestones`;
    const params: (string | boolean)[] = [];
    const conditions: string[] = [];

    if (project_id) {
      conditions.push(`project_id = $${params.length + 1}`);
      params.push(project_id);
    }

    if (is_released !== null) {
      conditions.push(`is_released = $${params.length + 1}`);
      params.push(is_released === 'true');
    }

    if (conditions.length > 0) {
      queryText += ` WHERE ` + conditions.join(' AND ');
    }

    queryText += ` ORDER BY project_id, index ASC`;

    const result = await query<MilestoneRow>(queryText, params);

    const milestones = result.rows.map((row) => ({
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
      milestones,
      count: milestones.length,
    });
  } catch (error) {
    console.error('Error fetching milestones:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
