import { formatUSDFromIDR, USD_HINT_THRESHOLD_IDR } from './fx';

export type Locale = 'en' | 'id';

/**
 * Format a number as Indonesian Rupiah currency, locale-aware.
 * English locale appends a USD hint for amounts >= USD_HINT_THRESHOLD_IDR.
 */
export function formatRupiah(value: bigint | number | string, locale: Locale = 'id'): string {
  const num = typeof value === 'bigint' ? Number(value) : typeof value === 'string' ? Number(value) : value;
  if (locale === 'en') {
    const idrFormatted = `Rp ${num.toLocaleString('en-US')}`;
    if (num >= USD_HINT_THRESHOLD_IDR) {
      return `${idrFormatted} (≈ ${formatUSDFromIDR(num)})`;
    }
    return idrFormatted;
  }
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Format a date, locale-aware.
 */
export function formatDate(date: Date | string, locale: Locale = 'id'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format a date and time, locale-aware.
 */
export function formatDateTime(date: Date | string, locale: Locale = 'id'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString(locale === 'en' ? 'en-US' : 'id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format a relative time string, locale-aware.
 */
export function formatRelativeTime(date: Date | string, locale: Locale = 'id'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const diffMs = Date.now() - d.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHr = Math.floor(diffMs / 3_600_000);
  const diffDay = Math.floor(diffMs / 86_400_000);
  const diffMonth = Math.floor(diffMs / (30 * 86_400_000));
  const diffYear = Math.floor(diffMs / (365 * 86_400_000));

  if (locale === 'en') {
    if (diffMin < 1) return 'just now';
    if (diffHr < 1) return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
    if (diffDay < 1) return `${diffHr} hour${diffHr === 1 ? '' : 's'} ago`;
    if (diffMonth < 1) return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`;
    if (diffYear < 1) return `${diffMonth} month${diffMonth === 1 ? '' : 's'} ago`;
    return `${diffYear} year${diffYear === 1 ? '' : 's'} ago`;
  }
  if (diffMin < 1) return 'baru saja';
  if (diffHr < 1) return `${diffMin} menit yang lalu`;
  if (diffDay < 1) return `${diffHr} jam yang lalu`;
  if (diffMonth < 1) return `${diffDay} hari yang lalu`;
  if (diffYear < 1) return `${diffMonth} bulan yang lalu`;
  return `${diffYear} tahun yang lalu`;
}

/**
 * Format a number with locale-aware separators.
 */
export function formatNumber(value: number | bigint, locale: Locale = 'id'): string {
  const num = typeof value === 'bigint' ? Number(value) : value;
  return new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'id-ID').format(num);
}

/**
 * Abbreviate large numbers (e.g., 1.5M, 2.3B), locale-aware.
 * English uses K/M/B suffixes; Indonesian falls back to locale-formatted number.
 */
export function abbreviateNumber(value: number | bigint, locale: Locale = 'id'): string {
  const num = typeof value === 'bigint' ? Number(value) : value;
  if (locale === 'en') {
    const abs = Math.abs(num);
    if (abs >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`;
    if (abs >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (abs >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toFixed(0);
  }
  return formatNumber(num, 'id');
}

/**
 * Clamp a value between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Combine CSS class names conditionally.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
