import {
  IconApi,
  IconDatabase,
  IconLayoutDashboard,
  IconReplace,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";

import {
  ServiceCta,
  ServiceFeatures,
  ServiceHero,
} from "@/components/public/services/software-development";

const features = [
  {
    title: "Enterprise CMS development",
    description:
      "Multi-user, multi-site content systems with publishing workflows, media control, and governance in place.",
    icon: IconDatabase,
  },
  {
    title: "Headless CMS solutions",
    description:
      "API-driven content delivery for omnichannel experiences, performance gains, and flexible frontend architectures.",
    icon: IconApi,
  },
  {
    title: "CMS migration and modernization",
    description:
      "Move away from legacy or plugin-heavy platforms with minimal disruption and improved security.",
    icon: IconReplace,
  },
  {
    title: "Custom admin panels",
    description:
      "Intuitive backend interfaces for content operations, access control, workflow tracking, and reporting.",
    icon: IconLayoutDashboard,
  },
] as const;

export const Route = createFileRoute(
  "/(public)/services/custom-cms-development"
)({ component: CustomCMSDevelopmentRoute });

function CustomCMSDevelopmentRoute() {
  return (
    <main className="flex min-h-screen flex-col">
      <ServiceHero
        badges={["Strapi", "Sanity", "Contentful", "WordPress"]}
        description="Scalable, secure, and business-driven content management solutions tailored to your publishing workflows."
        eyebrow="Software development"
        primaryCta={{ href: "/contact", label: "Start your CMS project" }}
        title="Custom CMS Development Company"
      />
      <ServiceFeatures
        items={features}
        kicker="Content platforms"
        technologies={[
          "React",
          "Next.js",
          "Node.js",
          "PostgreSQL",
          "Redis",
          "Cloudflare",
        ]}
        title="Content systems built around scale, speed, and control"
      />
      <ServiceCta
        actionLabel="Design a CMS roadmap"
        description="Create a content platform that empowers teams, reduces operational friction, and supports multi-channel growth."
        title="Need a CMS that fits your business instead of the other way around?"
      />
    </main>
  );
}
