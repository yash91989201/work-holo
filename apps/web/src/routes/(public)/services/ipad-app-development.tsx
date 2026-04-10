import {
  IconApps,
  IconBuilding,
  IconDeviceIpad,
  IconTopologyStar3,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";

import {
  ServiceCta,
  ServiceFeatures,
  ServiceHero,
} from "@/components/public/services/software-development";

const features = [
  {
    title: "Custom iPad applications",
    description:
      "Business, education, field service, and dashboard apps designed around large-screen productivity workflows.",
    icon: IconDeviceIpad,
  },
  {
    title: "iPadOS interface engineering",
    description:
      "Multi-column layouts, adaptive UI systems, Apple Pencil support, and smooth landscape-first experiences.",
    icon: IconApps,
  },
  {
    title: "Enterprise mobility",
    description:
      "Secure internal platforms for reporting, sales enablement, logistics, and multi-role collaboration.",
    icon: IconBuilding,
  },
  {
    title: "System integration",
    description:
      "Connected workflows spanning ERP, CRM, analytics, cloud storage, and real-time data services.",
    icon: IconTopologyStar3,
  },
];

export const Route = createFileRoute("/(public)/services/ipad-app-development")(
  { component: IPadAppDevelopmentRoute }
);

function IPadAppDevelopmentRoute() {
  return (
    <main className="flex min-h-screen flex-col">
      <ServiceHero
        badges={["Swift", "SwiftUI", "PencilKit", "iPadOS SDK"]}
        description="Enterprise-ready iPad applications built for productivity, mobility, and rich large-screen user experiences."
        eyebrow="Software development"
        primaryCta={{ href: "/contact", label: "Start your project" }}
        title="iPad App Development Company"
      />
      <ServiceFeatures
        items={features}
        kicker="Large-screen delivery"
        technologies={["UIKit", "CloudKit", "ARKit", "Combine", "AWS", "CI/CD"]}
        title="Purpose-built iPad experiences for operational teams"
      />
      <ServiceCta
        actionLabel="Scope your iPad app"
        description="Turn the iPad into a reliable business tool with tailored software, robust integrations, and disciplined device-specific testing."
        title="Planning an iPad experience for teams or customers?"
      />
    </main>
  );
}
