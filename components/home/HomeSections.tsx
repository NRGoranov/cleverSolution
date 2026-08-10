import Link from "next/link";
import { bg } from "@/content/bg";
import { getFeaturedProducts, categories } from "@/data/products";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { getAccentClasses } from "@/lib/utils";

export function FeaturedProducts() {
  const products = getFeaturedProducts(4);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-20" aria-labelledby="featured-heading">
      <div className="mx-auto max-w-6xl px-4">
        <ScrollReveal>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2
                id="featured-heading"
                className="font-display text-3xl font-semibold text-ink md:text-4xl"
              >
                {bg.featured.title}
              </h2>
              <p className="mt-2 text-ink-muted">{bg.featured.subtitle}</p>
            </div>
          </div>
        </ScrollReveal>
        <ProductGrid products={products} />
      </div>
    </section>
  );
}

export function CategoryGrid() {
  return (
    <section
      id="categories"
      className="bg-zinc-50 py-16 md:py-20"
      aria-labelledby="categories-heading"
    >
      <div className="mx-auto max-w-6xl px-4">
        <ScrollReveal>
          <h2
            id="categories-heading"
            className="font-display text-3xl font-semibold text-ink md:text-4xl"
          >
            {bg.categories.sectionTitle}
          </h2>
          <p className="mt-2 text-ink-muted">{bg.categories.sectionSubtitle}</p>
        </ScrollReveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => (
            <ScrollReveal key={category.id} delay={index * 0.08}>
              <Link
                href={category.href}
                className="group flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-soft-lg"
              >
                <h3
                  className={`font-display text-xl font-semibold ${getAccentClasses(category.accent).text}`}
                >
                  {category.name}
                </h3>
                <p className="mt-2 flex-1 text-sm text-ink-muted">
                  {category.description}
                </p>
                <span
                  className={`mt-4 text-sm font-medium ${getAccentClasses(category.accent).text}`}
                >
                  {bg.featured.viewAll} →
                </span>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ContactSection() {
  return (
    <section className="py-16 md:py-20" aria-labelledby="contact-cta-heading">
      <div className="mx-auto max-w-6xl px-4">
        <ScrollReveal>
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-soft md:p-12">
            <h2
              id="contact-cta-heading"
              className="font-display text-3xl font-semibold text-ink"
            >
              {bg.home.contactSection.title}
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-ink-muted">
              {bg.home.contactSection.subtitle}
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center justify-center rounded-md bg-brand px-8 py-3 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand-dark"
            >
              {bg.home.contactSection.cta}
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
