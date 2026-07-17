import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  // metadataBase makes OG images / canonical URLs absolute
  metadataBase: new URL(siteUrl),
  title: {
    default: "Kayease Themes — Premium Website Templates",
    template: "%s | Kayease Themes",
  },
  description:
    "Browse and buy premium, production-ready website themes and templates for every project.",
  keywords: ["website themes", "templates", "premium themes", "web design"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Kayease Themes",
    title: "Kayease Themes — Premium Website Templates",
    description:
      "Browse and buy premium, production-ready website themes and templates.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Kayease Themes — Premium Website Templates",
    description:
      "Browse and buy premium, production-ready website themes and templates.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
        {/* Loads GA4 after hydration; only when a Measurement ID is set */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
