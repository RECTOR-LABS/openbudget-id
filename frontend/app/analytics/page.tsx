'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatRupiah, abbreviateNumber } from '@/lib/utils';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Project {
  id: string;
  title: string;
  ministry: string;
  total_budget: string;
  total_released: string;
  completion_rate: number;
  budget_accuracy: number;
  avg_trust_score: number | null;
  total_ratings: number;
  total_milestones: number;
  released_milestones: number;
  overall_score: number;
  created_at: string;
}

interface Anomaly {
  id: string;
  title: string;
  ministry: string;
  anomaly_type: string;
  anomaly_description: string;
  total_budget?: string;
  release_percentage?: number;
  missing_proof_count?: number;
  avg_rating?: number;
}

export default function AnalyticsPage() {
  const [leaderboard, setLeaderboard] = useState<Project[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('overall_score');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [trends, setTrends] = useState<{ period: string; project_count: number; total_budget: string; total_released: string }[]>([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchTrends(selectedProject);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProject]);

  const fetchAnalytics = async () => {
    try {
      const [leaderboardRes, anomaliesRes] = await Promise.all([
        fetch('/api/analytics/projects-leaderboard'),
        fetch('/api/analytics/anomalies'),
      ]);

      if (leaderboardRes.ok) {
        const data = await leaderboardRes.json();
        setLeaderboard(data.projects || []);
      }

      if (anomaliesRes.ok) {
        const data = await anomaliesRes.json();
        setAnomalies(data.anomalies || []);
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrends = async (projectId: string) => {
    try {
      const project = leaderboard.find(p => p.id === projectId);
      if (!project) return;

      const res = await fetch(`/api/analytics/trends?ministry=${encodeURIComponent(project.ministry)}&period=monthly`);
      if (res.ok) {
        const data = await res.json();
        setTrends(data.trends || []);
      }
    } catch (err) {
      console.error('Failed to fetch trends:', err);
    }
  };

  const sortedLeaderboard = [...leaderboard].sort((a, b) => {
    const aVal = a[sortBy as keyof Project];
    const bVal = b[sortBy as keyof Project];
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return bVal - aVal;
    }
    return 0;
  });

  const getRankBadgeColor = (index: number, total: number) => {
    const topQuarter = Math.ceil(total * 0.25);
    const bottomQuarter = Math.floor(total * 0.75);

    if (index < topQuarter) return 'bg-green-100 text-green-800';
    if (index >= bottomQuarter) return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const getAnomalyColor = (type: string) => {
    switch (type) {
      case 'low_release_rate': return 'bg-orange-100 border-orange-300 text-orange-900';
      case 'missing_proof': return 'bg-red-100 border-red-300 text-red-900';
      case 'over_allocated': return 'bg-purple-100 border-purple-300 text-purple-900';
      case 'low_trust_score': return 'bg-yellow-100 border-yellow-300 text-yellow-900';
      default: return 'bg-gray-100 border-gray-300 text-gray-900';
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat analytics...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-16 mb-12 overflow-hidden">
          {/* Batik Pattern Overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='15' cy='15' r='6' fill='%23ffffff'/%3E%3Ccircle cx='45' cy='15' r='6' fill='%23ffffff'/%3E%3Ccircle cx='15' cy='45' r='6' fill='%23ffffff'/%3E%3Ccircle cx='45' cy='45' r='6' fill='%23ffffff'/%3E%3Ccircle cx='30' cy='30' r='8' fill='%23ffffff'/%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px',
            }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

          <div className="relative z-10 max-w-7xl mx-auto px-4">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-blue-100 mb-6 text-sm">
              <a href="/" className="hover:text-white transition-colors">
                🏠 Beranda
              </a>
              <span>/</span>
              <span className="text-white font-medium">Analytics</span>
            </div>

            {/* Main Header */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                {/* Icon with glassmorphism */}
                <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 flex items-center justify-center text-4xl flex-shrink-0">
                  📊
                </div>

                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                    Analytics & Intelligence Dashboard
                  </h1>
                  <p className="text-lg lg:text-xl text-blue-100 max-w-2xl">
                    Insights mendalam dari data transparansi anggaran pemerintah
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-3">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 min-w-[120px]">
                  <div className="text-sm text-blue-100 mb-1">Total Kementerian</div>
                  <div className="text-2xl font-bold">{leaderboard.length}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 min-w-[120px]">
                  <div className="text-sm text-blue-100 mb-1">Anomali Terdeteksi</div>
                  <div className="text-2xl font-bold text-yellow-300">{anomalies.length}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 pb-8">

          {/* Project Leaderboard */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">🏆 Project Performance Leaderboard</h2>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="overall_score">Overall Score</option>
                <option value="completion_rate">Completion Rate</option>
                <option value="budget_accuracy">Budget Accuracy</option>
                <option value="avg_trust_score">Trust Score</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-4 font-semibold text-gray-700">Rank</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Project</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Ministry</th>
                    <th className="text-center p-4 font-semibold text-gray-700">Completion</th>
                    <th className="text-center p-4 font-semibold text-gray-700">Budget Accuracy</th>
                    <th className="text-center p-4 font-semibold text-gray-700">Trust Score</th>
                    <th className="text-center p-4 font-semibold text-gray-700">Overall Score</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedLeaderboard.map((project, index) => (
                    <tr
                      key={project.id}
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition"
                      onClick={() => setSelectedProject(project.id)}
                    >
                      <td className="p-4">
                        <span className={`inline-block px-3 py-1 rounded-full font-semibold text-sm ${getRankBadgeColor(index, sortedLeaderboard.length)}`}>
                          #{index + 1}
                        </span>
                      </td>
                      <td className="p-4">
                        <Link
                          href={`/projects/${project.id}`}
                          className="font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {project.title}
                        </Link>
                      </td>
                      <td className="p-4 text-gray-700 text-sm">{project.ministry}</td>
                      <td className="p-4 text-center text-gray-700">{project.completion_rate?.toFixed(1) || 0}%</td>
                      <td className="p-4 text-center text-gray-700">{project.budget_accuracy?.toFixed(1) || 0}%</td>
                      <td className="p-4 text-center">
                        {project.avg_trust_score ? (
                          <span className="text-yellow-600 font-semibold">
                            ⭐ {project.avg_trust_score.toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <span className="text-blue-600 font-bold text-lg">
                          {project.overall_score?.toFixed(1) || 0}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Spending Trends Chart */}
          {selectedProject && trends.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                📈 Spending Trends - {leaderboard.find(p => p.id === selectedProject)?.title || 'Project'}
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="period"
                    tickFormatter={(value) => new Date(value).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                  />
                  <YAxis tickFormatter={(value) => abbreviateNumber(value)} />
                  <Tooltip
                    labelFormatter={(value) => new Date(value).toLocaleDateString('id-ID')}
                    formatter={(value: number | string) => formatRupiah(BigInt(value))}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="total_budget" stroke="#3B82F6" name="Total Budget" strokeWidth={2} />
                  <Line type="monotone" dataKey="total_released" stroke="#10B981" name="Total Released" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Anomaly Detection */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🚨 Anomaly Detection ({anomalies.length} terdeteksi)
            </h2>
            <p className="text-gray-600 mb-6">
              Pola pengeluaran yang mencurigakan terdeteksi otomatis oleh sistem
            </p>

            {anomalies.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-semibold">Tidak ada anomali terdeteksi</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {anomalies.map((anomaly, index) => (
                  <div
                    key={index}
                    className={`rounded-lg border-2 p-4 ${getAnomalyColor(anomaly.anomaly_type)}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-lg">{anomaly.title}</h3>
                      <span className="px-2 py-1 bg-white bg-opacity-50 rounded text-xs font-semibold">
                        {anomaly.anomaly_type.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm mb-2">{anomaly.ministry}</p>
                    <p className="text-sm mb-3">{anomaly.anomaly_description}</p>
                    {anomaly.total_budget && (
                      <div className="text-sm font-semibold">
                        Budget: {formatRupiah(BigInt(anomaly.total_budget))}
                      </div>
                    )}
                    {anomaly.release_percentage !== undefined && (
                      <div className="text-sm font-semibold">
                        Release Rate: {anomaly.release_percentage.toFixed(1)}%
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
