import type { Metadata } from "next";
import { bg } from "@/content/bg";
import { ContactForm } from "@/components/contact/ContactForm";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: bg.contact.title,
  description: bg.contact.subtitle,
  path: "/contact",
});

export default function KontaktiPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <ScrollReveal>
        <header className="mb-10 max-w-2xl">
          <h1 className="font-display text-4xl font-semibold text-ink md:text-5xl">
            {bg.contact.title}
          </h1>
          <p className="mt-4 text-lg text-ink-muted">{bg.contact.subtitle}</p>
        </header>
      </ScrollReveal>

      <div className="grid gap-12 lg:grid-cols-5">
        <ScrollReveal className="lg:col-span-3">
          <div className="rounded-2xl bg-white p-6 shadow-soft md:p-8">
            <ContactForm />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1} className="lg:col-span-2">
          <aside className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 md:p-8">
            <h2 className="font-display text-xl font-semibold text-ink">
              {bg.contact.info.title}
            </h2>
            <ul className="mt-6 space-y-4 text-ink-muted">
              <li>
                <span className="block text-sm font-medium text-ink-subtle">
                  {bg.contact.form.email}
                </span>
                <a
                  href={`mailto:${bg.contact.info.email}`}
                  className="text-ink hover:text-ink-muted"
                >
                  {bg.contact.info.email}
                </a>
              </li>
              <li>
                <span className="block text-sm font-medium text-ink-subtle">
                  {bg.contact.form.phone}
                </span>
                <a
                  href={`tel:${bg.contact.info.phone.replace(/\s/g, "")}`}
                  className="text-ink hover:text-ink-muted"
                >
                  {bg.contact.info.phone}
                </a>
              </li>
              <li>
                <span className="block text-sm font-medium text-ink-subtle">
                  Адрес
                </span>
                {bg.contact.info.address}
              </li>
              <li>
                <span className="block text-sm font-medium text-ink-subtle">
                  Работно време
                </span>
                {bg.contact.info.hours}
              </li>
            </ul>
          </aside>
        </ScrollReveal>
      </div>
    </div>
  );
}
