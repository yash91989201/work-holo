import {
  IconBolt,
  IconBrandReactNative,
  IconComponents,
  IconDeviceMobileShare,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";

import {
  ServiceCta,
  ServiceFeatures,
  ServiceHero,
} from "@/components/public/services/software-development";

const features = [
  {
    title: "Component Architects",
    description:
      "Hire developers skilled in reusable UI systems for efficient app development.",
    icon: IconComponents,
  },
  {
    title: "Cross-Platform Experts",
    description:
      "Access developers for shared mobile codebases reducing development time.",
    icon: IconDeviceMobileShare,
  },
  {
    title: "Performance Specialists",
    description:
      "Get developers who optimize for near-native performance and reliability.",
    icon: IconBolt,
  },
  {
    title: "Deployment Professionals",
    description:
      "Hire developers experienced in rapid deployment and over-the-air updates.",
    icon: IconBrandReactNative,
  },
] as const;

export const Route = createFileRoute(
  "/(public)/resources/react-native-app-developers"
)({ component: ReactNativeAppDevelopersRoute });

function ReactNativeAppDevelopersRoute() {
  return (
    <main className="flex min-h-screen flex-col">
      <ServiceHero
        badges={["React Native", "TypeScript", "Expo", "Redux"]}
        description="Hire experienced React Native developers for high-performance cross-platform apps."
        eyebrow="Hire Developers"
        primaryCta={{ href: "/contact", label: "Hire React Native Developers" }}
        title="Hire React Native App Developers"
      />
      <ServiceFeatures
        items={features}
        kicker="React Native hiring"
        technologies={[
          "MobX",
          "React Navigation",
          "GraphQL",
          "Firebase",
          "AWS",
          "CodePush",
        ]}
        title="Skilled React Native developers for cross-platform apps"
      />
      <ServiceCta
        actionLabel="Hire React Native Specialists"
        description="Get dedicated developers to build scalable mobile apps with native quality."
        title="Ready to hire React Native developers?"
      />
    </main>
  );
}
