import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAuth, requireMinistry } from '@/lib/api-auth';

interface ProjectRow {
  id: string;
  ministry_id: string;
  ministry_name: string;
  title: string;
  description: string | null;
  recipient_name: string;
  recipient_type: string | null;
  total_amount: string;
  total_allocated: string;
  total_released: string;
  status: string;
  blockchain_id: string | null;
  solana_account: string | null;
  creation_tx: string | null;
  created_at: Date;
  updated_at: Date;
  milestone_count_actual: string;
}

/**
 * POST /api/projects - Create a new draft project
 */
export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const auth = await requireAuth();
    if (!auth.authorized) {
      return auth.response;
    }

    const body = await request.json();
    const { title, description, recipient_name, recipient_type, total_amount, ministry_id } = body;

    // Authorization check - user can only create projects for their ministry
    const ministryCheck = requireMinistry(auth.session, ministry_id);
    if (!ministryCheck.authorized) {
      return ministryCheck.response;
    }

    // Validation
    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    if (!recipient_name || recipient_name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Recipient name is required' },
        { status: 400 }
      );
    }

    if (!total_amount || total_amount <= 0) {
      return NextResponse.json(
        { error: 'Total amount must be greater than 0' },
        { status: 400 }
      );
    }

    if (!ministry_id) {
      return NextResponse.json(
        { error: 'Ministry ID is required' },
        { status: 400 }
      );
    }

    // Insert project into database
    const result = await query(
      `INSERT INTO projects
       (ministry_id, title, description, recipient_name, recipient_type, total_amount, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [ministry_id, title, description || null, recipient_name, recipient_type || null, total_amount, 'draft']
    );

    const project = result.rows[0];

    return NextResponse.json(
      {
        message: 'Project created successfully',
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
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/projects - List all projects with optional filters
 * Supports: status, ministry_id, ministry (name), search (title/ministry)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const ministry_id = searchParams.get('ministry_id');
    const ministry = searchParams.get('ministry'); // Filter by ministry name
    const search = searchParams.get('search'); // Search in title or ministry name
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query dynamically based on filters
    let queryText = `
      SELECT
        p.*,
        ma.ministry_name,
        COUNT(m.id) as milestone_count_actual
      FROM projects p
      LEFT JOIN ministry_accounts ma ON p.ministry_id = ma.id
      LEFT JOIN milestones m ON p.id = m.project_id
    `;

    const params: (string | number)[] = [];
    const conditions: string[] = [];

    if (status) {
      conditions.push(`p.status = $${params.length + 1}`);
      params.push(status);
    }

    if (ministry_id) {
      conditions.push(`p.ministry_id = $${params.length + 1}`);
      params.push(ministry_id);
    }

    if (ministry) {
      conditions.push(`ma.ministry_name ILIKE $${params.length + 1}`);
      params.push(`%${ministry}%`);
    }

    if (search) {
      conditions.push(`(p.title ILIKE $${params.length + 1} OR ma.ministry_name ILIKE $${params.length + 1})`);
      params.push(`%${search}%`);
    }

    if (conditions.length > 0) {
      queryText += ` WHERE ` + conditions.join(' AND ');
    }

    queryText += `
      GROUP BY p.id, ma.ministry_name
      ORDER BY p.created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    params.push(limit, offset);

    const result = await query<ProjectRow>(queryText, params);

    // Return flat array for public API (simpler for public homepage)
    const projects = result.rows.map((row) => ({
      id: row.id,
      ministry_id: row.ministry_id,
      ministry: row.ministry_name,
      title: row.title,
      description: row.description,
      recipient_name: row.recipient_name,
      recipient_type: row.recipient_type,
      total_amount: row.total_amount,
      total_allocated: row.total_allocated || '0',
      total_released: row.total_released || '0',
      status: row.status,
      blockchain_id: row.blockchain_id,
      solana_account: row.solana_account,
      creation_tx: row.creation_tx,
      created_at: row.created_at,
      updated_at: row.updated_at,
      milestone_count: parseInt(row.milestone_count_actual) || 0,
    }));

    // Return simple array for public consumption
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
