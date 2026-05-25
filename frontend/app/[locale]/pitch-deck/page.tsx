'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function PitchDeckPage() {
  const t = useTranslations('pitchDeck');
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

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
                {t('hero.subhead')}
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <span className="px-6 py-2 bg-green-600 text-white rounded-full font-semibold">
                  🏆 {t('hero.badge1')}
                </span>
                <span className="px-6 py-2 bg-purple-600 text-white rounded-full font-semibold">
                  ⚡ {t('hero.badge2')}
                </span>
                <span className="px-6 py-2 bg-yellow-600 text-white rounded-full font-semibold">
                  🇮🇩 {t('hero.badge3')}
                </span>
              </div>
              <p className="text-lg text-blue-200 max-w-3xl mx-auto">
                {t('hero.description')}
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
              <h2 className="text-5xl font-bold text-gray-900 mb-6">💔 {t('problem.title')}</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t('problem.subtitle')}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {(t.raw('problem.cards') as Array<{ icon: string; title: string; description: string; stat: string; statLabel: string }>).map((problem, index) => (
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
              <h2 className="text-5xl font-bold mb-6">✨ {t('solution.title')}</h2>
              <p className="text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
                {t('solution.subtextBefore')}
                <span className="text-yellow-300 font-semibold"> immutable </span>
                {t('solution.subtextMid1')}
                <span className="text-yellow-300 font-semibold"> transparent </span>
                {t('solution.subtextMid2')}
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
                <h3 className="text-3xl font-bold mb-6">{t('solution.howTitle')}</h3>
                <div className="space-y-4">
                  {(t.raw('solution.steps') as Array<{ step: string; title: string; desc: string }>).map((item) => (
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
                <h4 className="text-2xl font-bold mb-6 text-center">{t('solution.archTitle')}</h4>
                <div className="space-y-4 text-sm">
                  <div className="bg-blue-900/50 rounded-lg p-4 border border-blue-400">
                    <div className="font-bold mb-2 text-yellow-300">🔗 On-Chain (Solana)</div>
                    <div className="text-blue-100">
                      {t('solution.archOnChain')}
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
                      {t('solution.archOffChain')}
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
                      {t('solution.archBridge')}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
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
              <h2 className="text-5xl font-bold text-gray-900 mb-4">⚡ {t('features.title')}</h2>
              <p className="text-xl text-gray-600">
                {t('features.subtitle')}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {(t.raw('features.items') as Array<{ icon: string; title: string; features: string[]; color: string }>).map((feature, index) => (
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
              <h2 className="text-5xl font-bold mb-4">🚀 {t('techStack.title')}</h2>
              <p className="text-xl text-gray-400">
                {t('techStack.subtitle')}
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
              <h3 className="text-2xl font-bold mb-4 text-center">{t('techStack.perfTitle')}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {(t.raw('techStack.metrics') as Array<{ label: string; value: string; icon: string }>).map((metric, i) => (
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
              <h2 className="text-5xl font-bold mb-4">⛓️ {t('smartContract.title')}</h2>
              <p className="text-xl text-blue-200 max-w-4xl mx-auto">
                {t('smartContract.subtitle')}
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
              <h2 className="text-5xl font-bold text-gray-900 mb-4">👨‍💻 {t('team.title')}</h2>
              <p className="text-xl text-gray-600">
                {t('team.subtitle')}
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
                      {t('team.role')}
                    </p>
                    <p className="text-gray-700 italic mb-4">&quot;{t('team.quote')}&quot;</p>

                    <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
                      <div className="bg-white rounded-lg px-4 py-2 shadow">
                        <div className="text-2xl font-bold text-blue-600">24</div>
                        <div className="text-xs text-gray-600">{t('team.repositories')}</div>
                      </div>
                      <div className="bg-white rounded-lg px-4 py-2 shadow">
                        <div className="text-2xl font-bold text-green-600">19</div>
                        <div className="text-xs text-gray-600">{t('team.followers')}</div>
                      </div>
                      <div className="bg-white rounded-lg px-4 py-2 shadow">
                        <div className="text-2xl font-bold text-purple-600">84</div>
                        <div className="text-xs text-gray-600">{t('team.following')}</div>
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
                {t('team.bio')}
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
              <h2 className="text-5xl font-bold mb-4">🏆 {t('hackathon.title')}</h2>
              <p className="text-xl text-purple-100">
                {t('hackathon.subtitle')}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {(t.raw('hackathon.criteria') as Array<{ criteria: string; score: string; points: string[] }>).map((item, index) => (
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
                {t('cta.headline')}
              </h2>
              <p className="text-2xl text-gray-800 mb-8">
                {t('cta.subhead')}
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="/"
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                >
                  🏠 {t('cta.publicDashboard')}
                </a>
                <a
                  href="/admin"
                  className="px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                >
                  🏛️ {t('cta.adminPanel')}
                </a>
                <a
                  href="https://explorer.solana.com/address/RECtBgp43nvj5inPVW7qo1YN95RwXaYDxLX4dvuJXFY?cluster=devnet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                >
                  🔗 {t('cta.verifyExplorer')}
                </a>
              </div>

              <div className="mt-12 text-gray-800">
                <p className="text-lg font-semibold mb-2">
                  {t('cta.builtFor')} 🇮🇩
                </p>
                <p className="text-sm">
                  {t('cta.organizers')}
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
