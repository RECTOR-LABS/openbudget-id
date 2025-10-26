/**
 * Format a number as Indonesian Rupiah currency
 * @param amount - Amount in the smallest unit (e.g., lamports or basic unit)
 * @param options - Formatting options
 * @returns Formatted currency string
 */
export function formatRupiah(
  amount: number | bigint,
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {}
): string {
  const numericAmount = typeof amount === 'bigint' ? Number(amount) : amount;

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: options.minimumFractionDigits ?? 0,
    maximumFractionDigits: options.maximumFractionDigits ?? 0,
  }).format(numericAmount);
}

/**
 * Format a date in Indonesian locale
 * @param date - Date string or Date object
 * @param options - Formatting options
 * @returns Formatted date string
 */
export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string {
  return new Date(date).toLocaleDateString('id-ID', options);
}

/**
 * Format a date and time in Indonesian locale
 * @param date - Date string or Date object
 * @returns Formatted date and time string
 */
export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * Format a relative time (e.g., "2 hari yang lalu")
 * @param date - Date string or Date object
 * @returns Relative time string in Indonesian
 */
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSeconds < 60) {
    return 'baru saja';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} menit yang lalu`;
  } else if (diffHours < 24) {
    return `${diffHours} jam yang lalu`;
  } else if (diffDays < 30) {
    return `${diffDays} hari yang lalu`;
  } else if (diffMonths < 12) {
    return `${diffMonths} bulan yang lalu`;
  } else {
    return `${diffYears} tahun yang lalu`;
  }
}

/**
 * Format a large number with Indonesian locale separators
 * @param num - Number to format
 * @returns Formatted number string
 */
export function formatNumber(num: number | bigint): string {
  const numericValue = typeof num === 'bigint' ? Number(num) : num;
  return new Intl.NumberFormat('id-ID').format(numericValue);
}

/**
 * Abbreviate large numbers (e.g., 1.5M, 2.3B)
 * @param num - Number to abbreviate
 * @param decimals - Number of decimal places
 * @returns Abbreviated number string
 */
export function abbreviateNumber(num: number | bigint, decimals: number = 1): string {
  const numericValue = typeof num === 'bigint' ? Number(num) : num;

  if (numericValue >= 1_000_000_000) {
    return `${(numericValue / 1_000_000_000).toFixed(decimals)}B`;
  } else if (numericValue >= 1_000_000) {
    return `${(numericValue / 1_000_000).toFixed(decimals)}M`;
  } else if (numericValue >= 1_000) {
    return `${(numericValue / 1_000).toFixed(decimals)}K`;
  }
  return numericValue.toString();
}

/**
 * Clamp a value between min and max
 * @param value - Value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Combine CSS class names conditionally
 * @param classes - Class names or conditional objects
 * @returns Combined class string
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
