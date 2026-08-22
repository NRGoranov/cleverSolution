import Image from "next/image";
import Link from "next/link";
import { bg } from "@/content/bg";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
};

export function BrandLogo({
  className,
  imageClassName,
  priority = false,
}: BrandLogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center rounded-md transition-[background-color,transform] duration-200 hover:bg-zinc-900/[0.04] active:scale-[0.99]",
        className
      )}
      aria-label={bg.site.name}
    >
      <Image
        src="/images/brand/logo.png"
        alt=""
        width={231}
        height={80}
        priority={priority}
        className={cn("h-8 w-auto md:h-9", imageClassName)}
      />
    </Link>
  );
}
