'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Beranda', href: '/', icon: '🏠' },
    { name: 'Proyek', href: '/#projects', icon: '📊' },
    { name: 'Analytics', href: '/analytics', icon: '📈' },
    { name: 'API Docs', href: '/api-docs', icon: '📚' },
    { name: 'Pitch Deck', href: '/pitch-deck', icon: '🎯' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-gradient-to-r from-blue-600 to-blue-700'
      }`}
    >
      {/* Batik pattern overlay (subtle) */}
      {!scrolled && (
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='5' cy='5' r='2' fill='%23F59E0B' opacity='0.3'/%3E%3Ccircle cx='15' cy='5' r='2' fill='%23F59E0B' opacity='0.3'/%3E%3Ccircle cx='5' cy='15' r='2' fill='%23F59E0B' opacity='0.3'/%3E%3Ccircle cx='15' cy='15' r='2' fill='%23F59E0B' opacity='0.3'/%3E%3Ccircle cx='10' cy='10' r='2.5' fill='%2378350F' opacity='0.4'/%3E%3C/svg%3E")`,
            backgroundSize: '20px 20px',
          }}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Tagline */}
          <Link href="/" className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative w-12 h-12 flex-shrink-0 transition-transform group-hover:scale-110 duration-300">
              <Image
                src="/logo-icon.svg"
                alt="OpenBudget Logo"
                width={48}
                height={48}
                priority
                className="object-contain"
              />
            </div>
            <div className="hidden md:block">
              <div
                className={`text-2xl font-bold tracking-tight ${
                  scrolled ? 'text-gray-900' : 'text-white'
                }`}
              >
                Open<span className={scrolled ? 'text-blue-600' : 'text-yellow-300'}>Budget</span>
              </div>
              <div
                className={`text-xs font-medium tracking-wider ${
                  scrolled ? 'text-gray-600' : 'text-blue-100'
                }`}
              >
                TRANSPARANSI BLOCKCHAIN
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive(link.href)
                    ? scrolled
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-white/20 text-white shadow-lg'
                    : scrolled
                    ? 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                    : 'text-blue-50 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="mr-1">{link.icon}</span>
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Ministry Login Button */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              href="/admin"
              className={`group relative px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 overflow-hidden cursor-pointer ${
                scrolled
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg'
                  : 'bg-white text-blue-700 hover:bg-yellow-50 hover:text-blue-800 shadow-lg'
              }`}
            >
              {/* Batik pattern overlay on button */}
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='3' cy='3' r='1' fill='%23000'/%3E%3Ccircle cx='9' cy='3' r='1' fill='%23000'/%3E%3Ccircle cx='3' cy='9' r='1' fill='%23000'/%3E%3Ccircle cx='9' cy='9' r='1' fill='%23000'/%3E%3C/svg%3E")`,
                  backgroundSize: '12px 12px',
                }}
              />
              <span className="relative flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                  />
                </svg>
                Ministry Login
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg transition-colors duration-200 cursor-pointer"
            aria-label="Toggle menu"
          >
            <svg
              className={`w-6 h-6 ${scrolled ? 'text-gray-700' : 'text-white'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-6 space-y-2 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  isActive(link.href)
                    ? scrolled
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-white/20 text-white'
                    : scrolled
                    ? 'text-gray-700 hover:bg-gray-100'
                    : 'text-blue-50 hover:bg-white/10'
                }`}
              >
                <span className="mr-2">{link.icon}</span>
                {link.name}
              </Link>
            ))}
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-semibold text-center transition-colors cursor-pointer ${
                scrolled
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-white text-blue-700 hover:bg-yellow-50'
              }`}
            >
              <svg
                className="w-5 h-5 inline-block mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                />
              </svg>
              Ministry Login
            </Link>
          </div>
        )}
      </div>

      {/* Batik accent line at bottom */}
      {!scrolled && (
        <div className="h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 opacity-70" />
      )}
    </header>
  );
}
