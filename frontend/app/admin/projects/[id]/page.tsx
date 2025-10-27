'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, web3, BN } from '@coral-xyz/anchor';
import AdminLayout from '@/components/admin/AdminLayout';
import { getExplorerUrl, getPlatformPda, getProjectPda, getMilestonePda } from '@/lib/solana';
import idlJson from '@/idl/openbudget.json';

interface Project {
  id: string;
  blockchain_id: string | null;
  title: string;
  description: string;
  recipient_name: string;
  recipient_type: string;
  total_amount: string;
  total_allocated: string;
  total_released: string;
  status: 'draft' | 'published';
  solana_account: string | null;
  creation_tx: string | null;
  created_at: string;
  milestones?: Milestone[];
}

interface Milestone {
  id: string;
  index: number;
  description: string;
  amount: string;
  is_released: boolean;
  proof_url: string | null;
  released_at: string | null;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const { publicKey } = useWallet();
  const anchorWallet = useAnchorWallet();
  const { connection } = useConnection();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [error, setError] = useState('');

  const fetchProject = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${params.id}`);
      const data = await response.json();

      if (response.ok) {
        setProject(data.project);
      } else {
        setError(data.error || 'Failed to fetch project');
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const handlePublish = async () => {
    if (!anchorWallet) {
      alert('Please connect your wallet first');
      return;
    }

    if (!project) return;

    try {
      setPublishing(true);
      setError('');

      // Create provider and program
      const provider = new AnchorProvider(
        connection,
        anchorWallet,
        { commitment: 'confirmed' }
      );
      // Anchor 0.30+ reads programId from IDL's address field
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const program = new Program(idlJson as any, provider);

      // Generate blockchain ID if not exists
      const blockchainId = project.blockchain_id ||
        `PROJ-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      // Get PDAs
      const [platformPda] = getPlatformPda();
      const [projectPda] = getProjectPda(blockchainId);

      // Convert amount to u64 (BN for Anchor)
      const totalBudget = new BN(project.total_amount);

      // Create instruction
      const tx = await program.methods
        .initializeProject(
          blockchainId,
          project.title,
          project.recipient_name,
          totalBudget
        )
        .accounts({
          platform_state: platformPda,
          project: projectPda,
          authority: anchorWallet.publicKey,
          system_program: web3.SystemProgram.programId,
        })
        .rpc({ skipPreflight: true });

      console.log('Transaction signature:', tx);

      // Wait for confirmation
      const latestBlockhash = await connection.getLatestBlockhash();
      await connection.confirmTransaction({
        signature: tx,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      }, 'confirmed');

      console.log('Transaction confirmed!');

