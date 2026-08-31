import type { Metadata } from "next";
import { bg } from "@/content/bg";
import { LegalPage } from "@/components/legal/LegalPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: bg.terms.title,
  description: bg.terms.intro,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage
      title={bg.terms.title}
      updated={bg.terms.updated}
      intro={bg.terms.intro}
      sections={bg.terms.sections}
    />
  );
}
