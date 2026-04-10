import { createFileRoute } from "@tanstack/react-router";
import {
  EducationCTA,
  EducationFeatures,
  EducationHero,
} from "@/components/public/products/education";

export const Route = createFileRoute("/(public)/products/e-learning-app")({
  component: RouteComponent,
});

export default function RouteComponent() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-purple-200 selection:text-purple-900">
      <main>
        <EducationHero />
        <EducationFeatures />
        <EducationCTA />
      </main>
    </div>
  );
}
