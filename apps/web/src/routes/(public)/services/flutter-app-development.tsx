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
    title: "Custom Flutter apps",
    description:
      "Consumer, enterprise, on-demand, ecommerce, and SaaS mobile products built for long-term maintainability.",
    icon: IconBrandFlutter,
  },
  {
    title: "Single-codebase delivery",
    description:
      "Cross-platform consistency with faster iteration cycles and lower operational complexity across releases.",
    icon: IconDeviceMobileBolt,
  },
  {
    title: "Widget-driven UI design",
    description:
      "Polished custom interfaces, responsive layouts, and motion-rich experiences tuned for product clarity.",
    icon: IconBrush,
  },
  {
    title: "Backend integration",
    description:
      "Scalable API, database, payments, and authentication integrations structured for growth and reliability.",
    icon: IconApi,
  },
] as const;

export const Route = createFileRoute(
  "/(public)/services/flutter-app-development"
)({ component: FlutterAppDevelopmentRoute });

function FlutterAppDevelopmentRoute() {
  return (
    <main className="flex min-h-screen flex-col">
      <ServiceHero
        badges={["Flutter", "Dart", "Firebase", "AWS"]}
        description="High-quality cross-platform apps built from a single codebase without compromising performance or product polish."
        eyebrow="Software development"
        primaryCta={{ href: "/contact", label: "Get a free consultation" }}
        title="Scalable Flutter App Development Company"
      />
      <ServiceFeatures
        items={features}
        kicker="Flutter expertise"
        technologies={[
          "REST APIs",
          "GraphQL",
          "Node.js",
          "PostgreSQL",
          "Docker",
          "CI/CD",
        ]}
        title="Cross-platform speed with strong engineering fundamentals"
      />
      <ServiceCta
        actionLabel="Launch with Flutter"
        description="Ship faster across iOS and Android with a Flutter team that balances delivery speed, usability, and backend readiness."
        title="Want one codebase and a premium app experience?"
      />
    </main>
  );
}
