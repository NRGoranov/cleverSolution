"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "motion/react";

import { cn } from "@/lib/utils";

import { Cta, type CtaProps } from "@/components/ui/hero-10-utils/cta";

export interface Hero10Props {
  title: string;
  titleLine2Prefix?: string;
  titleHighlight?: string;
  description: string;
  socialProof?: string;
  images: string[];
  imageAlts?: string[];
  imageLinks?: string[];
  imageLabels?: string[];
  animation?: "none" | "subtle";
  primaryCTA: CtaProps;
  secondaryCTA?: CtaProps;
  variant?: "standard" | "compact";
}

const variantStyles = {
  standard: {
    section: "py-20 sm:py-28",
    title: "text-3xl sm:text-4xl md:text-5xl",
    description: "max-w-lg text-sm sm:text-base",
    header: "gap-5",
    content: "gap-8 sm:gap-10",
    fan: "max-w-3xl",
    fanCard: "aspect-[4/5]",
  },
  compact: {
    section: "py-14 sm:py-20",
    title: "text-2xl sm:text-3xl md:text-4xl",
    description: "max-w-md text-sm",
    header: "gap-4",
    content: "gap-6 sm:gap-8",
    fan: "max-w-2xl",
    fanCard: "aspect-[4/5]",
  },
} as const;

const fanSlots = [
  { width: "w-[38%]", layout: "-mr-8 z-10", rotate: -6, x: 48, ty: 24 },
  { width: "w-[42%]", layout: "z-20", rotate: 0, x: 0, ty: -8 },
  { width: "w-[38%]", layout: "-ml-8 z-10", rotate: 6, x: -48, ty: 24 },
];

const fanContainer: Variants = {
  hidden: { opacity: 0, y: 12, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.4,
      delayChildren: 0.5,
      staggerChildren: 0.1,
    },
  },
};

const fanCard: Variants = {
  hidden: (slot: (typeof fanSlots)[number]) => ({
    x: slot.x,
    rotate: slot.rotate,
    y: slot.ty,
  }),
  visible: (slot: (typeof fanSlots)[number]) => ({
    x: 0,
    rotate: slot.rotate,
    y: slot.ty,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 12, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

function Reveal({
  active,
  variants,
  className,
  children,
}: Readonly<{
  active: boolean;
  variants?: Variants;
  className?: string;
  children: React.ReactNode;
}>) {
  if (!active) return <div className={className}>{children}</div>;

  return (
    <motion.div variants={variants ?? item} className={className}>
      {children}
    </motion.div>
  );
}

function ImageFan({
  images,
  imageAlts,
  imageLinks,
  imageLabels,
  cardAspect,
  animate,
}: Readonly<{
  images: string[];
  imageAlts?: string[];
  imageLinks?: string[];
  imageLabels?: string[];
  cardAspect: string;
  animate: boolean;
}>) {
  return (
    <motion.div
      className="relative flex w-full items-center justify-center"
      variants={fanContainer}
      initial={animate ? "hidden" : false}
      whileInView={animate ? "visible" : undefined}
      animate={animate ? undefined : "visible"}
      viewport={{ once: true, margin: "-80px" }}
    >
      {images.slice(0, 3).map((src, i) => {
        const slot = fanSlots[i] ?? fanSlots[1];
        const href = imageLinks?.[i];
        const label = imageLabels?.[i];
        const alt = imageAlts?.[i] ?? label ?? "";

        const media = (
          <>
            <Image
              src={src}
              alt={href ? "" : alt}
              fill
              sizes="(max-width: 640px) 45vw, 28vw"
              priority={i === 1}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {label ? (
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-3 pb-3 pt-10 text-left text-xs font-semibold leading-snug text-white sm:text-sm">
                {label}
              </span>
            ) : null}
          </>
        );

        return (
          <motion.div
            key={src}
            custom={slot}
            variants={fanCard}
            className={cn(
              "group relative shrink-0 overflow-hidden rounded-xl shadow-xl outline outline-black/10",
              cardAspect,
              slot.width,
              slot.layout
            )}
          >
            {href ? (
              <Link
                href={href}
                className="absolute inset-0 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                aria-label={label ?? alt}
              >
                {media}
              </Link>
            ) : (
              media
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export function Hero10({
  title,
  titleLine2Prefix,
  titleHighlight,
  description,
  socialProof,
  images,
  imageAlts,
  imageLinks,
  imageLabels,
  animation = "none",
  primaryCTA,
  secondaryCTA,
  variant = "standard",
}: Readonly<Hero10Props>) {
  const reduce = useReducedMotion();
  const animate = animation === "subtle" && !reduce;
  const vs = variantStyles[variant];

  const titleElement = title && (
    <h1
      className={cn(
        "text-foreground font-serif font-normal tracking-tight text-balance",
        vs.title
      )}
    >
      {title}
      {(titleLine2Prefix || titleHighlight) && (
        <>
          <br />
          {titleLine2Prefix && <span>{titleLine2Prefix} </span>}
          {titleHighlight && (
            <span className="text-primary">{titleHighlight}</span>
          )}
        </>
      )}
    </h1>
  );

  const descriptionElement = description && (
    <p className={cn("text-muted-foreground text-balance", vs.description)}>
      {description}
    </p>
  );

  const ctasElement = (primaryCTA?.ctaEnabled || secondaryCTA?.ctaEnabled) && (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
      {primaryCTA?.ctaEnabled && <Cta cta={primaryCTA} />}
      {secondaryCTA?.ctaEnabled && (
        <Cta
          cta={{ ...secondaryCTA, variant: secondaryCTA.variant ?? "outline" }}
        />
      )}
    </div>
  );

  const socialProofElement = socialProof && (
    <p className="text-muted-foreground text-xs font-medium">{socialProof}</p>
  );

  const mediaElement = images?.length ? (
    <ImageFan
      images={images}
      imageAlts={imageAlts}
      imageLinks={imageLinks}
      imageLabels={imageLabels}
      cardAspect={vs.fanCard}
      animate={animate}
    />
  ) : null;

  return (
    <section className="relative w-full overflow-hidden">
      <motion.div
        className={cn(
          "relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 text-center",
          vs.section,
          vs.content
        )}
        variants={animate ? container : undefined}
        initial={animate ? "hidden" : false}
        whileInView={animate ? "visible" : undefined}
        viewport={{ once: true, margin: "-80px" }}
      >
        <Reveal
          active={animate}
          className={cn(
            "flex w-full max-w-2xl flex-col items-center",
            vs.header
          )}
        >
          {titleElement}
          {descriptionElement}
        </Reveal>

        <Reveal active={animate} className="flex flex-col items-center gap-4">
          {ctasElement}
          {socialProofElement}
        </Reveal>

        <div className={cn("mx-auto w-full", vs.fan)}>{mediaElement}</div>
      </motion.div>
    </section>
  );
}

export default Hero10;
