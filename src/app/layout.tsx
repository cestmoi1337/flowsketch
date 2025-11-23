import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FlowSketch | Paste to workflow",
  description: "Instant workflow diagrams from plain text."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-surface-light dark:bg-surface-dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
