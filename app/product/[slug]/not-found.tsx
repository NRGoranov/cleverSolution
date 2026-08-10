import Link from "next/link";
import { bg } from "@/content/bg";

export default function ProductNotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-24 text-center">
      <h1 className="font-display text-3xl font-semibold text-ink">
        {bg.product.notFound}
      </h1>
      <Link
        href="/"
        className="mt-6 inline-flex items-center justify-center rounded-md bg-zinc-900 px-6 py-3 text-sm font-medium text-white"
      >
        {bg.product.backToCategories}
      </Link>
    </div>
  );
}
