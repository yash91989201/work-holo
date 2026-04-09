import {
  IconArrowsShuffle,
  IconBuildingFactory2,
  IconCloudComputing,
  IconSettingsAutomation,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";

import {
  ServiceCta,
  ServiceFeatures,
  ServiceHero,
} from "@/components/public/services/software-development";

const features = [
  {
    title: "Business process automation",
    description:
      "Reduce manual work, improve accuracy, and streamline collaboration with tailored internal software.",
    icon: IconSettingsAutomation,
  },
  {
    title: "SaaS application development",
    description:
      "Multi-tenant products, subscriptions, dashboards, and API-first platforms designed for growth.",
    icon: IconCloudComputing,
  },
  {
    title: "Enterprise software systems",
    description:
      "ERP, compliance-ready tools, and secure multi-user platforms built around operational realities.",
    icon: IconBuildingFactory2,
  },
  {
    title: "System integration",
    description:
      "CRM, ERP, payments, and cloud-service integrations that keep data flowing across your business.",
    icon: IconArrowsShuffle,
  },
] as const;

export const Route = createFileRoute(
  "/(public)/services/custom-software-development"
)({ component: CustomSoftwareDevelopmentRoute });

function CustomSoftwareDevelopmentRoute() {
  return (
    <main className="flex min-h-screen flex-col">
      <ServiceHero
        badges={["React", "Next.js", "Node.js", "Microservices"]}
        description="Tailored software solutions engineered to fit your workflows, support growth, and modernize critical operations."
        eyebrow="Software development"
        primaryCta={{ href: "/contact", label: "Start your project" }}
        title="Custom Software Development"
      />
      <ServiceFeatures
        items={features}
        kicker="Tailored solutions"
        technologies={[
          "TypeScript",
          "AWS",
          "Azure",
          "PostgreSQL",
          "MongoDB",
          "Kubernetes",
        ]}
        title="Custom systems designed around how your business runs"
      />
      <ServiceCta
        actionLabel="Discuss your software needs"
        description="Replace generic tooling with software built around your teams, your customers, and your long-term operating model."
        title="Need software that matches your exact process?"
      />
    </main>
  );
}
