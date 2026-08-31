import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import {
  CategoryGrid,
  ContactSection,
  FeaturedProducts,
} from "@/components/home/HomeSections";
import { FaqPreview } from "@/components/home/FaqPreview";
import { bg } from "@/content/bg";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: `${bg.site.name} — ${bg.seo.homeTitle}`,
  description: bg.seo.homeDescription,
  path: "/",
  absoluteTitle: true,
});

export default function HomePage() {
  return (
    <div className="relative z-10">
      <Hero />
      <CategoryGrid />
      <FeaturedProducts />
      <FaqPreview />
      <ContactSection />
    </div>
  );
}
