"use client";

import { useSearchParams } from "next/navigation";
import { FormEvent, useState, Suspense } from "react";
import { bg } from "@/content/bg";
import { SkeletonContactForm } from "@/components/skeletons";

type FormState = "idle" | "submitting" | "success" | "error";

function ContactFormInner() {
  const searchParams = useSearchParams();
  const defaultProduct = searchParams.get("product") ?? "";

  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormState("submitting");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          product: formData.get("product"),
          message: formData.get("message"),
        }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? bg.contact.form.error);
      }

      setFormState("success");
      form.reset();
    } catch (error) {
      setFormState("error");
      setErrorMessage(
        error instanceof Error ? error.message : bg.contact.form.error
      );
    }
  }

  if (formState === "success") {
    return (
      <div
        role="status"
        className="rounded-xl border border-accent-security/30 bg-white p-6 text-center shadow-soft"
      >
        <p className="font-medium text-zinc-800">{bg.contact.form.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink">
          {bg.contact.form.name}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
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
          required
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
          required
          rows={5}
          placeholder={bg.contact.form.messagePlaceholder}
          className="w-full resize-y rounded-lg border border-zinc-200 bg-white px-4 py-3 text-ink shadow-sm transition-colors focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
        />
      </div>

      {formState === "error" && (
        <p role="alert" className="text-sm text-red-600">
          {errorMessage || bg.contact.form.error}
        </p>
      )}

      <button
        type="submit"
        disabled={formState === "submitting"}
        className="w-full rounded-md bg-brand px-6 py-3 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {formState === "submitting"
          ? bg.contact.form.submitting
          : bg.contact.form.submit}
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
