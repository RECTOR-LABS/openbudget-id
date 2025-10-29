'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  question: string;
  answer: string;
  icon: string;
}

export default function HelpResources() {
  const [activeTab, setActiveTab] = useState<'faq' | 'guide' | 'video'>('faq');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: 'Bagaimana cara membuat proyek baru?',
      answer:
        'Klik tombol "Create New Project" di dashboard. Isi form dengan judul proyek, deskripsi, total anggaran, dan informasi lainnya. Setelah disimpan, proyek akan berstatus "draft" dan bisa diedit sebelum dipublikasikan.',
      icon: '📝',
    },
    {
      question: 'Apa yang terjadi saat saya publish proyek?',
      answer:
        'Saat publish, proyek Anda akan dicatat ke blockchain Solana. Data menjadi immutable (tidak bisa diubah/dihapus). Anda perlu menandatangani transaksi dengan wallet Solana. Setelah di-publish, proyek bisa dilihat publik oleh warga.',
      icon: '🔗',
    },
    {
      question: 'Bagaimana cara menambahkan milestone?',
      answer:
        'Setelah proyek di-publish, buka halaman detail proyek dan klik "Add Milestone". Isi deskripsi milestone, jumlah alokasi, dan target tanggal. Total alokasi semua milestone tidak boleh melebihi total anggaran proyek.',
      icon: '📌',
    },
    {
      question: 'Apa itu release funds dan bagaimana cara melakukannya?',
      answer:
        'Release funds adalah pencairan dana untuk milestone yang sudah selesai. Upload bukti dokumen (link/URL) terlebih dahulu, lalu klik tombol "Release Funds". Transaksi akan dicatat permanen di blockchain dan tidak bisa dibatalkan.',
      icon: '💸',
    },
    {
      question: 'Apakah data bisa diedit setelah di-publish?',
      answer:
        'Tidak. Setelah proyek di-publish ke blockchain, data menjadi immutable (tidak bisa diubah). Ini adalah fitur keamanan untuk mencegah manipulasi data. Pastikan semua data sudah benar sebelum publish!',
      icon: '🔒',
    },
    {
      question: 'Bagaimana cara memverifikasi data di blockchain?',
      answer:
        'Setiap proyek yang di-publish memiliki link "View on Solana Explorer". Klik link tersebut untuk melihat data asli di blockchain Solana. Anda bisa verifikasi bahwa data di platform sama dengan data on-chain.',
      icon: '🔍',
    },
    {
      question: 'Apa itu Trust Score dan bagaimana cara kerjanya?',
      answer:
        'Trust Score adalah rating dari warga negara (1-5 bintang) terhadap proyek Anda. Rating tinggi menunjukkan kepercayaan publik yang baik. Warga bisa memberi rating setelah melihat detail proyek dan progress milestone.',
      icon: '⭐',
    },
    {
      question: 'Bagaimana cara menanggapi komentar warga?',
      answer:
        'Anda bisa membalas komentar warga di halaman detail proyek (section Comments). Balasan Anda akan ditandai sebagai "Official Response" sehingga mudah dikenali oleh publik. Respon cepat meningkatkan trust score.',
      icon: '💬',
    },
  ];

  const quickGuide = [
    {
      icon: '🚀',
      title: 'Quick Start',
      steps: [
        '1. Connect Wallet Solana',
        '2. Create Draft Project',
        '3. Publish to Blockchain',
        '4. Add Milestones',
        '5. Release Funds',
      ],
    },
    {
      icon: '💡',
      title: 'Best Practices',
      steps: [
        'Gunakan deskripsi yang jelas dan detail',
        'Upload bukti dokumen sebelum release funds',
        'Balas komentar warga dengan responsif',
        'Monitor trust score secara berkala',
        'Verifikasi data di Solana Explorer',
      ],
    },
    {
      icon: '⚠️',
      title: 'Common Mistakes',
      steps: [
        'Lupa connect wallet sebelum publish',
        'Total milestone melebihi total budget',
        'Data salah dan sudah terlanjur publish',
        'Tidak upload proof sebelum release',
        'Mengabaikan komentar dan laporan warga',
      ],
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Tabs */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="flex">
          {[
            { id: 'faq' as const, label: 'FAQ', icon: '❓' },
            { id: 'guide' as const, label: 'Quick Guide', icon: '📖' },
            { id: 'video' as const, label: 'Video Tutorial', icon: '🎥' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <motion.div
              key="faq"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-6 py-4 flex items-start gap-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-2xl flex-shrink-0">{faq.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{faq.question}</h4>
                    </div>
                    <motion.svg
                      animate={{ rotate: openFaq === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-5 h-5 text-gray-400 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </motion.svg>
                  </button>

                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-4 pl-16">
                          <p className="text-gray-600">{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>
          )}

          {/* Quick Guide Tab */}
          {activeTab === 'guide' && (
            <motion.div
              key="guide"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid md:grid-cols-3 gap-6"
            >
              {quickGuide.map((guide, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6"
                >
                  <div className="text-4xl mb-3 text-center">{guide.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
                    {guide.title}
                  </h3>
                  <ul className="space-y-2">
                    {guide.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-blue-600 font-bold">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Video Tutorial Tab */}
          {activeTab === 'video' && (
            <motion.div
              key="video"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center"
            >
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-12 mb-6">
                <motion.div
                  className="text-8xl mb-6"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🎥
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Video Tutorial Coming Soon
                </h3>
                <p className="text-gray-600 mb-6 max-w-xl mx-auto">
                  Kami sedang membuat video tutorial lengkap untuk membantu Anda memaksimalkan
                  penggunaan platform OpenBudget.ID.
                </p>
                <div className="flex justify-center gap-4">
                  <a
                    href="/pitch-deck"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    Lihat Pitch Deck
                  </a>
                  <a
                    href="/api-docs"
                    className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    Lihat API Docs
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                {[
                  {
                    title: 'Tutorial 1: Setup Wallet',
                    duration: '3 min',
                    description: 'Cara install dan setup wallet Solana',
                    status: 'Coming Soon',
                  },
                  {
                    title: 'Tutorial 2: Create Project',
                    duration: '5 min',
                    description: 'Langkah-langkah membuat dan publish proyek',
                    status: 'Coming Soon',
                  },
                  {
                    title: 'Tutorial 3: Manage Milestones',
                    duration: '4 min',
                    description: 'Add milestone dan release funds',
                    status: 'Coming Soon',
                  },
                  {
                    title: 'Tutorial 4: Citizen Engagement',
                    duration: '3 min',
                    description: 'Respond ke komentar dan monitor trust score',
                    status: 'Coming Soon',
                  },
                ].map((video, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4 opacity-50"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{video.title}</h4>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                        {video.duration}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{video.description}</p>
                    <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded">
                      {video.status}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 border-t border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Butuh bantuan lebih lanjut? Hubungi support kami:
          </p>
          <div className="flex gap-3">
            <a
              href="mailto:support@openbudget.id"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              📧 Email Support
            </a>
            <a
              href="https://github.com/rz1989s/openbudget-garuda-spark"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              💻 GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
