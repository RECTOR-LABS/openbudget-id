import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { Providers } from '@/components/providers/Providers';
import enMessages from '../../messages/en.json';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'OpenBudget.ID - Ministry Login',
  description: 'Sign in to manage your ministry budget transparency dashboard.',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextIntlClientProvider locale="en" messages={enMessages} formats={{}} timeZone="UTC" now={new Date()}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
