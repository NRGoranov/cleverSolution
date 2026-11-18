"use client";

import Link from "next/link";
import { useState } from "react";
import { bg } from "@/content/bg";
import type { CategoryAccent, ProductWithCategory } from "@/data/products";
import { colorsForProduct, type ProductColorOption } from "@/lib/product-colors";
import { primaryCtaClassName } from "@/lib/utils";
import {
  AddToInquiryButton,
  InquiryAddedStatus,
} from "@/components/inquiry/AddToInquiryButton";
import type { InquiryAddResult } from "@/lib/inquiry";
import { ProductColorSwatches } from "./ProductColorSwatches";
import { ProductGallery } from "./ProductGallery";

type ProductDetailProps = {
  product: ProductWithCategory;
  accent: CategoryAccent;
  categoryName?: string;
};

export function ProductDetail({
  product,
  accent,
  categoryName,
}: ProductDetailProps) {
  const colors = colorsForProduct(product);
  const [selectedColor, setSelectedColor] = useState<ProductColorOption | null>(
    null
  );
  const [inquiryResult, setInquiryResult] = useState<InquiryAddResult | null>(
    null
  );

  const productLabel = selectedColor
    ? `${product.name} — ${selectedColor.name}`
    : product.name;
  const contactHref = `/contact?product=${encodeURIComponent(productLabel)}`;

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="space-y-4">
        <ProductGallery
          product={product}
          accent={accent}
          selectedColor={selectedColor}
        />
        <ProductColorSwatches
          colors={colors}
          selectedId={selectedColor?.id ?? null}
          onSelect={(color) =>
            setSelectedColor((current) =>
              current?.id === color.id ? null : color
            )
          }
        />
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-ink">
            {categoryName}
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
          <p className="leading-relaxed text-ink-muted">{product.description}</p>
        </section>

        <div className="space-y-3 pt-2">
          <p className="text-sm text-ink-muted">{bg.product.inquiryHint}</p>
          <div className="flex flex-wrap items-center gap-4">
            <AddToInquiryButton
              item={{
                slug: product.slug,
                name: product.name,
                colorId: selectedColor?.id,
                colorName: selectedColor?.name,
              }}
              onResult={setInquiryResult}
            />
            <Link href={contactHref} className={primaryCtaClassName}>
              {bg.product.contactCta}
            </Link>
            {product.buyUrl && (
              <a
                href={product.buyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center justify-center rounded-md border border-brand/30 px-5 text-sm font-medium text-brand transition-colors hover:bg-brand-soft"
              >
                {bg.product.externalBuy}
              </a>
            )}
          </div>
          {inquiryResult ? <InquiryAddedStatus result={inquiryResult} /> : null}
        </div>
      </div>
    </div>
  );
}
