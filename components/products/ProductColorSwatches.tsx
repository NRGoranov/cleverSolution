"use client";

import { bg } from "@/content/bg";
import type { ProductColorOption } from "@/lib/product-colors";
import { cn } from "@/lib/cn";

type ProductColorSwatchesProps = {
  colors: ProductColorOption[];
  selectedId: string | null;
  onSelect: (color: ProductColorOption) => void;
};

function isLight(hex: string) {
  const n = hex.replace("#", "");
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 220;
}

export function ProductColorSwatches({
  colors,
  selectedId,
  onSelect,
}: ProductColorSwatchesProps) {
  if (colors.length === 0) return null;

  const selected = colors.find((color) => color.id === selectedId);

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-ink">
        {selected
          ? bg.product.colorSelected(selected.name)
          : bg.product.colorLabel}
      </p>
      <div
        role="radiogroup"
        aria-label={bg.product.colorLabel}
        className="flex flex-wrap gap-2"
      >
        {colors.map((color) => {
          const selectedSwatch = color.id === selectedId;
          return (
            <button
              key={color.id}
              type="button"
              role="radio"
              aria-checked={selectedSwatch}
              aria-label={color.name}
              title={color.name}
              onClick={() => onSelect(color)}
              className={cn(
                "h-8 w-8 rounded-full shadow-[inset_0_0_0_1px_rgba(24,24,27,0.12)] transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
                selectedSwatch
                  ? "scale-110 ring-2 ring-ink ring-offset-2 ring-offset-canvas"
                  : "hover:scale-105",
                isLight(color.hex) && "border border-zinc-300"
              )}
              style={{ backgroundColor: color.hex }}
            />
          );
        })}
      </div>
    </div>
  );
}
