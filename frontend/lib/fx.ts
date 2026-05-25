export const IDR_PER_USD = 16_000;
export const FX_AS_OF = '2026-05-25';

export function formatUSDFromIDR(idr: bigint | number): string {
  const idrNum = typeof idr === 'bigint' ? Number(idr) : idr;
  const usd = idrNum / IDR_PER_USD;
  const abs = Math.abs(usd);
  let formatted: string;
  if (abs >= 1_000_000_000) {
    formatted = `$${(usd / 1_000_000_000).toFixed(1)}B`;
  } else if (abs >= 1_000_000) {
    formatted = `$${(usd / 1_000_000).toFixed(1)}M`;
  } else if (abs >= 1_000) {
    formatted = `$${(usd / 1_000).toFixed(1)}K`;
  } else {
    formatted = `$${usd.toFixed(0)}`;
  }
  return formatted;
}

export const USD_HINT_THRESHOLD_IDR = 1_000_000;
