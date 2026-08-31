import type { Metadata } from "next";
import { bg } from "@/content/bg";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: bg.about.title,
  description: bg.seo.aboutDescription,
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <ScrollReveal>
        <article className="mx-auto max-w-3xl rounded-2xl border border-zinc-200/80 bg-white/90 p-6 shadow-soft backdrop-blur-sm md:p-10">
          <header className="mb-8">
            <p className="text-sm font-medium uppercase tracking-widest text-brand">
              {bg.nav.about}
            </p>
            <h1 className="mt-2 font-display text-4xl font-semibold text-ink md:text-5xl">
              {bg.about.bg.heading}
            </h1>
          </header>

          <div className="space-y-5 text-base leading-relaxed text-ink-muted md:text-lg">
            <p>{bg.about.bg.p1}</p>
            <p>{bg.about.bg.p2}</p>
            <p className="font-medium text-ink">{bg.about.bg.p3}</p>
          </div>

          <section className="mt-12 border-t border-zinc-200 pt-10" lang="en">
            <h2 className="font-display text-3xl font-semibold text-ink md:text-4xl">
              {bg.about.en.heading}
            </h2>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-ink-muted md:text-lg">
              <p>{bg.about.en.p1}</p>
              <p>{bg.about.en.p2}</p>
            </div>
          </section>
        </article>
      </ScrollReveal>
    </div>
  );
}
