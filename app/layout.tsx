import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { MainBackground } from "@/components/layout/MainBackground";
import { SkipToContent } from "@/components/layout/SkipToContent";
import { bg } from "@/content/bg";
import { siteConfig } from "@/lib/site-config";
import { buildMetadata, organizationJsonLd } from "@/lib/seo";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  variable: "--font-display",
  display: "swap",
});

const sans = Source_Sans_3({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  ...buildMetadata({
    title: `${bg.site.name} — ${bg.seo.homeTitle}`,
    description: bg.seo.homeDescription,
    path: "/",
    absoluteTitle: true,
  }),
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${bg.site.name} — ${bg.seo.homeTitle}`,
    template: `%s | ${bg.site.name}`,
  },
  description: bg.seo.homeDescription,
};

export const viewport: Viewport = {
  themeColor: "#ff6000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = organizationJsonLd();

  return (
    <html lang="bg" data-scroll-behavior="smooth">
      <body
        className={`${display.variable} ${sans.variable} flex min-h-screen flex-col antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <SkipToContent />
        <MainBackground />
        <Header />
        <main id="main-content" tabIndex={-1} className="relative z-10 flex-1 focus:outline-none">
          {children}
        </main>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}
