import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "@/components/home/hero-section";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { AboutSection } from "@/components/home/about-section";
import { ServicesSection } from "@/components/home/services-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { TeamSection } from "@/components/home/team-section";
import { TechnologiesSection } from "@/components/home/technologies-section";
import { ProjectsSection } from "@/components/home/projects-section";
import { ProcessSection } from "@/components/home/process-section";
import { InsightsSection } from "@/components/home/insights-section";
import { ContactSection } from "@/components/home/contact-section";

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
      <TestimonialsSection />
      <TeamSection />
      <TechnologiesSection />
      <ProcessSection />
      <ProjectsSection />
      <InsightsSection />
      <ContactSection />
    </div>
  );
}
