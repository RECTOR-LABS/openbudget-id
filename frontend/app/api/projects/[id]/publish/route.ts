import { NextRequest, NextResponse } from 'next/server';
import { query, transaction } from '@/lib/db';
import { getProjectPda, getExplorerUrl } from '@/lib/solana';

/**
 * POST /api/projects/[id]/publish - Publish project to blockchain
 *
 * Accepts real blockchain transaction data from frontend wallet integration.
 * Updates database with blockchain_id, solana_account, and transaction signature.
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

    // Parse request body for real blockchain data
    const body = await request.json();
    const { blockchain_id, transaction_signature } = body;

    if (!blockchain_id || !transaction_signature) {
      return NextResponse.json(
        { error: 'Missing blockchain_id or transaction_signature' },
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

    // Derive Project PDA from blockchain_id
    const [projectPda] = getProjectPda(blockchain_id);
    const solanaAccount = projectPda.toBase58();

    // Update project in database with REAL transaction data
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
        [blockchain_id, solanaAccount, transaction_signature, 'published', id]
      );

      return result.rows[0];
    });

    const explorerUrl = getExplorerUrl(solanaAccount, 'address');
    const txExplorerUrl = getExplorerUrl(transaction_signature, 'tx');

    return NextResponse.json({
      message: 'Project published successfully to Solana blockchain',
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
    });
  } catch (error) {
    console.error('Error publishing project:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
