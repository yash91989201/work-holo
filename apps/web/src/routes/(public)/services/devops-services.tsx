import {
  IconCode,
  IconContainer,
  IconEye,
  IconGitBranch,
  IconShield,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";

import {
  CloudCta,
  CloudFeatures,
  CloudHero,
} from "@/components/public/services/cloud-devops";

const features = [
  {
    title: "CI/CD Pipeline Implementation",
    description:
      "Automated build pipelines, code integration workflows, deployment automation, version control integration, and testing automation reducing manual errors.",
    icon: IconGitBranch,
  },
  {
    title: "Infrastructure as Code",
    description:
      "Code-driven infrastructure provisioning, environment replication, configuration management, and automated scaling frameworks for reproducibility.",
    icon: IconCode,
  },
  {
    title: "Containerization & Orchestration",
    description:
      "Container-based architecture, microservices deployment, orchestration frameworks, and scalable cluster environments improving portability.",
    icon: IconContainer,
  },
  {
    title: "Monitoring & Observability",
    description:
      "Real-time performance monitoring, log aggregation systems, alert management frameworks, and incident response workflows for system resilience.",
    icon: IconEye,
  },
  {
    title: "DevSecOps Integration",
    description:
      "Automated security scanning, compliance validation, secure configuration practices, and vulnerability monitoring — security integrated into every pipeline stage.",
    icon: IconShield,
  },
];

export const Route = createFileRoute("/(public)/services/devops-services")({
  component: DevopsServices,
});

function DevopsServices() {
  return (
    <div className="min-h-screen bg-background selection:bg-accent selection:text-accent-foreground">
      <CloudHero
        description="Accelerating Software Delivery Through Automation, Reliability & Continuous Innovation"
        eyebrow="Home / Services / DevOps Services"
        title="DevOps Services"
      />
      <CloudFeatures features={features} />
      <CloudCta
        actionLabel="Start Your DevOps Project"
        description="Let's discuss how DevOps automation can streamline your workflows and improve deployment reliability."
        title="Ready to Accelerate Software Delivery?"
      />
    </div>
  );
}
