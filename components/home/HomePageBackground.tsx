"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";
import { heroDriftWallItems, HERO_DRIFT_COLUMNS } from "@/lib/hero-drift-images";
import { cn } from "@/lib/utils";

const DriftWall = dynamic(() => import("@/components/DriftWall"), {
  ssr: false,
});

type HomePageBackgroundProps = {
  className?: string;
};

/** Fixed DriftWall backdrop for the homepage; sections scroll over it. */
export function HomePageBackground({ className }: HomePageBackgroundProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 z-0 overflow-hidden",
        className
      )}
    >
      <DriftWall
        items={[...heroDriftWallItems]}
        columns={HERO_DRIFT_COLUMNS}
        tileWidth={200}
        tileHeight={132}
        gap={18}
        tilt={16}
        turn={-10}
        perspective={1200}
        depth={120}
        speed={reduceMotion ? 0 : 10}
        direction="up"
        variance={0.45}
        parallax={reduceMotion ? 0 : 0.6}
        lift={64}
        fade={0.6}
        dim={0.55}
        overlayColor="#1c1008"
        radius={14}
        roll={0}
        pauseOnHover={false}
        grayscale={false}
        className="h-full min-h-screen"
      />
    </div>
  );
}
