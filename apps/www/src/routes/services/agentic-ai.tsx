import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "@/components/services/agentic-ai/hero-section";
import { WhatIsSection } from "@/components/services/agentic-ai/what-is-section";
import { UseCasesSection } from "@/components/services/agentic-ai/use-cases-section";
import { WhyNowSection } from "@/components/services/agentic-ai/why-now-section";
import { CapabilitiesSection } from "@/components/services/agentic-ai/capabilities-section";
import { ProcessSection } from "@/components/services/agentic-ai/process-section";
import { WhyLogicielSection } from "@/components/services/agentic-ai/why-logiciel-section";
import { IntegrationsSection } from "@/components/services/agentic-ai/integrations-section";
import { SuccessStoriesSection } from "@/components/services/agentic-ai/success-stories-section";

export const Route = createFileRoute("/services/agentic-ai")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="relative overflow-hidden bg-background">
      <HeroSection />
      <WhatIsSection />
      <UseCasesSection />
      <WhyNowSection />
      <CapabilitiesSection />
      <ProcessSection />
      <WhyLogicielSection />
      <IntegrationsSection />
      <SuccessStoriesSection />
    </div>
  );
}
