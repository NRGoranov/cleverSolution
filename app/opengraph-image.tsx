import { ImageResponse } from "next/og";

export const alt = "Clever Solution — професионално кухненско оборудване";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(160deg, #fff8f1 0%, #ffe8d6 55%, #ffd4b0 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#d14f00",
          }}
        >
          Clever Solution
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.15,
            color: "#18181b",
            maxWidth: 900,
          }}
        >
          Професионално кухненско оборудване и решения
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 28,
            color: "#52525b",
          }}
        >
          Your clever choice
        </div>
      </div>
    ),
    { ...size }
  );
}
