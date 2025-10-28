'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';

interface OnboardingWizardProps {
  onComplete: () => void;
  onSkip: () => void;
}

export default function OnboardingWizard({ onComplete, onSkip }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { connected, publicKey } = useWallet();
  const [showConfetti, setShowConfetti] = useState(false);

  const steps = [
    {
      title: 'Selamat Datang di OpenBudget.ID!',
      subtitle: 'Platform Transparansi Anggaran Berbasis Blockchain',
      content: (
        <div className="text-center">
          <motion.div
            className="text-8xl mb-6"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            👋
          </motion.div>
          <p className="text-lg text-gray-700 mb-4">
            Kami akan memandu Anda melalui fitur-fitur utama platform ini.
          </p>
          <p className="text-gray-600">
            Proses ini hanya memakan waktu <strong>2-3 menit</strong> dan akan membantu Anda memahami
            cara kerja sistem.
          </p>
        </div>
      ),
    },
    {
      title: 'Hubungkan Wallet Solana',
      subtitle: 'Diperlukan untuk publish proyek ke blockchain',
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
            {connected ? (
              <>
                <motion.div
                  className="text-6xl mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  ✅
                </motion.div>
                <h4 className="text-xl font-bold text-green-700 mb-2">Wallet Terhubung!</h4>
                <p className="text-gray-700 font-mono text-sm">
                  {publicKey?.toBase58().slice(0, 8)}...{publicKey?.toBase58().slice(-8)}
                </p>
              </>
            ) : (
              <>
                <motion.div
                  className="text-6xl mb-4"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  🔌
                </motion.div>
                <h4 className="text-xl font-bold text-blue-900 mb-2">Belum Terhubung</h4>
                <p className="text-gray-700 mb-4">
                  Klik tombol &quot;Connect Wallet&quot; di pojok kanan atas untuk menghubungkan wallet Anda.
                </p>
                <p className="text-sm text-gray-600">
                  Kami mendukung: <strong>Phantom</strong> dan <strong>Solflare</strong>
                </p>
              </>
            )}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div className="flex-1 text-sm">
                <p className="font-semibold text-yellow-900 mb-1">Mengapa perlu wallet?</p>
                <p className="text-yellow-800">
                  Wallet Solana berfungsi sebagai &quot;tanda tangan digital&quot; yang memastikan hanya Anda
                  yang bisa publish dan update proyek anggaran kementerian Anda.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Dashboard Kementerian Anda',
      subtitle: 'Pusat kontrol untuk semua proyek anggaran',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                icon: '📊',
                title: 'Project Stats',
                description: 'Lihat total proyek, completion rate, dan budget utilization',
                color: 'blue',
              },
              {
                icon: '💰',
                title: 'Budget Insights',
                description: 'Monitor total anggaran yang dialokasikan dan dicairkan',
                color: 'green',
              },
              {
                icon: '⭐',
                title: 'Trust Score',
                description: 'Rating dari warga terhadap proyek Anda',
                color: 'yellow',
              },
              {
                icon: '📋',
                title: 'Recent Activity',
                description: 'Timeline aktivitas terbaru kementerian Anda',
                color: 'purple',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className={`bg-${item.color}-50 border border-${item.color}-200 rounded-lg p-4 text-center`}
              >
                <div className="text-4xl mb-2">{item.icon}</div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">{item.title}</h4>
                <p className="text-xs text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-700 text-center">
              Dashboard ini memberikan gambaran lengkap tentang performa transparansi anggaran
              kementerian Anda.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Cara Membuat & Publish Proyek',
      subtitle: 'Langkah-langkah mencatat anggaran ke blockchain',
      content: (
        <div className="space-y-3">
          {[
            {
              step: '1',
              title: 'Buat Proyek Draft',
              description: 'Isi detail proyek: judul, deskripsi, total anggaran',
              icon: '📝',
            },
            {
              step: '2',
              title: 'Tambahkan Milestones',
              description: 'Bagi anggaran menjadi milestone dengan target waktu',
              icon: '📌',
            },
            {
              step: '3',
              title: 'Publish ke Blockchain',
              description: 'Tanda tangan dengan wallet untuk mencatat ke Solana',
              icon: '🔗',
            },
            {
              step: '4',
              title: 'Release Funds',
              description: 'Cairkan dana per milestone dengan upload bukti',
              icon: '💸',
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ x: 10 }}
              className="flex items-start gap-4 bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                {item.step}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{item.icon}</span>
                  <h4 className="font-semibold text-gray-900">{item.title}</h4>
                </div>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </motion.div>
          ))}

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🔒</span>
              <p className="text-sm text-green-800">
                <strong>Immutable:</strong> Setelah di-publish, data tidak bisa diubah atau dihapus.
                Pastikan data sudah benar sebelum publish!
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Transparansi & Akuntabilitas',
      subtitle: 'Apa yang dilihat warga negara',
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
            <h4 className="font-semibold text-gray-900 mb-4 text-center">
              Setiap Proyek Anda Bisa Dilihat oleh:
            </h4>

            <div className="space-y-3">
              {[
                {
                  icon: '👥',
                  title: 'Warga Negara',
                  action: 'Memantau progress, memberi rating, dan komentar',
                },
                {
                  icon: '📰',
                  title: 'Media & Jurnalis',
                  action: 'Investigasi dan liputan transparansi anggaran',
                },
                {
                  icon: '🔍',
                  title: 'Auditor & BPK',
                  action: 'Audit real-time tanpa menunggu laporan',
                },
                {
                  icon: '🏛️',
                  title: 'DPR & Stakeholder',
                  action: 'Oversight dan pengawasan anggaran negara',
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 bg-white rounded-lg p-3"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                    <p className="text-xs text-gray-600">{item.action}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-900 text-center">
              ✨ Transparansi bukan ancaman, tapi bukti <strong>akuntabilitas</strong> dan{' '}
              <strong>integritas</strong> kementerian Anda.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Siap Memulai!',
      subtitle: 'Anda siap menggunakan OpenBudget.ID',
      content: (
        <div className="text-center">
          <motion.div
            className="text-8xl mb-6"
            animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
            transition={{ duration: 2 }}
          >
            🎉
          </motion.div>

          <h4 className="text-2xl font-bold text-gray-900 mb-4">Selamat!</h4>
          <p className="text-lg text-gray-700 mb-6">
            Anda telah menyelesaikan panduan awal. Sekarang Anda siap untuk:
          </p>

          <div className="grid grid-cols-1 gap-3 max-w-md mx-auto mb-6">
            {[
              { icon: '📝', text: 'Membuat proyek anggaran baru' },
              { icon: '🔗', text: 'Publish ke blockchain Solana' },
              { icon: '📊', text: 'Memantau progress dan engagement' },
              { icon: '💬', text: 'Berinteraksi dengan warga' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-3"
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-gray-700 font-medium">{item.text}</span>
                <span className="ml-auto text-green-600 font-bold">✓</span>
              </motion.div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              💡 <strong>Tips:</strong> Jika ada pertanyaan, klik tombol &quot;Help&quot; di menu sidebar atau
              kunjungi halaman dokumentasi.
            </p>
          </div>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowConfetti(true);
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Progress Bar */}
        <div className="h-2 bg-gray-200">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Step Counter */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
              <span>Langkah {currentStep + 1}</span>
              <span className="text-blue-400">dari</span>
              <span>{steps.length}</span>
            </div>
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                {steps[currentStep].title}
              </h2>
              <p className="text-gray-600 mb-8 text-center">{steps[currentStep].subtitle}</p>

              <div className="mb-8">{steps[currentStep].content}</div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-6 bg-gray-50 flex items-center justify-between">
          <button
            onClick={onSkip}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            Skip Tour
          </button>

          <div className="flex items-center gap-3">
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors"
              >
                ← Kembali
              </button>
            )}

            <motion.button
              onClick={handleNext}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-bold shadow-lg transition-all"
            >
              {currentStep === steps.length - 1 ? '🎉 Mulai Sekarang!' : 'Lanjut →'}
            </motion.button>
          </div>
        </div>

        {/* Confetti Effect (on completion) */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-10%`,
                }}
                initial={{ y: 0, opacity: 1, rotate: 0 }}
                animate={{
                  y: '110vh',
                  opacity: 0,
                  rotate: Math.random() * 720,
                }}
                transition={{
                  duration: Math.random() * 2 + 2,
                  delay: Math.random() * 0.5,
                }}
              >
                {['🎉', '🎊', '✨', '⭐', '🌟'][Math.floor(Math.random() * 5)]}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
