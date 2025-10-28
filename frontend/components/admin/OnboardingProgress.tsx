'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';

interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  icon: string;
  link?: string;
}

export default function OnboardingProgress() {
  const { connected } = useWallet();
  const [tasks, setTasks] = useState<OnboardingTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        // Fetch from API or calculate based on user data
        const res = await fetch('/api/admin/dashboard-stats');
        if (res.ok) {
          const data = await res.json();

          const calculatedTasks: OnboardingTask[] = [
            {
              id: 'account_created',
              title: 'Akun Dibuat',
              description: 'Anda sudah login dengan Google OAuth',
              completed: true, // Always true if they're viewing this
              icon: '✅',
            },
            {
              id: 'wallet_connected',
              title: 'Wallet Terhubung',
              description: 'Hubungkan wallet Solana (Phantom/Solflare)',
              completed: connected,
              icon: connected ? '✅' : '🔌',
              link: connected ? undefined : '#wallet',
            },
            {
              id: 'first_project',
              title: 'Proyek Pertama',
              description: 'Buat proyek anggaran pertama',
              completed: data.project_stats.total_projects > 0,
              icon: data.project_stats.total_projects > 0 ? '✅' : '📝',
              link: data.project_stats.total_projects === 0 ? '/admin/projects/new' : undefined,
            },
            {
              id: 'project_published',
              title: 'Publish ke Blockchain',
              description: 'Publikasikan proyek ke Solana',
              completed: data.project_stats.published_projects > 0,
              icon: data.project_stats.published_projects > 0 ? '✅' : '🔗',
              link:
                data.project_stats.published_projects === 0 ? '/admin/projects' : undefined,
            },
            {
              id: 'milestone_added',
              title: 'Milestone Ditambahkan',
              description: 'Tambahkan milestone pertama',
              completed: data.project_stats.total_projects > 0, // Simplified check
              icon: data.project_stats.total_projects > 0 ? '✅' : '📌',
            },
            {
              id: 'funds_released',
              title: 'Dana Dicairkan',
              description: 'Release funds untuk milestone pertama',
              completed: parseFloat(data.budget_insights.total_released) > 0,
              icon: parseFloat(data.budget_insights.total_released) > 0 ? '✅' : '💸',
            },
          ];

          setTasks(calculatedTasks);
        }
      } catch (error) {
        console.error('Failed to fetch onboarding progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [connected]);

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const isFullyCompleted = completedCount === totalCount;

  if (loading) {
    return null;
  }

  if (isFullyCompleted) {
    return null; // Don't show if everything is completed
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div
        className="p-6 cursor-pointer hover:bg-blue-100/50 transition-colors"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              className="text-4xl"
              animate={{ rotate: collapsed ? 0 : [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              🎯
            </motion.div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Getting Started</h3>
              <p className="text-sm text-gray-600">
                Selesaikan langkah-langkah berikut untuk memulai
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {completedCount}/{totalCount}
              </div>
              <div className="text-xs text-gray-600">Tasks Completed</div>
            </div>

            <motion.button
              animate={{ rotate: collapsed ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="text-gray-600 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span className="font-semibold">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Task List */}
      <motion.div
        initial={false}
        animate={{ height: collapsed ? 0 : 'auto', opacity: collapsed ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-6 space-y-3">
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 5 }}
              className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-all ${
                task.completed
                  ? 'bg-green-50 border-green-200'
                  : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
              }`}
            >
              <motion.div
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-2xl"
                animate={task.completed ? {} : { scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {task.icon}
              </motion.div>

              <div className="flex-1">
                <h4
                  className={`font-semibold ${task.completed ? 'text-green-700 line-through' : 'text-gray-900'}`}
                >
                  {task.title}
                </h4>
                <p className="text-sm text-gray-600">{task.description}</p>
              </div>

              {!task.completed && task.link && (
                <a
                  href={task.link}
                  className="flex-shrink-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Mulai →
                </a>
              )}

              {task.completed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold"
                >
                  ✓
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Encouragement Message */}
        {completedCount > 0 && completedCount < totalCount && (
          <div className="px-6 pb-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 text-center"
            >
              <p className="text-purple-900 font-semibold">
                🎉 Bagus! Anda sudah menyelesaikan {completedCount} dari {totalCount} langkah!
              </p>
              <p className="text-sm text-purple-700 mt-1">
                Terus lanjutkan untuk menguasai semua fitur platform.
              </p>
            </motion.div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
