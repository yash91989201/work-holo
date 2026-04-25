import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "@/components/home/hero-section";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { AboutSection } from "@/components/home/about-section";
import { ServicesSection } from "@/components/home/services-section";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="relative overflow-hidden bg-background">
      <HeroSection />
      <WhyChooseUs />
      <AboutSection />
      <ServicesSection />
    </div>
  );
}
