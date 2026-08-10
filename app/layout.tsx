import type { Metadata } from "next";
import { Lora, Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { bg } from "@/content/bg";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const lora = Lora({
  subsets: ["latin", "cyrillic"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: bg.site.name,
    template: `%s | ${bg.site.name}`,
  },
  description: bg.site.description,
  openGraph: {
    type: "website",
    locale: "bg_BG",
    siteName: bg.site.name,
    title: bg.site.name,
    description: bg.site.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bg">
      <body
        className={`${lora.variable} ${inter.variable} flex min-h-screen flex-col antialiased`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
