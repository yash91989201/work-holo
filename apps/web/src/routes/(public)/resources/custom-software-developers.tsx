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
    title: "Automation Experts",
    description:
      "Hire developers to create software that automates business processes and improves efficiency.",
    icon: IconSettingsAutomation,
  },
  {
    title: "SaaS Developers",
    description:
      "Access developers for multi-tenant products, subscriptions, and API-first platforms.",
    icon: IconCloudComputing,
  },
  {
    title: "Enterprise Software Specialists",
    description:
      "Get developers for ERP, compliance tools, and secure multi-user platforms.",
    icon: IconBuildingFactory2,
  },
  {
    title: "Integration Professionals",
    description:
      "Hire developers experienced in CRM, ERP, and cloud-service integrations.",
    icon: IconArrowsShuffle,
  },
] as const;

export const Route = createFileRoute(
  "/(public)/resources/custom-software-developers"
)({ component: CustomSoftwareDevelopersRoute });

function CustomSoftwareDevelopersRoute() {
  return (
    <main className="flex min-h-screen flex-col">
      <ServiceHero
        badges={["React", "Next.js", "Node.js", "Microservices"]}
        description="Hire experienced developers to build tailored software solutions for your business."
        eyebrow="Hire Developers"
        primaryCta={{
          href: "/contact",
          label: "Hire Custom Software Developers",
        }}
        title="Hire Custom Software Developers"
      />
      <ServiceFeatures
        items={features}
        kicker="Custom hiring"
        technologies={[
          "TypeScript",
          "AWS",
          "Azure",
          "PostgreSQL",
          "MongoDB",
          "Kubernetes",
        ]}
        title="Skilled developers for tailored systems"
      />
      <ServiceCta
        actionLabel="Hire Software Specialists"
        description="Get dedicated developers to create software that matches your exact business needs."
        title="Ready to hire custom software developers?"
      />
    </main>
  );
}
