import {
  IconCode,
  IconDatabase,
  IconServer,
  IconShield,
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
    title: "Infrastructure Migration",
    description:
      "Physical servers to cloud environments, virtual machines to scalable instances, and network configurations to secure cloud architecture for improved flexibility.",
    icon: IconServer,
  },
  {
    title: "Application Migration",
    description:
      "Rehosting (lift and shift), replatforming for optimization, refactoring legacy applications, and cloud-native transformation based on workload complexity.",
    icon: IconCode,
  },
  {
    title: "Database Migration",
    description:
      "Structured and unstructured data transfer, zero-downtime database transitions, backup validation, and performance benchmarking preserving data integrity.",
    icon: IconDatabase,
  },
  {
    title: "Hybrid & Multi-Cloud Migration",
    description:
      "Hybrid migration strategies, multi-cloud transition planning, phased migration execution, and disaster recovery alignment reducing downtime risks.",
    icon: IconStack,
  },
  {
    title: "Security & Compliance Assurance",
    description:
      "Identity and access configuration, encryption validation, regulatory alignment, and security monitoring setup ensuring governance remains intact throughout migration.",
    icon: IconShield,
  },
];

export const Route = createFileRoute(
  "/(public)/services/cloud-migration-services"
)({
  component: CloudMigrationServices,
});

function CloudMigrationServices() {
  return (
    <div className="min-h-screen bg-background selection:bg-accent selection:text-accent-foreground">
      <CloudHero
        description="Secure, Structured & Zero-Disruption Cloud Transformation"
        eyebrow="Home / Services / Cloud Migration"
        title="Cloud Migration Services"
      />
      <CloudFeatures features={features} />
      <CloudCta
        actionLabel="Start Your Migration"
        description="Let's discuss how structured cloud migration can modernize your infrastructure with zero disruption."
        title="Ready to Migrate to the Cloud?"
      />
    </div>
  );
}
