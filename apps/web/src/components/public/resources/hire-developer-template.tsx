import type { TablerIcon } from "@tabler/icons-react";
import { HireCta } from "./hire-cta";
import { HireFeatures } from "./hire-features";
import { HireHero } from "./hire-hero";

type FeatureItem = {
  icon: TablerIcon;
  title: string;
  desc: string;
};

type HireDeveloperTemplateProps = {
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  featuresTitle: string;
  featuresDescription?: string;
  featuresItems: FeatureItem[];
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonLabel: string;
  ctaButtonHref?: string;
};

export function HireDeveloperTemplate({
  heroTitle,
  heroHighlight,
  heroSubtitle,
  featuresTitle,
  featuresDescription,
  featuresItems,
  ctaTitle,
  ctaDescription,
  ctaButtonLabel,
  ctaButtonHref,
}: HireDeveloperTemplateProps) {
  return (
    <main>
      <HireHero
        highlight={heroHighlight}
        subtitle={heroSubtitle}
        title={heroTitle}
      />
      <HireFeatures
        description={featuresDescription}
        items={featuresItems}
        title={featuresTitle}
      />
      <HireCta
        buttonHref={ctaButtonHref}
        buttonLabel={ctaButtonLabel}
        description={ctaDescription}
        title={ctaTitle}
      />
    </main>
  );
}
