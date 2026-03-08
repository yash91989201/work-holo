import { FeatureFaqSection } from "../TeamChannel/feature-faq-section";
import { FeatureCtaSection } from "../TeamChannel/feature-cta-section";
import { REAL_TIME_PAGE_DATA } from "./real-time-data";
import { RealTimeHero } from "./real-time-hero";
import { RealTimeFeatures } from "./real-time-features";
import { RealTimeQuote } from "./real-time-quote";
import { RealTimeTabs } from "./real-time-tabs";
import { RealTimeLogos } from "./real-time-logos";
import { RealTimeResources } from "./real-time-resources";

export function RealTimePage() {
  return (
    <div className="flex min-h-screen flex-col pt-16">
      <RealTimeHero />
      <RealTimeFeatures />
      <RealTimeQuote />
      <RealTimeTabs />
      <RealTimeLogos />
      <RealTimeResources />
      <FeatureFaqSection
        items={REAL_TIME_PAGE_DATA.faq.faqs}
      />
      <FeatureCtaSection
        heading={REAL_TIME_PAGE_DATA.cta.heading}
        ctaPrimary={REAL_TIME_PAGE_DATA.cta.primaryButtonText}
        ctaSecondary={REAL_TIME_PAGE_DATA.cta.secondaryButtonText}
      />
    </div>
  );
}
