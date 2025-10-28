'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProjectCard from '@/components/ProjectCard';
import { motion } from 'framer-motion';

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

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMinistry, setSelectedMinistry] = useState('');
  const [ministries, setMinistries] = useState<string[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        let url = '/api/projects?status=published&limit=100';
        if (selectedMinistry) {
          url += `&ministry=${encodeURIComponent(selectedMinistry)}`;
        }
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setProjects(data);

          // Extract unique ministries
          const uniqueMinistries = Array.from(
            new Set(data.map((p: Project) => p.recipient_name))
          ).sort() as string[];
          setMinistries(uniqueMinistries);
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [selectedMinistry]);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.recipient_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Semua Proyek Anggaran
            </h1>
            <p className="text-lg text-gray-600">
              Jelajahi transparansi anggaran negara yang tercatat di blockchain
            </p>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🔍 Cari Proyek
                </label>
                <input
                  type="text"
                  placeholder="Cari berdasarkan nama proyek atau kementerian..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Ministry Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🏛️ Filter Kementerian
                </label>
                <select
                  value={selectedMinistry}
                  onChange={(e) => setSelectedMinistry(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Semua Kementerian</option>
                  {ministries.map((ministry) => (
                    <option key={ministry} value={ministry}>
                      {ministry}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Menampilkan <span className="font-semibold">{filteredProjects.length}</span> proyek
                {searchTerm || selectedMinistry ? ' (terfilter)' : ''}
              </p>
              {(searchTerm || selectedMinistry) ? (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedMinistry('');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Reset Filter
                </button>
              ) : null}
            </div>
          </motion.div>

          {/* Projects Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-sm p-6 animate-pulse"
                >
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-6"></div>
                  <div className="h-2 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-2 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : filteredProjects.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl shadow-sm p-12 text-center"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Tidak ada proyek ditemukan
              </h3>
              <p className="text-gray-600 mb-6">
                Coba ubah kata kunci pencarian atau filter yang Anda gunakan
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedMinistry('');
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Reset Pencarian
              </button>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
