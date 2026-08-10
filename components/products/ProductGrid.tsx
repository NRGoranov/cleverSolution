import type { ProductWithCategory } from "@/data/products";
import { ProductCard } from "./ProductCard";

type ProductGridProps = {
  products: ProductWithCategory[];
};

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}
