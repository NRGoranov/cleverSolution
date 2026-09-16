import Link from "next/link";
import { parseFaqLinks } from "@/lib/faq";

const linkClassName =
  "font-medium text-brand underline decoration-brand/40 underline-offset-2 transition-colors hover:text-brand-dark hover:decoration-brand-dark";

export function FaqAnswer({ text }: { text: string }) {
  const parts = parseFaqLinks(text);

  return (
    <>
      {parts.map((part, index) => {
        if (part.type === "text") {
          return <span key={index}>{part.value}</span>;
        }

        const href = part.href;
        const external =
          href.startsWith("mailto:") ||
          href.startsWith("tel:") ||
          href.startsWith("http");

        if (external) {
          return (
            <a key={index} href={href} className={linkClassName}>
              {part.value}
            </a>
          );
        }

        return (
          <Link key={index} href={href} className={linkClassName}>
            {part.value}
          </Link>
        );
      })}
    </>
  );
}
