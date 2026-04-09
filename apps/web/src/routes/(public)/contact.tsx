import { createFileRoute } from "@tanstack/react-router";
import {
  CtaSection,
  FaqSection,
  HeroSection,
  LocationsSection,
  PartnerSection,
} from "@/components/public/contact";

export const Route = createFileRoute("/(public)/contact")({
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <HeroSection />
      <LocationsSection />
      <PartnerSection />
      <FaqSection />
      <CtaSection />
    </div>
  );
}
