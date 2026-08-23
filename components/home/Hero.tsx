import { Hero10 } from "@/components/ui/hero-10";
import { bg } from "@/content/bg";

/** Hero fan — three category entry points (placeholder photos until partner shots arrive). */
const HERO_SLIDES = [
  {
    src: "/images/hero/1-fryer.png",
    alt: "Професионален двоен фритюрник от неръждаема стомана",
    href: "/kitchen",
    label: "Професионално кухненско оборудване",
  },
  {
    src: "/images/hero/2-combi-oven.png",
    alt: "Професионален конвектомат Rational",
    href: "/security",
    label: "Решения за контрол на достъпа",
  },
  {
    src: "/images/hero/3-deck-oven.png",
    alt: "Професионална пекарска фурна Doyon",
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
        size: "default",
      }}
      secondaryCTA={{
        ctaEnabled: true,
        text: bg.hero.contactCta,
        link: "/contact",
        variant: "outline",
        size: "default",
      }}
    />
  );
}
