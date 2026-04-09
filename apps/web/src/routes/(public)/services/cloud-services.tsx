import {
  IconArrowRight,
  IconCloud,
  IconServer,
  IconSettings,
  IconStack,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";

import {
  CloudCta,
  CloudFeatures,
  CloudHero,
} from "@/components/public/services/cloud-devops";

const features = [
  {
    title: "Cloud Consulting & Strategy",
    description:
      "Cloud readiness assessment, architecture blueprinting, cost optimization strategy, multi-cloud planning, and infrastructure modernization roadmaps for strategic clarity.",
    icon: IconCloud,
  },
  {
    title: "Cloud Infrastructure Engineering",
    description:
      "VPC architecture, load balancing & auto-scaling, high-availability systems, secure network configuration, and resource provisioning for reliable performance.",
    icon: IconServer,
  },
  {
    title: "Cloud Migration & Modernization",
    description:
      "On-premise to cloud migration, legacy system modernization, database migration, application re-platforming, and zero-downtime migration planning.",
    icon: IconArrowRight,
  },
  {
    title: "Multi-Cloud & Hybrid Solutions",
    description:
      "Hybrid cloud architectures, multi-cloud deployment models, cross-platform integration, and disaster recovery systems reducing dependency risks.",
    icon: IconStack,
  },
  {
    title: "Cloud Managed Services",
    description:
      "Infrastructure monitoring, performance optimization, backup & disaster recovery, incident management, and continuous improvement cycles for long-term operational stability.",
    icon: IconSettings,
  },
];

export const Route = createFileRoute("/(public)/services/cloud-services")({
  component: CloudServices,
});

function CloudServices() {
  return (
    <div className="min-h-screen bg-background selection:bg-accent selection:text-accent-foreground">
      <CloudHero
        description="Scalable, Secure & Enterprise-Ready Cloud Solutions for Modern Businesses"
        eyebrow="Home / Services / Cloud Services"
        title="Cloud Services"
      />
      <CloudFeatures features={features} />
      <CloudCta
        actionLabel="Start Your Cloud Project"
        description="Let's discuss how our cloud services can modernize your infrastructure and accelerate business growth."
        title="Ready to Transform Your Cloud Infrastructure?"
      />
    </div>
  );
}
