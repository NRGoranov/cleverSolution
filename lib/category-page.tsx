import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { bg } from "@/content/bg";
import {
  getCategoryById,
  getPublishedByCategory,
  type CategoryId,
} from "@/data/products";
import { ComingSoon } from "@/components/category/ComingSoon";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { getAccentClasses } from "@/lib/utils";
import { cn } from "@/lib/cn";

type CategoryPageProps = {
  categoryId: CategoryId;
};

export function getCategoryMetadata(categoryId: CategoryId): Metadata {
  const category = getCategoryById(categoryId);
  if (!category) return {};

  return {
    title: category.name,
    description: category.description,
    openGraph: {
      title: `${category.name} | ${bg.site.name}`,
      description: category.description,
    },
  };
}

export function CategoryPageContent({ categoryId }: CategoryPageProps) {
  const category = getCategoryById(categoryId);
  if (!category) notFound();

  const products = getPublishedByCategory(categoryId);
  const { text } = getAccentClasses(category.accent);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <ScrollReveal>
        <header className="mb-10 max-w-2xl">
          <p className={cn("text-sm font-medium uppercase tracking-widest", text)}>
            {bg.nav.categories}
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-ink md:text-5xl">
            {category.name}
          </h1>
          <p className="mt-4 text-lg text-ink-muted">{category.description}</p>
          {products.length > 0 && (
            <p className="mt-2 text-sm text-ink-subtle">
              {bg.category.productCount(products.length)}
            </p>
          )}
        </header>
      </ScrollReveal>

      {products.length === 0 ? (
        <ComingSoon accent={category.accent} />
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
