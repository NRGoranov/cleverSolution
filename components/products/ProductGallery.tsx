"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/data/products/schema";
import type { CategoryAccent } from "@/data/products";
import { cn } from "@/lib/cn";
import { ImagePlaceholder } from "./ImagePlaceholder";

type ProductGalleryProps = {
  product: Product;
  accent: CategoryAccent;
};

export function ProductGallery({ product, accent }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const images = product.images;

  if (images.length === 0) {
    return (
      <ImagePlaceholder accent={accent} className="aspect-square w-full" />
    );
  }

  const activeImage = images[activeIndex] ?? images[0];

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-100 shadow-soft">
        <Image
          key={activeImage.src}
          src={activeImage.src}
          alt={activeImage.alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3" role="tablist" aria-label="Гalerия">
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={image.alt}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg ring-2 ring-offset-2 ring-offset-canvas transition-all",
                index === activeIndex
                  ? "ring-zinc-900"
                  : "ring-transparent hover:ring-zinc-200"
              )}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
