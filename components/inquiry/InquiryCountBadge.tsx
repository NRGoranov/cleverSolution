"use client";

import { bg } from "@/content/bg";
import { useInquiry } from "./useInquiry";

export function InquiryCountBadge() {
  const { items } = useInquiry();
  if (items.length === 0) return null;

  return (
    <span
      className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1.5 text-[11px] font-semibold leading-none text-brand-foreground"
      aria-label={bg.product.inquiryCountAria(items.length)}
    >
      {items.length}
    </span>
  );
}
