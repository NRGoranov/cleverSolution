import { Hero10 } from "@/components/ui/hero-10";
import { bg } from "@/content/bg";

/** Hero fan — one product photo from three different catalogue categories. */
const HERO_SLIDES = [
  {
    src: "/images/products/icp-xs/1.png",
    alt: "Професионален конвектомат iCombi PRO XS",
    href: "/kitchen",
    label: "Професионално кухненско оборудване",
  },
  {
    src: "/images/products/wristbands/vinyl-classic/1.jpg",
    alt: "Vinyl Classic гривни за контрол на достъпа",
    href: "/wristbands",
    label: "Гривни за контрол на достъпа",
  },
  {
    src: "/images/products/wristbands/rfid/1.png",
    alt: "RFID гривни и аксесоари за контрол на достъпа",
    href: "/security",
    label: "Решения за контрол на достъпа",
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
