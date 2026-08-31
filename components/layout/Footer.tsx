import Link from "next/link";
import { bg } from "@/content/bg";
import { categories } from "@/data/products";
import { BrandLogo } from "@/components/layout/BrandLogo";

const legalLinks = [
  { href: "/faq", label: bg.nav.faq },
  { href: "/privacy", label: bg.nav.privacy },
  { href: "/terms", label: bg.nav.terms },
] as const;

export function Footer() {
  return (
    <footer className="relative z-10 mt-auto border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <BrandLogo imageClassName="h-8 w-auto" />
          <p className="mt-3 text-sm text-ink-muted">{bg.site.tagline}</p>
          <Link
            href="/about"
            className="mt-3 inline-block text-sm font-medium text-ink transition-colors hover:text-brand"
          >
            {bg.nav.about}
          </Link>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-muted">
            {bg.nav.categories}
          </p>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={category.href}
                  className="text-sm text-ink transition-colors hover:text-ink-muted"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-muted">
            {bg.footer.contact}
          </p>
          <ul className="space-y-2 text-sm text-ink">
            <li>
              <a
                href={`mailto:${bg.contact.info.email}`}
                className="transition-colors hover:text-ink-muted"
              >
                {bg.contact.info.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${bg.contact.info.phone.replace(/\s/g, "")}`}
                className="transition-colors hover:text-ink-muted"
              >
                {bg.contact.info.phone}
              </a>
            </li>
            <li>{bg.contact.info.address}</li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-muted">
            {bg.footer.legal}
          </p>
          <ul className="space-y-2">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-ink transition-colors hover:text-ink-muted"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative border-t border-zinc-200 px-4 py-6 sm:py-6">
        <p className="text-center text-sm text-ink-muted">
          © {new Date().getFullYear()} {bg.site.name}. {bg.footer.rights}
        </p>
        <p className="mt-3 text-center text-xs text-ink-subtle sm:absolute sm:bottom-6 sm:left-6 sm:mt-0 sm:text-left">
          {bg.footer.madeBy}{" "}
          <a
            href={bg.footer.makerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-ink-subtle/40 underline-offset-2 transition-colors hover:text-brand hover:decoration-brand/50"
          >
            {bg.footer.makerName}
          </a>
        </p>
      </div>
    </footer>
  );
}
