import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "@/components/services/ai-agents/hero-section";

export const Route = createFileRoute("/services/ai-agents")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="relative overflow-hidden bg-background">
      <HeroSection />
    </div>
  );
}
