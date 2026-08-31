import type { Metadata } from "next";
import { bg } from "@/content/bg";
import { LegalPage } from "@/components/legal/LegalPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: bg.privacy.title,
  description: bg.privacy.intro,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage
      title={bg.privacy.title}
      updated={bg.privacy.updated}
      intro={bg.privacy.intro}
      sections={bg.privacy.sections}
    />
  );
}
