import { FeatureHero } from "./feature-hero";
import { FeatureCardImageLeft } from "./feature-card-image-left";
import { FeatureCardContentLeft } from "./feature-card-content-left";
import { FeatureStatsSection } from "./feature-stats-section";
import { FeatureFaqSection } from "./feature-faq-section";
import { FeatureCtaSection } from "./feature-cta-section";
import { LandingHeader } from "@/components/landing/landing-header";
import { Footer } from "@/components/landing/footer";
import type { FeaturePageData } from "./feature-page-data";

interface FeaturePageTemplateProps {
  data: FeaturePageData;
}

export function FeaturePageTemplate({ data }: FeaturePageTemplateProps) {
  return (
    <div className="w-full">
      <FeatureHero
        category={data.category}
        headingBefore={data.headingBefore}
        headingHighlight={data.headingHighlight}
        subtitle={data.subtitle}
        ctaPrimary={data.ctaPrimary}
        ctaSecondary={data.ctaSecondary}
      />
      {data.sections.map((section) =>
        section.layout === "image-left" ? (
          <FeatureCardImageLeft
            key={section.heading}
            badge={section.badge}
            heading={section.heading}
            description={section.description}
            linkText={section.linkText}
            linkHref={section.linkHref}
            imageSrc={section.imageSrc}
            imageAlt={section.imageAlt}
            bgVariant={section.bgVariant}
          />
        ) : (
          <FeatureCardContentLeft
            key={section.heading}
            badge={section.badge}
            heading={section.heading}
            description={section.description}
            linkText={section.linkText}
            linkHref={section.linkHref}
            imageSrc={section.imageSrc}
            imageAlt={section.imageAlt}
            bgVariant={section.bgVariant}
          />
        )
      )}
      <FeatureStatsSection
        headline={data.statsHeadline}
        subtitle={data.statsSubtitle}
        stats={data.stats as [typeof data.stats[0], typeof data.stats[0], typeof data.stats[0]]}
      />
      <FeatureFaqSection items={data.faq} />
      <FeatureCtaSection
        heading={data.ctaHeading}
        ctaPrimary={data.ctaPrimary}
        ctaSecondary={data.ctaSecondary}
      />
    </div>
  );
}
