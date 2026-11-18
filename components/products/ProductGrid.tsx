import type { ProductWithCategory } from "@/data/products";
import { cn } from "@/lib/utils";
import { ProductCard } from "./ProductCard";

type ProductGridProps = {
  products: ProductWithCategory[];
  className?: string;
};

export function ProductGrid({ products, className }: ProductGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}
