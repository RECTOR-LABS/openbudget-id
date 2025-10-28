import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/ratings?project_id=xxx - Get ratings for a project
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('project_id');

    if (!projectId) {
      return NextResponse.json({ error: 'Missing project_id' }, { status: 400 });
    }

    // Get individual ratings
    const ratingsResult = await query(
      `SELECT *
       FROM project_ratings
       WHERE project_id = $1
       ORDER BY created_at DESC`,
      [projectId]
    );

    // Get average rating and count
    const statsResult = await query(
      `SELECT
        ROUND(AVG(rating), 2) as average_rating,
        COUNT(*) as total_ratings,
        COUNT(*) FILTER (WHERE rating = 5) as five_star,
        COUNT(*) FILTER (WHERE rating = 4) as four_star,
        COUNT(*) FILTER (WHERE rating = 3) as three_star,
        COUNT(*) FILTER (WHERE rating = 2) as two_star,
        COUNT(*) FILTER (WHERE rating = 1) as one_star
       FROM project_ratings
       WHERE project_id = $1`,
      [projectId]
    );

    // Convert PostgreSQL numeric strings to numbers
    const rawStats = statsResult.rows[0];
    const stats = rawStats ? {
      average_rating: parseFloat(rawStats.average_rating) || 0,
      total_ratings: parseInt(rawStats.total_ratings) || 0,
      five_star: parseInt(rawStats.five_star) || 0,
      four_star: parseInt(rawStats.four_star) || 0,
      three_star: parseInt(rawStats.three_star) || 0,
      two_star: parseInt(rawStats.two_star) || 0,
      one_star: parseInt(rawStats.one_star) || 0,
    } : null;

    return NextResponse.json({
      ratings: ratingsResult.rows,
      stats,
    });
  } catch (error) {
    console.error('GET /api/ratings error:', error);
    return NextResponse.json({ error: 'Failed to fetch ratings' }, { status: 500 });
  }
}

// POST /api/ratings - Create or update rating
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { project_id, email, name, rating, comment } = body;

    // Validation
    if (!project_id || !email || !name) {
      return NextResponse.json(
        { error: 'project_id, email, and name are required' },
        { status: 400 }
      );
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    if (comment && comment.length > 500) {
      return NextResponse.json(
        { error: 'Comment must be 500 characters or less' },
        { status: 400 }
      );
    }

    // Upsert rating (insert or update if exists)
    const result = await query(
      `INSERT INTO project_ratings (project_id, email, name, rating, comment)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (project_id, email)
       DO UPDATE SET
         rating = EXCLUDED.rating,
         comment = EXCLUDED.comment,
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [project_id, email, name, rating, comment || null]
    );

    // Refresh materialized view (for leaderboard)
    await query('SELECT refresh_ministry_performance()');

    return NextResponse.json({
      success: true,
      rating: result.rows[0],
      message: 'Rating submitted successfully',
    });
  } catch (error) {
    console.error('POST /api/ratings error:', error);
    return NextResponse.json({ error: 'Failed to submit rating' }, { status: 500 });
  }
}
