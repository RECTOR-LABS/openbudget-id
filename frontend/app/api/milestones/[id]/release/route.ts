import { NextRequest, NextResponse } from 'next/server';
import { transaction } from '@/lib/db';
import { getMilestonePda, getExplorerUrl } from '@/lib/solana';

/**
 * POST /api/milestones/[id]/release - Release milestone funds
 *
 * Accepts a real blockchain transaction signature from the client
 * and stores the release data in the database.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { proof_url, transaction_signature } = body;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: 'Invalid milestone ID format' },
        { status: 400 }
      );
    }

    // Validate proof URL
    if (!proof_url || proof_url.trim().length === 0) {
      return NextResponse.json(
        { error: 'Proof URL is required' },
        { status: 400 }
      );
    }

    // Validate transaction signature
    if (!transaction_signature || transaction_signature.trim().length === 0) {
      return NextResponse.json(
        { error: 'Transaction signature is required' },
        { status: 400 }
      );
    }

    // Release milestone in a transaction
    const result = await transaction(async (client) => {
      // Fetch milestone with lock
      const milestoneResult = await client.query(
        `SELECT m.*, p.blockchain_id
         FROM milestones m
         JOIN projects p ON m.project_id = p.id
         WHERE m.id = $1
         FOR UPDATE`,
        [id]
      );

      if (milestoneResult.rows.length === 0) {
        throw new Error('Milestone not found');
      }

      const milestone = milestoneResult.rows[0];

      // Check if already released
      if (milestone.is_released) {
        throw new Error('Milestone already released');
      }

      // Check if project has blockchain_id (must be published)
      if (!milestone.blockchain_id) {
        throw new Error('Project must be published before releasing milestones');
      }

      // Derive Milestone PDA
      const [milestonePda] = getMilestonePda(milestone.blockchain_id, milestone.index);
      const solanaAccount = milestonePda.toBase58();

      // Update milestone with real transaction signature
      const updateMilestoneResult = await client.query(
        `UPDATE milestones
         SET is_released = TRUE,
             release_tx = $1,
             proof_url = $2,
             released_at = CURRENT_TIMESTAMP,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $3
         RETURNING *`,
        [transaction_signature, proof_url, id]
      );

      // Update project's total_released
      await client.query(
        `UPDATE projects
         SET total_released = total_released + $1,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $2`,
        [milestone.amount, milestone.project_id]
      );

      return {
        milestone: updateMilestoneResult.rows[0],
        solanaAccount,
      };
    });

    const explorerUrl = getExplorerUrl(result.solanaAccount, 'address');
    const txExplorerUrl = getExplorerUrl(result.milestone.release_tx, 'tx');

    return NextResponse.json({
      message: 'Milestone funds released successfully',
      milestone: {
        id: result.milestone.id,
        project_id: result.milestone.project_id,
        index: result.milestone.index,
        description: result.milestone.description,
        amount: result.milestone.amount,
        is_released: result.milestone.is_released,
        release_tx: result.milestone.release_tx,
        proof_url: result.milestone.proof_url,
        released_at: result.milestone.released_at,
        solana_account: result.solanaAccount,
        explorer_url: explorerUrl,
        tx_explorer_url: txExplorerUrl,
      },
    });
  } catch (error) {
    console.error('Error releasing milestone funds:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Return more specific error messages
    if (errorMessage.includes('not found')) {
      return NextResponse.json({ error: errorMessage }, { status: 404 });
    }
    if (errorMessage.includes('already released') || errorMessage.includes('must be published')) {
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
}
