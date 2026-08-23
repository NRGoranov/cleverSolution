declare module "@/components/DriftWall" {
  import type { CSSProperties } from "react";

  export type DriftWallItem = {
    image: string;
    title?: string;
    href?: string;
    column?: number;
  };

  export type DriftWallProps = {
    items?: DriftWallItem[];
    columns?: number;
    /** Grow columns so the wall spans the viewport (default true). */
    fillViewport?: boolean;
    tileWidth?: number;
    tileHeight?: number;
    gap?: number;
    radius?: number;
    tilt?: number;
    turn?: number;
    roll?: number;
    perspective?: number;
    depth?: number;
    speed?: number;
    direction?: "up" | "down";
    variance?: number;
    parallax?: number;
    pauseOnHover?: boolean;
    lift?: number;
    fade?: number;
    dim?: number;
    grayscale?: boolean;
    overlayColor?: string;
    className?: string;
    style?: CSSProperties;
  };

  const DriftWall: (props: DriftWallProps) => JSX.Element;
  export default DriftWall;
}
