'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';
import { formatRupiah } from '@/lib/utils';
import type { Locale } from '@/lib/utils';

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
  const t = useTranslations('admin.systemInsights');
  const locale = useLocale() as Locale;
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
          setError(t('error'));
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Error loading system statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [t]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{t('loading')}</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !stats) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error || t('noData')}</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <p className="text-gray-600">
            {t('subtitle')}
          </p>
        </div>

        {/* Why Hybrid Architecture */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">
            {t('whyHybrid')}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-blue-800 mb-2">{t('dbTitle')}</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>✓ {t('dbFeatures.0', { ms: database.query_time_ms })}</li>
                <li>✓ {t('dbFeatures.1')}</li>
                <li>✓ {t('dbFeatures.2')}</li>
                <li>✓ {t('dbFeatures.3')}</li>
                <li>⚠ {t('dbFeatures.4')}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-blue-800 mb-2">{t('chainTitle')}</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>✓ {t('chainFeatures.0')}</li>
                <li>✓ {t('chainFeatures.1')}</li>
                <li>✓ {t('chainFeatures.2')}</li>
                <li>✓ {t('chainFeatures.3')}</li>
                <li>⚠ {t('chainFeatures.4')}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Side-by-Side Stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Database Stats */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">{t('dbOffChainTitle')}</h2>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {t('dbBadge')}
              </span>
            </div>

            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-3">
                <p className="text-sm text-gray-600">{t('ministriesLabel')}</p>
                <p className="text-2xl font-bold text-gray-900">{database.ministries.total}</p>
              </div>

              <div className="border-b border-gray-200 pb-3">
                <p className="text-sm text-gray-600">{t('projectsLabel')}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {database.projects.total}
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({t('projectsDetail', { published: database.projects.published, draft: database.projects.draft })})
                  </span>
                </p>
              </div>

              <div className="border-b border-gray-200 pb-3">
                <p className="text-sm text-gray-600">{t('milestonesLabel')}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {database.milestones.total}
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({t('milestonesDetail', { released: database.milestones.released, pending: database.milestones.pending })})
                  </span>
                </p>
              </div>

              <div className="border-b border-gray-200 pb-3">
                <p className="text-sm text-gray-600">{t('totalBudgetLabel')}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatRupiah(database.projects.total_budget, locale)}
                </p>
              </div>

              <div className="border-b border-gray-200 pb-3">
                <p className="text-sm text-gray-600">{t('totalReleasedLabel')}</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatRupiah(database.projects.total_released, locale)}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">{t('queryPerfLabel')}</p>
                <p className="text-2xl font-bold text-blue-600">
                  {database.query_time_ms}ms
                </p>
              </div>
            </div>
          </div>

          {/* Blockchain Stats */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">{t('chainOnChainTitle')}</h2>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                {t('chainBadge')}
              </span>
            </div>

            <div className="space-y-4">
              <div className="border-b border-purple-200 pb-3">
                <p className="text-sm text-gray-600">{t('publishedProjectsLabel')}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {database.projects.on_chain}
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    {t('publishedProjectsDetail')}
                  </span>
                </p>
              </div>

              <div className="border-b border-purple-200 pb-3">
                <p className="text-sm text-gray-600">{t('releasedMilestonesLabel')}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {database.milestones.released}
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    {t('releasedMilestonesDetail')}
                  </span>
                </p>
              </div>

              <div className="border-b border-purple-200 pb-3">
                <p className="text-sm text-gray-600">{t('onChainBudgetLabel')}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatRupiah(database.projects.total_budget, locale)}
                </p>
              </div>

              <div className="border-b border-purple-200 pb-3">
                <p className="text-sm text-gray-600">{t('releasedAmountLabel')}</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatRupiah(database.milestones.released_amount || '0', locale)}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">{t('verificationLabel')}</p>
                <p className="text-lg font-bold text-purple-600 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  {t('immutable')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Published Projects List */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {t('publishedProjectsTable')}
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t('colTitle')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t('colDbId')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t('colBlockchainId')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t('colOnChain')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t('colBudget')}
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
                          {t('viewPda')}
                        </Link>
                      ) : (
                        <span className="text-gray-400 text-sm">{t('draftLabel')}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {formatRupiah(project.total_amount, locale)}
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
            {t('milestonesTable')}
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t('colProject')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t('colDescription')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t('colAmount')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t('colStatus')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t('colBlockchainTx')}
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
                      {formatRupiah(milestone.amount, locale)}
                    </td>
                    <td className="px-4 py-3">
                      {milestone.is_released ? (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded">
                          {t('statusReleased')}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded">
                          {t('statusPending')}
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
          <h3 className="font-semibold text-gray-900 mb-2">{t('howItWorksTitle')}</h3>
          <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
            <li>{t('howItWorksSteps.0')}</li>
            <li>{t('howItWorksSteps.1')}</li>
            <li>{t('howItWorksSteps.2')}</li>
            <li>{t('howItWorksSteps.3')}</li>
          </ol>
        </div>
      </div>
    </AdminLayout>
  );
}
