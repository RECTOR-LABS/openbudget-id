import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { query } from '@/lib/db';

/**
 * GET /api/ministry-accounts/[id] - Get ministry account details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: 'Invalid account ID format' },
        { status: 400 }
      );
    }

    // Only allow users to access their own account
    if (session.user.id !== id) {
      return NextResponse.json(
        { error: 'Forbidden - You can only access your own account' },
        { status: 403 }
      );
    }

    const result = await query(
      'SELECT id, google_id, email, ministry_name, wallet_address, created_at, updated_at FROM ministry_accounts WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      account: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching account:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/ministry-accounts/[id] - Update ministry account
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: 'Invalid account ID format' },
        { status: 400 }
      );
    }

    // Only allow users to update their own account
    if (session.user.id !== id) {
      return NextResponse.json(
        { error: 'Forbidden - You can only update your own account' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { ministry_name, wallet_address } = body;

    // Validate ministry_name
    if (ministry_name !== undefined) {
      if (typeof ministry_name !== 'string' || ministry_name.trim().length === 0) {
        return NextResponse.json(
          { error: 'Ministry name must be a non-empty string' },
          { status: 400 }
        );
      }
      if (ministry_name.trim().length > 100) {
        return NextResponse.json(
          { error: 'Ministry name too long (max 100 characters)' },
          { status: 400 }
        );
      }
    }

    // Validate wallet_address (optional)
    if (wallet_address !== undefined && wallet_address !== null) {
      if (typeof wallet_address !== 'string') {
        return NextResponse.json(
          { error: 'Wallet address must be a string' },
          { status: 400 }
        );
      }
      // Basic Solana address validation (32-44 characters, base58)
      if (wallet_address.length < 32 || wallet_address.length > 44) {
        return NextResponse.json(
          { error: 'Invalid Solana wallet address format' },
          { status: 400 }
        );
      }
    }

    // Build dynamic UPDATE query
    const updates: string[] = [];
    const values: (string | number | bigint | boolean | null)[] = [];
    let paramIndex = 1;

    if (ministry_name !== undefined) {
      updates.push(`ministry_name = $${paramIndex}`);
      values.push(ministry_name.trim());
      paramIndex++;
    }

    if (wallet_address !== undefined) {
      updates.push(`wallet_address = $${paramIndex}`);
      values.push(wallet_address);
      paramIndex++;
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await query(
      `UPDATE ministry_accounts
       SET ${updates.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING id, google_id, email, ministry_name, wallet_address, created_at, updated_at`,
      values
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Account updated successfully',
      account: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating account:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
