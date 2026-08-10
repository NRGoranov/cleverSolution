import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CategoryAccent } from "@/data/products";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const accentClasses: Record<
  CategoryAccent,
  { text: string; bg: string; border: string; ring: string }
> = {
  kitchen: {
    text: "text-zinc-800",
    bg: "bg-zinc-900",
    border: "border-zinc-800",
    ring: "focus-visible:outline-zinc-900",
  },
  security: {
    text: "text-zinc-800",
    bg: "bg-zinc-800",
    border: "border-zinc-700",
    ring: "focus-visible:outline-zinc-800",
  },
  wristbands: {
    text: "text-zinc-700",
    bg: "bg-zinc-700",
    border: "border-zinc-600",
    ring: "focus-visible:outline-zinc-700",
  },
  vacuums: {
    text: "text-zinc-700",
    bg: "bg-zinc-800",
    border: "border-zinc-600",
    ring: "focus-visible:outline-zinc-800",
  },
};

export function getAccentClasses(accent: CategoryAccent) {
  return accentClasses[accent];
}

export function formatPrice(priceBgn: number): string {
  return new Intl.NumberFormat("bg-BG", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(priceBgn);
}
