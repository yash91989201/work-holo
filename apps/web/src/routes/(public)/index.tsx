import { createFileRoute } from "@tanstack/react-router";
import {
  BigTextSection,
  ContactPreview,
  FutureSection,
  HeroSection,
  LogoBar,
  MarqueeSection,
  PortfolioPreview,
  ServicesOverview,
  StatsSection,
  TeamSection,
  TestimonialsSection,
} from "@/components/public/home";

export const Route = createFileRoute("/(public)/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="w-full overflow-x-hidden selection:bg-primary selection:text-primary-foreground">
      <HeroSection />
      <LogoBar />
      <ServicesOverview />
      <BigTextSection />
      <FutureSection />
      <StatsSection />
      <TeamSection />
      <MarqueeSection />
      <PortfolioPreview />
      <TestimonialsSection />
      <ContactPreview />
    </div>
  );
}
