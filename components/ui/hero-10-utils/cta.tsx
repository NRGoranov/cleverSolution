import Link from "next/link";
import { Button, type ButtonProps } from "@/components/ui/button";

export type CtaProps = {
  ctaEnabled?: boolean;
  text: string;
  link?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
};

export function Cta({ cta }: { cta: CtaProps }) {
  if (!cta.ctaEnabled) return null;

  const href = cta.link?.trim() || "#";
  const isExternal = href.startsWith("http");

  if (isExternal) {
    return (
      <Button asChild variant={cta.variant ?? "default"} size={cta.size ?? "default"}>
        <a href={href} target="_blank" rel="noopener noreferrer">
          {cta.text}
        </a>
      </Button>
    );
  }

  return (
    <Button asChild variant={cta.variant ?? "default"} size={cta.size ?? "default"}>
      <Link href={href}>{cta.text}</Link>
    </Button>
  );
}
