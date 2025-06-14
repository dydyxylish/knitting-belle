import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Knitting Belle",
  description: "Knitting Belleの編み図ダウンロードサイト(Knitting pattern download site by Knitting-Belle)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
          {children}
      </body>
    </html>
  );
}
