'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface GitInfo {
  commit: string;
  branch: string;
  timestamp: string;
}

export default function Footer() {
  const [gitInfo, setGitInfo] = useState<GitInfo | null>(null);

  useEffect(() => {
    fetch('/api/git-info')
      .then((res) => res.json())
      .then((data) => setGitInfo(data))
      .catch(() => {
        // Fallback if API fails
        setGitInfo({
          commit: 'unknown',
          branch: 'unknown',
          timestamp: new Date().toISOString(),
        });
      });
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 relative overflow-hidden">
      {/* Batik pattern background */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='5' cy='5' r='2' fill='%23F59E0B'/%3E%3Ccircle cx='15' cy='5' r='2' fill='%23F59E0B'/%3E%3Ccircle cx='5' cy='15' r='2' fill='%23F59E0B'/%3E%3Ccircle cx='15' cy='15' r='2' fill='%23F59E0B'/%3E%3Ccircle cx='10' cy='10' r='2.5' fill='%2378350F'/%3E%3C/svg%3E")`,
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10">
                <Image
                  src="/logo-icon.svg"
                  alt="OpenBudget Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Open<span className="text-yellow-400">Budget</span>
                </h3>
                <p className="text-xs text-gray-400 font-medium tracking-wide">
                  TRANSPARANSI BLOCKCHAIN
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Platform transparansi anggaran pemerintah berbasis blockchain Solana. Memastikan
              akuntabilitas dan kepercayaan publik melalui teknologi terdesentralisasi.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Navigasi Cepat
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm hover:text-yellow-400 transition-colors inline-flex items-center cursor-pointer"
                >
                  <span className="mr-2">→</span>
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/#projects"
                  className="text-sm hover:text-yellow-400 transition-colors inline-flex items-center cursor-pointer"
                >
                  <span className="mr-2">→</span>
                  Daftar Proyek
                </Link>
              </li>
              <li>
                <Link
                  href="/api-docs"
                  className="text-sm hover:text-yellow-400 transition-colors inline-flex items-center cursor-pointer"
                >
                  <span className="mr-2">→</span>
                  Dokumentasi API
                </Link>
              </li>
              <li>
                <Link
                  href="/pitch-deck"
                  className="text-sm hover:text-yellow-400 transition-colors inline-flex items-center cursor-pointer"
                >
                  <span className="mr-2">→</span>
                  Pitch Deck
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="text-sm hover:text-yellow-400 transition-colors inline-flex items-center cursor-pointer"
                >
                  <span className="mr-2">→</span>
                  Panel Admin Kementerian
                </Link>
              </li>
            </ul>
          </div>

          {/* Hackathon Context */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                />
              </svg>
              Hackathon
            </h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-white mb-1">Garuda Spark 2025</p>
                <p className="text-xs text-gray-400">STIndo × Komdigi × Ekraf</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-green-900/50 text-green-400 text-xs font-semibold rounded-full border border-green-700">
                  Cypherpunk Colosseum
                </span>
              </div>
              <a
                href="https://earn.superteam.fun/listing/st-indo-x-komdigi-x-ekraf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                View on Superteam Earn
              </a>
            </div>
          </div>

          {/* Blockchain Verification */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              Blockchain Info
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-start">
                <span className="text-gray-400 mr-2">Network:</span>
                <span className="text-white font-medium">Solana Devnet</span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-400 mr-2">Program:</span>
                <a
                  href="https://explorer.solana.com/address/RECtBgp43nvj5inPVW7qo1YN95RwXaYDxLX4dvuJXFY?cluster=devnet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors break-all"
                >
                  RECtBgp4...JXFY
                </a>
              </div>
              <div className="pt-2">
                <a
                  href="https://explorer.solana.com/address/RECtBgp43nvj5inPVW7qo1YN95RwXaYDxLX4dvuJXFY?cluster=devnet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3.9 12.3L8.1 8l1.4 1.4-2.8 2.8 2.8 2.8-1.4 1.4-4.2-4.1zm16.2 0L15.9 16l-1.4-1.4 2.8-2.8-2.8-2.8 1.4-1.4 4.2 4.1z" />
                  </svg>
                  View on Explorer
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="text-sm text-gray-400 text-center md:text-left">
            <p>
              © {currentYear} OpenBudget.ID - Garuda Spark Hackathon
            </p>
            <p className="text-xs mt-1">
              Built with Solana, Next.js, and Indonesian pride 🇮🇩
            </p>
          </div>

          {/* Git Version Info */}
          {gitInfo && (
            <div className="flex items-center space-x-4 text-xs bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1.5 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v2h-2v-2zm0-8h2v6h-2V9z" />
                </svg>
                <span className="text-gray-400">Branch:</span>
                <span className="ml-1.5 text-yellow-400 font-mono font-semibold">
                  {gitInfo.branch}
                </span>
              </div>
              <div className="h-4 w-px bg-gray-700" />
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1.5 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
                </svg>
                <span className="text-gray-400">Commit:</span>
                <code className="ml-1.5 text-green-400 font-mono font-semibold">
                  {gitInfo.commit}
                </code>
              </div>
            </div>
          )}
        </div>

        {/* Batik accent line */}
        <div className="mt-6 h-1 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 rounded-full opacity-50" />
      </div>
    </footer>
  );
}
