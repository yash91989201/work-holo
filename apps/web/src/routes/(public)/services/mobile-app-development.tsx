import {
  IconBrandAndroid,
  IconBrandApple,
  IconCloud,
  IconDeviceMobileCode,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";

import {
  ServiceCta,
  ServiceFeatures,
  ServiceHero,
} from "@/components/public/services/software-development";

const features = [
  {
    title: "Custom mobile products",
    description:
      "Tailored apps aligned to your business workflows, audience expectations, and long-term product roadmap.",
    icon: IconDeviceMobileCode,
  },
  {
    title: "iOS app engineering",
    description:
      "Native iPhone and iPad experiences built for performance, security, and polished Apple platform interactions.",
    icon: IconBrandApple,
  },
  {
    title: "Android app engineering",
    description:
      "Scalable Android apps optimized across devices with dependable performance and intuitive navigation.",
    icon: IconBrandAndroid,
  },
  {
    title: "Cross-platform delivery",
    description:
      "Flutter and React Native builds that accelerate launch timelines while preserving a quality user experience.",
    icon: IconCloud,
  },
];

export const Route = createFileRoute(
  "/(public)/services/mobile-app-development"
)({ component: MobileAppDevelopmentRoute });

function MobileAppDevelopmentRoute() {
  return (
    <main className="flex min-h-screen flex-col">
      <ServiceHero
        badges={["Swift", "Kotlin", "Flutter", "React Native"]}
        description="Custom iOS, Android, and cross-platform apps built for scalable growth and dependable business operations."
        eyebrow="Software development"
        primaryCta={{ href: "/contact", label: "Contact us" }}
        title="Mobile App Development Company"
      />
      <ServiceFeatures
        items={features}
        kicker="Capabilities"
        technologies={[
          "Firebase",
          "Node.js",
          "AWS",
          "GraphQL",
          "PostgreSQL",
          "Docker",
        ]}
        title="Mobile solutions designed for growth"
      />
      <ServiceCta
        actionLabel="Start your mobile project"
        description="From first release to post-launch scaling, we build mobile products that support revenue, operations, and customer engagement."
        title="Need a mobile app that fits your business model?"
      />
    </main>
  );
}
