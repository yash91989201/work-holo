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
    title: "Component-based architecture",
    description:
      "Reusable UI systems that speed up iteration, simplify testing, and keep feature delivery manageable.",
    icon: IconComponents,
  },
  {
    title: "Shared mobile codebase",
    description:
      "One React Native build for iOS and Android that reduces development time while preserving quality.",
    icon: IconDeviceMobileShare,
  },
  {
    title: "Near-native performance",
    description:
      "Optimized runtime behavior and native module integration for experiences that feel responsive and reliable.",
    icon: IconBolt,
  },
  {
    title: "Rapid deployment workflows",
    description:
      "Faster time-to-market through efficient tooling, over-the-air updates, and production-ready release practices.",
    icon: IconBrandReactNative,
  },
] as const;

export const Route = createFileRoute(
  "/(public)/services/react-native-app-development"
)({ component: ReactNativeAppDevelopmentRoute });

function ReactNativeAppDevelopmentRoute() {
  return (
    <main className="flex min-h-screen flex-col">
      <ServiceHero
        badges={["React Native", "TypeScript", "Expo", "Redux"]}
        description="High-performance cross-platform apps with native precision, efficient release cycles, and maintainable product foundations."
        eyebrow="Software development"
        primaryCta={{ href: "/contact", label: "Start your project" }}
        title="React Native App Development Company"
      />
      <ServiceFeatures
        items={features}
        kicker="Cross-platform engineering"
        technologies={[
          "MobX",
          "React Navigation",
          "GraphQL",
          "Firebase",
          "AWS",
          "CodePush",
        ]}
        title="React Native delivery for ambitious product teams"
      />
      <ServiceCta
        actionLabel="Build with React Native"
        description="Move faster across platforms with a team that understands native quality, release management, and scalable mobile architecture."
        title="Need cross-platform speed without sacrificing experience?"
      />
    </main>
  );
}
