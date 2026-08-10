import { Hero10 } from "@/components/ui/hero-10";
import { bg } from "@/content/bg";

/** Hero fan — local cooking machinery only (from /public/images/hero). */
const HERO_IMAGES = [
  "/images/hero/1-fryer.png",
  "/images/hero/2-combi-oven.png",
  "/images/hero/3-deck-oven.png",
] as const;

const HERO_ALTS = [
  "Професионален двоен фритюрник от неръждаема стомана",
  "Професионален конвектомат Rational",
  "Професионална пекарска фурна Doyon",
] as const;

export function Hero() {
  return (
    <Hero10
      title={bg.hero.headline}
      titleLine2Prefix=""
      titleHighlight={bg.hero.headlineAccent}
      description={bg.hero.subheadline}
      images={[...HERO_IMAGES]}
      imageAlts={[...HERO_ALTS]}
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
