import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { bg } from "@/content/bg";
import {
  getProductBySlug,
  getPublishedSlugs,
  getCategoryById,
} from "@/data/products";
import { ProductDetail } from "@/components/products/ProductDetail";
import { ProductSpecs } from "@/components/products/ProductSpecs";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { buildProductJsonLd } from "@/lib/product-jsonld";
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

        <ScrollReveal>
          <ProductDetail
            product={product}
            accent={accent}
            categoryName={category?.name}
          />
        </ScrollReveal>

        <div className="mt-12">
          <ProductSpecs specs={product.specs} />
        </div>
      </div>
    </>
  );
}
