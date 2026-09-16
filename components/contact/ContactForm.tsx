"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FormEvent, Suspense } from "react";
import { bg } from "@/content/bg";
import { SkeletonContactForm } from "@/components/skeletons";

function ContactFormInner() {
  const searchParams = useSearchParams();
  const defaultProduct = searchParams.get("product") ?? "";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div
        role="alert"
        className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950"
      >
        <p>{bg.contact.form.unavailable}</p>
        <p className="mt-2">
          <a
            href={`tel:${bg.contact.info.phone.replace(/\s/g, "")}`}
            className="font-medium text-brand underline decoration-brand/40 underline-offset-2 hover:text-brand-dark"
          >
            {bg.contact.info.phone}
          </a>
          {" · "}
          <a
            href={`mailto:${bg.contact.info.email}`}
            className="font-medium text-brand underline decoration-brand/40 underline-offset-2 hover:text-brand-dark"
          >
            {bg.contact.info.email}
          </a>
        </p>
      </div>

      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink">
          {bg.contact.form.name}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder={bg.contact.form.namePlaceholder}
          className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-ink shadow-sm transition-colors focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
          {bg.contact.form.email}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder={bg.contact.form.emailPlaceholder}
          className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-ink shadow-sm transition-colors focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
        />
      </div>

      <div>
        <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-ink">
          {bg.contact.form.phone}
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder={bg.contact.form.phonePlaceholder}
          className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-ink shadow-sm transition-colors focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
        />
      </div>

      <div>
        <label htmlFor="product" className="mb-1.5 block text-sm font-medium text-ink">
          {bg.contact.form.product}
        </label>
        <input
          id="product"
          name="product"
          type="text"
          defaultValue={defaultProduct}
          key={defaultProduct}
          placeholder={bg.contact.form.productPlaceholder}
          className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-ink shadow-sm transition-colors focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-ink">
          {bg.contact.form.message}
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder={bg.contact.form.messagePlaceholder}
          className="w-full resize-y rounded-lg border border-zinc-200 bg-white px-4 py-3 text-ink shadow-sm transition-colors focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
        />
      </div>

      <p className="text-xs leading-relaxed text-ink-subtle">
        {bg.contact.form.privacyNote}{" "}
        <Link
          href="/privacy"
          className="font-medium text-ink underline decoration-zinc-300 underline-offset-2 hover:text-brand"
        >
          {bg.contact.form.privacyLink}
        </Link>
        .
      </p>

      <button
        type="submit"
        formNoValidate
        disabled
        aria-disabled="true"
        className="min-h-11 w-full cursor-not-allowed rounded-md bg-brand px-6 py-3 text-sm font-medium text-brand-foreground opacity-50"
      >
        {bg.contact.form.submit}
      </button>
    </form>
  );
}

export function ContactForm() {
  return (
    <Suspense fallback={<SkeletonContactForm />}>
      <ContactFormInner />
    </Suspense>
  );
}
