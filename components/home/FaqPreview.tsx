import Link from "next/link";
import { bg } from "@/content/bg";
import { Accordion } from "@/components/motion/Accordion";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

const PREVIEW_COUNT = 4;

export function FaqPreview() {
  const items = bg.faq.items.slice(0, PREVIEW_COUNT).map((item) => ({
    id: item.id,
    title: item.question,
    content: item.answer,
  }));

  return (
    <section
      className="relative z-10 py-16 md:py-20"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-6xl px-4">
        <ScrollReveal>
          <div className="mb-8 max-w-2xl">
            <h2
              id="faq-heading"
              className="font-display text-3xl font-semibold text-ink md:text-4xl"
            >
              {bg.faq.title}
            </h2>
            <p className="mt-2 text-ink-muted">{bg.faq.subtitle}</p>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={0.05}>
          <Accordion items={items} />
          <div className="mt-6">
            <Link
              href="/faq"
              className="text-sm font-medium text-brand transition-colors hover:text-brand-dark"
            >
              {bg.faq.cta} →
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
