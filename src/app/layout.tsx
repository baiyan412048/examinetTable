import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import "./globals.css";

import { cn } from '@/lib/utils'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap'
})

export const metadata: Metadata = {
  title: "檢查表"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn('h-screen overflow-hidden', inter.variable)}>{children}</body>
    </html>
  );
}
