"use client";

import Link from "next/link";
import { ClipboardList, X } from "lucide-react";
import { bg } from "@/content/bg";
import {
  formatInquiryForSubmit,
  formatInquiryItem,
  removeFromInquiry,
  type InquiryItem,
} from "@/lib/inquiry";

type InquiryProductListProps = {
  items: InquiryItem[];
  ready?: boolean;
};

export function InquiryProductList({
  items,
  ready = true,
}: InquiryProductListProps) {
  const submitValue = formatInquiryForSubmit(items);

  return (
    <div>
      <p
        id="product-label"
        className="mb-1.5 block text-sm font-medium text-ink"
      >
        {bg.contact.form.product}
      </p>
      <input type="hidden" name="product" value={submitValue} />

      {!ready ? (
        <div
          className="min-h-[3.25rem] rounded-lg border border-zinc-200 bg-white shadow-sm"
          aria-hidden="true"
        />
      ) : items.length === 0 ? (
        <div className="flex items-start gap-3 rounded-lg border border-dashed border-zinc-200 bg-white px-4 py-3 text-sm text-ink-muted">
          <ClipboardList
            className="mt-0.5 h-4 w-4 shrink-0 text-ink-subtle"
            aria-hidden="true"
          />
          <p>
            {bg.contact.form.inquiryEmpty}{" "}
            <Link
              href="/kitchen"
              className="font-medium text-brand underline decoration-brand/40 underline-offset-2 hover:text-brand-dark"
            >
              {bg.contact.form.inquiryBrowse}
            </Link>
          </p>
        </div>
      ) : (
        <ul
          aria-labelledby="product-label"
          className="space-y-2 rounded-lg border border-zinc-200 bg-white p-2 shadow-sm"
        >
          {items.map((item) => (
            <li
              key={item.slug}
              className="flex items-center justify-between gap-3 rounded-md px-2 py-1.5"
            >
              <span className="text-sm text-ink">{formatInquiryItem(item)}</span>
              <button
                type="button"
                onClick={() => removeFromInquiry(item.slug)}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-zinc-100 hover:text-ink"
                aria-label={`${bg.contact.form.inquiryRemove}: ${formatInquiryItem(item)}`}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
