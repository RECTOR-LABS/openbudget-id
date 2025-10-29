import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/admin/recent-activity?limit=10 - Get ministry's recent activities
export async function GET(req: NextRequest) {
  try {
    // Get authenticated session
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');

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

    // Collect activities from different sources
    const activities: Array<{
      type: string;
      title: string;
      description: string;
      timestamp: string;
      project_id?: string;
      project_title?: string;
      link?: string;
      metadata?: Record<string, unknown>;
    }> = [];

    // 1. Project Published
    const projectsResult = await query(
      `SELECT id, title, created_at, creation_tx
      FROM projects
      WHERE recipient_name = $1 AND status = 'published'
      ORDER BY created_at DESC
      LIMIT $2`,
      [ministryName, limit]
    );

    projectsResult.rows.forEach((row: Record<string, string>) => {
      activities.push({
        type: 'project_published',
        title: 'Proyek Dipublish',
        description: `Proyek "${row.title}" berhasil dipublikasikan ke blockchain`,
        timestamp: row.created_at,
        project_id: row.id,
        project_title: row.title,
        link: `/admin/projects/${row.id}`,
        metadata: {
          transaction: row.creation_tx,
        },
      });
    });

    // 2. Milestones Released
    const milestonesResult = await query(
      `SELECT m.id, m.description, m.released_at, m.release_tx, p.id as project_id, p.title as project_title
      FROM milestones m
      JOIN projects p ON p.id = m.project_id
      WHERE p.recipient_name = $1 AND m.is_released = true
      ORDER BY m.released_at DESC
      LIMIT $2`,
      [ministryName, limit]
    );

    milestonesResult.rows.forEach((row: Record<string, string>) => {
      activities.push({
        type: 'milestone_released',
        title: 'Milestone Dicairkan',
        description: `Milestone "${row.description}" pada proyek "${row.project_title}"`,
        timestamp: row.released_at,
        project_id: row.project_id,
        project_title: row.project_title,
        link: `/admin/projects/${row.project_id}`,
        metadata: {
          transaction: row.release_tx,
        },
      });
    });

    // 3. Comments Received
    const commentsResult = await query(
      `SELECT c.id, c.comment, c.created_at, c.email, p.id as project_id, p.title as project_title
      FROM comments c
      JOIN projects p ON p.id = c.project_id
      WHERE p.recipient_name = $1
      ORDER BY c.created_at DESC
      LIMIT $2`,
      [ministryName, limit]
    );

    commentsResult.rows.forEach((row: Record<string, string>) => {
      activities.push({
        type: 'comment_received',
        title: 'Komentar Baru',
        description: `Komentar dari ${row.email} pada proyek "${row.project_title}"`,
        timestamp: row.created_at,
        project_id: row.project_id,
        project_title: row.project_title,
        link: `/projects/${row.project_id}#comments`,
        metadata: {
          comment: row.comment.substring(0, 100) + (row.comment.length > 100 ? '...' : ''),
        },
      });
    });

    // 4. Issues Reported
    const issuesResult = await query(
      `SELECT i.id, i.description, i.severity, i.created_at, p.id as project_id, p.title as project_title
      FROM issues i
      JOIN projects p ON p.id = i.project_id
      WHERE p.recipient_name = $1
      ORDER BY i.created_at DESC
      LIMIT $2`,
      [ministryName, limit]
    );

    issuesResult.rows.forEach((row: Record<string, string>) => {
      activities.push({
        type: 'issue_reported',
        title: 'Laporan Masalah',
        description: `Masalah ${row.severity} dilaporkan pada proyek "${row.project_title}"`,
        timestamp: row.created_at,
        project_id: row.project_id,
        project_title: row.project_title,
        link: `/admin/projects/${row.project_id}#issues`,
        metadata: {
          severity: row.severity,
          description: row.description.substring(0, 100) + (row.description.length > 100 ? '...' : ''),
        },
      });
    });

    // 5. Trust Scores / Ratings
    const ratingsResult = await query(
      `SELECT r.id, r.rating, r.created_at, r.email, p.id as project_id, p.title as project_title
      FROM project_ratings r
      JOIN projects p ON p.id = r.project_id
      WHERE p.recipient_name = $1
      ORDER BY r.created_at DESC
      LIMIT $2`,
      [ministryName, limit]
    );

    ratingsResult.rows.forEach((row: Record<string, unknown>) => {
      activities.push({
        type: 'rating_received',
        title: 'Trust Score Baru',
        description: `Rating ${row.rating}/5 dari ${row.email} pada proyek "${row.project_title}"`,
        timestamp: row.created_at as string,
        project_id: row.project_id as string,
        project_title: row.project_title as string,
        link: `/projects/${row.project_id}`,
        metadata: {
          rating: row.rating,
        },
      });
    });

    // Sort all activities by timestamp (desc) and limit
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const recentActivities = activities.slice(0, limit);

    return NextResponse.json({
      ministry_name: ministryName,
      activities: recentActivities,
      total: recentActivities.length,
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('GET /api/admin/recent-activity error:', error);
    return NextResponse.json({ error: 'Failed to fetch recent activity' }, { status: 500 });
  }
}
