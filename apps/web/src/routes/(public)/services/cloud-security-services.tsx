import {
  IconFileCheck,
  IconLock,
  IconSearch,
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
    title: "Risk Assessment & Audits",
    description:
      "Configuration vulnerability scanning, access control analysis, exposure risk identification, compliance gap assessment, and network security evaluation with actionable improvement plans.",
    icon: IconSearch,
  },
  {
    title: "Identity & Access Management",
    description:
      "Role-based access control (RBAC), multi-factor authentication (MFA), privileged access governance, and policy-based authorization models strengthening operational security.",
    icon: IconUsers,
  },
  {
    title: "Data Protection & Encryption",
    description:
      "Encryption at rest and in transit, secure key management, data masking strategies, and backup encryption validation protecting data integrity across workloads.",
    icon: IconLock,
  },
  {
    title: "Threat Monitoring & Detection",
    description:
      "Security monitoring systems, intrusion detection mechanisms, log analysis frameworks, and real-time alerting models for early threat detection and minimized impact.",
    icon: IconShield,
  },
  {
    title: "Compliance & Governance",
    description:
      "Policy documentation, compliance alignment, regulatory reporting, security governance frameworks, and continuous compliance validation ensuring audit readiness at all times.",
    icon: IconFileCheck,
  },
];

export const Route = createFileRoute(
  "/(public)/services/cloud-security-services"
)({
  component: CloudSecurityServices,
});

function CloudSecurityServices() {
  return (
    <div className="min-h-screen bg-background selection:bg-accent selection:text-accent-foreground">
      <CloudHero
        description="Protecting Cloud Environments with Advanced Security & Compliance Frameworks"
        eyebrow="Home / Services / Cloud Security"
        title="Cloud Security Services"
      />
      <CloudFeatures features={features} />
      <CloudCta
        actionLabel="Get a Security Assessment"
        description="Let's discuss how our security services can protect your cloud infrastructure and ensure compliance."
        title="Secure Your Cloud Environment"
      />
    </div>
  );
}
