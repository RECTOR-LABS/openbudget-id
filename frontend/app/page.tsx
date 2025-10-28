'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

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

export default function MarketingHomePage() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        const res = await fetch('/api/projects?status=published&limit=4');
        if (res.ok) {
          const data = await res.json();
          setFeaturedProjects(data);
        }
      } catch (error) {
        console.error('Failed to fetch featured projects:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProjects();
  }, []);

  const formatRupiah = (amount: string) => {
    const num = BigInt(amount);
    const billions = Number(num / BigInt(1_000_000_000));
    if (billions >= 1000) {
      return `Rp ${(billions / 1000).toFixed(1)} T`;
    }
    return `Rp ${billions.toFixed(1)} M`;
  };

  const calculateProgress = (released: string, total: string) => {
    const releasedNum = Number(BigInt(released));
    const totalNum = Number(BigInt(total));
    if (totalNum === 0) return 0;
    return Math.round((releasedNum / totalNum) * 100);
  };

  return (
    <>
      <Header />

      {/* Hero Section - Interactive & Playful */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden pt-20">
        {/* Animated Floating Rupiah Symbols */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-6xl opacity-10"
              initial={{
                x: Math.random() * 100 + '%',
                y: Math.random() * 100 + '%',
              }}
              animate={{
                y: [
                  Math.random() * 100 + '%',
                  Math.random() * 100 + '%',
                  Math.random() * 100 + '%',
                ],
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {['💰', '📊', '🔒', '✅'][Math.floor(Math.random() * 4)]}
            </motion.div>
          ))}
        </div>

        {/* Batik Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='15' cy='15' r='6' fill='%23F59E0B'/%3E%3Ccircle cx='45' cy='15' r='6' fill='%23F59E0B'/%3E%3Ccircle cx='15' cy='45' r='6' fill='%23F59E0B'/%3E%3Ccircle cx='45' cy='45' r='6' fill='%23F59E0B'/%3E%3Ccircle cx='30' cy='30' r='8' fill='%2378350F'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              Transparansi Anggaran Negara,
              <br />
              <span className="text-yellow-300">Di Ujung Jari Anda</span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Lihat setiap rupiah anggaran pemerintah secara real-time.
              <br />
              Teknologi blockchain memastikan setiap transaksi tercatat permanen dan tidak bisa diubah.
            </motion.p>

            <motion.div
              className="flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <Link href="#projects">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold rounded-xl shadow-lg transition-all"
                >
                  🔍 Jelajahi Proyek
                </motion.button>
              </Link>
              <Link href="#how-it-works">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold rounded-xl border-2 border-white/30 transition-all"
                >
                  📚 Pelajari Cara Kerja
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-16"
          >
            <svg
              className="w-8 h-8 mx-auto animate-bounce text-yellow-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              💔 Mengapa Kita Butuh Transparansi?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tanpa transparansi, sulit untuk memastikan anggaran negara digunakan dengan benar
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🕵️',
                title: 'Sulit Dipantau',
                description:
                  'Masyarakat tidak tahu kemana uang pajak mereka pergi. Data anggaran sulit diakses dan dipahami.',
                stat: '72%',
                statLabel: 'Warga tidak percaya pengelolaan APBN',
                color: 'red',
              },
              {
                icon: '✏️',
                title: 'Bisa Dimanipulasi',
                description:
                  'Data di sistem lama bisa diubah tanpa jejak. Laporan bisa dipalsukan dan direvisi sesuka hati.',
                stat: 'Rp 182 T',
                statLabel: 'Kerugian negara akibat korupsi (2015-2023)',
                color: 'orange',
              },
              {
                icon: '⏰',
                title: 'Audit Terlambat',
                description:
                  'Masalah baru ketahuan setelah berbulan-bulan. Terlambat untuk mencegah kerugian negara.',
                stat: '6-12 bulan',
                statLabel: 'Waktu audit rata-rata',
                color: 'yellow',
              },
            ].map((problem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all cursor-pointer border-2 border-gray-100"
              >
                <motion.div
                  className="text-6xl mb-4"
                  whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                >
                  {problem.icon}
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{problem.title}</h3>
                <p className="text-gray-600 mb-6">{problem.description}</p>
                <div className={`bg-${problem.color}-50 rounded-lg p-4 border border-${problem.color}-200`}>
                  <div className={`text-3xl font-bold text-${problem.color}-700`}>{problem.stat}</div>
                  <div className={`text-sm text-${problem.color}-600 mt-1`}>{problem.statLabel}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section - 3 Pillars */}
      <section id="solution" className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative overflow-hidden">
        {/* Batik Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='4' fill='%23FFF'/%3E%3Ccircle cx='30' cy='10' r='4' fill='%23FFF'/%3E%3Ccircle cx='10' cy='30' r='4' fill='%23FFF'/%3E%3Ccircle cx='30' cy='30' r='4' fill='%23FFF'/%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              ✨ Solusi: Blockchain untuk Transparansi
            </h2>
            <p className="text-xl text-blue-100 max-w-4xl mx-auto">
              Teknologi blockchain seperti <span className="text-yellow-300 font-semibold">cap notaris digital</span> yang tidak bisa dihapus atau diubah siapa pun
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🔒',
                title: 'Tidak Bisa Diubah',
                subtitle: '(Immutable)',
                description:
                  'Setiap transaksi yang sudah tercatat tidak bisa diedit, dihapus, atau dimanipulasi. Seperti tulisan di batu yang permanen.',
                analogy: 'Seperti cap notaris yang tidak bisa dihapus',
                color: 'green',
              },
              {
                icon: '🔍',
                title: 'Bisa Diverifikasi Siapa Saja',
                subtitle: '(Transparent)',
                description:
                  'Setiap orang bisa memeriksa data asli di blockchain. Tidak perlu percaya pada satu pihak, data bisa dicek sendiri.',
                analogy: 'Seperti buku kas yang bisa dilihat semua orang',
                color: 'blue',
              },
              {
                icon: '⚡',
                title: 'Real-Time',
                subtitle: '(Instant)',
                description:
                  'Data diperbarui langsung saat transaksi terjadi. Tidak perlu menunggu laporan akhir bulan atau audit tahunan.',
                analogy: 'Seperti notifikasi bank yang langsung masuk',
                color: 'purple',
              },
            ].map((pillar, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border-2 border-white/20 hover:border-yellow-300/50 transition-all cursor-pointer"
              >
                <motion.div
                  className="text-7xl mb-4 text-center"
                  whileHover={{ scale: 1.3, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {pillar.icon}
                </motion.div>
                <h3 className="text-2xl font-bold mb-1 text-center">{pillar.title}</h3>
                <p className="text-yellow-300 text-sm mb-4 text-center font-semibold">
                  {pillar.subtitle}
                </p>
                <p className="text-blue-100 mb-4 text-center">{pillar.description}</p>
                <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                  <p className="text-sm text-yellow-200 text-center italic">
                    💡 {pillar.analogy}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              🚀 Cara Kerja (Untuk Warga)
            </h2>
            <p className="text-xl text-gray-600">
              Hanya 4 langkah sederhana untuk memantau anggaran negara
            </p>
          </motion.div>

          <div className="space-y-8">
            {[
              {
                step: '1',
                title: 'Buka Website & Cari Proyek',
                description:
                  'Tidak perlu login. Langsung cari proyek yang ingin dipantau berdasarkan kementerian atau kata kunci.',
                icon: '🔍',
                color: 'blue',
              },
              {
                step: '2',
                title: 'Lihat Detail Anggaran',
                description:
                  'Lihat berapa total anggaran, sudah berapa yang dicairkan, dan untuk apa saja milestone-nya.',
                icon: '📊',
                color: 'green',
              },
              {
                step: '3',
                title: 'Verifikasi di Blockchain',
                description:
                  'Klik link "Lihat di Blockchain" untuk memastikan data yang ditampilkan sama dengan yang tercatat di blockchain Solana.',
                icon: '🔗',
                color: 'purple',
              },
              {
                step: '4',
                title: 'Pantau Progress & Beri Rating',
                description:
                  'Ikuti proyek, beri komentar, atau laporkan jika ada yang mencurigakan. Trust score Anda membantu warga lain.',
                icon: '⭐',
                color: 'yellow',
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.02, x: 10 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="flex items-start gap-6 bg-gray-50 rounded-2xl p-8 hover:shadow-xl transition-all cursor-pointer border-2 border-gray-100 hover:border-blue-300"
              >
                <motion.div
                  className={`flex-shrink-0 w-16 h-16 bg-${step.color}-500 text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-lg`}
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.6 }}
                >
                  {step.step}
                </motion.div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <motion.span
                      className="text-4xl"
                      whileHover={{ scale: 1.3, rotate: [0, -15, 15, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      {step.icon}
                    </motion.span>
                    <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                  </div>
                  <p className="text-gray-600 text-lg">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section id="projects" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              📋 Proyek Terbaru
            </h2>
            <p className="text-xl text-gray-600">
              Lihat proyek anggaran yang sedang berjalan dan sudah diverifikasi di blockchain
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat proyek...</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {featuredProjects.slice(0, 4).map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -10, scale: 1.03 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <Link
                      href={`/projects/${project.id}`}
                      className="block bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all border-2 border-gray-100 hover:border-blue-300 h-full"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                          {project.ministry}
                        </span>
                        {project.solana_account && (
                          <motion.span
                            whileHover={{ scale: 1.2, rotate: 360 }}
                            transition={{ duration: 0.5 }}
                            className="text-green-600 text-xl"
                            title="Verified on Blockchain"
                          >
                            ✓
                          </motion.span>
                        )}
                      </div>

                      <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 text-lg">
                        {project.title}
                      </h3>

                      <div className="space-y-2 mb-4">
                        <div className="text-sm text-gray-600">
                          <span className="font-semibold">Total:</span>{' '}
                          <span className="text-blue-600 font-bold">
                            {formatRupiah(project.total_amount)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-semibold">Dicairkan:</span>{' '}
                          <span className="text-green-600 font-bold">
                            {formatRupiah(project.total_released)}
                          </span>
                        </div>
                      </div>

                      <div className="mb-2">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Progress</span>
                          <span className="font-semibold">
                            {calculateProgress(project.total_released, project.total_amount)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            className="bg-blue-600 h-2 rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{
                              width: `${calculateProgress(project.total_released, project.total_amount)}%`,
                            }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                            viewport={{ once: true }}
                          />
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 mt-4">
                        Dibuat: {new Date(project.created_at).toLocaleDateString('id-ID')}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <Link href="/projects">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all"
                  >
                    Lihat Semua Proyek →
                  </motion.button>
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </section>

      {/* Trust & Security Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl p-12 border-2 border-green-200 shadow-xl"
          >
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <motion.h2
                  className="text-4xl font-bold text-gray-900 mb-6"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  🔐 Aman & Terpercaya
                </motion.h2>
                <motion.p
                  className="text-xl text-gray-700 mb-6"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  Setiap transaksi tercatat permanen di blockchain Solana — teknologi yang sama dengan yang dipakai perusahaan crypto global.
                </motion.p>
                <motion.ul
                  className="space-y-4"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  {[
                    'Data tidak bisa dihapus atau diubah',
                    'Verifikasi bisa dilakukan siapa saja',
                    'Tidak ada pihak yang bisa manipulasi',
                    'Audit otomatis dan real-time',
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      className="flex items-center gap-3"
                      whileHover={{ x: 10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.span
                        className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center flex-shrink-0"
                        whileHover={{ rotate: 360, scale: 1.2 }}
                        transition={{ duration: 0.5 }}
                      >
                        ✓
                      </motion.span>
                      <span className="text-gray-700 text-lg">{item}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>

              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-2xl">
                  {/* Animated Lock Icon */}
                  <motion.div
                    className="text-8xl text-center mb-6"
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    🔒
                  </motion.div>

                  <h4 className="text-2xl font-bold text-center mb-4">Blockchain Verification</h4>
                  <p className="text-center text-blue-100 mb-6">
                    Setiap transaksi memiliki ID unik yang bisa Anda cek di Solana Explorer
                  </p>

                  <motion.div
                    className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 font-mono text-sm"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <motion.span
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-green-400 text-xl"
                      >
                        ●
                      </motion.span>
                      <span className="text-xs text-blue-200">LIVE ON BLOCKCHAIN</span>
                    </div>
                    <div className="text-xs text-white/70">
                      TX: 5x7Hy...9kL3 <br />
                      Block: 245,892,103 <br />
                      Status: ✅ Confirmed
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-yellow-400 to-yellow-600 relative overflow-hidden">
        {/* Batik Pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='15' cy='15' r='6' fill='%2378350F'/%3E%3Ccircle cx='45' cy='15' r='6' fill='%2378350F'/%3E%3Ccircle cx='15' cy='45' r='6' fill='%2378350F'/%3E%3Ccircle cx='45' cy='45' r='6' fill='%2378350F'/%3E%3Ccircle cx='30' cy='30' r='8' fill='%23F59E0B'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Mari Wujudkan Indonesia yang Lebih Transparan
            </h2>
            <p className="text-xl md:text-2xl text-gray-800 mb-8">
              Setiap warga negara berhak tahu kemana uang pajak mereka pergi.
              <br />
              Mulai pantau anggaran negara hari ini!
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/projects">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all"
                >
                  🔍 Jelajahi Semua Proyek
                </motion.button>
              </Link>
              <Link href="/analytics">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg transition-all"
                >
                  📊 Lihat Analitik
                </motion.button>
              </Link>
              <a
                href="https://explorer.solana.com/address/RECtBgp43nvj5inPVW7qo1YN95RwXaYDxLX4dvuJXFY?cluster=devnet"
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl shadow-lg transition-all"
                >
                  🔗 Verifikasi di Blockchain
                </motion.button>
              </a>
            </div>

            <motion.div
              className="mt-12 text-gray-800"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <p className="text-lg font-semibold mb-2">
                ✨ Built for Garuda Spark 2025 🇮🇩
              </p>
              <p className="text-sm">
                Transparansi untuk Indonesia yang Lebih Baik
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
