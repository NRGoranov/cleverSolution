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

  // Prices omitted until real pricing is supplied (priceBgn stays optional in schema).
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    url,
    image,
  };

  if (product.priceBgn != null) {
    jsonLd.offers = {
      "@type": "Offer",
      priceCurrency: "BGN",
      price: product.priceBgn,
      availability: "https://schema.org/InStock",
      url,
    };
  }

  return jsonLd;
}
