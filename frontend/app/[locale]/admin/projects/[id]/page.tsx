'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, web3, BN } from '@coral-xyz/anchor';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('admin.projects.detail');

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

  // Display debug logs from previous release attempt (survives page reload)
  useEffect(() => {
    const logs = localStorage.getItem('release_debug_logs');
    if (logs) {
      try {
        const parsedLogs = JSON.parse(logs);
        if (parsedLogs.length > 0) {
          console.log('📋 Debug logs from previous release attempt:');
          parsedLogs.forEach((log: { time: string; message: string }) => {
            console.log(`  [${log.time}] ${log.message}`);
          });
        }
      } catch (e) {
        console.error('Failed to parse debug logs:', e);
      }
    }
  }, []);

  const handlePublish = async () => {
    if (!anchorWallet) {
      alert(t('connectWallet'));
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
        alert(t('publishSuccess'));
        fetchProject();
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update database');
      }
    } catch (error: unknown) {
      console.error('Error publishing project:', error);

      // Check if transaction was already processed (likely successful)
      if (error instanceof Error && error.message.includes('already been processed')) {
        alert(t('publishMayHaveSucceeded'));
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
            <p className="text-gray-600">{t('loading')}</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!project) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-red-600">{t('notFound')}</p>
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
            <p className="text-gray-600">{project.description || t('noDescription')}</p>
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
                  {t('publishing')}
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {t('publishButton')}
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
            <h2 className="font-semibold text-gray-900 mb-4">{t('projectInfo')}</h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-500">{t('recipient')}</dt>
                <dd className="text-gray-900 font-medium">{project.recipient_name}</dd>
              </div>
              {project.recipient_type && (
                <div>
                  <dt className="text-gray-500">{t('type')}</dt>
                  <dd className="text-gray-900 font-medium capitalize">{project.recipient_type}</dd>
                </div>
              )}
              <div>
                <dt className="text-gray-500">{t('created')}</dt>
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
            <h2 className="font-semibold text-gray-900 mb-4">{t('budgetTracking')}</h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-500">{t('totalBudget')}</dt>
                <dd className="text-2xl font-bold text-gray-900">{formatAmount(project.total_amount)}</dd>
              </div>
              <div>
                <dt className="text-gray-500">{t('allocatedToMilestones')}</dt>
                <dd className="text-lg font-semibold text-blue-600">{formatAmount(project.total_allocated || '0')}</dd>
              </div>
              <div>
                <dt className="text-gray-500">{t('released')}</dt>
                <dd className="text-lg font-semibold text-green-600">{formatAmount(project.total_released || '0')}</dd>
              </div>
              <div>
                <dt className="text-gray-500">{t('remaining')}</dt>
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
              {t('onChainInfo')}
            </h2>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-gray-600">{t('blockchainId')}</dt>
                <dd className="font-mono text-gray-900">{project.blockchain_id}</dd>
              </div>
              <div>
                <dt className="text-gray-600">{t('solanaAccount')}</dt>
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
                  <dt className="text-gray-600">{t('creationTx')}</dt>
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
              <h2 className="text-xl font-semibold text-gray-900">{t('milestonesTitle')}</h2>
              <button
                onClick={() => setShowMilestoneForm(!showMilestoneForm)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {t('addMilestone')}
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
              <p className="text-gray-500 text-center py-8">{t('noMilestones')}</p>
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
  const t = useTranslations('admin.projects.detail.milestone');
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
      setError(t('connectWallet'));
      return;
    }

    if (!blockchainId) {
      setError(t('mustBePublished'));
      return;
    }

    // Validate amount
    if (!formData.amount || formData.amount.trim() === '') {
      setError(t('enterAmount'));
      return;
    }

    try {
      setLoading(true);
      setError('');

      const amountInRupiah = Math.floor(parseFloat(formData.amount)).toString();

      if (isNaN(parseFloat(amountInRupiah))) {
        setError(t('invalidAmount'));
        return;
      }

      if (BigInt(amountInRupiah) > remainingBudget) {
        setError(t('exceedsBudget', { amount: `Rp ${Number(remainingBudget).toLocaleString('id-ID')}` }));
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
        alert(t('addSuccess', { tx, url: getExplorerUrl(tx, 'tx') }));
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
        alert(t('addSuccessAlreadyProcessed'));
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
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('indexLabel')}</label>
          <input
            type="number"
            value={formData.index}
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
            title={t('indexHint')}
          />
          <p className="text-xs text-gray-500 mt-1">{t('indexHint')}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('amountLabel')}</label>
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
            {t('remainingBudget', { amount: `Rp ${Number(remainingBudget).toLocaleString('id-ID')}` })}
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('descriptionLabel')}</label>
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
          {loading ? t('adding') : t('addButton')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          {t('cancelButton')}
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
  const t = useTranslations('admin.projects.detail.milestone');
  const [releasing, setReleasing] = useState(false);
  const [showReleaseForm, setShowReleaseForm] = useState(false);
  const [proofUrl, setProofUrl] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; url: string } | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'synced' | 'out-of-sync' | null>(null);

  // Re-entry lock to prevent duplicate executions
  const isProcessingRef = useRef(false);

  // Warn user before leaving during critical operation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (releasing) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    // Prevent Next.js Fast Refresh during critical operation
    if (releasing && typeof window !== 'undefined') {
      console.warn('🚫 Transaction in progress, Fast Refresh may cause issues');
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [releasing]);

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
    // Persistent logging that survives page reload
    const logToStorage = (message: string) => {
      try {
        const logs = JSON.parse(localStorage.getItem('release_debug_logs') || '[]');
        logs.push({ time: new Date().toISOString(), message });
        localStorage.setItem('release_debug_logs', JSON.stringify(logs));
        console.log(message);
      } catch (e) {
        console.error('Failed to log to storage:', e);
      }
    };

    // Clear old logs on start
    localStorage.setItem('release_debug_logs', JSON.stringify([]));
    logToStorage('🚀 handleRelease called');

    // Check re-entry lock to prevent duplicate executions
    if (isProcessingRef.current) {
      logToStorage('⚠️ Already processing, ignoring duplicate call');
      console.warn('⚠️ Release already in progress, ignoring duplicate call');
      return;
    }

    // Set lock immediately
    isProcessingRef.current = true;
    logToStorage('🔒 Lock acquired');

    if (!anchorWallet) {
      logToStorage('❌ No wallet connected');
      alert(t('connectWallet'));
      isProcessingRef.current = false; // Release lock
      return;
    }

    if (!proofUrl.trim()) {
      logToStorage('❌ No proof URL');
      setError(t('proofRequired'));
      isProcessingRef.current = false; // Release lock
      return;
    }

    logToStorage('✅ Validation passed, initializing program');

    // Initialize program BEFORE try block so it's accessible in catch block for recovery
    const provider = new AnchorProvider(
      connection,
      anchorWallet,
      { commitment: 'confirmed' }
    );
    // Anchor 0.30+ reads programId from IDL's address field
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const program = new Program(idlJson as any, provider);

    try {
      setReleasing(true);
      setError('');

      logToStorage('🔧 Setting releasing state');

      const [projectPda] = getProjectPda(blockchainId);
      const [milestonePda] = getMilestonePda(blockchainId, milestone.index);

      logToStorage('📍 PDAs derived, about to send blockchain transaction');
      console.log('🔄 Sending blockchain transaction...');

      logToStorage('⏰ Calling .rpc() - Phantom popup should appear now');

      const tx = await program.methods
        .releaseFunds(blockchainId, milestone.index, proofUrl)
        .accounts({
          project: projectPda,
          milestone: milestonePda,
          authority: anchorWallet.publicKey,
        })
        .rpc();

      logToStorage(`✅ Blockchain transaction successful: ${tx}`);
      console.log('✅ Blockchain transaction successful:', tx);
      console.log('⏳ About to start database update...');
      logToStorage('⏳ About to start database update');

      // CRITICAL: Update database with aggressive retry logic
      // This MUST succeed to keep database in sync with blockchain
      let dbUpdateSuccess = false;
      let retryCount = 0;
      const maxRetries = 5; // Increased from 3 to 5
      let lastError: Error | null = null;

      while (!dbUpdateSuccess && retryCount < maxRetries) {
        try {
          console.log(`Updating database... (attempt ${retryCount + 1}/${maxRetries})`);

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

          const response = await fetch(`/api/milestones/${milestone.id}/release`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              proof_url: proofUrl,
              transaction_signature: tx,
            }),
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (response.ok) {
            dbUpdateSuccess = true;
            console.log('✅ Database updated successfully');
            alert(t('releaseSuccess'));
            onRelease();
            return; // Exit early on success
          } else {
            const data = await response.json();
            lastError = new Error(data.error || 'Failed to update database');
            throw lastError;
          }
        } catch (apiError) {
          retryCount++;
          lastError = apiError instanceof Error ? apiError : new Error('Unknown error');

          // Don't retry on abort errors beyond max retries
          if (lastError.name === 'AbortError') {
            console.warn(`API timeout on attempt ${retryCount}`);
          }

          if (retryCount < maxRetries) {
            const waitTime = Math.min(1000 * retryCount, 5000); // Progressive backoff: 1s, 2s, 3s, 4s, 5s
            console.warn(`Database update failed, retrying in ${waitTime}ms... (${retryCount}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
          }
        }
      }

      // If we get here, all retries failed
      // But blockchain succeeded, so we MUST inform the user clearly
      if (!dbUpdateSuccess) {
        const errorMsg = t('dbSyncFailed', { txShort: tx.slice(0, 8), retries: maxRetries, tx });
        console.error('Database sync failed:', lastError);
        setError(errorMsg);
        alert(errorMsg);

        // Don't auto-refresh - let user manually refresh to avoid killing JavaScript execution
        console.log('Please manually refresh the page (Cmd+R or F5)');
      }
    } catch (error: unknown) {
      logToStorage(`❌ ERROR CAUGHT: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
      console.error('Error releasing funds:', error);

      // Check if error is "already processed" - this means SUCCESS
      if (error instanceof Error && error.message.includes('already been processed')) {
        alert(t('releaseAlreadyProcessed'));
        onRelease();
      }
      // Check if milestone already released on blockchain
      else if (error instanceof Error && error.message.includes('MilestoneAlreadyReleased')) {
        // Self-healing: Query blockchain to get the actual transaction signature and sync database
        console.log('🔄 Self-healing: Milestone already released on blockchain, syncing database...');
        logToStorage('🔄 Self-healing: Querying blockchain for transaction signature');

        try {
          // Get milestone PDA
          const [milestonePda] = getMilestonePda(blockchainId, milestone.index);

          // Query recent transactions for this milestone account
          const signatures = await connection.getSignaturesForAddress(milestonePda, { limit: 10 });

          if (signatures.length === 0) {
            throw new Error(t('selfHealNoTx'));
          }

          // Find the ReleaseFunds transaction (most recent one should be it)
          let releaseTxSignature: string | null = null;

          for (const sig of signatures) {
            const tx = await connection.getTransaction(sig.signature, {
              maxSupportedTransactionVersion: 0
            });

            if (tx && tx.meta && tx.meta.logMessages) {
              const hasReleaseFunds = tx.meta.logMessages.some(log =>
                log.includes('Instruction: ReleaseFunds') ||
                log.includes('Funds released for milestone')
              );

              if (hasReleaseFunds) {
                releaseTxSignature = sig.signature;
                break;
              }
            }
          }

          if (!releaseTxSignature) {
            throw new Error(t('selfHealNoReleaseTx'));
          }

          console.log('✅ Found release transaction:', releaseTxSignature);
          logToStorage(`✅ Found release transaction: ${releaseTxSignature}`);

          // Update database with the actual transaction signature
          const response = await fetch(`/api/milestones/${milestone.id}/release`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              proof_url: proofUrl || 'Recovered from blockchain',
              transaction_signature: releaseTxSignature,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update database');
          }

          console.log('✅ Database synced successfully!');
          logToStorage('✅ Database synced successfully');

          alert(t('selfHealSuccess'));

          // Refresh project data
          onRelease();

        } catch (healingError) {
          console.error('❌ Self-healing failed:', healingError);
          logToStorage(`❌ Self-healing failed: ${healingError instanceof Error ? healingError.message : 'Unknown error'}`);

          const healErrorMsg = healingError instanceof Error ? healingError.message : 'Unknown error';
          const errorMessage = t('selfHealAlreadyReleased', { error: healErrorMsg });
          setError(errorMessage);
          alert(errorMessage);
        }
      }
      else {
        const errorMessage = error instanceof Error ? error.message : 'Failed to release funds';
        setError(errorMessage);

        // Show alert for critical errors to ensure user sees it
        if (errorMessage.includes('Blockchain transaction succeeded')) {
          alert(`⚠️ CRITICAL: ${errorMessage}`);
        }
      }
    } finally {
      setReleasing(false);
      // Release lock
      isProcessingRef.current = false;
      console.log('🔓 Lock released');
    }
  };

  const handleVerifyOnBlockchain = async () => {
    if (!connection) return;

    setVerifying(true);
    setVerificationStatus(null);
    setError('');

    try {
      console.log('🔍 Verifying milestone against blockchain...');

      // Get milestone PDA
      const [milestonePda] = getMilestonePda(blockchainId, milestone.index);

      // Fetch account data from blockchain
      const accountInfo = await connection.getAccountInfo(milestonePda);

      if (!accountInfo) {
        setError(t('verifyAccount'));
        setVerificationStatus('out-of-sync');
        return;
      }

      // Parse milestone account data
      const data = accountInfo.data;
      let offset = 8; // discriminator

      // Skip project_id
      const projectIdLen = data.readUInt32LE(offset);
      offset += 4 + projectIdLen;

      // Skip index
      offset += 1;

      // Skip description
      const descLen = data.readUInt32LE(offset);
      offset += 4 + descLen;

      // Skip amount
      offset += 8;

      // Read is_released
      const blockchainIsReleased = data[offset] === 1;

      // Compare with database
      const dbIsReleased = milestone.is_released;

      if (blockchainIsReleased === dbIsReleased) {
        setVerificationStatus('synced');
        console.log('✅ Verification passed: Database matches blockchain');
      } else {
        setVerificationStatus('out-of-sync');
        console.log('⚠️ Verification failed: Database out of sync with blockchain');
        setError(t('verifyOutOfSync', {
          db: dbIsReleased ? 'released' : 'not released',
          chain: blockchainIsReleased ? 'released' : 'not released',
        }));
      }
    } catch (error) {
      console.error('Error verifying milestone:', error);
      setError(error instanceof Error ? error.message : 'Failed to verify');
      setVerificationStatus('out-of-sync');
    } finally {
      setVerifying(false);
    }
  };

  const handleSyncFromBlockchain = async () => {
    if (!connection) return;

    setVerifying(true);
    setError('');

    try {
      console.log('🔄 Syncing milestone from blockchain...');

      // Get milestone PDA
      const [milestonePda] = getMilestonePda(blockchainId, milestone.index);

      // Fetch account data
      const accountInfo = await connection.getAccountInfo(milestonePda);

      if (!accountInfo) {
        throw new Error(t('syncNotFound'));
      }

      // Parse is_released status
      const data = accountInfo.data;
      let offset = 8;
      const projectIdLen = data.readUInt32LE(offset);
      offset += 4 + projectIdLen + 1;
      const descLen = data.readUInt32LE(offset);
      offset += 4 + descLen + 8;
      const blockchainIsReleased = data[offset] === 1;

      // If blockchain shows released but database doesn't, trigger self-healing
      if (blockchainIsReleased && !milestone.is_released) {
        console.log('🔄 Database out of sync, triggering self-healing...');

        // Query transactions to find release signature
        const signatures = await connection.getSignaturesForAddress(milestonePda, { limit: 10 });

        let releaseTxSignature: string | null = null;

        for (const sig of signatures) {
          const tx = await connection.getTransaction(sig.signature, {
            maxSupportedTransactionVersion: 0
          });

          if (tx && tx.meta && tx.meta.logMessages) {
            const hasReleaseFunds = tx.meta.logMessages.some(log =>
              log.includes('Instruction: ReleaseFunds') ||
              log.includes('Funds released for milestone')
            );

            if (hasReleaseFunds) {
              releaseTxSignature = sig.signature;
              break;
            }
          }
        }

        if (!releaseTxSignature) {
          throw new Error(t('syncNoTx'));
        }

        // Update database
        const response = await fetch(`/api/milestones/${milestone.id}/release`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            proof_url: milestone.proof_url || 'Synced from blockchain',
            transaction_signature: releaseTxSignature,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update database');
        }

        alert(t('syncSuccess'));
        setVerificationStatus('synced');
        onRelease(); // Refresh project data
      } else if (!blockchainIsReleased && milestone.is_released) {
        alert(t('syncWarning'));
        setVerificationStatus('out-of-sync');
      } else {
        alert(t('syncAlreadySynced'));
        setVerificationStatus('synced');
      }
    } catch (error) {
      console.error('Error syncing from blockchain:', error);
      setError(error instanceof Error ? error.message : 'Failed to sync');
      alert(t('syncFailed', { error: error instanceof Error ? error.message : 'Unknown error' }));
    } finally {
      setVerifying(false);
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
              {t('milestoneTag', { num: milestone.index + 1 })}
            </span>
            {milestone.is_released && (
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {t('released')}
              </span>
            )}
          </div>
          <p className="text-gray-900 mb-2">{milestone.description}</p>
          <p className="text-lg font-semibold text-gray-900">{formatAmount(milestone.amount)}</p>
          {milestone.is_released && milestone.released_at && (
            <p className="text-sm text-gray-500 mt-2">
              {t('releasedOn', { date: new Date(milestone.released_at).toLocaleDateString('id-ID') })}
            </p>
          )}
          {milestone.proof_url && (
            <a
              href={milestone.proof_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-700 mt-2 inline-block"
            >
              {t('viewProof')}
            </a>
          )}
        </div>

        <div className="flex gap-2">
          {!milestone.is_released && (
            <button
              type="button"
              onClick={() => setShowReleaseForm(!showReleaseForm)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
            >
              {t('releaseFunds')}
            </button>
          )}

          <button
            type="button"
            onClick={handleVerifyOnBlockchain}
            disabled={verifying}
            className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
              verificationStatus === 'synced'
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : verificationStatus === 'out-of-sync'
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            } disabled:opacity-50`}
          >
            {verifying ? (
              `⏳ ${t('verifying')}`
            ) : verificationStatus === 'synced' ? (
              <>✓ {t('synced')}</>
            ) : verificationStatus === 'out-of-sync' ? (
              <>⚠ {t('outOfSync')}</>
            ) : (
              <>🔍 {t('verify')}</>
            )}
          </button>

          {verificationStatus === 'out-of-sync' && (
            <button
              type="button"
              onClick={handleSyncFromBlockchain}
              disabled={verifying}
              className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm disabled:opacity-50"
            >
              {verifying ? `⏳ ${t('syncing')}` : `🔄 ${t('sync')}`}
            </button>
          )}
        </div>
      </div>

      {showReleaseForm && !milestone.is_released && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          {/* Critical Operation Warning */}
          {releasing && (
            <div className="bg-yellow-50 border border-yellow-300 rounded p-3 mb-4">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-yellow-800">{t('transactionWarning')}</p>
                  <p className="text-xs text-yellow-700 mt-1">
                    {t('transactionWarningDetail')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* File Upload Option */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('uploadProof')}
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
                  {uploading ? t('uploading') : t('chooseFile')}
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
              {t('fileLimit')}
            </p>
          </div>

          {/* OR Separator */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">{t('orSeparator')}</span>
            </div>
          </div>

          {/* Manual URL Option */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('proofUrlLabel')}
            </label>
            <input
              type="url"
              value={proofUrl}
              onChange={(e) => {
                setProofUrl(e.target.value);
                setUploadedFile(null);
              }}
              placeholder={t('proofUrlPlaceholder')}
              disabled={uploading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 disabled:bg-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              {t('proofUrlHint')}
            </p>
          </div>

          {/* Production Note */}
          <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
            <p className="text-xs text-blue-700">
              📝 {t('ipfsNote')}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleRelease}
              disabled={releasing || uploading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm"
            >
              {releasing ? t('releasing') : t('confirmRelease')}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowReleaseForm(false);
                setProofUrl('');
                setUploadedFile(null);
                setError('');
              }}
              disabled={releasing || uploading}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm disabled:opacity-50"
            >
              {t('cancelRelease')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
