import { createFileRoute } from "@tanstack/react-router";

import { CTASection } from "@/components/public/cta-section";
import { FeaturesSection } from "@/components/public/features-section";
import { HeroSection } from "@/components/public/hero-section";
import { NoteSection } from "@/components/public/note-section";

export const Route = createFileRoute("/(public)/")({
  component: HomePage,
});

function HomePage() {
  return (
    <main className="container mx-auto w-full">
      <HeroSection />
      <FeaturesSection />
      <NoteSection />
      <CTASection />
    </main>
  );
}
