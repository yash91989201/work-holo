import { createFileRoute } from "@tanstack/react-router";
import { AboutSection } from "@/components/home/about-section";
import { HeroSection } from "@/components/home/hero-section";
import { ProcessSection } from "@/components/home/process-section";
import { ProjectsSection } from "@/components/home/projects-section";
import { ServicesSection } from "@/components/home/services-section";
import { TechnologiesSection } from "@/components/home/technologies-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { ContactCard } from "@/components/shared/contact-card";

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
      <TechnologiesSection />
      <ProcessSection />
      <ProjectsSection />
      <section className="relative scroll-mt-28 py-20 lg:py-28" id="contact">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ContactCard />
        </div>
      </section>
    </div>
  );
}
