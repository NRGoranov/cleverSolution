import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import {
  CategoryGrid,
  ContactSection,
  FeaturedProducts,
} from "@/components/home/HomeSections";
import { bg } from "@/content/bg";

export const metadata: Metadata = {
  title: bg.site.name,
  description: bg.site.description,
  openGraph: {
    title: bg.site.name,
    description: bg.site.description,
  },
};

export default function HomePage() {
  return (
    <div className="relative z-10">
      <Hero />
      <CategoryGrid />
      <FeaturedProducts />
      <ContactSection />
    </div>
  );
}
