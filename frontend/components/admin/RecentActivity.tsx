'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Activity {
  type: string;
  title: string;
  description: string;
  timestamp: string;
  project_id?: string;
  project_title?: string;
  link?: string;
  metadata?: Record<string, unknown>;
}

export default function RecentActivity({ limit = 10 }: { limit?: number }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch(`/api/admin/recent-activity?limit=${limit}`);
        if (res.ok) {
          const data = await res.json();
          setActivities(data.activities);
        } else {
          const errorData = await res.json();
          setError(errorData.error || 'Failed to load activities');
        }
      } catch (err) {
        console.error('Failed to fetch recent activities:', err);
        setError('Error loading recent activities');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [limit]);

  const getActivityIcon = (type: string) => {
    const icons: Record<string, string> = {
      project_published: '📋',
      milestone_released: '💸',
      comment_received: '💬',
      issue_reported: '🚨',
      rating_received: '⭐',
    };
    return icons[type] || '📌';
  };

  const getActivityColor = (type: string) => {
    const colors: Record<string, string> = {
      project_published: 'blue',
      milestone_released: 'green',
      comment_received: 'purple',
      issue_reported: 'red',
      rating_received: 'yellow',
    };
    return colors[type] || 'gray';
  };

  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit yang lalu`;
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    if (diffDays < 7) return `${diffDays} hari yang lalu`;

    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-gray-600">Belum ada aktivitas</p>
          <p className="text-sm text-gray-500 mt-2">
            Mulai dengan membuat proyek baru atau publish proyek existing
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>

        {/* Activities */}
        <div className="space-y-6">
          {activities.map((activity, index) => {
            const color = getActivityColor(activity.type);
            const icon = getActivityIcon(activity.type);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="relative pl-12"
              >
                {/* Icon */}
                <motion.div
                  className={`absolute left-0 w-10 h-10 bg-${color}-100 border-4 border-white rounded-full flex items-center justify-center shadow-md z-10`}
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="text-xl">{icon}</span>
                </motion.div>

                {/* Content */}
                <motion.div
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                  className={`bg-gray-50 rounded-lg p-4 border-l-4 border-${color}-400 hover:shadow-md transition-all`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                      {formatRelativeTime(activity.timestamp)}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">{activity.description}</p>

                  {activity.metadata && (
                    <div className="text-xs text-gray-500 mb-2">
                      {activity.metadata.transaction ? (
                        <span className="font-mono bg-gray-200 px-2 py-1 rounded">
                          TX: {String(activity.metadata.transaction).slice(0, 8)}...
                        </span>
                      ) : null}
                      {activity.metadata.severity ? (
                        <span
                          className={`ml-2 px-2 py-1 rounded ${
                            activity.metadata.severity === 'critical'
                              ? 'bg-red-200 text-red-700'
                              : activity.metadata.severity === 'high'
                                ? 'bg-orange-200 text-orange-700'
                                : activity.metadata.severity === 'medium'
                                  ? 'bg-yellow-200 text-yellow-700'
                                  : 'bg-green-200 text-green-700'
                          }`}
                        >
                          {String(activity.metadata.severity).toUpperCase()}
                        </span>
                      ) : null}
                      {activity.metadata.rating ? (
                        <span className="ml-2 text-yellow-600">
                          {'★'.repeat(Number(activity.metadata.rating))}
                          {'☆'.repeat(5 - Number(activity.metadata.rating))}
                        </span>
                      ) : null}
                    </div>
                  )}

                  {activity.link && (
                    <Link
                      href={activity.link}
                      className={`text-sm text-${color}-600 hover:text-${color}-700 font-semibold hover:underline inline-flex items-center gap-1`}
                    >
                      Lihat Detail
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {activities.length >= limit && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: activities.length * 0.1 }}
          className="mt-6 text-center"
        >
          <Link
            href="/admin/activity"
            className="text-sm text-blue-600 hover:text-blue-700 font-semibold hover:underline"
          >
            Lihat Semua Activity →
          </Link>
        </motion.div>
      )}
    </div>
  );
}
