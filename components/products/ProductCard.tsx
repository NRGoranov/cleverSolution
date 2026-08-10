"use client";

import Image from "next/image";
import Link from "next/link";
import { bg } from "@/content/bg";
import type { ProductWithCategory } from "@/data/products";
import { getAccentClasses } from "@/lib/utils";
import { cn } from "@/lib/cn";
import { ImagePlaceholder } from "./ImagePlaceholder";

type ProductCardProps = {
  product: ProductWithCategory;
};

const categoryAccentMap = {
  kitchenware: "kitchen",
  security: "security",
  wristbands: "wristbands",
  vacuums: "vacuums",
} as const;

export function ProductCard({ product }: ProductCardProps) {
  const accent = categoryAccentMap[product.categoryId];
  const mainImage = product.images[0];
  const contactHref = `/contact?product=${encodeURIComponent(product.name)}`;
  const productHref = `/product/${product.slug}`;

  return (
    <article className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-soft transition-shadow hover:shadow-soft-lg">
      <Link href={productHref} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
          {mainImage ? (
            <Image
              src={mainImage.src}
              alt={mainImage.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <ImagePlaceholder accent={accent} className="h-full rounded-none border-0" compact />
          )}
        </div>
      </Link>
      <div className="space-y-3 p-5">
        <Link href={productHref}>
          <h3 className="font-display text-lg font-semibold text-ink transition-colors group-hover:text-ink-muted">
            {product.name}
          </h3>
        </Link>
        <p className="line-clamp-2 text-sm text-ink-muted">{product.tagline}</p>
        <Link
          href={contactHref}
          className={cn(
            "inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90",
            getAccentClasses(accent).bg
          )}
        >
          {bg.product.contactCta}
        </Link>
      </div>
    </article>
  );
}
