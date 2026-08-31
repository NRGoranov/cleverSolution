import type { Metadata } from "next";
import Link from "next/link";
import { bg } from "@/content/bg";

export const metadata: Metadata = {
  title: bg.seo.notFoundTitle,
  description: bg.seo.notFoundDescription,
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="font-display text-6xl font-semibold text-brand">
        {bg.notFound.code}
      </p>
      <h1 className="mt-4 font-display text-3xl font-semibold text-ink md:text-4xl">
        {bg.notFound.title}
      </h1>
      <p className="mt-4 text-ink-muted">{bg.notFound.description}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-md bg-brand px-6 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand-dark"
        >
          {bg.notFound.homeCta}
        </Link>
        <Link
          href="/contact"
          className="inline-flex h-11 items-center justify-center rounded-md border border-zinc-200 bg-white px-6 text-sm font-medium text-ink transition-colors hover:bg-zinc-50"
        >
          {bg.notFound.contactCta}
        </Link>
      </div>
    </div>
  );
}
