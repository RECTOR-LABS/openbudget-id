'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface DashboardStatsData {
  ministry_name: string;
  project_stats: {
    total_projects: number;
    published_projects: number;
    draft_projects: number;
    completed_projects: number;
    completion_rate: number;
  };
  budget_insights: {
    total_allocated: string;
    total_released: string;
    budget_utilization: number;
  };
  citizen_engagement: {
    avg_trust_score: number;
    total_comments: number;
    total_subscribers: number;
    total_issues: number;
  };
  issues_breakdown: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  blockchain_status: {
    verified_count: number;
    total_published: number;
    verification_percentage: number;
  };
}

export default function DashboardStats() {
  const [stats, setStats] = useState<DashboardStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/dashboard-stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        } else {
          const errorData = await res.json();
          setError(errorData.error || 'Failed to load stats');
        }
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
        setError('Error loading dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatRupiah = (amount: string) => {
    const num = BigInt(amount);
    const trillions = Number(num / BigInt(1_000_000_000_000));
    const billions = Number(num / BigInt(1_000_000_000));

    if (trillions >= 1) {
      return `Rp ${trillions.toFixed(2)} T`;
    }
    if (billions >= 1) {
      return `Rp ${billions.toFixed(2)} M`;
    }
    return `Rp ${Number(num).toLocaleString('id-ID')}`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-md animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-700">{error || 'Failed to load dashboard stats'}</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Proyek',
      value: stats.project_stats.total_projects.toString(),
      icon: '📋',
      color: 'blue',
      details: [
        { label: 'Published', value: stats.project_stats.published_projects },
        { label: 'Draft', value: stats.project_stats.draft_projects },
        { label: 'Completed', value: stats.project_stats.completed_projects },
      ],
      footer: `${stats.project_stats.completion_rate}% completion rate`,
    },
    {
      title: 'Anggaran',
      value: formatRupiah(stats.budget_insights.total_allocated),
      icon: '💰',
      color: 'green',
      details: [
        { label: 'Dialokasikan', value: formatRupiah(stats.budget_insights.total_allocated) },
        { label: 'Dicairkan', value: formatRupiah(stats.budget_insights.total_released) },
      ],
      footer: `${stats.budget_insights.budget_utilization}% digunakan`,
      progress: stats.budget_insights.budget_utilization,
    },
    {
      title: 'Trust Score',
      value: stats.citizen_engagement.avg_trust_score.toFixed(1),
      icon: '⭐',
      color: 'yellow',
      details: Array.from({ length: 5 }, (_, i) => ({
        star: i + 1,
        filled: i < Math.round(stats.citizen_engagement.avg_trust_score),
      })),
      footer: 'Rating rata-rata dari warga',
    },
    {
      title: 'Citizen Engagement',
      value: (
        stats.citizen_engagement.total_comments +
        stats.citizen_engagement.total_subscribers
      ).toString(),
      icon: '👥',
      color: 'purple',
      details: [
        { label: 'Komentar', value: stats.citizen_engagement.total_comments },
        { label: 'Subscribers', value: stats.citizen_engagement.total_subscribers },
      ],
      footer: 'Total interaksi warga',
    },
    {
      title: 'Laporan Masalah',
      value: stats.citizen_engagement.total_issues.toString(),
      icon: '🚨',
      color: 'red',
      details: [
        { label: 'Critical', value: stats.issues_breakdown.critical, severity: 'critical' },
        { label: 'High', value: stats.issues_breakdown.high, severity: 'high' },
        { label: 'Medium', value: stats.issues_breakdown.medium, severity: 'medium' },
        { label: 'Low', value: stats.issues_breakdown.low, severity: 'low' },
      ],
      footer: 'Total issues dilaporkan',
    },
    {
      title: 'Blockchain Status',
      value: `${stats.blockchain_status.verification_percentage}%`,
      icon: '🔗',
      color: 'indigo',
      details: [
        { label: 'Verified', value: stats.blockchain_status.verified_count },
        { label: 'Total Published', value: stats.blockchain_status.total_published },
      ],
      footer: 'Proyek terverifikasi di blockchain',
      progress: stats.blockchain_status.verification_percentage,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statCards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          whileHover={{ y: -5, scale: 1.02 }}
          className={`bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border-2 border-gray-100 hover:border-${card.color}-300`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">{card.title}</p>
              <motion.h3
                className={`text-3xl font-bold text-${card.color}-600`}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
              >
                {card.value}
              </motion.h3>
            </div>
            <motion.div
              className="text-4xl"
              whileHover={{ rotate: 360, scale: 1.2 }}
              transition={{ duration: 0.5 }}
            >
              {card.icon}
            </motion.div>
          </div>

          <div className="space-y-2 mb-4">
            {card.title === 'Trust Score' ? (
              <div className="flex gap-1 justify-center">
                {(card.details as Array<{ star: number; filled: boolean }>).map((star, i) => (
                  <motion.span
                    key={i}
                    className={`text-2xl ${star.filled ? 'text-yellow-400' : 'text-gray-300'}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + i * 0.05 }}
                  >
                    ★
                  </motion.span>
                ))}
              </div>
            ) : card.title === 'Laporan Masalah' ? (
              <div className="grid grid-cols-2 gap-2">
                {(
                  card.details as Array<{
                    label: string;
                    value: number;
                    severity: 'critical' | 'high' | 'medium' | 'low';
                  }>
                ).map((detail, i) => {
                  const severityColors = {
                    critical: 'bg-red-100 text-red-700',
                    high: 'bg-orange-100 text-orange-700',
                    medium: 'bg-yellow-100 text-yellow-700',
                    low: 'bg-green-100 text-green-700',
                  };
                  return (
                    <div
                      key={i}
                      className={`text-xs px-2 py-1 rounded ${severityColors[detail.severity]}`}
                    >
                      {detail.label}: {detail.value}
                    </div>
                  );
                })}
              </div>
            ) : (
              (card.details as Array<{ label: string; value: string | number }>).map((detail, i) => (
                <div key={i} className="flex justify-between text-sm text-gray-600">
                  <span>{detail.label}:</span>
                  <span className="font-semibold">{detail.value}</span>
                </div>
              ))
            )}
          </div>

          {card.progress !== undefined && (
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className={`bg-${card.color}-500 h-2 rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${card.progress}%` }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 1 }}
                />
              </div>
            </div>
          )}

          <p className="text-xs text-gray-500 text-center border-t pt-3">{card.footer}</p>
        </motion.div>
      ))}
    </div>
  );
}
