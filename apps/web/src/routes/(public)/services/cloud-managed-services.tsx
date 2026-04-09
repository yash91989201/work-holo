import {
  IconActivity,
  IconDatabase,
  IconShield,
  IconTrendingUp,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";

import {
  CloudCta,
  CloudFeatures,
  CloudHero,
} from "@/components/public/services/cloud-devops";

const features = [
  {
    title: "24/7 Infrastructure Monitoring",
    description:
      "Server health & uptime monitoring, network performance tracking, resource utilization analysis, application responsiveness checks, and traffic load pattern analysis.",
    icon: IconActivity,
  },
  {
    title: "Performance & Cost Optimization",
    description:
      "Resource scaling adjustments, capacity forecasting, unused resource elimination, cost allocation analysis, and performance benchmarking balancing cost and output.",
    icon: IconTrendingUp,
  },
  {
    title: "Backup & Disaster Recovery",
    description:
      "Automated backup scheduling, recovery validation testing, business continuity planning, redundancy configuration, and failover management.",
    icon: IconDatabase,
  },
  {
    title: "Security & Governance",
    description:
      "Access control management, policy enforcement, threat detection, compliance validation, and security patch coordination safeguarding integrity.",
    icon: IconShield,
  },
];

export const Route = createFileRoute(
  "/(public)/services/cloud-managed-services"
)({
  component: CloudManagedServices,
});

function CloudManagedServices() {
  return (
    <div className="min-h-screen bg-background selection:bg-accent selection:text-accent-foreground">
      <CloudHero
        description="Proactive Cloud Operations & Continuous Infrastructure Management"
        eyebrow="Home / Services / Cloud Managed Services"
        title="Cloud Managed Services"
      />
      <CloudFeatures features={features} />
      <CloudCta
        actionLabel="Get Started"
        description="Let's discuss how our managed services can ensure your cloud infrastructure runs at peak performance."
        title="Need Proactive Cloud Management?"
      />
    </div>
  );
}
