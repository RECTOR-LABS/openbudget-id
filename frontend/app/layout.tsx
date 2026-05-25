import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OpenBudget.ID - Transparent Government Spending',
  description: 'Making every public fund traceable, auditable, and transparent — powered by Solana.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
