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
    <>
      <Hero />
      <CategoryGrid />
      <FeaturedProducts />
      {/* Testimonials section — plug back in when real content exists */}
      <ContactSection />
    </>
  );
}
