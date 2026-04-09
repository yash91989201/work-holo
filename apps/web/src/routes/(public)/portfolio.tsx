import { createFileRoute } from "@tanstack/react-router";

import {
  FAQSection,
  HeroSection,
  HireSection,
  PortfolioGrid,
} from "@/components/public/portfolio";

export const Route = createFileRoute("/(public)/portfolio")({
  component: PortfolioRoute,
});

function PortfolioRoute() {
  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />
      <PortfolioGrid />
      <HireSection />
      <FAQSection />
    </main>
  );
}
