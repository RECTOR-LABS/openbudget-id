'use client';

import { useState, useEffect, useCallback } from 'react';
import ProjectCard from '@/components/ProjectCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Project {
  id: string;
  title: string;
  ministry: string;
  recipient_name: string;
  total_amount: string;
  total_allocated: string;
  total_released: string;
  status: string;
  created_at: string;
  blockchain_id: string | null;
  solana_account: string | null;
  creation_tx: string | null;
}

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [ministries, setMinistries] = useState<string[]>([]);
  const [filters, setFilters] = useState({ ministry: '', search: '' });
  const [loading, setLoading] = useState(true);

  // Fetch available ministries (from published projects)
  useEffect(() => {
    const fetchMinistries = async () => {
      const res = await fetch('/api/projects?status=published');
      if (res.ok) {
        const data = await res.json();
        const uniqueMinistries = Array.from(
          new Set(data.map((p: Project) => p.ministry).filter(Boolean))
        ).sort();
        setMinistries(uniqueMinistries as string[]);
      }
    };
    fetchMinistries();
  }, []);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.ministry) params.append('ministry', filters.ministry);
    if (filters.search) params.append('search', filters.search);
    params.append('status', 'published');

    const res = await fetch(`/api/projects?${params}`);
    if (res.ok) {
      const data = await res.json();
      setProjects(data);
    }
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Filters */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Cari proyek atau kementerian..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 bg-white"
            />
            <select
              value={filters.ministry}
              onChange={(e) => setFilters({ ...filters, ministry: e.target.value })}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent md:w-64 text-gray-900 bg-white"
            >
              <option value="" className="text-gray-500">Semua Kementerian</option>
              {ministries.map((ministry) => (
                <option key={ministry} value={ministry} className="text-gray-900">
                  {ministry}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Summary */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Proyek Anggaran Publik
          </h2>
          <p className="text-gray-600">
            {loading ? 'Memuat...' : `${projects.length} proyek ditemukan`}
          </p>
        </div>

        {/* Project Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat proyek...</p>
            </div>
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-lg shadow">
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Tidak ada proyek ditemukan
            </h3>
            <p className="text-gray-600">
              Coba ubah filter pencarian atau kembali lagi nanti
            </p>
          </div>
        )}
      </main>
      </div>
      <Footer />
    </>
  );
}