      // Update database
      const response = await fetch(`/api/projects/${project.id}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blockchain_id: blockchainId,
          transaction_signature: tx,
        }),
      });

      if (response.ok) {
        alert('Project published to blockchain successfully!');
        fetchProject();
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update database');
      }
    } catch (error: unknown) {
      console.error('Error publishing project:', error);

      // Check if transaction was already processed (likely successful)
      if (error instanceof Error && error.message.includes('already been processed')) {
        alert('Transaction may have succeeded! Please refresh the page to check.');
        fetchProject();
      } else {
        setError(error instanceof Error ? error.message : 'Failed to publish project');
      }
    } finally {
      setPublishing(false);
    }
  };

  const formatAmount = (amount: string) => {
    const num = BigInt(amount);
    // Show full number with thousand separators (Indonesian format uses dots)
    return `Rp ${Number(num).toLocaleString('id-ID')}`;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading project...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!project) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-red-600">Project not found</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {project.title}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  project.status === 'published'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {project.status}
              </span>
            </div>
            <p className="text-gray-600">{project.description || 'No description'}</p>
          </div>
          {project.status === 'draft' && (
            <button
              onClick={handlePublish}
              disabled={publishing || !publicKey}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {publishing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Publishing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Publish to Blockchain
                </>
              )}
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Project Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Project Information</h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-500">Recipient</dt>
                <dd className="text-gray-900 font-medium">{project.recipient_name}</dd>
              </div>
              {project.recipient_type && (
                <div>
                  <dt className="text-gray-500">Type</dt>
                  <dd className="text-gray-900 font-medium capitalize">{project.recipient_type}</dd>
                </div>
              )}
              <div>
                <dt className="text-gray-500">Created</dt>
                <dd className="text-gray-900 font-medium">
                  {new Date(project.created_at).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </dd>
              </div>
            </dl>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Budget Tracking</h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-500">Total Budget</dt>
                <dd className="text-2xl font-bold text-gray-900">{formatAmount(project.total_amount)}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Allocated to Milestones</dt>
                <dd className="text-lg font-semibold text-blue-600">{formatAmount(project.total_allocated || '0')}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Released</dt>
                <dd className="text-lg font-semibold text-green-600">{formatAmount(project.total_released || '0')}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Remaining</dt>
                <dd className="text-lg font-semibold text-gray-600">
                  {formatAmount((BigInt(project.total_amount) - BigInt(project.total_allocated || '0')).toString())}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Blockchain Info */}
        {project.status === 'published' && project.solana_account && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z" />
              </svg>
              On-Chain Information
            </h2>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-gray-600">Blockchain ID</dt>
                <dd className="font-mono text-gray-900">{project.blockchain_id}</dd>
              </div>
              <div>
                <dt className="text-gray-600">Solana Account</dt>
                <dd>
                  <a
                    href={getExplorerUrl(project.solana_account, 'address')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-blue-600 hover:text-blue-700"
                  >
                    {project.solana_account}
                  </a>
                </dd>
              </div>
              {project.creation_tx && (
                <div>
                  <dt className="text-gray-600">Creation Transaction</dt>
                  <dd>
                    <a
                      href={getExplorerUrl(project.creation_tx, 'tx')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-blue-600 hover:text-blue-700 text-xs"
                    >
                      {project.creation_tx}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        )}

        {/* Milestones Section */}
        {project.status === 'published' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Milestones</h2>
              <button
                onClick={() => setShowMilestoneForm(!showMilestoneForm)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Milestone
              </button>
            </div>

            {showMilestoneForm && (
              <MilestoneForm
                projectId={project.id}
                blockchainId={project.blockchain_id!}
                milestoneCount={project.milestones?.length || 0}
                remainingBudget={BigInt(project.total_amount) - BigInt(project.total_allocated || '0')}
                onSuccess={() => {
                  setShowMilestoneForm(false);
                  fetchProject();
                }}
                onCancel={() => setShowMilestoneForm(false)}
              />
            )}

            {project.milestones && project.milestones.length > 0 ? (
              <div className="space-y-4 mt-6">
                {project.milestones.map((milestone) => (
                  <MilestoneCard
                    key={milestone.id}
                    milestone={milestone}
                    blockchainId={project.blockchain_id!}
                    onRelease={fetchProject}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No milestones yet. Add your first milestone above.</p>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

// Milestone Form Component
function MilestoneForm({
  projectId,
  blockchainId,
  milestoneCount,
  remainingBudget,
  onSuccess,
  onCancel,
}: {
  projectId: string;
  blockchainId: string;
  milestoneCount: number;
  remainingBudget: bigint;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const anchorWallet = useAnchorWallet();
  const { connection } = useConnection();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    index: milestoneCount, // Auto-increment based on existing milestones
    description: '',
    amount: '',
  });
  const [displayAmount, setDisplayAmount] = useState('');
  const [error, setError] = useState('');

  // Format number with thousand separators
  const formatNumber = (value: string): string => {
    const numericValue = value.replace(/\D/g, '');
    if (!numericValue) return '';
    return Number(numericValue).toLocaleString('id-ID');
  };

  // Parse formatted number back to raw number
  const parseFormattedNumber = (value: string): string => {
    return value.replace(/\D/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!anchorWallet) {
      setError('Please connect your wallet');
      return;
    }

    if (!blockchainId) {
      setError('Project must be published to blockchain first');
      return;
    }

    // Validate amount
    if (!formData.amount || formData.amount.trim() === '') {
      setError('Please enter milestone amount');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const amountInRupiah = Math.floor(parseFloat(formData.amount)).toString();

      if (isNaN(parseFloat(amountInRupiah))) {
        setError('Please enter a valid amount');
        return;
      }

      if (BigInt(amountInRupiah) > remainingBudget) {
        setError(`Amount exceeds remaining budget of Rp ${Number(remainingBudget).toLocaleString('id-ID')}`);
        return;
      }

      // Create provider and program
      const provider = new AnchorProvider(
        connection,
        anchorWallet,
        { commitment: 'confirmed' }
      );
      // Anchor 0.30+ reads programId from IDL's address field
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const program = new Program(idlJson as any, provider);

      // Get PDAs
      const [projectPda] = getProjectPda(blockchainId);
      const [milestonePda] = getMilestonePda(blockchainId, formData.index);

      // Create instruction with BN for u64
      // Anchor auto-converts snake_case (add_milestone) to camelCase (addMilestone)
      const tx = await program.methods
        .addMilestone(
          blockchainId,
          formData.index,
          formData.description,
          new BN(amountInRupiah)
        )
        .accounts({
          project: projectPda,
          milestone: milestonePda,
          authority: anchorWallet.publicKey,
          system_program: web3.SystemProgram.programId,
        })
        .rpc({ skipPreflight: true });

      console.log('Milestone transaction:', tx);

      // Wait for confirmation
      const latestBlockhash = await connection.getLatestBlockhash();
      await connection.confirmTransaction({
        signature: tx,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      }, 'confirmed');

      // Create in database
      const response = await fetch('/api/milestones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: projectId,
          milestone_index: formData.index,
          description: formData.description,
          amount: amountInRupiah,
        }),
      });

      if (response.ok) {
        setError('');
        alert(`✅ Milestone added successfully!\n\nTransaction: ${tx}\n\nView on Solana Explorer: ${getExplorerUrl(tx, 'tx')}`);
        onSuccess();
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save milestone');
      }
    } catch (error: unknown) {
      console.error('Error adding milestone:', error);

      // Check if error is "already processed" - this means SUCCESS
      if (error instanceof Error && error.message.includes('already been processed')) {
        setError('');
        alert('✅ Milestone added successfully! The transaction has been confirmed on the blockchain.');
        onSuccess();
      } else {
        setError(error instanceof Error ? error.message : 'Failed to add milestone');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-6 space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Milestone Index (Auto)</label>
          <input
            type="number"
            value={formData.index}
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
            title="Automatically assigned based on milestone count"
          />
          <p className="text-xs text-gray-500 mt-1">Auto-incremented, cannot be edited</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Amount (Rupiah)</label>
          <input
            type="text"
            value={displayAmount}
            onChange={(e) => {
              const rawValue = parseFormattedNumber(e.target.value);
              setFormData({ ...formData, amount: rawValue });
              setDisplayAmount(formatNumber(e.target.value));
            }}
            placeholder="1,000,000"
            inputMode="numeric"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Remaining: Rp {Number(remainingBudget).toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400"
          required
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Milestone'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// Milestone Card Component
function MilestoneCard({
  milestone,
  blockchainId,
  onRelease,
}: {
  milestone: Milestone;
  blockchainId: string;
  onRelease: () => void;
}) {
  const anchorWallet = useAnchorWallet();
  const { connection } = useConnection();
  const [releasing, setReleasing] = useState(false);
  const [showReleaseForm, setShowReleaseForm] = useState(false);
  const [proofUrl, setProofUrl] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; url: string } | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setError('File size exceeds 5MB limit');
      return;
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Only PDF and images (JPG, PNG, WebP) are allowed');
      return;
    }

    try {
      setUploading(true);
      setError('');

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to upload file');
      }

      const data = await response.json();
      const fullUrl = `${window.location.origin}${data.url}`;

      setUploadedFile({ name: file.name, url: fullUrl });
      setProofUrl(fullUrl);
      setError('');
    } catch (error) {
      console.error('Upload error:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleRelease = async () => {
    if (!anchorWallet) {
      alert('Please connect your wallet');
      return;
    }

    if (!proofUrl.trim()) {
      setError('Please upload a file or enter a proof document URL');
      return;
    }

    try {
      setReleasing(true);
      setError('');

      const provider = new AnchorProvider(
        connection,
        anchorWallet,
        { commitment: 'confirmed' }
      );
      // Anchor 0.30+ reads programId from IDL's address field
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const program = new Program(idlJson as any, provider);

      const [projectPda] = getProjectPda(blockchainId);
      const [milestonePda] = getMilestonePda(blockchainId, milestone.index);

      const tx = await program.methods
        .releaseFunds(blockchainId, milestone.index, proofUrl)
        .accounts({
          project: projectPda,
          milestone: milestonePda,
          authority: anchorWallet.publicKey,
        })
        .rpc();

      console.log('Release transaction:', tx);

      const response = await fetch(`/api/milestones/${milestone.id}/release`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proof_url: proofUrl,
          transaction_signature: tx,
        }),
      });

      if (response.ok) {
        alert('Funds released successfully!');
        onRelease();
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update database');
      }
    } catch (error: unknown) {
      console.error('Error releasing funds:', error);

      // Check if error is "already processed" - this means SUCCESS
      if (error instanceof Error && error.message.includes('already been processed')) {
        alert('✅ Funds released successfully! The transaction has been confirmed on the blockchain.');
        onRelease();
      } else {
        setError(error instanceof Error ? error.message : 'Failed to release funds');
      }
    } finally {
      setReleasing(false);
    }
  };

  const formatAmount = (amount: string) => {
    const num = BigInt(amount);
    // Show full number with thousand separators (Indonesian format uses dots)
    return `Rp ${Number(num).toLocaleString('id-ID')}`;
  };

  return (
    <div className={`border rounded-lg p-4 ${milestone.is_released ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded">
              Milestone #{milestone.index}
            </span>
            {milestone.is_released && (
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Released
              </span>
            )}
          </div>
          <p className="text-gray-900 mb-2">{milestone.description}</p>
          <p className="text-lg font-semibold text-gray-900">{formatAmount(milestone.amount)}</p>
          {milestone.is_released && milestone.released_at && (
            <p className="text-sm text-gray-500 mt-2">
              Released on {new Date(milestone.released_at).toLocaleDateString('id-ID')}
            </p>
          )}
          {milestone.proof_url && (
            <a
              href={milestone.proof_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-700 mt-2 inline-block"
            >
              View Proof Document →
            </a>
          )}
        </div>

        {!milestone.is_released && (
          <button
            onClick={() => setShowReleaseForm(!showReleaseForm)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
          >
            Release Funds
          </button>
        )}
      </div>

      {showReleaseForm && !milestone.is_released && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* File Upload Option */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Proof Document
            </label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
                <span className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  {uploading ? 'Uploading...' : 'Choose File'}
                </span>
              </label>
              {uploadedFile && (
                <span className="text-sm text-green-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {uploadedFile.name}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Max 5MB • Accepted: PDF, JPG, PNG, WebP
            </p>
          </div>

          {/* OR Separator */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>

          {/* Manual URL Option */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Proof Document URL
            </label>
            <input
              type="url"
              value={proofUrl}
              onChange={(e) => {
                setProofUrl(e.target.value);
                setUploadedFile(null);
              }}
              placeholder="https://example.com/proof-document.pdf"
              disabled={uploading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 disabled:bg-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              If your document is already hosted elsewhere
            </p>
          </div>

          {/* Production Note */}
          <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
            <p className="text-xs text-blue-700">
              📝 <strong>Note:</strong> In production, files will be stored on IPFS (decentralized storage) for permanent, tamper-proof records.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleRelease}
              disabled={releasing || uploading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm"
            >
              {releasing ? 'Releasing...' : 'Confirm Release'}
            </button>
            <button
              onClick={() => {
                setShowReleaseForm(false);
                setProofUrl('');
                setUploadedFile(null);
                setError('');
              }}
              disabled={releasing || uploading}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
