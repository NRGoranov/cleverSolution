export const siteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://cleversolutions.bg",
  brand: {
    /** Swap hero image/headline here when a flagship product is ready */
    heroImage: null as string | null,
    heroHeadline: null as string | null,
  },
  contact: {
    toEmail:
      process.env.TO_EMAIL ??
      process.env.CONTACT_TO_EMAIL ??
      "office@cleversolution.bg",
  },
} as const;
