import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/watchlist?email=xxx - Get user's watchlist
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Missing email parameter' }, { status: 400 });
    }

    const result = await query(
      `SELECT s.*, p.title, p.recipient_name, p.total_amount, p.total_released, p.status
       FROM project_subscriptions s
       JOIN projects p ON s.project_id = p.id
       WHERE s.email = $1
         AND s.is_active = TRUE
       ORDER BY s.created_at DESC`,
      [email]
    );

    return NextResponse.json({ watchlist: result.rows });
  } catch (error) {
    console.error('GET /api/watchlist error:', error);
    return NextResponse.json({ error: 'Failed to fetch watchlist' }, { status: 500 });
  }
}

// POST /api/watchlist - Add project to watchlist
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { project_id, email, name, notification_frequency } = body;

    if (!project_id || !email || !name) {
      return NextResponse.json(
        { error: 'project_id, email, and name are required' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO project_subscriptions (project_id, email, name, notification_frequency)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (project_id, email)
       DO UPDATE SET
         is_active = TRUE,
         notification_frequency = EXCLUDED.notification_frequency,
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [project_id, email, name, notification_frequency || 'instant']
    );

    return NextResponse.json({
      success: true,
      subscription: result.rows[0],
      message: 'Added to watchlist successfully',
    });
  } catch (error) {
    console.error('POST /api/watchlist error:', error);
    return NextResponse.json({ error: 'Failed to add to watchlist' }, { status: 500 });
  }
}

// DELETE /api/watchlist - Remove project from watchlist
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('project_id');
    const email = searchParams.get('email');

    if (!projectId || !email) {
      return NextResponse.json(
        { error: 'project_id and email are required' },
        { status: 400 }
      );
    }

    await query(
      `UPDATE project_subscriptions
       SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP
       WHERE project_id = $1 AND email = $2`,
      [projectId, email]
    );

    return NextResponse.json({
      success: true,
      message: 'Removed from watchlist successfully',
    });
  } catch (error) {
    console.error('DELETE /api/watchlist error:', error);
    return NextResponse.json({ error: 'Failed to remove from watchlist' }, { status: 500 });
  }
}
