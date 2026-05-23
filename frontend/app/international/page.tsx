'use client';

import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';

export default function InternationalPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        {/* Hero */}
        <section className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-blue-900 text-white relative overflow-hidden pt-20">
          <div className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='15' cy='15' r='4' fill='%23F59E0B'/%3E%3Ccircle cx='45' cy='15' r='4' fill='%23F59E0B'/%3E%3Ccircle cx='15' cy='45' r='4' fill='%23F59E0B'/%3E%3Ccircle cx='45' cy='45' r='4' fill='%23F59E0B'/%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px',
            }}
          />
          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-center mb-6">
                <Image src="/logo-icon.svg" alt="OpenBudget" width={72} height={72} />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Public budget transparency,<br />
                <span className="text-yellow-300">verified on Solana</span>
              </h1>
              <p className="text-xl md:text-2xl font-light mb-10 text-blue-100 max-w-3xl mx-auto">
                Built and validated in Indonesia&apos;s national hackathon.
                Ready for any institution that handles public money — including foreign aid.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/"
                  className="px-8 py-3 bg-yellow-400 text-blue-900 rounded-lg font-semibold hover:bg-yellow-300 transition"
                >
                  Try the live demo →
                </Link>
                <Link
                  href="/international/brief"
                  className="px-8 py-3 bg-white/10 border border-white/30 text-white rounded-lg font-semibold hover:bg-white/20 transition"
                >
                  Read the 1-page brief →
                </Link>
              </div>
              <div className="mt-10 flex flex-wrap justify-center gap-3 text-sm">
                <span className="px-4 py-1 bg-green-600/80 rounded-full">🏆 2nd Place — Garuda Spark Hackathon</span>
                <span className="px-4 py-1 bg-blue-600/80 rounded-full">🇮🇩 Endorsed by Indonesia&apos;s Komdigi + Ekraf</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Trust Gap — Problem */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                The trust gap is everywhere
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Wherever money flows through institutions, accountability is slow,
                manual, and easy to manipulate. Donors and citizens are left guessing.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Government budgets',
                  body: 'Annual reports arrive months late. Spending data lives in PDFs that can be amended. Citizens can&apos;t verify how their tax money is actually used.',
                  accent: 'bg-red-50 border-red-200',
                  iconBg: 'bg-red-100 text-red-600',
                  icon: '🏛️',
                },
                {
                  title: 'NGOs &amp; foundations',
                  body: 'Donors trust quarterly impact reports. When something feels off, there&apos;s no real-time way to audit how funds were spent — only the next report cycle.',
                  accent: 'bg-orange-50 border-orange-200',
                  iconBg: 'bg-orange-100 text-orange-600',
                  icon: '🤝',
                },
                {
                  title: 'Foreign aid',
                  body: 'Agencies send billions across borders, then rely on recipient governments&apos; own reporting. Tracking the last mile of aid is a chronic, expensive problem.',
                  accent: 'bg-amber-50 border-amber-200',
                  iconBg: 'bg-amber-100 text-amber-600',
                  icon: '🌍',
                },
              ].map((card, i) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-8 rounded-xl border-2 ${card.accent}`}
                >
                  <div className={`w-14 h-14 rounded-full ${card.iconBg} flex items-center justify-center text-3xl mb-4`}>
                    {card.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{card.title}</h3>
                  <p className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: card.body }} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works — Solution */}
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                How OpenBudget works
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Every spending milestone is recorded on the Solana blockchain.
                Citizens and donors verify the real transaction, in real time, without
                trusting any single party.
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  num: '01',
                  title: 'Institution registers project',
                  body: 'Set budget, milestones, and authorized signers. All metadata stored on-chain.',
                },
                {
                  num: '02',
                  title: 'Publishes to Solana',
                  body: 'A blockchain account is created. From here on, the project record is immutable.',
                },
                {
                  num: '03',
                  title: 'Releases funds per milestone',
                  body: 'Each spending milestone is signed and timestamped on-chain with a proof link.',
                },
                {
                  num: '04',
                  title: 'Anyone verifies in real time',
                  body: 'Citizens, donors, auditors query the chain directly. No quarterly reports needed.',
                },
              ].map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100"
                >
                  <div className="text-5xl font-bold text-blue-200 mb-3">{step.num}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{step.body}</p>
                </motion.div>
              ))}
            </div>
            <div className="mt-12 p-6 bg-blue-50 border border-blue-100 rounded-xl text-center max-w-3xl mx-auto">
              <p className="text-gray-800">
                <strong>Hybrid architecture:</strong> The blockchain is the single source of truth.
                A PostgreSQL cache makes browsing fast. If the cache ever drifts, the system
                automatically heals from on-chain state.
              </p>
            </div>
          </div>
        </section>

        {/* Proof */}
        <section className="py-24 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Battle-tested, not vaporware
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                OpenBudget won 2nd place at Indonesia&apos;s national Garuda Spark
                Hackathon — organized by two government ministries and Superteam Indonesia.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="p-8 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center mb-4">
                  <span className="text-4xl mr-3">🏆</span>
                  <div>
                    <div className="text-2xl font-bold">2nd Place</div>
                    <div className="text-gray-400 text-sm">Garuda Spark Hackathon (Oct 2025)</div>
                  </div>
                </div>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li className="flex"><span className="text-green-400 mr-2">✓</span> Prize: 1,500 USDC</li>
                  <li className="flex"><span className="text-green-400 mr-2">✓</span> Organized by Superteam Indonesia</li>
                  <li className="flex"><span className="text-green-400 mr-2">✓</span> Endorsed by Ministry of Communication (Komdigi)</li>
                  <li className="flex"><span className="text-green-400 mr-2">✓</span> Endorsed by Ministry of Creative Economy (Ekraf)</li>
                </ul>
              </div>
              <div className="p-8 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center mb-4">
                  <span className="text-4xl mr-3">⚙️</span>
                  <div>
                    <div className="text-2xl font-bold">Production-ready stack</div>
                    <div className="text-gray-400 text-sm">Live, deployed, working today</div>
                  </div>
                </div>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li className="flex"><span className="text-blue-400 mr-2">→</span> Solana blockchain (Anchor program on devnet)</li>
                  <li className="flex"><span className="text-blue-400 mr-2">→</span> Next.js 14 frontend</li>
                  <li className="flex"><span className="text-blue-400 mr-2">→</span> Self-healing PostgreSQL cache</li>
                  <li className="flex"><span className="text-blue-400 mr-2">→</span> Public dashboard + admin tools + analytics</li>
                </ul>
              </div>
            </div>
            <div className="text-center">
              <Link
                href="/"
                className="inline-block px-8 py-3 bg-yellow-400 text-gray-900 rounded-lg font-semibold hover:bg-yellow-300 transition"
              >
                See the live deployment →
              </Link>
            </div>
          </div>
        </section>

        {/* The Next Level */}
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Where this fits next
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                OpenBudget&apos;s architecture is institution-agnostic. The same trust
                primitive applies anywhere public money flows.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {[
                {
                  title: 'National &amp; municipal budgets',
                  body: 'Any government wanting tamper-proof spending records that citizens can verify directly.',
                },
                {
                  title: 'Foundations &amp; NGOs',
                  body: 'Donor-funded organizations giving stakeholders real-time visibility into program spending.',
                },
                {
                  title: 'Religious institutions',
                  body: 'Mosques, churches, temples, zakat / waqf bodies handling donations — full transparency restores donor trust.',
                },
                {
                  title: 'Universities &amp; research grants',
                  body: 'Grant recipients reporting milestone spending to funding bodies in real time, not via annual PDFs.',
                },
              ].map((u, i) => (
                <motion.div
                  key={u.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 bg-gray-50 rounded-xl border border-gray-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2" dangerouslySetInnerHTML={{ __html: u.title }} />
                  <p className="text-gray-700">{u.body}</p>
                </motion.div>
              ))}
            </div>

            {/* Foreign Aid Spotlight */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-10 bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-2xl"
            >
              <div className="flex items-start gap-4 mb-4">
                <span className="text-5xl">✈️</span>
                <div>
                  <div className="text-sm uppercase tracking-wide text-blue-200 mb-1">Spotlight use case</div>
                  <h3 className="text-3xl font-bold">Foreign aid transparency</h3>
                </div>
              </div>
              <p className="text-lg text-blue-50 leading-relaxed mb-4">
                Aid agencies send billions across borders annually, then rely on recipient
                governments&apos; own quarterly reports. There&apos;s no real-time, tamper-proof
                way to verify the last mile of aid spending.
              </p>
              <p className="text-lg text-blue-50 leading-relaxed">
                OpenBudget was built and validated by an Indonesian government hackathon —
                a recipient country&apos;s own technologists endorsed it. An aid agency can
                deploy the same primitive to verify exactly how its funds are spent by recipient
                ministries, in real time, without trusting periodic reports.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Get In Touch */}
        <section className="py-24 bg-gray-50 border-t border-gray-200">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Bring this to your institution
            </h2>
            <p className="text-xl text-gray-600 mb-10">
              We&apos;re looking for the next institution to deploy OpenBudget. If your
              organization handles public money — a government, foundation, NGO, or aid
              agency — get in touch.
            </p>
            <div className="inline-flex flex-col sm:flex-row gap-4">
              <a
                href="mailto:rector@rectorspace.com?subject=OpenBudget%20-%20Institutional%20Inquiry"
                className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-lg"
              >
                Email rector@rectorspace.com
              </a>
              <Link
                href="/international/brief"
                className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-50 transition text-lg"
              >
                Download 1-page brief →
              </Link>
            </div>
            <p className="mt-10 text-sm text-gray-500">
              Currently on Solana devnet. Mainnet deployment available on request for committed pilots.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
