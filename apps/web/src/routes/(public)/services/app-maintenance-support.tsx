import {
  IconActivityHeartbeat,
  IconBug,
  IconRefresh,
  IconShieldCog,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";

import {
  ServiceCta,
  ServiceFeatures,
  ServiceHero,
} from "@/components/public/services/software-development";

const features = [
  {
    title: "Corrective maintenance",
    description:
      "Identify and resolve bugs, crashes, and regressions to keep your applications stable in production.",
    icon: IconBug,
  },
  {
    title: "Adaptive maintenance",
    description:
      "Keep apps compatible with changing operating systems, APIs, frameworks, and devices.",
    icon: IconRefresh,
  },
  {
    title: "Preventive support",
    description:
      "Reduce risk with proactive monitoring, codebase upkeep, and release-readiness improvements.",
    icon: IconShieldCog,
  },
  {
    title: "Perfective optimization",
    description:
      "Enhance features and user experience based on analytics, customer feedback, and evolving goals.",
    icon: IconActivityHeartbeat,
  },
];

export const Route = createFileRoute(
  "/(public)/services/app-maintenance-support"
)({ component: AppMaintenanceSupportRoute });

function AppMaintenanceSupportRoute() {
  return (
    <main className="flex min-h-screen flex-col">
      <ServiceHero
        badges={["React Native", "Flutter", "AWS", "CI/CD"]}
        description="Long-term performance optimization and reliable application support for mobile, web, and cloud-based products."
        eyebrow="Software development"
        primaryCta={{ href: "/contact", label: "Get support plan" }}
        title="App Maintenance & Support Services"
      />
      <ServiceFeatures
        items={features}
        kicker="Ongoing support"
        technologies={[
          "iOS",
          "Android",
          "Next.js",
          "Azure",
          "Google Cloud",
          "DevOps",
        ]}
        title="Support services that protect uptime and user trust"
      />
      <ServiceCta
        actionLabel="Request maintenance support"
        description="Strengthen your release quality, respond faster to issues, and keep critical applications healthy as your product evolves."
        title="Need a dependable team after launch?"
      />
    </main>
  );
}
