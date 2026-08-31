import { Hero10 } from "@/components/ui/hero-10";
import { bg } from "@/content/bg";

/** Hero fan — three category entry points (product photos until partner shots arrive). */
const HERO_SLIDES = [
  {
    src: "/images/products/icp-xs/1.png",
    alt: "Професионален конвектомат iCombi PRO XS",
    href: "/kitchen",
    label: "Професионално кухненско оборудване",
  },
  {
    src: "/images/products/ivario-pro-l/1.png",
    alt: "Мултифункционален тиган iVario PRO L",
    href: "/security",
    label: "Решения за контрол на достъпа",
  },
  {
    src: "/images/products/idrochef-316touch/1.jpeg",
    alt: "Уред за sous-vide IDROCHEF",
    href: "/vacuums",
    label: "Препарати за почистване и поддръжка",
  },
] as const;

export function Hero() {
  return (
    <Hero10
      title={bg.hero.headline}
      titleLine2Prefix=""
      titleHighlight={bg.hero.headlineAccent}
      description={bg.hero.subheadline}
      images={HERO_SLIDES.map((slide) => slide.src)}
      imageAlts={HERO_SLIDES.map((slide) => slide.alt)}
      imageLinks={HERO_SLIDES.map((slide) => slide.href)}
      imageLabels={HERO_SLIDES.map((slide) => slide.label)}
      animation="subtle"
      primaryCTA={{
        ctaEnabled: true,
        text: bg.hero.cta,
        link: "#categories",
        variant: "default",
        size: "lg",
      }}
      secondaryCTA={{
        ctaEnabled: true,
        text: bg.hero.contactCta,
        link: "/contact",
        variant: "outline",
        size: "lg",
      }}
    />
  );
}
