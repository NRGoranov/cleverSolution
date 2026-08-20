import { bg } from "@/content/bg";
import type { Product } from "@/data/products/schema";

type ProductSpecsProps = {
  specs: Product["specs"];
};

const I_FEATURE_LABEL = /^i[A-Z]/;
const LONG_SPEC_VALUE_CHARS = 70;

function isIFeature(spec: Product["specs"][number]): boolean {
  return I_FEATURE_LABEL.test(spec.label);
}

function isLongSpec(spec: Product["specs"][number]): boolean {
  if (isIFeature(spec)) return true;
  return spec.value.trim().length > LONG_SPEC_VALUE_CHARS;
}

function sortSpecs(specs: Product["specs"]): Product["specs"] {
  const short = specs.filter((spec) => !isLongSpec(spec));
  const long = specs.filter((spec) => isLongSpec(spec) && !isIFeature(spec));
  const iFeatures = specs.filter((spec) => isIFeature(spec));
  return [...short, ...long, ...iFeatures];
}

export function ProductSpecs({ specs }: ProductSpecsProps) {
  if (specs.length === 0) return null;

  const orderedSpecs = sortSpecs(specs);

  return (
    <section aria-labelledby="specs-heading">
      <h2 id="specs-heading" className="mb-4 font-display text-xl font-semibold text-ink">
        {bg.product.specsTitle}
      </h2>
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-soft">
        <table className="w-full text-left text-sm">
          <tbody>
            {orderedSpecs.map((spec) => (
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
