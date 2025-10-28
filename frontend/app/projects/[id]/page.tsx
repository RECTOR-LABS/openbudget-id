'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getExplorerUrl } from '@/lib/solana';

interface Milestone {
  id: string;
  project_id: string;
  index: number; // Changed from milestone_index to index for consistency
  description: string;
  amount: string;
  is_released: boolean;
  released_at: string | null;
  proof_url: string | null;
  release_tx: string | null;
  created_at: string;
}

interface Project {
  id: string;
  title: string;
  description: string | null;
  recipient_name: string;
  recipient_type: string | null;
  total_amount: string;
  total_allocated: string;
  total_released: string;
  status: string;
  blockchain_id: string | null;
  solana_account: string | null;
  creation_tx: string | null;
  created_at: string;
  milestones: Milestone[];
}

export default function ProjectDetailPage() {
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setProject(data.project);
      } else {
        setError('Proyek tidak ditemukan');
      }
    } catch {
      setError('Gagal memuat proyek');
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat proyek...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Proyek Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-6">{error || 'Proyek yang Anda cari tidak ada'}</p>
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const totalBudget = BigInt(project.total_amount);
  const totalReleased = BigInt(project.total_released);

  // Format with Indonesian thousand separators (dots)
  const formatRupiah = (amount: bigint) => {
    return Number(amount).toLocaleString('id-ID');
  };

  // Calculate progress with decimal precision (convert to Number for accurate division)
  const progress = totalBudget > 0n
    ? (Number(totalReleased) / Number(totalBudget)) * 100
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 font-medium transition"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Kembali ke Beranda
          </Link>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
              <p className="text-lg text-gray-600 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                {project.recipient_name}
              </p>
            </div>
            {project.status === 'published' && (
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Dipublikasikan
              </span>
            )}
          </div>
          {project.description && (
            <p className="text-gray-700 mt-4 leading-relaxed">{project.description}</p>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Budget Overview Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Ringkasan Anggaran</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-600 mb-1">Total Anggaran</h3>
              <p className="text-2xl font-bold text-blue-900">
                Rp {formatRupiah(totalBudget)}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-green-600 mb-1">Telah Direalisasikan</h3>
              <p className="text-2xl font-bold text-green-900">
                Rp {formatRupiah(totalReleased)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-600 mb-1">Progress</h3>
              <p className="text-3xl font-bold text-gray-900">{progress.toFixed(1)}%</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Realisasi Anggaran</span>
              <span>{progress.toFixed(1)}% dari total</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>

          {/* Blockchain Verification */}
          {project.creation_tx && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Terverifikasi di Blockchain</h3>
                  <p className="text-sm text-gray-600">
                    Proyek ini tercatat secara permanen di Solana blockchain
                  </p>
                </div>
                <a
                  href={getExplorerUrl(project.creation_tx, 'tx')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Verifikasi di Solana Explorer
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Milestones */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Milestone Realisasi</h2>

          {project.milestones && project.milestones.length > 0 ? (
            <div className="space-y-4">
              {project.milestones.map((milestone) => {
                const milestoneAmount = BigInt(milestone.amount);
                const amountInMillions = Number(milestoneAmount) / 1_000_000;

                return (
                  <div
                    key={milestone.id}
                    className={`border-l-4 ${
                      milestone.is_released ? 'border-green-500' : 'border-yellow-500'
                    } pl-6 py-4 relative`}
                  >
                    {/* Timeline dot */}
                    <div
                      className={`absolute left-0 top-6 transform -translate-x-1/2 w-4 h-4 rounded-full ${
                        milestone.is_released ? 'bg-green-500' : 'bg-yellow-500'
                      } border-4 border-white shadow`}
                    />

                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-500">
                            Milestone #{milestone.index + 1}
                          </span>
                          {milestone.is_released ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Direalisasikan
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Pending
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {milestone.description}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Jumlah: <span className="font-semibold">Rp {amountInMillions.toFixed(1)}M</span>
                        </p>
                        {milestone.is_released && milestone.released_at && (
                          <p className="text-sm text-green-600 mt-1">
                            Direalisasikan pada{' '}
                            {new Date(milestone.released_at).toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3 mt-3">
                      {milestone.release_tx && (
                        <a
                          href={getExplorerUrl(milestone.release_tx, 'tx')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium transition"
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Verifikasi Transaksi
                        </a>
                      )}

                      {milestone.proof_url && (
                        <a
                          href={milestone.proof_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-gray-600 hover:text-gray-700 text-sm font-medium transition"
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          Lihat Dokumen Bukti
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <svg
                className="w-12 h-12 text-gray-400 mx-auto mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p>Belum ada milestone untuk proyek ini</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">
              Powered by Solana Blockchain • Built for Indonesian Transparency
            </p>
            <p className="text-sm text-gray-500">
              Setiap transaksi tercatat secara permanen dan dapat diverifikasi publik
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
