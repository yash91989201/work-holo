import {
  IconCode,
  IconDeviceDesktop,
  IconPalette,
  IconRocket,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";

import {
  ServiceCta,
  ServiceFeatures,
  ServiceHero,
} from "@/components/public/services/software-development";

const features = [
  {
    title: "Expert Web Developers",
    description:
      "Hire developers for responsive, scalable web applications with modern technologies.",
    icon: IconDeviceDesktop,
  },
  {
    title: "Full-Stack Specialists",
    description:
      "Access developers for connected ecosystems unifying web with app strategies.",
    icon: IconRocket,
  },
  {
    title: "UI/UX Designers",
    description:
      "Get developers skilled in interfaces for clarity, trust, and conversion.",
    icon: IconPalette,
  },
  {
    title: "Reliable Engineers",
    description:
      "Hire developers for secure solutions with long-term technical support.",
    icon: IconCode,
  },
] as const;

export const Route = createFileRoute("/(public)/resources/web-developers")({
  component: WebDevelopersRoute,
});

function WebDevelopersRoute() {
  return (
    <main className="flex min-h-screen flex-col">
      <ServiceHero
        badges={["React", "TypeScript", "Node.js", "Cloud-ready"]}
        description="Hire experienced web developers to build secure, scalable web platforms."
        eyebrow="Hire Developers"
        primaryCta={{ href: "/contact", label: "Hire Web Developers" }}
        title="Hire Web Developers"
      />
      <ServiceFeatures
        items={features}
        kicker="Web hiring"
        technologies={[
          "Responsive UI",
          "Secure architecture",
          "API integrations",
          "Cloud deployment",
        ]}
        title="Skilled web developers for performance and growth"
      />
      <ServiceCta
        actionLabel="Hire Web Specialists"
        description="Get dedicated web developers to create modern applications with reliable engineering."
        title="Ready to hire web developers?"
      />
    </main>
  );
}
