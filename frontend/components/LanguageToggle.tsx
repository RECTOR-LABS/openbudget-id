'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

interface LanguageToggleProps {
  /** When true the header is over a light background (scrolled); when false it's over the blue gradient. */
  scrolled?: boolean;
}

export function LanguageToggle({ scrolled = false }: LanguageToggleProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchTo = (target: 'en' | 'id') => {
    if (target === locale) return;
    // Strip current locale prefix, then prepend target prefix (if target !== default)
    const stripped = pathname.replace(/^\/(en|id)(?=\/|$)/, '') || '/';
    const next = target === 'en' ? stripped : `/id${stripped === '/' ? '' : stripped}`;
    router.push(next);
  };

  const activeClass = scrolled
    ? 'text-gray-900 font-bold'
    : 'text-white font-bold';

  const inactiveClass = scrolled
    ? 'text-gray-500 hover:text-gray-700'
    : 'text-blue-100 hover:text-white';

  const separatorClass = scrolled ? 'text-gray-300' : 'text-blue-300';

  return (
    <div className="flex items-center gap-1 text-sm font-medium">
      <button
        type="button"
        onClick={() => switchTo('en')}
        className={locale === 'en' ? activeClass : inactiveClass}
        aria-pressed={locale === 'en'}
      >
        EN
      </button>
      <span className={separatorClass}>|</span>
      <button
        type="button"
        onClick={() => switchTo('id')}
        className={locale === 'id' ? activeClass : inactiveClass}
        aria-pressed={locale === 'id'}
      >
        ID
      </button>
    </div>
  );
}
