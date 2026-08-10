import Link from "next/link";
import { bg } from "@/content/bg";
import type { CategoryAccent } from "@/data/products";
import { getAccentClasses } from "@/lib/utils";
import { cn } from "@/lib/cn";

type ComingSoonProps = {
  accent: CategoryAccent;
};

export function ComingSoon({ accent }: ComingSoonProps) {
  const { text, bg: bgAccent } = getAccentClasses(accent);

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-white px-6 py-20 text-center shadow-soft">
      <div
        className={cn(
          "mb-6 flex h-16 w-16 items-center justify-center rounded-full text-brand-foreground",
          bgAccent
        )}
        aria-hidden="true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      </div>
      <h2 className={cn("font-display text-2xl font-semibold md:text-3xl", text)}>
        {bg.category.comingSoon}
      </h2>
      <p className="mt-3 max-w-md text-ink-muted">
        {bg.category.comingSoonDescription}
      </p>
      <Link
        href="/contact"
        className={cn(
          "mt-8 inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90",
          bgAccent
        )}
      >
        {bg.category.contactCta}
      </Link>
    </div>
  );
}
