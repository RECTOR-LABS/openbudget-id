import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import FloatingPitchDeckButton from "@/components/FloatingPitchDeckButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OpenBudget.ID - Transparent Government Spending",
  description: "Making every public fund traceable, auditable, and transparent — powered by Solana.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <FloatingPitchDeckButton />
        </Providers>
      </body>
    </html>
  );
}
