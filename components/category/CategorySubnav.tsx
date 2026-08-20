import Link from "next/link";
import { cn } from "@/lib/cn";
import { getAccentClasses } from "@/lib/utils";

type Subcategory = {
  name: string;
  slug: string;
};

type CategorySubnavProps = {
  categoryHref: string;
  subcategories: readonly Subcategory[];
  activeSub?: string;
  accent: "kitchen" | "security" | "wristbands" | "vacuums";
  counts: Record<string, number>;
  totalCount: number;
};

export function CategorySubnav({
  categoryHref,
  subcategories,
  activeSub,
  accent,
  counts,
  totalCount,
}: CategorySubnavProps) {
  const { text, bg: bgAccent } = getAccentClasses(accent);

  const linkClass = (active: boolean) =>
    cn(
      "inline-flex shrink-0 items-center rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
      active
        ? cn("border-transparent text-white", bgAccent)
        : "border-zinc-200 bg-white text-ink-muted hover:border-zinc-300 hover:text-ink"
    );

  return (
    <nav
      aria-label="Подкатегории"
      className="mb-8 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <Link href={categoryHref} className={linkClass(!activeSub)}>
        Всички
        <span className={cn("ml-1.5 tabular-nums", !activeSub ? "text-white/80" : text)}>
          ({totalCount})
        </span>
      </Link>
      {subcategories.map((sub) => {
        const count = counts[sub.slug] ?? 0;
        if (count === 0) return null;
        const active = activeSub === sub.slug;
        return (
          <Link
            key={sub.slug}
            href={`${categoryHref}?sub=${sub.slug}`}
            className={linkClass(active)}
          >
            {sub.name}
            <span className={cn("ml-1.5 tabular-nums", active ? "text-white/80" : text)}>
              ({count})
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
