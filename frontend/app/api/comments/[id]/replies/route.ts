import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getLocaleFromRequest } from '@/lib/locale';

// GET /api/comments/[id]/replies - Get replies to a specific comment
// Locale-aware: `content` field returns the English translation when locale=en
// (COALESCE falls back to Indonesian if content_en is NULL).
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const locale = getLocaleFromRequest(req);
    const commentId = params.id;

    const result = await query(
      `SELECT *,
              COALESCE(content_en, content) AS content_localized
       FROM comments
       WHERE parent_comment_id = $1
         AND is_hidden = FALSE
       ORDER BY created_at ASC`,
      [commentId]
    );

    // Return content under the original field name so the frontend needs no changes
    const replies = result.rows.map((row: Record<string, unknown>) => ({
      ...row,
      content: locale === 'en'
        ? (row.content_localized as string)
        : (row.content as string),
      // Strip the helper column from the response
      content_localized: undefined,
    }));

    return NextResponse.json({ replies });
  } catch (error) {
    console.error('GET /api/comments/[id]/replies error:', error);
    return NextResponse.json({ error: 'Failed to fetch replies' }, { status: 500 });
  }
}
