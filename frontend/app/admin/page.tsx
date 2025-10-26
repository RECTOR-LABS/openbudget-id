'use client';

import { useSession } from 'next-auth/react';
import { useWallet } from '@solana/wallet-adapter-react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminDashboard() {
  const { data: session } = useSession();
  const { connected, publicKey } = useWallet();

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome, {session?.user?.name || 'Ministry Official'}
          </h1>
          <p className="text-gray-600">
            {session?.user?.ministryName || 'Unassigned Ministry'}
          </p>
        </div>

        {/* Wallet Status Card */}
        <div
          className={`rounded-lg shadow-sm border p-6 ${
            connected
              ? 'bg-green-50 border-green-200'
              : 'bg-yellow-50 border-yellow-200'
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-lg ${
                connected ? 'bg-green-100' : 'bg-yellow-100'
              }`}
            >
              <svg
                className={`w-6 h-6 ${
                  connected ? 'text-green-600' : 'text-yellow-600'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {connected ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                )}
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                {connected ? 'Wallet Connected' : 'Wallet Not Connected'}
              </h3>
              {connected ? (
                <p className="text-sm text-gray-600">
                  {publicKey?.toBase58().slice(0, 4)}...
                  {publicKey?.toBase58().slice(-4)}
                </p>
              ) : (
                <p className="text-sm text-gray-600">
                  Connect your Solana wallet to publish projects to the
                  blockchain
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/admin/projects"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-600"
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
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  View Projects
                </h3>
                <p className="text-sm text-gray-600">
                  Browse and manage all your budget projects
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/projects/new"
            className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-shadow ${
              connected
                ? 'hover:shadow-md'
                : 'opacity-50 cursor-not-allowed pointer-events-none'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Create New Project
                </h3>
                <p className="text-sm text-gray-600">
                  {connected
                    ? 'Start a new budget transparency project'
                    : 'Connect wallet to create projects'}
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
          <h3 className="font-semibold text-blue-900 mb-3">
            Getting Started
          </h3>
          <ol className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="font-semibold">1.</span>
              <span>Connect your Solana wallet (Phantom or Solflare)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold">2.</span>
              <span>Create a new budget project with project details</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold">3.</span>
              <span>Publish the project to Solana blockchain</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold">4.</span>
              <span>Add milestones with budget allocations</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold">5.</span>
              <span>
                Release funds when milestones are completed (immutable record)
              </span>
            </li>
          </ol>
        </div>
      </div>
    </AdminLayout>
  );
}
