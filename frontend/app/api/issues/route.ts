import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/issues?project_id=xxx or status=xxx
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('project_id');
    const milestoneId = searchParams.get('milestone_id');
    const status = searchParams.get('status');
    const severity = searchParams.get('severity');

    let sql = `
      SELECT i.*, p.title as project_title, p.recipient_name
      FROM issues i
      JOIN projects p ON i.project_id = p.id
      WHERE 1=1
    `;
    const params: string[] = [];
    let paramIndex = 1;

    if (projectId) {
      sql += ` AND i.project_id = $${paramIndex}`;
      params.push(projectId);
      paramIndex++;
    }

    if (milestoneId) {
      sql += ` AND i.milestone_id = $${paramIndex}`;
      params.push(milestoneId);
      paramIndex++;
    }

    if (status) {
      sql += ` AND i.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (severity) {
      sql += ` AND i.severity = $${paramIndex}`;
      params.push(severity);
      paramIndex++;
    }

    sql += ' ORDER BY i.created_at DESC';

    const result = await query(sql, params);

    return NextResponse.json({ issues: result.rows });
  } catch (error) {
    console.error('GET /api/issues error:', error);
    return NextResponse.json({ error: 'Failed to fetch issues' }, { status: 500 });
  }
}

// POST /api/issues - Report new issue
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      project_id,
      milestone_id,
      reporter_email,
      reporter_name,
      issue_type,
      title,
      description,
      severity,
    } = body;

    // Validation
    if (!project_id || !reporter_email || !reporter_name) {
      return NextResponse.json(
        { error: 'project_id, reporter_email, and reporter_name are required' },
        { status: 400 }
      );
    }

    if (!issue_type || !title || !description) {
      return NextResponse.json(
        { error: 'issue_type, title, and description are required' },
        { status: 400 }
      );
    }

    if (description.length < 10 || description.length > 2000) {
      return NextResponse.json(
        { error: 'Description must be between 10 and 2000 characters' },
        { status: 400 }
      );
    }

    const validIssueTypes = [
      'budget_mismatch',
      'missing_proof',
      'delayed_release',
      'fraudulent_claim',
      'other',
    ];
    if (!validIssueTypes.includes(issue_type)) {
      return NextResponse.json({ error: 'Invalid issue_type' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO issues (
        project_id,
        milestone_id,
        reporter_email,
        reporter_name,
        issue_type,
        title,
        description,
        severity
      )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        project_id,
        milestone_id || null,
        reporter_email,
        reporter_name,
        issue_type,
        title,
        description,
        severity || 'medium',
      ]
    );

    // TODO: Send email notification to ministry
    // await sendEmailNotification(...)

    return NextResponse.json({
      success: true,
      issue: result.rows[0],
      message: 'Issue reported successfully',
    });
  } catch (error) {
    console.error('POST /api/issues error:', error);
    return NextResponse.json({ error: 'Failed to report issue' }, { status: 500 });
  }
}
