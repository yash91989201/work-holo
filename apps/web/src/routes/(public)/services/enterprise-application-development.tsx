import {
  IconBraces,
  IconBuildingSkyscraper,
  IconCloudLock,
  IconNetwork,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";

import {
  ServiceCta,
  ServiceFeatures,
  ServiceHero,
} from "@/components/public/services/software-development";

const features = [
  {
    title: "Custom enterprise software",
    description:
      "ERP, CRM, HR, supply-chain, and business intelligence systems shaped around your operations.",
    icon: IconBuildingSkyscraper,
  },
  {
    title: "Enterprise web applications",
    description:
      "Secure, modular web platforms built with modern frontend, backend, and service architectures.",
    icon: IconBraces,
  },
  {
    title: "Cloud enterprise apps",
    description:
      "Auto-scaling, highly available deployments with governance, disaster recovery, and global accessibility.",
    icon: IconCloudLock,
  },
  {
    title: "System integration",
    description:
      "Connected workflows across legacy tools, payments, analytics, and mission-critical business systems.",
    icon: IconNetwork,
  },
] as const;

export const Route = createFileRoute(
  "/(public)/services/enterprise-application-development"
)({ component: EnterpriseApplicationDevelopmentRoute });

function EnterpriseApplicationDevelopmentRoute() {
  return (
    <main className="flex min-h-screen flex-col">
      <ServiceHero
        badges={["React", "Node.js", "AWS", "Kubernetes"]}
        description="Scalable, secure, and cloud-native enterprise software solutions built for complexity, governance, and growth."
        eyebrow="Software development"
        primaryCta={{
          href: "/contact",
          label: "Start your enterprise project",
        }}
        title="Enterprise Application Development"
      />
      <ServiceFeatures
        items={features}
        kicker="Enterprise systems"
        technologies={[
          "TypeScript",
          "Java",
          "Python",
          "Azure",
          "Google Cloud",
          "Terraform",
        ]}
        title="Mission-critical software for modern organizations"
      />
      <ServiceCta
        actionLabel="Plan your enterprise platform"
        description="Modernize internal operations with connected, secure systems that support compliance, visibility, and organizational scale."
        title="Building enterprise software with long-term business impact?"
      />
    </main>
  );
}
