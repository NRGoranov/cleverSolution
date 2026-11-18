"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, CircleCheck, Plus } from "lucide-react";
import { bg } from "@/content/bg";
import {
  addToInquiry,
  inquiryHas,
  type InquiryAddResult,
  type InquiryItem,
} from "@/lib/inquiry";
import { cn } from "@/lib/utils";

type AddToInquiryButtonProps = {
  item: InquiryItem;
  onResult?: (result: InquiryAddResult) => void;
};

export function InquiryAddedStatus({
  result,
}: {
  result: InquiryAddResult;
}) {
  const feedbackText =
    result === "added"
      ? bg.product.inquiryAddedFeedback
      : result === "updated"
        ? bg.product.inquiryUpdatedFeedback
        : bg.product.inquiryAlreadyFeedback;

  return (
    <p
      role="status"
      aria-live="polite"
      className="flex items-start gap-2 text-sm text-ink"
    >
      <CircleCheck
        className="mt-0.5 h-4 w-4 shrink-0 text-brand"
        aria-hidden="true"
      />
      <span>
        {feedbackText}{" "}
        <Link
          href="/contact"
          className="font-medium text-brand underline decoration-brand/40 underline-offset-2 hover:text-brand-dark"
        >
          {bg.product.inquiryViewCta}
        </Link>
      </span>
    </p>
  );
}

export function AddToInquiryButton({ item, onResult }: AddToInquiryButtonProps) {
  const [inList, setInList] = useState(false);

  useEffect(() => {
    setInList(inquiryHas(item.slug));
  }, [item.slug]);

  function handleClick() {
    const result = addToInquiry(item);
    setInList(true);
    onResult?.(result);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-md border px-5 text-sm font-medium transition-colors",
        inList
          ? "border-brand/40 bg-brand-soft text-brand"
          : "border-brand/30 text-brand hover:bg-brand-soft"
      )}
    >
      {inList ? (
        <Check className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Plus className="h-4 w-4" aria-hidden="true" />
      )}
      {inList ? bg.product.inquiryAddedCta : bg.product.inquiryAddCta}
    </button>
  );
}
