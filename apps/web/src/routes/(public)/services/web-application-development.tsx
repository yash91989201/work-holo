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
    title: "Web development",
    description:
      "Responsive, scalable, and secure web applications built with modern technologies and dependable architectures.",
    icon: IconDeviceDesktop,
  },
  {
    title: "Mobile product thinking",
    description:
      "Connected digital ecosystems that unify web experiences with broader app and platform strategies.",
    icon: IconRocket,
  },
  {
    title: "UI and UX design",
    description:
      "Interfaces shaped for clarity, trust, and conversion through thoughtful visual systems and user flows.",
    icon: IconPalette,
  },
  {
    title: "Trusted engineering delivery",
    description:
      "Secure digital solutions for startups, brands, and public-sector engagements with long-term technical support.",
    icon: IconCode,
  },
];

export const Route = createFileRoute(
  "/(public)/services/web-application-development"
)({ component: WebApplicationDevelopmentRoute });

function WebApplicationDevelopmentRoute() {
  return (
    <main className="flex min-h-screen flex-col">
      <ServiceHero
        badges={["React", "TypeScript", "Node.js", "Cloud-ready"]}
        description="Trusted software development and IT solutions for brands, startups, and institutions that need secure, scalable web platforms."
        eyebrow="Software development"
        primaryCta={{ href: "/contact", label: "Get started" }}
        secondaryCta={{ href: "/portfolio", label: "Our portfolio" }}
        title="500+ Global Brands and Startups"
      />
      <ServiceFeatures
        items={features}
        kicker="Digital delivery"
        technologies={[
          "Responsive UI",
          "Secure architecture",
          "API integrations",
          "Cloud deployment",
        ]}
        title="Web products designed for performance and growth"
      />
      <ServiceCta
        actionLabel="Request a free quote"
        description="Build a modern web application with a partner focused on product clarity, reliable engineering, and measurable business outcomes."
        title="Ready to launch a better web experience?"
      />
    </main>
  );
}
