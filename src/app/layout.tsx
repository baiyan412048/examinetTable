import type { Metadata } from "next";
import { Noto_Sans_Javanese } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans_Javanese({ subsets: ["latin"] });

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
      <body className={notoSans.className}>{children}</body>
    </html>
  );
}
