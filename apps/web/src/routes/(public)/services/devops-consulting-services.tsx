import {
  IconClipboardList,
  IconGitBranch,
  IconMap,
  IconShield,
  IconUsers,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";

import {
  CloudCta,
  CloudFeatures,
  CloudHero,
} from "@/components/public/services/cloud-devops";

const features = [
  {
    title: "DevOps Maturity Assessment",
    description:
      "Analysis of development workflows, release frequency, infrastructure provisioning, monitoring practices, and security integration to identify bottlenecks and inefficiencies.",
    icon: IconClipboardList,
  },
  {
    title: "Roadmap & Transformation Planning",
    description:
      "CI/CD architecture design, infrastructure automation planning, containerization strategy, security integration models, and governance policy definition for phased implementation.",
    icon: IconMap,
  },
  {
    title: "Pipeline Architecture Advisory",
    description:
      "Optimized frameworks for continuous integration, automated deployment, version control governance, and release management alignment reducing operational friction.",
    icon: IconGitBranch,
  },
  {
    title: "Culture & Team Alignment",
    description:
      "Cross-functional collaboration models, role definition frameworks, communication optimization, and responsibility matrix alignment for long-term performance.",
    icon: IconUsers,
  },
  {
    title: "DevSecOps Strategy",
    description:
      "Secure development lifecycle planning, automated compliance checkpoints, security monitoring integration, and risk-based pipeline governance strengthening resilience.",
    icon: IconShield,
  },
];

export const Route = createFileRoute(
  "/(public)/services/devops-consulting-services"
)({
  component: DevopsConsultingServices,
});

function DevopsConsultingServices() {
  return (
    <div className="min-h-screen bg-background selection:bg-accent selection:text-accent-foreground">
      <CloudHero
        description="Strategic DevOps Advisory for Scalable, High-Performance Software Delivery"
        eyebrow="Home / Services / DevOps Consulting"
        title="DevOps Consulting Services"
      />
      <CloudFeatures features={features} />
      <CloudCta
        actionLabel="Book a Consultation"
        description="Let's discuss how strategic DevOps consulting can accelerate your software delivery and operational excellence."
        title="Ready to Transform Your DevOps Strategy?"
      />
    </div>
  );
}
