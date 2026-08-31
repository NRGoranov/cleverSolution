import { ScrollReveal } from "@/components/motion/ScrollReveal";

type LegalSection = {
  heading: string;
  body: string;
};

type LegalPageProps = {
  title: string;
  updated: string;
  intro: string;
  sections: readonly LegalSection[];
};

export function LegalPage({ title, updated, intro, sections }: LegalPageProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <ScrollReveal>
        <article className="rounded-2xl border border-zinc-200/80 bg-white/90 p-6 shadow-soft backdrop-blur-sm md:p-10">
          <header className="mb-8">
            <h1 className="font-display text-4xl font-semibold text-ink md:text-5xl">
              {title}
            </h1>
            <p className="mt-3 text-sm text-ink-subtle">{updated}</p>
          </header>
          <p className="text-base leading-relaxed text-ink-muted md:text-lg">
            {intro}
          </p>
          <div className="mt-10 space-y-8">
            {sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-display text-2xl font-semibold text-ink">
                  {section.heading}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-ink-muted">
                  {section.body}
                </p>
              </section>
            ))}
          </div>
        </article>
      </ScrollReveal>
    </div>
  );
}
