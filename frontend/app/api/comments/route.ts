import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/comments?project_id=xxx or milestone_id=xxx
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('project_id');
    const milestoneId = searchParams.get('milestone_id');

    if (!projectId && !milestoneId) {
      return NextResponse.json(
        { error: 'Missing filter: provide project_id or milestone_id' },
        { status: 400 }
      );
    }

    const filterField = projectId ? 'project_id' : 'milestone_id';
    const filterId = projectId || milestoneId;

    const result = await query(
      `SELECT c.*,
              (SELECT COUNT(*) FROM comments r WHERE r.parent_comment_id = c.id) as reply_count
       FROM comments c
       WHERE c.${filterField} = $1
         AND c.parent_comment_id IS NULL
         AND c.is_hidden = FALSE
       ORDER BY c.created_at DESC`,
      [filterId]
    );

    return NextResponse.json({ comments: result.rows });
  } catch (error) {
    console.error('GET /api/comments error:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

// POST /api/comments - Create new comment
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      project_id,
      milestone_id,
      parent_comment_id,
      content,
      author_email,
      author_name,
    } = body;

    // Validation
    if (!content || content.length < 1 || content.length > 1000) {
      return NextResponse.json(
        { error: 'Content must be between 1 and 1000 characters' },
        { status: 400 }
      );
    }

    if (!author_email || !author_name) {
      return NextResponse.json(
        { error: 'Author email and name are required' },
        { status: 400 }
      );
    }

    // Must target either project or milestone (not both)
    if (!project_id && !milestone_id) {
      return NextResponse.json(
        { error: 'Must specify either project_id or milestone_id' },
        { status: 400 }
      );
    }

    if (project_id && milestone_id) {
      return NextResponse.json(
        { error: 'Cannot specify both project_id and milestone_id' },
        { status: 400 }
      );
    }

    // Rate limiting: check if user posted > 5 comments today
    const rateLimitCheck = await query(
      `SELECT COUNT(*) as count
       FROM comments
       WHERE author_email = $1
         AND created_at > NOW() - INTERVAL '24 hours'`,
      [author_email]
    );

    if (parseInt(rateLimitCheck.rows[0].count) >= 5) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Maximum 5 comments per 24 hours.' },
        { status: 429 }
      );
    }

    // Insert comment
    const result = await query(
      `INSERT INTO comments (
        project_id,
        milestone_id,
        parent_comment_id,
        author_email,
        author_name,
        content
      )
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [project_id, milestone_id, parent_comment_id, author_email, author_name, content]
    );

    const newComment = result.rows[0];

    // TODO: Send email notification to ministry
    // This would require Resend setup
    // await sendEmailNotification(...)

    return NextResponse.json({
      success: true,
      comment: newComment,
      message: 'Comment posted successfully',
    });
  } catch (error) {
    console.error('POST /api/comments error:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}
