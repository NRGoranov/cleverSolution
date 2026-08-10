import { bg } from "@/content/bg";
import type { Product } from "@/data/products/schema";

type ProductSpecsProps = {
  specs: Product["specs"];
};

export function ProductSpecs({ specs }: ProductSpecsProps) {
  if (specs.length === 0) return null;

  return (
    <section aria-labelledby="specs-heading">
      <h2 id="specs-heading" className="mb-4 font-display text-xl font-semibold text-ink">
        {bg.product.specsTitle}
      </h2>
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-soft">
        <table className="w-full text-left text-sm">
          <tbody>
            {specs.map((spec) => (
              <tr key={spec.label} className="border-b border-zinc-100 last:border-0">
                <th
                  scope="row"
                  className="w-2/5 px-5 py-3 font-medium text-ink-muted"
                >
                  {spec.label}
                </th>
                <td className="px-5 py-3 text-ink">{spec.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
