export const siteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://cleversolutions.bg",
  brand: {
    /** Swap hero image/headline here when a flagship product is ready */
    heroImage: null as string | null,
    heroHeadline: null as string | null,
  },
  contact: {
    toEmail: process.env.CONTACT_TO_EMAIL ?? "info@cleversolutions.bg",
    fromEmail: process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev",
  },
} as const;
