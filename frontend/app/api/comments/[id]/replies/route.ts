import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/comments/[id]/replies - Get replies to a specific comment
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const commentId = params.id;

    const result = await query(
      `SELECT *
       FROM comments
       WHERE parent_comment_id = $1
         AND is_hidden = FALSE
       ORDER BY created_at ASC`,
      [commentId]
    );

    return NextResponse.json({ replies: result.rows });
  } catch (error) {
    console.error('GET /api/comments/[id]/replies error:', error);
    return NextResponse.json({ error: 'Failed to fetch replies' }, { status: 500 });
  }
}
