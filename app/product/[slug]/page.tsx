import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { bg } from "@/content/bg";
import {
  getProductBySlug,
  getPublishedSlugs,
  getCategoryById,
} from "@/data/products";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductSpecs } from "@/components/products/ProductSpecs";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { buildProductJsonLd } from "@/lib/product-jsonld";
import { getAccentClasses } from "@/lib/utils";
import { cn } from "@/lib/cn";
import { buildMetadata } from "@/lib/seo";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getPublishedSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: bg.product.notFound, robots: { index: false } };
  }

  return buildMetadata({
    title: product.name,
    description: product.description,
    path: `/product/${product.slug}`,
    image: product.images[0]?.src,
    imageAlt: product.images[0]?.alt,
  });
}

const categoryAccentMap = {
  kitchenware: "kitchen",
  security: "security",
  wristbands: "wristbands",
  vacuums: "vacuums",
} as const;

/** Product detail — content is driven entirely by the URL slug. */
export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const category = getCategoryById(product.categoryId);
  const accent = categoryAccentMap[product.categoryId];
  const { text, bg: bgAccent } = getAccentClasses(accent);
  const contactHref = `/contact?product=${encodeURIComponent(product.name)}`;
  const jsonLd = buildProductJsonLd(product);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-ink-muted">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-ink">
                {bg.nav.home}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href={`/${product.categorySlug}`} className="hover:text-ink">
                {category?.name}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-ink">{product.name}</li>
          </ol>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ScrollReveal>
            <ProductGallery product={product} accent={accent} />
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="space-y-6">
              <div>
                <p className={cn("text-sm font-medium uppercase tracking-widest", text)}>
                  {category?.name}
                </p>
                <h1 className="mt-2 font-display text-3xl font-semibold text-ink md:text-4xl">
                  {product.name}
                </h1>
                <p className="mt-3 text-lg text-ink-muted">{product.tagline}</p>
              </div>

              <section aria-labelledby="description-heading">
                <h2
                  id="description-heading"
                  className="mb-3 font-display text-xl font-semibold text-ink"
                >
                  {bg.product.descriptionTitle}
                </h2>
                <p className="leading-relaxed text-ink-muted">
                  {product.description}
                </p>
              </section>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href={contactHref}
                  className={cn(
                    "inline-flex items-center justify-center rounded-md px-8 py-3 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90",
                    bgAccent
                  )}
                >
                  {bg.product.contactCta}
                </Link>
                {product.buyUrl && (
                  <a
                    href={product.buyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-md border border-brand/30 px-8 py-3 text-sm font-medium text-brand transition-colors hover:bg-brand-soft"
                  >
                    {bg.product.externalBuy}
                  </a>
                )}
              </div>
            </div>
          </ScrollReveal>
        </div>

        <div className="mt-12">
          <ProductSpecs specs={product.specs} />
        </div>
      </div>
    </>
  );
}
