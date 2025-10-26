import { PublicKey, Connection } from '@solana/web3.js';
import { Program, AnchorProvider } from '@coral-xyz/anchor';
import type { Openbudget } from '../idl/openbudget';
import IDL from '../idl/openbudget';

/**
 * Solana network configuration
 */
export const SOLANA_NETWORK = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';
export const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com';
export const PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_SOLANA_PROGRAM_ID || '3UuSu7oTs2Z6YuPnSuYcvr65nkV3PqDzF1qzxeiZVnjJ'
);

/**
 * Get Solana connection
 */
export function getConnection(): Connection {
  return new Connection(SOLANA_RPC_URL, 'confirmed');
}

/**
 * PDA Helper: Get Platform PDA
 * Seed: ["platform"]
 */
export function getPlatformPda(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('platform')],
    PROGRAM_ID
  );
}

/**
 * PDA Helper: Get Project PDA
 * Seed: ["project", project_id]
 * @param projectId - The unique project ID (e.g., "KEMENKES-2025-001")
 */
export function getProjectPda(projectId: string): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('project'), Buffer.from(projectId)],
    PROGRAM_ID
  );
}

/**
 * PDA Helper: Get Milestone PDA
 * Seed: ["milestone", project_id, index]
 * @param projectId - The project ID this milestone belongs to
 * @param index - The milestone index (0-based)
 */
export function getMilestonePda(projectId: string, index: number): [PublicKey, number] {
  // Ensure index fits in u8 (0-255)
  if (index < 0 || index > 255) {
    throw new Error('Milestone index must be between 0 and 255');
  }

  return PublicKey.findProgramAddressSync(
    [Buffer.from('milestone'), Buffer.from(projectId), Buffer.from([index])],
    PROGRAM_ID
  );
}

/**
 * Get Solana Explorer URL for an account
 * @param address - The public key or address string
 * @param type - The type of explorer page (address, tx, block)
 */
export function getExplorerUrl(
  address: string | PublicKey,
  type: 'address' | 'tx' | 'block' = 'address'
): string {
  const addressStr = typeof address === 'string' ? address : address.toBase58();
  const network = SOLANA_NETWORK === 'mainnet-beta' ? '' : `?cluster=${SOLANA_NETWORK}`;
  return `https://explorer.solana.com/${type}/${addressStr}${network}`;
}

/**
 * Get Anchor program instance (for client-side use)
 * Requires a wallet adapter to be connected
 * @param provider - Anchor provider with wallet
 */
export function getProgram(provider: AnchorProvider): Program {
  return new Program(IDL as any, PROGRAM_ID, provider);
}

/**
 * Fetch on-chain project data
 * @param projectId - The project ID
 */
export async function fetchProjectOnChain(projectId: string) {
  const connection = getConnection();
  const [projectPda] = getProjectPda(projectId);

  try {
    const accountInfo = await connection.getAccountInfo(projectPda);
    if (!accountInfo) {
      return null;
    }

    // Account data exists, you would decode it here using Anchor
    // For now, just return the raw account info
    return {
      address: projectPda.toBase58(),
      data: accountInfo.data,
      lamports: accountInfo.lamports,
      owner: accountInfo.owner.toBase58(),
    };
  } catch (error) {
    console.error('Error fetching project from blockchain:', error);
    return null;
  }
}

/**
 * Fetch on-chain milestone data
 * @param projectId - The project ID
 * @param index - The milestone index
 */
export async function fetchMilestoneOnChain(projectId: string, index: number) {
  const connection = getConnection();
  const [milestonePda] = getMilestonePda(projectId, index);

  try {
    const accountInfo = await connection.getAccountInfo(milestonePda);
    if (!accountInfo) {
      return null;
    }

    return {
      address: milestonePda.toBase58(),
      data: accountInfo.data,
      lamports: accountInfo.lamports,
      owner: accountInfo.owner.toBase58(),
    };
  } catch (error) {
    console.error('Error fetching milestone from blockchain:', error);
    return null;
  }
}

/**
 * Verify transaction on-chain
 * @param signature - Transaction signature
 */
export async function verifyTransaction(signature: string): Promise<boolean> {
  const connection = getConnection();

  try {
    const tx = await connection.getTransaction(signature, {
      maxSupportedTransactionVersion: 0,
    });
    return tx !== null;
  } catch (error) {
    console.error('Error verifying transaction:', error);
    return false;
  }
}

export default {
  PROGRAM_ID,
  SOLANA_NETWORK,
  SOLANA_RPC_URL,
  getConnection,
  getPlatformPda,
  getProjectPda,
  getMilestonePda,
  getExplorerUrl,
  getProgram,
  fetchProjectOnChain,
  fetchMilestoneOnChain,
  verifyTransaction,
};
