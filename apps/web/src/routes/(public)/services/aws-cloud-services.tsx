import {
  IconArrowRight,
  IconCloud,
  IconGitBranch,
  IconServer,
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
    title: "AWS Cloud Consulting",
    description:
      "Cloud readiness assessment, architecture planning, cost modeling, security framework design, and scalability roadmap aligned with business goals.",
    icon: IconCloud,
  },
  {
    title: "AWS Cloud Migration",
    description:
      "On-premise to AWS migration, legacy modernization, database migration, re-platforming, re-architecting, and zero-downtime deployment strategies.",
    icon: IconArrowRight,
  },
  {
    title: "Infrastructure Deployment",
    description:
      "EC2 instances, S3 storage, RDS databases, VPC networking, load balancing, and auto-scaling groups optimized for performance and resilience.",
    icon: IconServer,
  },
  {
    title: "DevOps & Automation",
    description:
      "CI/CD pipelines, Infrastructure as Code, automated monitoring, container orchestration, and deployment automation for faster release cycles.",
    icon: IconGitBranch,
  },
  {
    title: "Managed Services & Security",
    description:
      "Performance monitoring, security audits, backup & disaster recovery, cost optimization, IAM access control, encryption, and compliance-ready architecture.",
    icon: IconShield,
  },
];

export const Route = createFileRoute("/(public)/services/aws-cloud-services")({
  component: AwsCloudServices,
});

function AwsCloudServices() {
  return (
    <div className="min-h-screen bg-background selection:bg-accent selection:text-accent-foreground">
      <CloudHero
        description="Secure, Scalable & High-Performance Amazon Web Services Solutions"
        eyebrow="Home / Services / AWS Cloud Services"
        title="AWS Cloud Services"
      />
      <CloudFeatures features={features} />
      <CloudCta
        actionLabel="Start AWS Consultation"
        description="Let's discuss how AWS can scale your business with secure, high-performance cloud solutions."
        title="Transform Your Cloud Infrastructure"
      />
    </div>
  );
}
