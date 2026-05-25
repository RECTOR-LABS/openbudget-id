'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useTranslations } from 'next-intl';
import AdminLayout from '@/components/admin/AdminLayout';

const INDONESIAN_MINISTRIES = [
  'Kementerian Keuangan',
  'Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi',
  'Kementerian Kesehatan',
  'Kementerian Perhubungan',
  'Kementerian Pekerjaan Umum dan Perumahan Rakyat',
  'Kementerian Pertanian',
  'Kementerian Energi dan Sumber Daya Mineral',
  'Kementerian Dalam Negeri',
  'Kementerian Sosial',
  'Kementerian Ketenagakerjaan',
];

export default function SettingsPage() {
  const { data: session } = useSession();
  const { publicKey } = useWallet();
  const t = useTranslations('admin.settings');
  const [ministryName, setMinistryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccount = async () => {
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/ministry-accounts/${session.user.id}`);
        if (res.ok) {
          const data = await res.json();
          setMinistryName(data.account.ministry_name || 'Unassigned');
        } else {
          const errorData = await res.json();
          console.error('Failed to load account:', errorData);
          setError(errorData.error || t('loadError'));
        }
      } catch (err) {
        console.error('Error loading account information:', err);
        setError(t('loadError'));
      } finally {
        setLoading(false);
      }
    };

    fetchAccount();
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/ministry-accounts/${session.user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ministry_name: ministryName,
        }),
      });

      if (res.ok) {
        setSuccess(t('saveSuccess'));
        // Reload the page to update the session
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        const data = await res.json();
        setError(data.error || t('saveError'));
      }
    } catch {
      setError(t('saveError'));
    } finally {
      setSaving(false);
    }
  };

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

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>

      {/* Account Information Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('accountInfoTitle')}</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('emailLabel')}
            </label>
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span className="text-gray-700">{session?.user?.email}</span>
              <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {t('emailReadOnly')}
              </span>
            </div>
          </div>

          {/* Ministry Assignment (Editable) */}
          <div>
            <label htmlFor="ministry" className="block text-sm font-medium text-gray-700 mb-2">
              {t('ministryLabel')} <span className="text-red-500">{t('ministryRequired')}</span>
            </label>
            <select
              id="ministry"
              value={ministryName}
              onChange={(e) => setMinistryName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-900"
              required
            >
              {INDONESIAN_MINISTRIES.map((ministry) => (
                <option key={ministry} value={ministry}>
                  {ministry}
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              {t('ministryHint')}
            </p>
          </div>

          {/* Wallet Address (Read-only, if connected) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('walletLabel')}
            </label>
            {publicKey ? (
              <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700 font-mono text-sm">
                  {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
                </span>
                <span className="ml-auto text-xs text-green-700 bg-green-100 px-2 py-1 rounded">
                  {t('walletConnected')}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span className="text-gray-500">{t('walletDisconnected')}</span>
              </div>
            )}
            <p className="mt-1 text-sm text-gray-500">
              {t('walletHint')}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
              <svg
                className="w-5 h-5 text-red-600 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-red-700">{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
              <svg
                className="w-5 h-5 text-green-600 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-green-700">{success}</span>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {t('saving')}
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {t('saveButton')}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Account Details Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <svg
            className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">{t('infoTitle')}</h3>
            <p className="text-sm text-blue-800">
              {t('infoText')}
            </p>
          </div>
        </div>
      </div>
      </div>
    </AdminLayout>
  );
}
