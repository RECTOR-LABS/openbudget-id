'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function BriefPage() {
  return (
    <>
      {/* Screen-only print instructions banner */}
      <div className="print:hidden bg-blue-50 border-b border-blue-200 px-6 py-3 text-center text-sm text-blue-900">
        <strong>📄 Print this brief:</strong> Press <kbd className="px-2 py-0.5 bg-white border border-blue-300 rounded font-mono text-xs">Cmd+P</kbd> (Mac) or <kbd className="px-2 py-0.5 bg-white border border-blue-300 rounded font-mono text-xs">Ctrl+P</kbd> (Win) → choose &ldquo;Save as PDF&rdquo;.
        {' '}
        <Link href="/international" className="underline hover:text-blue-700">← Back to full page</Link>
      </div>

      <main className="max-w-4xl mx-auto px-8 py-12 print:py-6 print:px-6 bg-white text-gray-900">
        {/* Header */}
        <header className="flex items-center justify-between border-b-2 border-gray-900 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <Image src="/logo-icon.svg" alt="OpenBudget" width={48} height={48} />
            <div>
              <div className="text-2xl font-bold">OpenBudget</div>
              <div className="text-sm text-gray-600">Institutional Brief</div>
            </div>
          </div>
          <div className="text-right text-xs text-gray-600">
            <div>openbudget.rectorspace.com</div>
            <div>rector@rectorspace.com</div>
          </div>
        </header>

        {/* Headline */}
        <section className="mb-6">
          <h1 className="text-3xl font-bold mb-2 leading-tight">
            Public budget transparency, verified on Solana.
          </h1>
          <p className="text-base text-gray-700 italic">
            Built and validated in Indonesia&apos;s national hackathon. Ready for any
            institution that handles public money — including foreign aid.
          </p>
        </section>

        {/* The Problem */}
        <section className="mb-6">
          <h2 className="text-lg font-bold text-blue-900 uppercase tracking-wide mb-2">The Problem</h2>
          <p className="text-sm text-gray-800 leading-relaxed">
            Wherever money flows through institutions — governments, NGOs, foundations,
            foreign aid agencies — accountability lags reality. Quarterly PDF reports are
            slow, easy to amend, and force donors and citizens to trust periodic summaries
            rather than verify actual spending. The trust gap is structural, not technical.
          </p>
        </section>

        {/* The Solution */}
        <section className="mb-6">
          <h2 className="text-lg font-bold text-blue-900 uppercase tracking-wide mb-2">The Solution</h2>
          <p className="text-sm text-gray-800 leading-relaxed mb-3">
            OpenBudget records every spending milestone as an immutable transaction on the
            Solana blockchain. Citizens and donors verify the real transaction in real time,
            without trusting any single party. A hybrid architecture pairs the on-chain ledger
            (truth) with a fast PostgreSQL cache (browsing) — and the cache self-heals from
            chain state if they ever drift.
          </p>
          <div className="text-xs bg-gray-50 border border-gray-200 rounded p-3 font-mono">
            Institution → Registers project on-chain → Releases funds per milestone (signed, timestamped, proof-linked) → Anyone queries the chain directly
          </div>
        </section>

        {/* The Proof */}
        <section className="mb-6">
          <h2 className="text-lg font-bold text-blue-900 uppercase tracking-wide mb-2">The Proof</h2>
          <ul className="text-sm text-gray-800 space-y-1.5">
            <li>✓ <strong>2nd Place</strong> — Garuda Spark Hackathon (Oct 2025), 1,500 USDC prize</li>
            <li>✓ Organized by <strong>Superteam Indonesia</strong></li>
            <li>✓ Endorsed by <strong>Indonesia&apos;s Ministry of Communication</strong> (Komdigi)</li>
            <li>✓ Endorsed by <strong>Indonesia&apos;s Ministry of Creative Economy</strong> (Ekraf)</li>
            <li>✓ <strong>Live, deployed system</strong>: openbudget.rectorspace.com</li>
            <li>✓ Stack: Solana (Anchor) + Next.js 14 + PostgreSQL + Phantom/Solflare wallets</li>
          </ul>
        </section>

        {/* The Next Level */}
        <section className="mb-6">
          <h2 className="text-lg font-bold text-blue-900 uppercase tracking-wide mb-2">The Next Level</h2>
          <p className="text-sm text-gray-800 leading-relaxed">
            OpenBudget&apos;s architecture is institution-agnostic. The same trust primitive
            applies to <strong>national budgets, foundations, NGOs, religious institutions, and
            university grants</strong>. The most powerful immediate fit is{' '}
            <strong>foreign aid transparency</strong>: aid agencies sending billions across
            borders today rely on recipient-country quarterly reports. With OpenBudget, every
            dollar of aid becomes verifiable in real time, from agency to final ministry
            spending — a tamper-proof complement to existing accountability frameworks.
          </p>
        </section>

        {/* Contact */}
        <section className="mt-8 pt-6 border-t-2 border-gray-900">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-base font-bold text-blue-900 uppercase tracking-wide mb-1">Get in touch</h2>
              <p className="text-sm text-gray-800">
                <a href="mailto:rector@rectorspace.com" className="text-blue-700 underline">
                  rector@rectorspace.com
                </a>
                {' · '}
                <a href="https://openbudget.rectorspace.com" className="text-blue-700 underline">
                  openbudget.rectorspace.com
                </a>
              </p>
            </div>
            <div className="text-xs text-gray-500 text-right">
              OpenBudget Institutional Brief<br />
              Generated for international partnerships
            </div>
          </div>
        </section>
      </main>

      {/* Print-only style adjustments */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 12mm 12mm 12mm 12mm;
          }
          html, body {
            background: white;
            font-size: 11pt;
            color-adjust: exact;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
