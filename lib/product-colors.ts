import type { ProductWithCategory } from "@/data/products";

export type ProductColorOption = {
  id: string;
  name: string;
  hex: string;
  /** When the client sends a photo for this color, the gallery swaps to it. */
  imageSrc?: string;
};

/** Official wristband colour chart (codes + names). Photo swap waits on per-colour images. */
export const WRISTBAND_COLORS: ProductColorOption[] = [
  { id: "50", name: "50 Silver", hex: "#8a9dad" },
  { id: "51", name: "51 Gold", hex: "#c17a2e" },
  { id: "70", name: "70 Navy Blue", hex: "#0a3d7a" },
  { id: "11", name: "11 White", hex: "#ffffff" },
  { id: "12", name: "12 Pink", hex: "#f5a3c7" },
  { id: "13", name: "13 Blue", hex: "#1e6fcf" },
  { id: "14", name: "14 Yellow", hex: "#ffe600" },
  { id: "15", name: "15 Light Green", hex: "#b8d4b0" },
  { id: "16", name: "16 Red", hex: "#e03131" },
  { id: "20", name: "20 Black", hex: "#1a1a1a" },
  { id: "22", name: "22 Kelly Green", hex: "#2ba84a" },
  { id: "23", name: "23 Lavender", hex: "#8b8fd4" },
  { id: "24", name: "24 Golden-rod", hex: "#f5a623" },
  { id: "25", name: "25 Cranberry", hex: "#c41e5c" },
  { id: "26", name: "26 Gray", hex: "#6b6f78" },
  { id: "29", name: "29 Day Glow Orange", hex: "#ff8c00" },
  { id: "33", name: "33 Grape", hex: "#7a2e9e" },
  { id: "35", name: "35 Aqua", hex: "#4ecad9" },
  { id: "37", name: "37 Day Glow Pink", hex: "#ff2d8a" },
  { id: "39", name: "39 Day Glow Green", hex: "#6fcf2d" },
  { id: "48", name: "48 Tan", hex: "#e8c99a" },
];

export function colorsForProduct(
  product: ProductWithCategory
): ProductColorOption[] {
  if (product.colorOptions?.length) return product.colorOptions;
  if (product.categoryId === "wristbands") return WRISTBAND_COLORS;
  return [];
}
