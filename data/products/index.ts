import { bg } from "@/content/bg";
import type { CategoryId, Product, ProductWithCategory } from "./schema";
import { ProductSchema } from "./schema";
import { kitchenwareProducts } from "./kitchenware";
import { securityProducts } from "./security";
import { wristbandsProducts } from "./wristbands";
import { vacuumsProducts } from "./vacuums";

export type { CategoryId, Product, ProductWithCategory } from "./schema";
export { ProductSchema } from "./schema";

export const categories = [
  {
    id: "kitchenware" as const,
    slug: bg.categories.kitchenware.slug,
    name: bg.categories.kitchenware.name,
    description: bg.categories.kitchenware.description,
    accent: "kitchen" as const,
    href: `/${bg.categories.kitchenware.slug}`,
    subcategories: bg.categories.kitchenware.subcategories.map((s) => ({
      name: s.name,
      slug: s.slug,
      href: `/${bg.categories.kitchenware.slug}?sub=${s.slug}`,
    })),
  },
  {
    id: "security" as const,
    slug: bg.categories.security.slug,
    name: bg.categories.security.name,
    description: bg.categories.security.description,
    accent: "security" as const,
    href: `/${bg.categories.security.slug}`,
    subcategories: bg.categories.security.subcategories.map((s) => ({
      name: s.name,
      slug: s.slug,
      href: `/${bg.categories.security.slug}?sub=${s.slug}`,
    })),
  },
  {
    id: "wristbands" as const,
    slug: bg.categories.wristbands.slug,
    name: bg.categories.wristbands.name,
    description: bg.categories.wristbands.description,
    accent: "wristbands" as const,
    href: `/${bg.categories.wristbands.slug}`,
    subcategories: bg.categories.wristbands.subcategories.map((s) => ({
      name: s.name,
      slug: s.slug,
      href: `/${bg.categories.wristbands.slug}?sub=${s.slug}`,
    })),
  },
  {
    id: "vacuums" as const,
    slug: bg.categories.vacuums.slug,
    name: bg.categories.vacuums.name,
    description: bg.categories.vacuums.description,
    accent: "vacuums" as const,
    href: `/${bg.categories.vacuums.slug}`,
    subcategories: bg.categories.vacuums.subcategories.map((s) => ({
      name: s.name,
      slug: s.slug,
      href: `/${bg.categories.vacuums.slug}?sub=${s.slug}`,
    })),
  },
] as const;

export type CategoryAccent = (typeof categories)[number]["accent"];

const rawByCategory: Record<CategoryId, Product[]> = {
  kitchenware: kitchenwareProducts,
  security: securityProducts,
  wristbands: wristbandsProducts,
  vacuums: vacuumsProducts,
};

function parseProducts(products: Product[], categoryId: CategoryId): Product[] {
  return products.map((product, index) => {
    try {
      return ProductSchema.parse(product);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown validation error";
      throw new Error(
        `[${categoryId}] Invalid product at index ${index}: ${message}`
      );
    }
  });
}

const validatedByCategory: Record<CategoryId, Product[]> = {
  kitchenware: parseProducts(rawByCategory.kitchenware, "kitchenware"),
  security: parseProducts(rawByCategory.security, "security"),
  wristbands: parseProducts(rawByCategory.wristbands, "wristbands"),
  vacuums: parseProducts(rawByCategory.vacuums, "vacuums"),
};

/** Optional: E2E can force-publish a draft slug when E2E_TEST=1. */
const E2E_PUBLISH_SLUG = "sample-draft-only-e2e";

function isPublished(product: Product): boolean {
  if (product.status === "published") return true;
  if (process.env.E2E_TEST === "1" && product.slug === E2E_PUBLISH_SLUG) {
    return true;
  }
  return false;
}

function withCategory(
  product: Product,
  categoryId: CategoryId,
  categorySlug: string
): ProductWithCategory {
  return { ...product, categoryId, categorySlug };
}

export function getPublishedByCategory(
  categoryId: CategoryId,
  subcategory?: string
): ProductWithCategory[] {
  const category = categories.find((c) => c.id === categoryId);
  if (!category) return [];

  return validatedByCategory[categoryId]
    .filter(isPublished)
    .filter(
      (product) =>
        !subcategory ||
        product.subcategory === subcategory ||
        (!product.subcategory && subcategory === "all")
    )
    .map((product) => withCategory(product, categoryId, category.slug));
}

export function getAllPublishedProducts(): ProductWithCategory[] {
  return categories.flatMap((category) => getPublishedByCategory(category.id));
}

export function getProductBySlug(slug: string): ProductWithCategory | undefined {
  for (const category of categories) {
    const product = validatedByCategory[category.id].find((p) => p.slug === slug);
    if (product && isPublished(product)) {
      return withCategory(product, category.id, category.slug);
    }
  }
  return undefined;
}

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getCategoryById(id: CategoryId) {
  return categories.find((c) => c.id === id);
}

export function getFeaturedProducts(limit = 4): ProductWithCategory[] {
  return getAllPublishedProducts().slice(0, limit);
}

/** Slugs of published products only — for sitemap generation. */
export function getPublishedSlugs(): string[] {
  return getAllPublishedProducts().map((p) => p.slug);
}
