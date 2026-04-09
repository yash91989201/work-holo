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
    title: "Expert iPad Developers",
    description:
      "Hire developers for custom iPad apps in business, education, and field services.",
    icon: IconDeviceIpad,
  },
  {
    title: "iPadOS Specialists",
    description:
      "Access developers skilled in multi-column layouts, Apple Pencil, and adaptive UI.",
    icon: IconApps,
  },
  {
    title: "Enterprise Mobility Experts",
    description:
      "Get developers for secure internal platforms and multi-role collaboration.",
    icon: IconBuilding,
  },
  {
    title: "Integration Professionals",
    description:
      "Hire developers experienced in ERP, CRM, and real-time data services.",
    icon: IconTopologyStar3,
  },
] as const;

export const Route = createFileRoute("/(public)/resources/ipad-app-developers")(
  { component: IPadAppDevelopersRoute }
);

function IPadAppDevelopersRoute() {
  return (
    <main className="flex min-h-screen flex-col">
      <ServiceHero
        badges={["Swift", "SwiftUI", "PencilKit", "iPadOS SDK"]}
        description="Hire experienced iPad developers to build enterprise-ready apps for productivity."
        eyebrow="Hire Developers"
        primaryCta={{ href: "/contact", label: "Hire iPad Developers" }}
        title="Hire iPad App Developers"
      />
      <ServiceFeatures
        items={features}
        kicker="iPad hiring"
        technologies={["UIKit", "CloudKit", "ARKit", "Combine", "AWS", "CI/CD"]}
        title="Skilled iPad developers for operational teams"
      />
      <ServiceCta
        actionLabel="Hire iPad Specialists"
        description="Get dedicated iPad developers to create tailored software for teams and customers."
        title="Ready to hire iPad developers?"
      />
    </main>
  );
}
