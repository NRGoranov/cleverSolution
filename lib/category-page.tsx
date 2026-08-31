import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { bg } from "@/content/bg";
import {
  getCategoryById,
  getPublishedByCategory,
  type CategoryId,
} from "@/data/products";
import { buildMetadata } from "@/lib/seo";
import { CategorySubnav } from "@/components/category/CategorySubnav";
import { ComingSoon } from "@/components/category/ComingSoon";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { getAccentClasses } from "@/lib/utils";
import { cn } from "@/lib/cn";

type CategoryPageProps = {
  categoryId: CategoryId;
  subcategory?: string;
};

export function getCategoryMetadata(
  categoryId: CategoryId,
  subcategory?: string
): Metadata {
  const category = getCategoryById(categoryId);
  if (!category) return {};

  const sub = subcategory
    ? category.subcategories.find((item) => item.slug === subcategory)
    : undefined;
  const title = sub ? `${sub.name} — ${category.name}` : category.name;
  const path = sub ? `${category.href}?sub=${sub.slug}` : category.href;

  return buildMetadata({
    title,
    description: category.description,
    path,
  });
}

export function CategoryPageContent({
  categoryId,
  subcategory,
}: CategoryPageProps) {
  const category = getCategoryById(categoryId);
  if (!category) notFound();

  if (
    subcategory &&
    !category.subcategories.some((item) => item.slug === subcategory)
  ) {
    notFound();
  }

  const allProducts = getPublishedByCategory(categoryId);
  const products = getPublishedByCategory(categoryId, subcategory);
  const activeSub = category.subcategories.find((item) => item.slug === subcategory);
  const { text } = getAccentClasses(category.accent);

  const counts = Object.fromEntries(
    category.subcategories.map((sub) => [
      sub.slug,
      allProducts.filter((product) => product.subcategory === sub.slug).length,
    ])
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <ScrollReveal>
        <header className="mb-8 max-w-2xl">
          <p className={cn("text-sm font-medium uppercase tracking-widest", text)}>
            {bg.nav.categories}
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-ink md:text-5xl">
            {activeSub ? activeSub.name : category.name}
          </h1>
          <p className="mt-4 text-lg text-ink-muted">
            {activeSub
              ? `${activeSub.name} — ${category.description}`
              : category.description}
          </p>
          {products.length > 0 && (
            <p className="mt-2 text-sm text-ink-subtle">
              {bg.category.productCount(products.length)}
            </p>
          )}
        </header>
      </ScrollReveal>

      {category.subcategories.length > 0 && allProducts.length > 0 && (
        <CategorySubnav
          categoryHref={category.href}
          subcategories={category.subcategories}
          activeSub={subcategory}
          accent={category.accent}
          counts={counts}
          totalCount={allProducts.length}
        />
      )}

      {products.length === 0 ? (
        <ComingSoon accent={category.accent} />
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
