'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';

interface SystemStats {
  database: {
    ministries: { total: number };
    projects: {
      total: number;
      published: number;
      draft: number;
      on_chain: number;
      total_budget: string;
      total_allocated: string;
      total_released: string;
    };
    milestones: {
      total: number;
      released: number;
      pending: number;
      total_budget: string;
      released_amount: string;
    };
    projects_list: Array<{
      id: string;
      title: string;
      blockchain_id: string | null;
      solana_account: string | null;
      creation_tx: string | null;
      total_amount: string;
      total_allocated: string;
      total_released: string;
      status: string;
    }>;
    milestones_list: Array<{
      id: string;
      description: string;
      amount: string;
      is_released: boolean;
      release_tx: string | null;
      released_at: string | null;
      project_title: string;
      project_blockchain_id: string | null;
    }>;
    query_time_ms: number;
  };
}

export default function SystemInsightsPage() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/system-stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        } else {
          setError('Failed to load system statistics');
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Error loading system statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatRupiah = (amount: string) => {
    const num = BigInt(amount);
    if (num >= BigInt(1_000_000_000_000)) {
      return `Rp ${(Number(num) / 1_000_000_000_000).toFixed(1)}T`;
    }
    if (num >= BigInt(1_000_000_000)) {
      return `Rp ${(Number(num) / 1_000_000_000).toFixed(1)}B`;
    }
    if (num >= BigInt(1_000_000)) {
      return `Rp ${(Number(num) / 1_000_000).toFixed(1)}M`;
    }
    return `Rp ${num.toLocaleString('id-ID')}`;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading system insights...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !stats) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error || 'No data available'}</p>
        </div>
      </AdminLayout>
    );
  }

  const { database } = stats;
  const blockchainUrl = process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'devnet'
    ? 'https://explorer.solana.com/?cluster=devnet'
    : 'https://explorer.solana.com';

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">System Insights</h1>
          <p className="text-gray-600">
            Under the hood: Database (Off-Chain) vs Blockchain (On-Chain)
          </p>
        </div>

        {/* Why Hybrid Architecture */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">
            Why Hybrid Architecture?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-blue-800 mb-2">Database (PostgreSQL)</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>✓ Fast queries (&lt;{database.query_time_ms}ms)</li>
                <li>✓ Full-text search</li>
                <li>✓ Complex filtering</li>
                <li>✓ Draft projects (pre-blockchain)</li>
                <li>⚠ Centralized (can be tampered)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-blue-800 mb-2">Blockchain (Solana)</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>✓ Immutable proof</li>
                <li>✓ Public verification</li>
                <li>✓ Trustless transparency</li>
                <li>✓ Permanent record</li>
                <li>⚠ Slower queries (RPC limits)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Side-by-Side Stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Database Stats */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Database (Off-Chain)</h2>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                PostgreSQL
              </span>
            </div>

            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-3">
                <p className="text-sm text-gray-600">Ministries</p>
                <p className="text-2xl font-bold text-gray-900">{database.ministries.total}</p>
              </div>

              <div className="border-b border-gray-200 pb-3">
                <p className="text-sm text-gray-600">Projects</p>
                <p className="text-2xl font-bold text-gray-900">
                  {database.projects.total}
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({database.projects.published} published, {database.projects.draft} draft)
                  </span>
                </p>
              </div>

              <div className="border-b border-gray-200 pb-3">
                <p className="text-sm text-gray-600">Milestones</p>
                <p className="text-2xl font-bold text-gray-900">
                  {database.milestones.total}
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({database.milestones.released} released, {database.milestones.pending} pending)
                  </span>
                </p>
              </div>

              <div className="border-b border-gray-200 pb-3">
                <p className="text-sm text-gray-600">Total Budget Tracked</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatRupiah(database.projects.total_budget)}
                </p>
              </div>

              <div className="border-b border-gray-200 pb-3">
                <p className="text-sm text-gray-600">Total Released</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatRupiah(database.projects.total_released)}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Query Performance</p>
                <p className="text-2xl font-bold text-blue-600">
                  {database.query_time_ms}ms
                </p>
              </div>
            </div>
          </div>

          {/* Blockchain Stats */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Blockchain (On-Chain)</h2>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                Solana Devnet
              </span>
            </div>

            <div className="space-y-4">
              <div className="border-b border-purple-200 pb-3">
                <p className="text-sm text-gray-600">Published Projects</p>
                <p className="text-2xl font-bold text-gray-900">
                  {database.projects.on_chain}
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    PDAs on Solana
                  </span>
                </p>
              </div>

              <div className="border-b border-purple-200 pb-3">
                <p className="text-sm text-gray-600">Released Milestones</p>
                <p className="text-2xl font-bold text-gray-900">
                  {database.milestones.released}
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    with tx signatures
                  </span>
                </p>
              </div>

              <div className="border-b border-purple-200 pb-3">
                <p className="text-sm text-gray-600">On-Chain Budget</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatRupiah(database.projects.total_budget)}
                </p>
              </div>

              <div className="border-b border-purple-200 pb-3">
                <p className="text-sm text-gray-600">Released Amount</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatRupiah(database.milestones.released_amount || '0')}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Verification</p>
                <p className="text-lg font-bold text-purple-600 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  Immutable
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Published Projects List */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Published Projects (Database ↔ Blockchain)
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    DB ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Blockchain ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    On-Chain
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Budget
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {database.projects_list.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {project.title}
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-gray-500">
                      {project.id.slice(0, 8)}...
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-700">
                      {project.blockchain_id || '-'}
                    </td>
                    <td className="px-4 py-3">
                      {project.solana_account ? (
                        <Link
                          href={`${blockchainUrl}/address/${project.solana_account}`}
                          target="_blank"
                          className="text-purple-600 hover:text-purple-800 text-sm flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                          View PDA
                        </Link>
                      ) : (
                        <span className="text-gray-400 text-sm">Draft</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {formatRupiah(project.total_amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Milestones List */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Milestones (Database ↔ Blockchain Releases)
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Project
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Blockchain TX
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {database.milestones_list.map((milestone) => (
                  <tr key={milestone.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {milestone.project_title}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {milestone.description}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {formatRupiah(milestone.amount)}
                    </td>
                    <td className="px-4 py-3">
                      {milestone.is_released ? (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded">
                          Released
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {milestone.release_tx ? (
                        <Link
                          href={`${blockchainUrl}/tx/${milestone.release_tx}`}
                          target="_blank"
                          className="text-purple-600 hover:text-purple-800 text-xs font-mono flex items-center"
                        >
                          {milestone.release_tx.slice(0, 8)}...
                          <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </Link>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-2">How It Works</h3>
          <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
            <li>
              <strong>Draft → Database:</strong> Ministry creates project (stored in PostgreSQL, fast & searchable)
            </li>
            <li>
              <strong>Publish → Blockchain:</strong> Ministry signs transaction, project immutably recorded on Solana
            </li>
            <li>
              <strong>Database ← Blockchain:</strong> We store PDA address and tx signature in DB for quick lookups
            </li>
            <li>
              <strong>Citizen Verifies:</strong> Click &ldquo;View on Explorer&rdquo; to verify DB data matches blockchain truth
            </li>
          </ol>
        </div>
      </div>
    </AdminLayout>
  );
}
