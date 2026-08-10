import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: "#ffffff",
          alt: "#f4f4f5",
        },
        ink: {
          DEFAULT: "#18181b",
          muted: "#52525b",
          subtle: "#a1a1aa",
        },
        brand: {
          DEFAULT: "#0f766e",
          dark: "#115e59",
          muted: "#14b8a6",
          soft: "#ccfbf1",
          foreground: "#ffffff",
        },
        accent: {
          kitchen: "#0f766e",
          security: "#0d9488",
          wristbands: "#14b8a6",
          vacuums: "#2dd4bf",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 24px -4px rgba(24, 24, 27, 0.06), 0 2px 8px -2px rgba(24, 24, 27, 0.03)",
        "soft-lg":
          "0 8px 32px -8px rgba(24, 24, 27, 0.1), 0 4px 16px -4px rgba(24, 24, 27, 0.05)",
      },
    },
  },
  plugins: [],
};

export default config;
