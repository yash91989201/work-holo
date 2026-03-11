import { FeatureCtaSection } from "../TeamChannel/feature-cta-section";
import { FeatureFaqSection } from "../TeamChannel/feature-faq-section";
import { REAL_TIME_PAGE_DATA } from "./real-time-data";
import { RealTimeFeatures } from "./real-time-features";
import { RealTimeHero } from "./real-time-hero";
import { RealTimeLogos } from "./real-time-logos";
import { RealTimeQuote } from "./real-time-quote";
import { RealTimeResources } from "./real-time-resources";
import { RealTimeTabs } from "./real-time-tabs";

export function RealTimePage() {
  return (
    <div className="flex min-h-screen flex-col pt-16">
      <RealTimeHero />
      <RealTimeFeatures />
      <RealTimeQuote />
      <RealTimeTabs />
      <RealTimeLogos />
      <RealTimeResources />
      <FeatureFaqSection items={REAL_TIME_PAGE_DATA.faq.faqs} />
      <FeatureCtaSection
        ctaPrimary={REAL_TIME_PAGE_DATA.cta.primaryButtonText}
        ctaSecondary={REAL_TIME_PAGE_DATA.cta.secondaryButtonText}
        heading={REAL_TIME_PAGE_DATA.cta.heading}
      />
    </div>
  );
}
