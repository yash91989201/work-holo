import { HeroSection } from "@/components/landing/hero-section";
import { AiFeaturesSection } from "@/components/landing/ai-features-section";
import { FeaturesTabsSection } from "@/components/landing/features-tabs-section";
import { OrgControlSection } from "@/components/landing/org-control-section";
import { WorkspaceVisibilitySection } from "@/components/landing/workspace-visibility-section";
import { SecuritySection } from "@/components/landing/security-section";
import { ComingSoonSection } from "@/components/landing/coming-soon-section";
import { StatsCtaSection } from "@/components/landing/stats-cta-section";
import { Footer } from "@/components/landing/footer";

export function NewHomePage() {
  return (
    <main className="w-full">
      <HeroSection />
      <AiFeaturesSection />
      <FeaturesTabsSection />
      <OrgControlSection />
      <WorkspaceVisibilitySection />
      <SecuritySection />
      <ComingSoonSection />
      <StatsCtaSection />
      <Footer />
    </main>
  );
}
