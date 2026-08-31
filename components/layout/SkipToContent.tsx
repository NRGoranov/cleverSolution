import { bg } from "@/content/bg";

export function SkipToContent() {
  return (
    <a href="#main-content" className="skip-link">
      {bg.a11y.skipToContent}
    </a>
  );
}
