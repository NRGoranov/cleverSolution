"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { bg } from "@/content/bg";
import { InquiryProductList } from "@/components/inquiry/InquiryProductList";
import { useInquiry } from "@/components/inquiry/useInquiry";
import { SkeletonContactForm } from "@/components/skeletons";
import { clearInquiry, mergeInquiryLabel } from "@/lib/inquiry";

type FormState = "idle" | "submitting" | "success" | "error";
type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateFields(formData: FormData): FieldErrors {
  const errors: FieldErrors = {};
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (name.length < 2) errors.name = bg.contact.form.nameError;
  if (!isValidEmail(email)) errors.email = bg.contact.form.emailError;
  if (message.length < 10) errors.message = bg.contact.form.messageError;

  return errors;
}

function ContactFormInner({ smtpEnabled }: { smtpEnabled: boolean }) {
  const searchParams = useSearchParams();
  const { items: inquiryItems, ready: inquiryReady } = useInquiry();

  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    const queryProduct = searchParams.get("product");
    if (queryProduct) mergeInquiryLabel(queryProduct);
  }, [searchParams]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!smtpEnabled) return;

    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const clientErrors = validateFields(formData);

    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      setFormState("idle");
      return;
    }

    setFieldErrors({});
    setFormState("submitting");

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
      clearInquiry();
      form.reset();
    } catch (error) {
      setFormState("error");
      setErrorMessage(
        error instanceof Error ? error.message : bg.contact.form.error
      );
    }
  }

  if (smtpEnabled && formState === "success") {
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
      {!smtpEnabled ? (
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
      ) : null}

      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink">
          {bg.contact.form.name}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required={smtpEnabled}
          maxLength={120}
          autoComplete="name"
          aria-invalid={fieldErrors.name ? true : undefined}
          aria-describedby={fieldErrors.name ? "name-error" : undefined}
          placeholder={bg.contact.form.namePlaceholder}
          className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-ink shadow-sm transition-colors focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
        />
        {fieldErrors.name ? (
          <p id="name-error" role="alert" className="mt-1.5 text-sm text-red-600">
            {fieldErrors.name}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
          {bg.contact.form.email}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required={smtpEnabled}
          maxLength={254}
          autoComplete="email"
          aria-invalid={fieldErrors.email ? true : undefined}
          aria-describedby={fieldErrors.email ? "email-error" : undefined}
          placeholder={bg.contact.form.emailPlaceholder}
          className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-ink shadow-sm transition-colors focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
        />
        {fieldErrors.email ? (
          <p id="email-error" role="alert" className="mt-1.5 text-sm text-red-600">
            {fieldErrors.email}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-ink">
          {bg.contact.form.phone}
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          maxLength={40}
          autoComplete="tel"
          placeholder={bg.contact.form.phonePlaceholder}
          className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-ink shadow-sm transition-colors focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
        />
      </div>

      <InquiryProductList items={inquiryItems} ready={inquiryReady} />

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-ink">
          {bg.contact.form.message}
        </label>
        <textarea
          id="message"
          name="message"
          required={smtpEnabled}
          maxLength={5000}
          rows={5}
          aria-invalid={fieldErrors.message ? true : undefined}
          aria-describedby={fieldErrors.message ? "message-error" : undefined}
          placeholder={bg.contact.form.messagePlaceholder}
          className="w-full resize-y rounded-lg border border-zinc-200 bg-white px-4 py-3 text-ink shadow-sm transition-colors focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
        />
        {fieldErrors.message ? (
          <p id="message-error" role="alert" className="mt-1.5 text-sm text-red-600">
            {fieldErrors.message}
          </p>
        ) : null}
      </div>

      {formState === "error" && (
        <p role="alert" className="text-sm text-red-600">
          {errorMessage || bg.contact.form.error}
        </p>
      )}

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
        disabled={!smtpEnabled || formState === "submitting"}
        aria-disabled={!smtpEnabled || formState === "submitting"}
        className="min-h-11 w-full rounded-md bg-brand px-6 py-3 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        {formState === "submitting"
          ? bg.contact.form.submitting
          : bg.contact.form.submit}
      </button>
    </form>
  );
}

export function ContactForm({ smtpEnabled = false }: { smtpEnabled?: boolean }) {
  return (
    <Suspense fallback={<SkeletonContactForm />}>
      <ContactFormInner smtpEnabled={smtpEnabled} />
    </Suspense>
  );
}
