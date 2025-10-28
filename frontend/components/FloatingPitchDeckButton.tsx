'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function FloatingPitchDeckButton() {
  const pathname = usePathname();

  // Don't show on pitch-deck page itself
  if (pathname === '/pitch-deck') {
    return null;
  }

  return (
    <Link href="/pitch-deck">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5, type: 'spring' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 group"
      >
        {/* Pulse animation ring */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full opacity-75 group-hover:opacity-100 animate-ping" />

        {/* Main button */}
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 hover:shadow-yellow-400/50 transition-all">
          {/* Batik pattern overlay */}
          <div
            className="absolute inset-0 opacity-20 rounded-full pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='3' cy='3' r='1.5' fill='%23FFF'/%3E%3Ccircle cx='9' cy='3' r='1.5' fill='%23FFF'/%3E%3Ccircle cx='3' cy='9' r='1.5' fill='%23FFF'/%3E%3Ccircle cx='9' cy='9' r='1.5' fill='%23FFF'/%3E%3C/svg%3E")`,
              backgroundSize: '12px 12px',
            }}
          />

          {/* Icon */}
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg
              className="w-6 h-6 text-yellow-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </motion.div>

          {/* Text */}
          <div className="relative font-bold">
            <div className="text-sm">Pitch Deck</div>
            <div className="text-xs text-yellow-200">Garuda Spark 2025</div>
          </div>

          {/* Badge */}
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-white shadow-lg animate-bounce">
            🏆
          </div>
        </div>

        {/* Tooltip on hover */}
        <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg shadow-xl whitespace-nowrap">
            View our hackathon presentation 🎯
            <div className="absolute top-full right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-900" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
