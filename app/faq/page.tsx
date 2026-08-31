import type { Metadata } from "next";
import Link from "next/link";
import { bg } from "@/content/bg";
import { Accordion } from "@/components/motion/Accordion";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { buildMetadata, faqJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: bg.faq.title,
  description: bg.faq.subtitle,
  path: "/faq",
});

export default function FaqPage() {
  const items = bg.faq.items.map((item) => ({
    id: item.id,
    title: item.question,
    content: item.answer,
  }));
  const jsonLd = faqJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
        <ScrollReveal>
          <header className="mb-10">
            <h1 className="font-display text-4xl font-semibold text-ink md:text-5xl">
              {bg.faq.title}
            </h1>
            <p className="mt-4 text-lg text-ink-muted">{bg.faq.subtitle}</p>
          </header>
        </ScrollReveal>
        <ScrollReveal delay={0.05}>
          <Accordion items={items} />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <p className="mt-10 text-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-brand px-8 py-3 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand-dark"
            >
              {bg.faq.contactCta}
            </Link>
          </p>
        </ScrollReveal>
      </div>
    </>
  );
}
