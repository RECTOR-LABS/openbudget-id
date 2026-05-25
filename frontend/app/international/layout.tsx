import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import enMessages from '../../messages/en.json';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'OpenBudget.ID - Transparent Government Spending',
  description: 'Making every public fund traceable, auditable, and transparent — powered by Solana.',
};

export default function InternationalLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextIntlClientProvider locale="en" messages={enMessages} formats={{}} timeZone="UTC" now={new Date()}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
