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
  const productHref = `/product/${product.slug}`;

  return (
    <article className="group flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-soft transition-shadow hover:shadow-soft-lg">
      <Link href={productHref} className="block shrink-0" tabIndex={-1}>
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100">
          {mainImage ? (
            <Image
              src={mainImage.src}
              alt={mainImage.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <ImagePlaceholder
              accent={accent}
              className="h-full rounded-none border-0"
              compact
            />
          )}
        </div>
      </Link>

      <div className="flex min-h-0 flex-1 flex-col gap-3 p-5">
        <div className="min-h-[3.5rem]">
          <Link href={productHref}>
            <h3 className="line-clamp-2 font-display text-lg font-semibold leading-snug text-ink transition-colors group-hover:text-ink-muted">
              {product.name}
            </h3>
          </Link>
        </div>

        <p className="line-clamp-2 min-h-[2.5rem] text-sm leading-snug text-ink-muted">
          {product.tagline}
        </p>

        <div className="mt-auto pt-1">
          <Link
            href={productHref}
            className={cn(
              "inline-flex h-10 w-full items-center justify-center rounded-md px-5 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90",
              getAccentClasses(accent).bg
            )}
          >
            {bg.product.detailsCta}
          </Link>
        </div>
      </div>
    </article>
  );
}
