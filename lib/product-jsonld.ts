import type { ProductWithCategory } from "@/data/products";
import { siteConfig } from "@/lib/site-config";

export function buildProductJsonLd(product: ProductWithCategory) {
  const url = `${siteConfig.url}/product/${product.slug}`;
  const image =
    product.images.length > 0
      ? product.images.map((img) =>
          img.src.startsWith("http") ? img.src : `${siteConfig.url}${img.src}`
        )
      : undefined;

  // No Offer. `priceBgn` is a legacy leva figure in the catalogue file, not a
  // selling price. Since 9 August 2026 a published price has to be the payable
  // price in euro and has to say whether VAT is included. "InStock" is also
  // not something this inquiry site can stand behind.
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    url,
    image,
  };
}
