import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GlowFood – Smart Pantry & Recipe Planner",
  description:
    "Smart food inventory manager that scans barcodes, tracks expiry dates, and suggests waste-reducing recipes. Built by M Ali Asad Khan (FA24-BCS-120).",
  keywords: ["food management", "recipe planner", "pantry manager", "food waste", "smart fridge", "zero waste"],
  authors: [{ name: "M Ali Asad Khan" }],
  manifest: "/manifest.json",
  openGraph: {
    title: "GlowFood – Smart Pantry & Zero-Waste Chef",
    description: "Smart food management for sustainable living. Track expiry, scan barcodes & cook smarter.",
    type: "website",
    siteName: "GlowFood",
  },
  twitter: {
    card: "summary_large_image",
    title: "GlowFood",
    description: "Smart pantry manager & zero-waste recipe planner",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F4E0E0" },
    { media: "(prefers-color-scheme: dark)",  color: "#3d2c3d" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="GlowFood AI" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
