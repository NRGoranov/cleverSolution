import type { Metadata } from "next";
import { bg } from "@/content/bg";
import { siteConfig } from "@/lib/site-config";

export function absoluteUrl(path = "/"): string {
  const base = siteConfig.url.replace(/\/$/, "");
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

type BuildMetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  /** Skip the "%s | Brand" template (homepage). */
  absoluteTitle?: boolean;
};

export function buildMetadata({
  title,
  description,
  path,
  image,
  imageAlt,
  absoluteTitle = false,
}: BuildMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const ogImages = image
    ? [
        {
          url: image.startsWith("http") ? image : absoluteUrl(image),
          alt: imageAlt ?? title,
        },
      ]
    : undefined;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      locale: "bg_BG",
      siteName: bg.site.name,
      type: "website",
      images: ogImages,
    },
    twitter: {
      card: ogImages ? "summary_large_image" : "summary",
      title,
      description,
      images: ogImages?.map((item) => item.url),
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: bg.site.name,
    legalName: "КЛЕВЪР СОЛЮШЪН ЕООД",
    url: siteConfig.url,
    logo: absoluteUrl("/images/brand/logo.png"),
    email: bg.contact.info.email,
    telephone: bg.contact.info.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "София",
      addressCountry: "BG",
    },
  };
}

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: bg.faq.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
