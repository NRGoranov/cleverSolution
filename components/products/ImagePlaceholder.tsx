import { bg } from "@/content/bg";
import { cn } from "@/lib/cn";
import type { CategoryAccent } from "@/data/products";
import { getAccentClasses } from "@/lib/utils";

type ImagePlaceholderProps = {
  accent?: CategoryAccent;
  className?: string;
  compact?: boolean;
};

export function ImagePlaceholder({
  accent = "kitchen",
  className,
  compact = false,
}: ImagePlaceholderProps) {
  const { text, border } = getAccentClasses(accent);

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-xl bg-zinc-100",
        "border border-dashed",
        border,
        className
      )}
      role="img"
      aria-label={bg.product.photoPending}
    >
      <div className="absolute inset-0 opacity-30">
        <svg
          className="h-full w-full"
          viewBox="0 0 200 200"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="placeholder-pattern"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1" className="fill-ink-subtle" />
            </pattern>
          </defs>
          <rect width="200" height="200" fill="url(#placeholder-pattern)" />
        </svg>
      </div>
      <div className="relative flex flex-col items-center gap-2 px-4 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={compact ? 28 : 40}
          height={compact ? 28 : 40}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(text, "opacity-70")}
          aria-hidden="true"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
        <span
          className={cn(
            "font-display font-medium",
            text,
            compact ? "text-sm" : "text-base"
          )}
        >
          {bg.product.photoPending}
        </span>
      </div>
    </div>
  );
}
