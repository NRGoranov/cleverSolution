"use client";

import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/** Warm orange page backdrop — visible at top, fades to cream downward. */
export function PageGradientBackground() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-canvas"
    >
      {/* Primary top → bottom wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-soft/80 via-brand-soft/25 to-canvas" />

      {/* Glow accents — upper third only */}
      <div
        className={cn(
          "absolute -left-[12%] -top-[8%] h-[48%] w-[52%] rounded-full bg-brand-soft/70 blur-3xl",
          !reduceMotion && "animate-hero-glow-a"
        )}
      />
      <div
        className={cn(
          "absolute -right-[8%] top-0 h-[38%] w-[42%] rounded-full bg-brand-muted/25 blur-3xl",
          !reduceMotion && "animate-hero-glow-b"
        )}
      />
      <div
        className={cn(
          "absolute left-1/2 top-[4%] h-[32%] w-[36%] -translate-x-1/2 rounded-full bg-brand/12 blur-3xl",
          !reduceMotion && "animate-hero-glow-c"
        )}
      />

      {/* Gentle fade — lower half only */}
      <div className="absolute inset-x-0 top-[50%] h-[50%] bg-gradient-to-b from-transparent to-canvas/95" />
    </div>
  );
}
