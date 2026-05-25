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
        {/* Hero Header Section */}
        <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-16 mb-12 overflow-hidden">
          {/* Batik Pattern Overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-blue-100 mb-6 text-sm">
                <a href="/" className="hover:text-white transition">
                  🏠 Beranda
                </a>
                <span>/</span>
                <span className="text-white font-medium">Proyek</span>
              </div>

              {/* Main Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-3xl border border-white/20">
                      📊
                    </div>
                    <div>
                      <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">
                        Semua Proyek Anggaran
                      </h1>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-green-500/20 border border-green-400/30 rounded-full text-sm font-medium text-green-100">
                          ✅ Verified on Blockchain
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-lg md:text-xl text-blue-100 max-w-2xl leading-relaxed">
                    Jelajahi transparansi anggaran negara yang tercatat secara permanen di blockchain Solana.
                    Setiap proyek dapat diverifikasi dan tidak dapat dimanipulasi.
                  </p>
                </div>

                {/* Stats Cards */}
                <div className="flex gap-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 min-w-[120px]"
                  >
                    <div className="text-3xl font-bold mb-1">{projects.length}</div>
                    <div className="text-sm text-blue-100">Total Proyek</div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 min-w-[120px]"
                  >
                    <div className="text-3xl font-bold mb-1">{ministries.length}</div>
                    <div className="text-sm text-blue-100">Kementerian</div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Removed old header - now using hero section above */}

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
