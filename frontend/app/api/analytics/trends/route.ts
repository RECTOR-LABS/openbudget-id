import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/analytics/trends?ministry=xxx&period=monthly
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ministry = searchParams.get('ministry');
    const period = searchParams.get('period') || 'monthly'; // daily, weekly, monthly, yearly

    let sql = '';
    const params: string[] = [];

    if (period === 'monthly') {
      sql = `
        SELECT
          DATE_TRUNC('month', p.created_at) as period,
          COUNT(p.id) as project_count,
          SUM(CAST(p.total_amount AS BIGINT)) as total_budget,
          SUM(CAST(p.total_released AS BIGINT)) as total_released
        FROM projects p
        WHERE p.status != 'draft'
      `;

      if (ministry) {
        sql += ` AND p.recipient_name = $1`;
        params.push(ministry);
      }

      sql += `
        GROUP BY DATE_TRUNC('month', p.created_at)
        ORDER BY period ASC
      `;
    } else if (period === 'yearly') {
      sql = `
        SELECT
          DATE_TRUNC('year', p.created_at) as period,
          COUNT(p.id) as project_count,
          SUM(CAST(p.total_amount AS BIGINT)) as total_budget,
          SUM(CAST(p.total_released AS BIGINT)) as total_released
        FROM projects p
        WHERE p.status != 'draft'
      `;

      if (ministry) {
        sql += ` AND p.recipient_name = $1`;
        params.push(ministry);
      }

      sql += `
        GROUP BY DATE_TRUNC('year', p.created_at)
        ORDER BY period ASC
      `;
    } else {
      // Default monthly
      sql = `
        SELECT
          DATE_TRUNC('month', p.created_at) as period,
          COUNT(p.id) as project_count,
          SUM(CAST(p.total_amount AS BIGINT)) as total_budget,
          SUM(CAST(p.total_released AS BIGINT)) as total_released
        FROM projects p
        WHERE p.status != 'draft'
      `;

      if (ministry) {
        sql += ` AND p.recipient_name = $1`;
        params.push(ministry);
      }

      sql += `
        GROUP BY DATE_TRUNC('month', p.created_at)
        ORDER BY period ASC
      `;
    }

    const result = await query(sql, params);

    // Parse numeric/bigint strings to numbers for proper frontend handling
    const trends = result.rows.map((row: Record<string, unknown>) => ({
      ...row,
      project_count: parseInt(row.project_count as string) || 0,
      total_budget: row.total_budget ? row.total_budget.toString() : '0',
      total_released: row.total_released ? row.total_released.toString() : '0',
    }));

    return NextResponse.json({
      trends,
      ministry,
      period,
    });
  } catch (error) {
    console.error('GET /api/analytics/trends error:', error);
    return NextResponse.json({ error: 'Failed to fetch trends data' }, { status: 500 });
  }
}
