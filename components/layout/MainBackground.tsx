"use client";

import { usePathname } from "next/navigation";
import { HomePageBackground } from "@/components/home/HomePageBackground";
import { PageGradientBackground } from "@/components/layout/PageGradientBackground";

/** Home = DriftWall; all other routes = teal harmonic gradient. */
export function MainBackground() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (isHome) {
    return <HomePageBackground />;
  }

  return <PageGradientBackground />;
}
