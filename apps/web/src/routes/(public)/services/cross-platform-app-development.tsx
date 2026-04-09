import {
  IconArrowsJoin2,
  IconBrandFlutter,
  IconBrandReactNative,
  IconTopologyComplex,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";

import {
  ServiceCta,
  ServiceFeatures,
  ServiceHero,
} from "@/components/public/services/software-development";

const features = [
  {
    title: "Flutter app development",
    description:
      "High-performance apps from a single Dart codebase for businesses that need fast, consistent releases.",
    icon: IconBrandFlutter,
  },
  {
    title: "React Native development",
    description:
      "Reusable JavaScript-driven mobile products with strong scalability and mature delivery tooling.",
    icon: IconBrandReactNative,
  },
  {
    title: "Hybrid app delivery",
    description:
      "Multi-device experiences optimized for mobile and web compatibility across real customer journeys.",
    icon: IconArrowsJoin2,
  },
  {
    title: "API and backend integration",
    description:
      "Unified connections to your existing systems, third-party tools, and cloud platforms.",
    icon: IconTopologyComplex,
  },
] as const;

export const Route = createFileRoute(
  "/(public)/services/cross-platform-app-development"
)({ component: CrossPlatformAppDevelopmentRoute });

function CrossPlatformAppDevelopmentRoute() {
  return (
    <main className="flex min-h-screen flex-col">
      <ServiceHero
        badges={["Flutter", "React Native", "Dart", "TypeScript"]}
        description="High-performance cross-platform apps built with a single codebase to reduce complexity and accelerate delivery."
        eyebrow="Software development"
        primaryCta={{ href: "/contact", label: "Get a free consultation" }}
        title="Cross-Platform App Development Company"
      />
      <ServiceFeatures
        items={features}
        kicker="Unified delivery"
        technologies={[
          "Firebase",
          "GraphQL",
          "REST APIs",
          "Redux",
          "Riverpod",
          "CI/CD",
        ]}
        title="One product strategy across multiple platforms"
      />
      <ServiceCta
        actionLabel="Explore cross-platform options"
        description="Reach iOS and Android audiences faster with a delivery model tuned for consistency, maintainability, and cost efficiency."
        title="Want broader reach with fewer parallel codebases?"
      />
    </main>
  );
}
