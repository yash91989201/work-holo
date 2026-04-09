import {
  IconApi,
  IconBrandFlutter,
  IconBrush,
  IconDeviceMobileBolt,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";

import {
  ServiceCta,
  ServiceFeatures,
  ServiceHero,
} from "@/components/public/services/software-development";

const features = [
  {
    title: "Expert Flutter Developers",
    description:
      "Hire developers for custom Flutter apps in consumer, enterprise, and SaaS products.",
    icon: IconBrandFlutter,
  },
  {
    title: "Cross-Platform Specialists",
    description:
      "Access developers skilled in single-codebase delivery for iOS and Android.",
    icon: IconDeviceMobileBolt,
  },
  {
    title: "UI/UX Designers",
    description:
      "Get developers who create polished, responsive interfaces with Flutter widgets.",
    icon: IconBrush,
  },
  {
    title: "Integration Experts",
    description:
      "Hire developers for scalable API, database, and authentication integrations.",
    icon: IconApi,
  },
] as const;

export const Route = createFileRoute(
  "/(public)/resources/flutter-app-developers"
)({ component: FlutterAppDevelopersRoute });

function FlutterAppDevelopersRoute() {
  return (
    <main className="flex min-h-screen flex-col">
      <ServiceHero
        badges={["Flutter", "Dart", "Firebase", "AWS"]}
        description="Hire experienced Flutter developers to build high-quality cross-platform apps."
        eyebrow="Hire Developers"
        primaryCta={{ href: "/contact", label: "Hire Flutter Developers" }}
        title="Hire Flutter App Developers"
      />
      <ServiceFeatures
        items={features}
        kicker="Flutter hiring"
        technologies={[
          "REST APIs",
          "GraphQL",
          "Node.js",
          "PostgreSQL",
          "Docker",
          "CI/CD",
        ]}
        title="Skilled Flutter developers for cross-platform apps"
      />
      <ServiceCta
        actionLabel="Hire Flutter Specialists"
        description="Get dedicated Flutter developers to ship faster across platforms with premium experiences."
        title="Ready to hire Flutter developers?"
      />
    </main>
  );
}
