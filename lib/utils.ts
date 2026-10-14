import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CategoryAccent } from "@/data/products";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Primary CTA shared by category “Детайли” and product “Свържете се”. */
export const primaryCtaClassName =
  "inline-flex h-10 items-center justify-center rounded-md bg-brand px-5 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90";

const accentClasses: Record<
  CategoryAccent,
  { text: string; bg: string; border: string; ring: string }
> = {
  kitchen: {
    text: "text-brand",
    bg: "bg-brand",
    border: "border-brand",
    ring: "focus-visible:outline-brand",
  },
  security: {
    text: "text-brand-dark",
    bg: "bg-brand-dark",
    border: "border-brand-dark",
    ring: "focus-visible:outline-brand-dark",
  },
  wristbands: {
    text: "text-brand",
    bg: "bg-brand-muted",
    border: "border-brand-muted",
    ring: "focus-visible:outline-brand-muted",
  },
  vacuums: {
    text: "text-brand-dark",
    bg: "bg-brand",
    border: "border-brand",
    ring: "focus-visible:outline-brand",
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
