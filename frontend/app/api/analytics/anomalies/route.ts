import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const anomalies = [];

    // Anomaly 1: Projects with large budget but low release rate
    const lowReleaseResult = await query(`
      SELECT
        p.id,
        p.title,
        p.recipient_name as ministry,
        p.total_amount as total_budget,
        p.total_released,
        ROUND(
          CAST(p.total_released AS NUMERIC) / CAST(p.total_amount AS NUMERIC) * 100,
          2
        ) as release_percentage,
        'low_release_rate' as anomaly_type,
        'Large budget project with unusually low fund release' as anomaly_description
      FROM projects p
      WHERE p.status = 'published'
        AND CAST(p.total_amount AS BIGINT) > 100000000000  -- > 100B IDR
        AND CAST(p.total_released AS NUMERIC) / CAST(p.total_amount AS NUMERIC) < 0.3  -- < 30% released
      ORDER BY CAST(p.total_amount AS BIGINT) DESC
      LIMIT 10
    `);

    anomalies.push(...lowReleaseResult.rows);

    // Anomaly 2: Projects with milestones but missing proof documents
    const missingProofResult = await query(`
      SELECT
        p.id,
        p.title,
        p.recipient_name as ministry,
        p.total_amount as total_budget,
        COUNT(m.id) as total_milestones,
        COUNT(m.id) FILTER (WHERE m.is_released = TRUE AND (m.proof_url IS NULL OR m.proof_url = '')) as missing_proof_count,
        'missing_proof' as anomaly_type,
        'Milestones released without proof documentation' as anomaly_description
      FROM projects p
      JOIN milestones m ON m.project_id = p.id
      WHERE p.status = 'published'
      GROUP BY p.id, p.title, p.recipient_name, p.total_amount
      HAVING COUNT(m.id) FILTER (WHERE m.is_released = TRUE AND (m.proof_url IS NULL OR m.proof_url = '')) > 0
      ORDER BY missing_proof_count DESC
      LIMIT 10
    `);

    anomalies.push(...missingProofResult.rows);

    // Anomaly 3: Projects with significantly over-allocated milestones
    const overAllocatedResult = await query(`
      SELECT
        p.id,
        p.title,
        p.recipient_name as ministry,
        p.total_amount as total_budget,
        p.total_allocated,
        ROUND(
          (CAST(p.total_allocated AS NUMERIC) - CAST(p.total_amount AS NUMERIC)) / CAST(p.total_amount AS NUMERIC) * 100,
          2
        ) as over_allocation_percentage,
        'over_allocated' as anomaly_type,
        'Milestone allocations exceed total project budget' as anomaly_description
      FROM projects p
      WHERE p.status = 'published'
        AND CAST(p.total_allocated AS BIGINT) > CAST(p.total_amount AS BIGINT)
      ORDER BY over_allocation_percentage DESC
      LIMIT 10
    `);

    anomalies.push(...overAllocatedResult.rows);

    // Anomaly 4: Projects with low community trust scores
    const lowTrustResult = await query(`
      SELECT
        p.id,
        p.title,
        p.recipient_name as ministry,
        p.total_amount as total_budget,
        ROUND(AVG(r.rating), 2) as avg_rating,
        COUNT(r.id) as rating_count,
        'low_trust_score' as anomaly_type,
        'Project has low community trust score' as anomaly_description
      FROM projects p
      JOIN project_ratings r ON r.project_id = p.id
      WHERE p.status = 'published'
      GROUP BY p.id, p.title, p.recipient_name, p.total_amount
      HAVING COUNT(r.id) >= 3 AND AVG(r.rating) < 2.5
      ORDER BY avg_rating ASC
      LIMIT 10
    `);

    anomalies.push(...lowTrustResult.rows);

    // Parse numeric strings to numbers for proper frontend handling
    const parsedAnomalies = anomalies.map((anomaly: Record<string, unknown>) => ({
      ...anomaly,
      release_percentage: anomaly.release_percentage ? parseFloat(anomaly.release_percentage as string) : undefined,
      avg_rating: anomaly.avg_rating ? parseFloat(anomaly.avg_rating as string) : undefined,
      over_allocation_percentage: anomaly.over_allocation_percentage ? parseFloat(anomaly.over_allocation_percentage as string) : undefined,
    }));

    return NextResponse.json({
      anomalies: parsedAnomalies,
      total_anomalies: parsedAnomalies.length,
      detected_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('GET /api/analytics/anomalies error:', error);
    return NextResponse.json(
      { error: 'Failed to detect anomalies' },
      { status: 500 }
    );
  }
}
