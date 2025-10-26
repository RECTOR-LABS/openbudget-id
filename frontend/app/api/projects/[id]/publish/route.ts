import { NextRequest, NextResponse } from 'next/server';
import { query, transaction } from '@/lib/db';
import { getProjectPda, getExplorerUrl } from '@/lib/solana';

/**
 * POST /api/projects/[id]/publish - Publish project to blockchain
 *
 * NOTE: This is a placeholder implementation for Epic 2.
 * Actual blockchain interaction with wallet will be implemented in Epic 3.
 * For now, it derives the PDA and stores it in the database.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: 'Invalid project ID format' },
        { status: 400 }
      );
    }

    // Fetch project
    const projectResult = await query(
      `SELECT * FROM projects WHERE id = $1`,
      [id]
    );

    if (projectResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const project = projectResult.rows[0];

    // Check if already published
    if (project.status === 'published') {
      return NextResponse.json(
        { error: 'Project already published' },
        { status: 400 }
      );
    }

    // Generate short blockchain ID if not exists (max 32 chars for PDA seed)
    // Format: PROJ-{timestamp}-{random} (e.g., "PROJ-20251026-A7B9C2")
    const blockchainProjectId = project.blockchain_id ||
      `PROJ-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Derive Project PDA
    const [projectPda] = getProjectPda(blockchainProjectId);
    const solanaAccount = projectPda.toBase58();

    // PLACEHOLDER: In Epic 3, this will call the actual blockchain transaction
    // For now, we simulate a successful transaction with a placeholder signature
    const placeholderTxSignature = `PLACEHOLDER_TX_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Update project in database
    const updateResult = await transaction(async (client) => {
      const result = await client.query(
        `UPDATE projects
         SET blockchain_id = $1,
             solana_account = $2,
             creation_tx = $3,
             status = $4,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $5
         RETURNING *`,
        [blockchainProjectId, solanaAccount, placeholderTxSignature, 'published', id]
      );

      return result.rows[0];
    });

    const explorerUrl = getExplorerUrl(solanaAccount, 'address');
    const txExplorerUrl = getExplorerUrl(placeholderTxSignature, 'tx');

    return NextResponse.json({
      message: 'Project published successfully (placeholder)',
      project: {
        id: updateResult.id,
        blockchain_id: updateResult.blockchain_id,
        title: updateResult.title,
        status: updateResult.status,
        solana_account: updateResult.solana_account,
        creation_tx: updateResult.creation_tx,
        explorer_url: explorerUrl,
        tx_explorer_url: txExplorerUrl,
      },
      note: 'This is a placeholder implementation. Actual blockchain transaction will be implemented in Epic 3 with wallet integration.',
    });
  } catch (error) {
    console.error('Error publishing project:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
