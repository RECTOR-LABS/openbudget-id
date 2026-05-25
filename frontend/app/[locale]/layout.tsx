import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n';
import { Providers } from '@/components/providers/Providers';
import FloatingPitchDeckButton from '@/components/FloatingPitchDeckButton';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'OpenBudget.ID - Transparent Government Spending',
  description: 'Making every public fund traceable, auditable, and transparent — powered by Solana.',
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(locales, locale)) {
    notFound();
  }

  // Enable static rendering for all nested pages
  setRequestLocale(locale as Locale);

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            {children}
            <FloatingPitchDeckButton />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
