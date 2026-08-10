import Link from "next/link";
import type { CategoryAccent } from "@/data/products";
import { getAccentClasses } from "@/lib/utils";
import { cn } from "@/lib/cn";

type CategoryCardProps = {
  name: string;
  description: string;
  href: string;
  accent: CategoryAccent;
};

export function CategoryCard({
  name,
  description,
  href,
  accent,
}: CategoryCardProps) {
  const { text, border } = getAccentClasses(accent);

  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col rounded-2xl border bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-soft-lg",
        border,
        "border-opacity-20"
      )}
    >
      <h3 className={cn("font-display text-xl font-semibold", text)}>
        {name}
      </h3>
      <p className="mt-2 flex-1 text-sm text-ink-muted">{description}</p>
      <span
        className={cn(
          "mt-4 inline-flex items-center text-sm font-medium transition-transform group-hover:translate-x-1",
          text
        )}
      >
        Разгледайте
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="ml-1"
          aria-hidden="true"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </span>
    </Link>
  );
}
