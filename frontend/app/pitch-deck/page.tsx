'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';

export default function PitchDeckPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const [videoPlaying, setVideoPlaying] = useState(false);

  // Scroll-based animations
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  return (
    <>
      <Header />
      <div ref={containerRef} className="bg-gray-50">
        {/* Hero Section */}
        <motion.section
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-blue-900 text-white relative overflow-hidden pt-20"
        >
          {/* Batik pattern overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='15' cy='15' r='6' fill='%23F59E0B'/%3E%3Ccircle cx='45' cy='15' r='6' fill='%23F59E0B'/%3E%3Ccircle cx='15' cy='45' r='6' fill='%23F59E0B'/%3E%3Ccircle cx='45' cy='45' r='6' fill='%23F59E0B'/%3E%3Ccircle cx='30' cy='30' r='8' fill='%2378350F'/%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px',
            }}
          />

          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <div className="flex items-center justify-center mb-6">
                <Image src="/logo-icon.svg" alt="OpenBudget" width={80} height={80} />
              </div>
              <h1 className="text-6xl md:text-7xl font-bold mb-6">
                Open<span className="text-yellow-300">Budget</span>.ID
              </h1>
              <p className="text-2xl md:text-3xl font-light mb-8 text-blue-100">
                Transparansi Anggaran Pemerintah Berbasis Blockchain
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <span className="px-6 py-2 bg-green-600 text-white rounded-full font-semibold">
                  🏆 Garuda Spark 2025
                </span>
                <span className="px-6 py-2 bg-purple-600 text-white rounded-full font-semibold">
                  ⚡ Cypherpunk Colosseum
                </span>
                <span className="px-6 py-2 bg-yellow-600 text-white rounded-full font-semibold">
                  🇮🇩 Digital Indonesia 2045
                </span>
              </div>
              <p className="text-lg text-blue-200 max-w-3xl mx-auto">
                Setiap rupiah anggaran publik dapat dilacak, diaudit, dan diverifikasi oleh warga
                negara — didukung oleh Solana Blockchain.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-12"
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
        </motion.section>

        {/* Problem Statement */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl font-bold text-gray-900 mb-6">💔 Masalah yang Dihadapi</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Korupsi dan penyalahgunaan anggaran publik merusak kepercayaan rakyat terhadap
                pemerintah
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: '🕵️',
                  title: 'Kurangnya Transparansi',
                  description:
                    'Masyarakat tidak dapat mengakses data detail penggunaan anggaran pemerintah secara real-time',
                  stat: '72%',
                  statLabel: 'Warga tidak percaya pengelolaan APBN',
                },
                {
                  icon: '📝',
                  title: 'Data Dapat Dimanipulasi',
                  description:
                    'Sistem pencatatan tradisional rentan terhadap perubahan retroaktif dan pemalsuan dokumen',
                  stat: 'Rp 182 T',
                  statLabel: 'Kerugian negara akibat korupsi (2015-2023)',
                },
                {
                  icon: '⏰',
                  title: 'Audit Lambat & Mahal',
                  description:
                    'Proses audit manual memakan waktu berbulan-bulan dan membutuhkan biaya besar',
                  stat: '6-12 bulan',
                  statLabel: 'Waktu audit rata-rata',
                },
              ].map((problem, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 hover:shadow-xl transition-shadow"
                >
                  <div className="text-5xl mb-4">{problem.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{problem.title}</h3>
                  <p className="text-gray-700 mb-6">{problem.description}</p>
                  <div className="bg-red-100 rounded-lg p-4 border border-red-300">
                    <div className="text-3xl font-bold text-red-700">{problem.stat}</div>
                    <div className="text-sm text-red-600 mt-1">{problem.statLabel}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Solution Overview */}
        <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white relative overflow-hidden">
          {/* Batik accent */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='4' fill='%23FFF'/%3E%3Ccircle cx='30' cy='10' r='4' fill='%23FFF'/%3E%3Ccircle cx='10' cy='30' r='4' fill='%23FFF'/%3E%3Ccircle cx='30' cy='30' r='4' fill='%23FFF'/%3E%3C/svg%3E")`,
              backgroundSize: '40px 40px',
            }}
          />

          <div className="relative z-10 max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl font-bold mb-6">✨ Solusi: OpenBudget.ID</h2>
              <p className="text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
                Blockchain sebagai infrastruktur invisible yang membuat setiap transaksi anggaran
                <span className="text-yellow-300 font-semibold"> immutable </span>
                (tidak dapat diubah),
                <span className="text-yellow-300 font-semibold"> transparent </span>
                (dapat diverifikasi siapa saja), dan
                <span className="text-yellow-300 font-semibold"> real-time</span>.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h3 className="text-3xl font-bold mb-6">Bagaimana Cara Kerjanya?</h3>
                <div className="space-y-4">
                  {[
                    {
                      step: '1',
                      title: 'Kementerian Mendaftarkan Proyek',
                      desc: 'Login dengan Google OAuth, buat proyek anggaran draft di database',
                    },
                    {
                      step: '2',
                      title: 'Publikasi ke Blockchain Solana',
                      desc: 'Proyek di-publish ke blockchain menjadi record immutable dengan Wallet signature',
                    },
                    {
                      step: '3',
                      title: 'Tambahkan Milestone Realisasi',
                      desc: 'Setiap pencairan dana dicatat sebagai milestone on-chain dengan bukti dokumen',
                    },
                    {
                      step: '4',
                      title: 'Warga Verifikasi Real-Time',
                      desc: 'Publik dapat melihat, mencari, dan memverifikasi setiap transaksi via Solana Explorer',
                    },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-yellow-400 text-blue-900 rounded-full flex items-center justify-center font-bold text-lg">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-1">{item.title}</h4>
                        <p className="text-blue-100 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20"
              >
                <h4 className="text-2xl font-bold mb-6 text-center">Hybrid Architecture</h4>
                <div className="space-y-4 text-sm">
                  <div className="bg-blue-900/50 rounded-lg p-4 border border-blue-400">
                    <div className="font-bold mb-2 text-yellow-300">🔗 On-Chain (Solana)</div>
                    <div className="text-blue-100">
                      Immutable spending records — Source of Truth yang tidak bisa diubah siapa pun
                    </div>
                  </div>
                  <div className="text-center">
                    <svg
                      className="w-6 h-6 mx-auto text-yellow-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </div>
                  <div className="bg-blue-900/50 rounded-lg p-4 border border-green-400">
                    <div className="font-bold mb-2 text-yellow-300">💾 Off-Chain (PostgreSQL)</div>
                    <div className="text-blue-100">
                      Searchable metadata & cache — Fast queries untuk UX yang optimal
                    </div>
                  </div>
                  <div className="text-center">
                    <svg
                      className="w-6 h-6 mx-auto text-yellow-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M8 7h12M8 12h12m-12 5h12M3 7h.01M3 12h.01M3 17h.01"
                      />
                    </svg>
                  </div>
                  <div className="bg-purple-900/50 rounded-lg p-4 border border-purple-400">
                    <div className="font-bold mb-2 text-yellow-300">🌉 Bridge (Next.js API)</div>
                    <div className="text-blue-100">
                      Koordinasi DB ↔ Blockchain dengan self-healing auto-sync
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Video Demo Section - STUNNING ANIMATED */}
        <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-30"
                initial={{
                  x: Math.random() * 100 + '%',
                  y: Math.random() * 100 + '%',
                }}
                animate={{
                  y: [Math.random() * 100 + '%', Math.random() * 100 + '%'],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: Math.random() * 5 + 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-5xl font-bold text-white mb-4">🎥 Demo Video</h2>
              <p className="text-xl text-gray-300">
                Lihat OpenBudget.ID beraksi dalam 3 menit
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Batik frame decoration */}
              <div className="absolute -inset-4 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 rounded-3xl opacity-50 blur-xl" />
              <div className="absolute -inset-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl">
                {/* Batik pattern on frame */}
                <div
                  className="absolute inset-0 opacity-20 rounded-2xl"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='7.5' cy='7.5' r='3' fill='%23F59E0B'/%3E%3Ccircle cx='22.5' cy='7.5' r='3' fill='%23F59E0B'/%3E%3Ccircle cx='7.5' cy='22.5' r='3' fill='%23F59E0B'/%3E%3Ccircle cx='22.5' cy='22.5' r='3' fill='%23F59E0B'/%3E%3C/svg%3E")`,
                    backgroundSize: '30px 30px',
                  }}
                />
              </div>

              <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl aspect-video">
                {!videoPlaying ? (
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900 cursor-pointer group"
                    onClick={() => setVideoPlaying(true)}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative"
                    >
                      <div className="absolute inset-0 bg-yellow-400 rounded-full blur-2xl opacity-50 group-hover:opacity-70 transition-opacity" />
                      <div className="relative bg-white rounded-full p-8 shadow-2xl">
                        <svg
                          className="w-16 h-16 text-blue-600 ml-2"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </motion.div>
                    <div className="absolute bottom-8 left-0 right-0 text-center">
                      <p className="text-white text-xl font-semibold mb-2">
                        Klik untuk Menonton Demo
                      </p>
                      <p className="text-blue-200 text-sm">
                        Lihat bagaimana OpenBudget.ID membawa transparansi ke pengeluaran pemerintah
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                    <div className="text-center text-white p-8">
                      <svg
                        className="w-16 h-16 mx-auto mb-4 text-yellow-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      <h3 className="text-2xl font-bold mb-2">Placeholder Video Demo</h3>
                      <p className="text-gray-400 mb-4">
                        Ganti bagian ini dengan embed video Anda:
                      </p>
                      <code className="text-sm bg-gray-800 px-4 py-2 rounded block max-w-md mx-auto">
                        {'<iframe src="YOUR_VIDEO_URL" .../>'}
                      </code>
                      <p className="text-gray-500 text-sm mt-4">
                        Mendukung: YouTube, Vimeo, Loom, atau file video langsung
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              viewport={{ once: true }}
              className="mt-8 text-center"
            >
              <p className="text-gray-400 text-sm mb-4">
                💡 <strong>Tips:</strong> Masukkan URL video demo Anda di iframe di atas
              </p>
              <p className="text-gray-500 text-xs">
                Contoh: https://www.youtube.com/embed/YOUR_VIDEO_ID atau
                https://player.vimeo.com/video/YOUR_VIDEO_ID
              </p>
            </motion.div>
          </div>
        </section>

        {/* Features Showcase */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl font-bold text-gray-900 mb-4">⚡ Fitur Unggulan</h2>
              <p className="text-xl text-gray-600">
                Teknologi canggih untuk transparansi maksimal
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: '🏛️',
                  title: 'Ministry Admin Dashboard',
                  features: [
                    'Google OAuth login',
                    'Wallet integration (Phantom/Solflare)',
                    'Real-time blockchain publish',
                    'Milestone management',
                  ],
                  color: 'blue',
                },
                {
                  icon: '👥',
                  title: 'Public Citizen Dashboard',
                  features: [
                    'No login required',
                    'Real-time search & filter',
                    'Blockchain verification links',
                    'Indonesian localization',
                  ],
                  color: 'green',
                },
                {
                  icon: '🔄',
                  title: 'Self-Healing System',
                  features: [
                    'Auto-sync DB ↔ Blockchain',
                    'Manual verify/sync buttons',
                    'Database can be rebuilt',
                    'Production-ready resilience',
                  ],
                  color: 'purple',
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  viewport={{ once: true }}
                  className={`bg-${feature.color}-50 border-2 border-${feature.color}-200 rounded-2xl p-8 hover:shadow-2xl transition-all hover:-translate-y-2`}
                >
                  <div className="text-6xl mb-4 text-center">{feature.icon}</div>
                  <h3 className={`text-2xl font-bold text-${feature.color}-900 mb-4 text-center`}>
                    {feature.title}
                  </h3>
                  <ul className="space-y-2">
                    {feature.features.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <svg
                          className={`w-5 h-5 mr-2 text-${feature.color}-600 flex-shrink-0 mt-0.5`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Technical Excellence */}
        <section className="py-20 bg-gray-900 text-white">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl font-bold mb-4">🚀 Technical Stack</h2>
              <p className="text-xl text-gray-400">
                Built with cutting-edge technology
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700"
              >
                <h3 className="text-2xl font-bold mb-4 text-yellow-400">Blockchain Layer</h3>
                <ul className="space-y-3 text-gray-300">
                  <li>✅ Solana Agave 3.0.7</li>
                  <li>✅ Anchor Framework 0.32.1</li>
                  <li>✅ Rust 1.90.0</li>
                  <li>✅ 14/14 tests passing on devnet</li>
                  <li>✅ Program ID: RECtBgp4...JXFY</li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700"
              >
                <h3 className="text-2xl font-bold mb-4 text-blue-400">Application Layer</h3>
                <ul className="space-y-3 text-gray-300">
                  <li>✅ Next.js 14 App Router</li>
                  <li>✅ PostgreSQL 17.6 (10 indexes, &lt;1ms queries)</li>
                  <li>✅ NextAuth 4.24.5 (Google OAuth)</li>
                  <li>✅ Wallet Adapter (Phantom/Solflare)</li>
                  <li>✅ Tailwind CSS + Framer Motion</li>
                </ul>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              viewport={{ once: true }}
              className="mt-8 bg-gradient-to-r from-green-900 to-green-700 rounded-xl p-8 border border-green-500"
            >
              <h3 className="text-2xl font-bold mb-4 text-center">Performance Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {[
                  { label: 'Database Queries', value: '< 1ms', icon: '⚡' },
                  { label: 'Pages Compiled', value: '11/11', icon: '📄' },
                  { label: 'Test Coverage', value: '14/14', icon: '✅' },
                  { label: 'Build Time', value: '< 30s', icon: '🚀' },
                ].map((metric, i) => (
                  <div key={i}>
                    <div className="text-4xl mb-2">{metric.icon}</div>
                    <div className="text-3xl font-bold text-yellow-300">{metric.value}</div>
                    <div className="text-sm text-green-200 mt-1">{metric.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Smart Contract Architecture */}
        <section className="py-20 bg-gradient-to-br from-indigo-900 to-blue-900 text-white relative overflow-hidden">
          {/* Batik pattern overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='50' height='50' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12.5' cy='12.5' r='5' fill='%23F59E0B'/%3E%3Ccircle cx='37.5' cy='12.5' r='5' fill='%23F59E0B'/%3E%3Ccircle cx='12.5' cy='37.5' r='5' fill='%23F59E0B'/%3E%3Ccircle cx='37.5' cy='37.5' r='5' fill='%23F59E0B'/%3E%3Ccircle cx='25' cy='25' r='6' fill='%2378350F'/%3E%3C/svg%3E")`,
              backgroundSize: '50px 50px',
            }}
          />

          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl font-bold mb-4">⛓️ Arsitektur Solana Smart Contract</h2>
              <p className="text-xl text-blue-200 max-w-4xl mx-auto">
                Immutable, dapat diaudit, dan transparan — dibangun dengan Anchor Framework di Solana
              </p>
            </motion.div>

            {/* 4 Instructions */}
            <div className="mb-16">
              <h3 className="text-3xl font-bold text-center mb-8 text-yellow-300">
                4 Core Instructions
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    name: 'initialize_platform',
                    icon: '🏗️',
                    desc: 'Sets up global platform state with admin authority',
                    code: `pub fn initialize_platform(
  ctx: Context<InitializePlatform>
) -> Result<()>`,
                  },
                  {
                    name: 'initialize_project',
                    icon: '📋',
                    desc: 'Creates a new budget project on-chain',
                    code: `pub fn initialize_project(
  ctx: Context<InitializeProject>,
  project_id: String,
  title: String,
  ministry: String,
  total_budget: u64
) -> Result<()>`,
                  },
                  {
                    name: 'add_milestone',
                    icon: '📌',
                    desc: 'Adds spending milestone with budget validation',
                    code: `pub fn add_milestone(
  ctx: Context<AddMilestone>,
  project_id: String,
  index: u8,
  description: String,
  amount: u64
) -> Result<()>`,
                  },
                  {
                    name: 'release_funds',
                    icon: '💸',
                    desc: 'Immutable fund release with proof documentation',
                    code: `pub fn release_funds(
  ctx: Context<ReleaseFunds>,
  project_id: String,
  index: u8,
  proof_url: String
) -> Result<()>`,
                  },
                ].map((instruction, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    viewport={{ once: true }}
                    className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-yellow-400/50 transition-all"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-4xl">{instruction.icon}</span>
                      <h4 className="text-xl font-bold text-yellow-300">
                        {instruction.name}
                      </h4>
                    </div>
                    <p className="text-blue-100 mb-4 text-sm">{instruction.desc}</p>
                    <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto text-xs">
                      <code className="text-green-300 font-mono">{instruction.code}</code>
                    </pre>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Account Structures */}
            <div className="mb-16">
              <h3 className="text-3xl font-bold text-center mb-8 text-yellow-300">
                On-Chain Account Structures
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
                >
                  <h4 className="text-2xl font-bold mb-4 text-yellow-300">Project Account</h4>
                  <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto text-xs">
                    <code className="text-green-300 font-mono">{`#[account]
pub struct Project {
  pub id: String,              // 36 bytes
  pub title: String,           // 104 bytes
  pub ministry: String,        // 54 bytes
  pub total_budget: u64,       // Total allocated
  pub total_allocated: u64,    // Milestone sum
  pub total_released: u64,     // Released funds
  pub milestone_count: u8,
  pub created_at: i64,
  pub authority: Pubkey,       // Ministry wallet
}
// Total: 267 bytes`}</code>
                  </pre>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
                >
                  <h4 className="text-2xl font-bold mb-4 text-yellow-300">Milestone Account</h4>
                  <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto text-xs">
                    <code className="text-green-300 font-mono">{`#[account]
pub struct Milestone {
  pub project_id: String,      // 36 bytes
  pub index: u8,               // Position
  pub description: String,     // 204 bytes
  pub amount: u64,             // Budget amount
  pub is_released: bool,       // Release status
  pub released_at: Option<i64>,// Timestamp
  pub proof_url: String,       // 204 bytes
}
// Total: 471 bytes`}</code>
                  </pre>
                </motion.div>
              </div>
            </div>

            {/* PDA Derivation */}
            <div className="mb-16">
              <h3 className="text-3xl font-bold text-center mb-8 text-yellow-300">
                Program Derived Addresses (PDAs)
              </h3>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 max-w-4xl mx-auto"
              >
                <p className="text-blue-100 mb-4">
                  PDAs ensure deterministic account addresses — no private keys needed:
                </p>
                <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto text-xs mb-4">
                  <code className="text-cyan-300 font-mono">{`// TypeScript (Frontend)
import { PublicKey } from '@solana/web3.js';

const programId = new PublicKey(
  'RECtBgp43nvj5inPVW7qo1YN95RwXaYDxLX4dvuJXFY'
);

// Derive Project PDA
const [projectPda] = PublicKey.findProgramAddressSync(
  [Buffer.from('project'), Buffer.from(projectId)],
  programId
);

// Derive Milestone PDA
const [milestonePda] = PublicKey.findProgramAddressSync(
  [Buffer.from('milestone'), Buffer.from(projectId), Buffer.from([index])],
  programId
);`}</code>
                </pre>
                <p className="text-blue-200 text-sm">
                  ✅ Same seeds = Same address (verifiable by anyone)
                </p>
              </motion.div>
            </div>

            {/* Error Codes */}
            <div>
              <h3 className="text-3xl font-bold text-center mb-8 text-yellow-300">
                Error Handling
              </h3>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 max-w-5xl mx-auto"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {[
                    { code: 'ProjectIdTooLong', msg: 'Project ID must be 32 characters or less' },
                    { code: 'InvalidTitle', msg: 'Title must be between 1 and 100 characters' },
                    { code: 'InvalidBudget', msg: 'Budget must be greater than 0' },
                    {
                      code: 'InsufficientBudget',
                      msg: 'Milestone amount exceeds remaining budget',
                    },
                    { code: 'UnauthorizedAccess', msg: 'Only project authority can perform this' },
                    { code: 'MilestoneAlreadyReleased', msg: 'Milestone already released' },
                  ].map((error, i) => (
                    <div
                      key={i}
                      className="bg-red-900/30 border border-red-500/50 rounded-lg p-3"
                    >
                      <div className="font-mono text-red-300 font-bold mb-1">{error.code}</div>
                      <div className="text-red-100 text-xs">{error.msg}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              viewport={{ once: true }}
              className="mt-12 text-center"
            >
              <a
                href="https://explorer.solana.com/address/RECtBgp43nvj5inPVW7qo1YN95RwXaYDxLX4dvuJXFY?cluster=devnet"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold rounded-xl shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                </svg>
                View Smart Contract on Solana Explorer
              </a>
            </motion.div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl font-bold text-gray-900 mb-4">👨‍💻 Kenali Developer-nya</h2>
              <p className="text-xl text-gray-600">
                Developer solo yang bersemangat tentang transparansi blockchain
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200 shadow-xl relative overflow-hidden">
                {/* Batik decoration */}
                <div
                  className="absolute top-0 right-0 w-32 h-32 opacity-10"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='4' fill='%234F46E5'/%3E%3Ccircle cx='30' cy='10' r='4' fill='%234F46E5'/%3E%3Ccircle cx='10' cy='30' r='4' fill='%234F46E5'/%3E%3Ccircle cx='30' cy='30' r='4' fill='%234F46E5'/%3E%3C/svg%3E")`,
                    backgroundSize: '40px 40px',
                  }}
                />

                <div className="relative flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-50" />
                      <Image
                        src="https://avatars.githubusercontent.com/u/95009642?v=4"
                        alt="RECTOR"
                        width={128}
                        height={128}
                        className="relative w-32 h-32 rounded-full border-4 border-white shadow-xl"
                      />
                    </div>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">Thę Rēct◎r</h3>
                    <p className="text-lg text-blue-600 font-semibold mb-3">
                      Lead Developer & Blockchain Architect
                    </p>
                    <p className="text-gray-700 italic mb-4">&quot;Membangun untuk keabadian&quot;</p>

                    <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
                      <div className="bg-white rounded-lg px-4 py-2 shadow">
                        <div className="text-2xl font-bold text-blue-600">24</div>
                        <div className="text-xs text-gray-600">Repositories</div>
                      </div>
                      <div className="bg-white rounded-lg px-4 py-2 shadow">
                        <div className="text-2xl font-bold text-green-600">19</div>
                        <div className="text-xs text-gray-600">Followers</div>
                      </div>
                      <div className="bg-white rounded-lg px-4 py-2 shadow">
                        <div className="text-2xl font-bold text-purple-600">84</div>
                        <div className="text-xs text-gray-600">Following</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm">
                      <span className="flex items-center gap-1 text-gray-700">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
                            clipRule="evenodd"
                          />
                        </svg>
                        RECTOR LABS
                      </span>
                      <span className="flex items-center gap-1 text-gray-700">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Earth
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <a
                    href="https://github.com/rz1989s"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors cursor-pointer"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    GitHub
                  </a>
                  <a
                    href="https://twitter.com/rz1989sol"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors cursor-pointer"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                    </svg>
                    @rz1989sol
                  </a>
                  <a
                    href="https://docs.rectorspace.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                    </svg>
                    Website
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              viewport={{ once: true }}
              className="mt-12 text-center"
            >
              <p className="text-gray-600 max-w-3xl mx-auto">
                <strong>RECTOR</strong> is a full-stack blockchain developer specializing in Solana
                and Web3 applications. With expertise in Rust, Anchor, TypeScript, and Next.js, he
                builds production-ready decentralized applications that prioritize user experience
                and real-world impact. OpenBudget.ID represents his commitment to leveraging
                blockchain technology for social good and government transparency.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Judging Criteria Alignment */}
        <section className="py-20 bg-gradient-to-br from-purple-600 to-purple-800 text-white">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl font-bold mb-4">🏆 Kesesuaian Hackathon</h2>
              <p className="text-xl text-purple-100">
                Dirancang untuk unggul di setiap kriteria evaluasi
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  criteria: 'Potensi Dampak (35%)',
                  score: '⭐⭐⭐⭐⭐',
                  points: [
                    'Mengatasi korupsi & transparansi — masalah nasional kritis',
                    'Selaras sempurna dengan visi Digital Indonesia 2045',
                    'Dapat diskalakan ke semua kementerian & pemerintah daerah',
                  ],
                },
                {
                  criteria: 'Kelayakan Teknis (25%)',
                  score: '⭐⭐⭐⭐⭐',
                  points: [
                    'MVP yang sepenuhnya fungsional di-deploy di Solana devnet',
                    'Hybrid architecture yang solid (on-chain + off-chain)',
                    'Siap produksi dengan kemampuan self-healing',
                  ],
                },
                {
                  criteria: 'Innovation (20%)',
                  score: '⭐⭐⭐⭐⭐',
                  points: [
                    'Sistem sinkronisasi self-healing DB ↔ blockchain yang baru',
                    'Blockchain sebagai infrastruktur invisible (UX-first)',
                    'Bahasa desain yang terinspirasi batik Indonesia',
                  ],
                },
                {
                  criteria: 'Kelayakan Bisnis (20%)',
                  score: '⭐⭐⭐⭐⭐',
                  points: [
                    'Jalur adopsi yang jelas: pilot dengan 1 kementerian → skalakan secara nasional',
                    'Pemerintah sebagai pengguna utama — keberlanjutan yang kuat',
                    'Open API untuk integrasi NGO/media',
                  ],
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20"
                >
                  <h3 className="text-2xl font-bold mb-2">{item.criteria}</h3>
                  <div className="text-3xl mb-4">{item.score}</div>
                  <ul className="space-y-2 text-purple-100">
                    {item.points.map((point, i) => (
                      <li key={i} className="flex items-start">
                        <span className="mr-2 text-yellow-300">✓</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-br from-yellow-500 to-yellow-600 relative overflow-hidden">
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
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                Mari Wujudkan Indonesia yang Lebih Transparan
              </h2>
              <p className="text-2xl text-gray-800 mb-8">
                OpenBudget.ID bukan hanya aplikasi — ini adalah gerakan menuju pemerintahan yang
                lebih akuntabel dan dapat dipercaya.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="/"
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                >
                  🏠 Lihat Dashboard Publik
                </a>
                <a
                  href="/admin"
                  className="px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                >
                  🏛️ Panel Admin Kementerian
                </a>
                <a
                  href="https://explorer.solana.com/address/RECtBgp43nvj5inPVW7qo1YN95RwXaYDxLX4dvuJXFY?cluster=devnet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                >
                  🔗 Verifikasi di Solana Explorer
                </a>
              </div>

              <div className="mt-12 text-gray-800">
                <p className="text-lg font-semibold mb-2">
                  Built for Garuda Spark 2025 🇮🇩
                </p>
                <p className="text-sm">
                  Superteam Indonesia × Ministry of Communication and Digital Affairs × Ministry of
                  Creative Economy
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
