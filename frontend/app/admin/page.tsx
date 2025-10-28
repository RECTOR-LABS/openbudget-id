'use client';

import { useSession } from 'next-auth/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import DashboardStats from '@/components/admin/DashboardStats';
import RecentActivity from '@/components/admin/RecentActivity';
import OnboardingWizard from '@/components/admin/OnboardingWizard';
import OnboardingProgress from '@/components/admin/OnboardingProgress';
import HelpResources from '@/components/admin/HelpResources';

export default function AdminDashboard() {
  const { data: session } = useSession();
  const { connected } = useWallet();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(true); // Will be loaded from API

  useEffect(() => {
    // Check if user has completed onboarding
    const checkOnboarding = () => {
      const hasSeenOnboarding = localStorage.getItem('onboarding_completed');
      if (!hasSeenOnboarding) {
        // First time user
        setShowOnboarding(true);
        setOnboardingCompleted(false);
      }
    };

    checkOnboarding();
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboarding_completed', 'true');
    setShowOnboarding(false);
    setOnboardingCompleted(true);
  };

  const handleOnboardingSkip = () => {
    localStorage.setItem('onboarding_completed', 'skipped');
    setShowOnboarding(false);
  };

  const quickActions = [
    {
      href: '/admin/projects/new',
      icon: '📝',
      title: 'Buat Proyek Baru',
      description: 'Mulai proyek anggaran transparan',
      color: 'green',
      requiresWallet: true,
    },
    {
      href: '/admin/projects',
      icon: '📋',
      title: 'Kelola Proyek',
      description: 'Lihat dan edit proyek yang ada',
      color: 'blue',
      requiresWallet: false,
    },
    {
      href: '/admin/settings',
      icon: '⚙️',
      title: 'Pengaturan',
      description: 'Update informasi kementerian',
      color: 'gray',
      requiresWallet: false,
    },
    {
      href: '/analytics',
      icon: '📊',
      title: 'Analytics',
      description: 'Lihat leaderboard dan trends',
      color: 'purple',
      requiresWallet: false,
    },
    {
      href: '/pitch-deck',
      icon: '🎯',
      title: 'Pitch Deck',
      description: 'Pelajari tentang platform',
      color: 'yellow',
      requiresWallet: false,
    },
    {
      href: '/api-docs',
      icon: '🔌',
      title: 'API Docs',
      description: 'Dokumentasi API lengkap',
      color: 'indigo',
      requiresWallet: false,
    },
  ];

  return (
    <AdminLayout>
      {/* Onboarding Wizard Modal */}
      {showOnboarding && (
        <OnboardingWizard
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      )}

      <div className="space-y-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-white relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='15' cy='15' r='6' fill='%23FFF'/%3E%3Ccircle cx='45' cy='15' r='6' fill='%23FFF'/%3E%3Ccircle cx='15' cy='45' r='6' fill='%23FFF'/%3E%3Ccircle cx='45' cy='45' r='6' fill='%23FFF'/%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px',
            }}
          />

          <div className="relative z-10 flex items-center justify-between">
            <div>
              <motion.h1
                className="text-3xl font-bold mb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Selamat Datang, {session?.user?.name || 'Ministry Official'}! 👋
              </motion.h1>
              <motion.p
                className="text-blue-100 text-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                {session?.user?.ministryName || 'Unassigned Ministry'} • Dashboard Transparansi Anggaran
              </motion.p>
            </div>

            {!onboardingCompleted && (
              <motion.button
                onClick={() => setShowOnboarding(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-white text-blue-600 font-bold rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                🎯 Start Tour
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Onboarding Progress (if not completed) */}
        {!onboardingCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <OnboardingProgress />
          </motion.div>
        )}

        {/* Dashboard Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Statistik Kementerian</h2>
            <p className="text-gray-600">Ringkasan performa transparansi anggaran Anda</p>
          </div>
          <DashboardStats />
        </motion.div>

        {/* Quick Actions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
            <p className="text-gray-600">Akses cepat ke fitur-fitur utama</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.05 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Link
                  href={action.href}
                  className={`block bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border-2 border-gray-100 hover:border-${action.color}-300 h-full ${
                    action.requiresWallet && !connected
                      ? 'opacity-50 cursor-not-allowed pointer-events-none'
                      : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <motion.div
                      className={`p-3 bg-${action.color}-100 rounded-lg`}
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.5 }}
                    >
                      <span className="text-3xl">{action.icon}</span>
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1 text-lg">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                      {action.requiresWallet && !connected && (
                        <span className="inline-block mt-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                          Requires Wallet
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <RecentActivity limit={10} />
        </motion.div>

        {/* Help Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Bantuan & Panduan</h2>
            <p className="text-gray-600">FAQ, guide, dan tutorial untuk membantu Anda</p>
          </div>
          <HelpResources />
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl p-8 text-center shadow-lg"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Siap Membuat Anggaran Lebih Transparan?
          </h3>
          <p className="text-gray-800 mb-6 max-w-2xl mx-auto">
            Mulai dengan membuat proyek baru atau publish proyek yang sudah ada ke blockchain Solana.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/admin/projects/new">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all"
                disabled={!connected}
              >
                📝 Buat Proyek Baru
              </motion.button>
            </Link>
            <Link href="/admin/projects">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl shadow-lg transition-all"
              >
                📋 Kelola Proyek Existing
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
