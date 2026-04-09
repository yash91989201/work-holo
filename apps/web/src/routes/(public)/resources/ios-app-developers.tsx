import {
  IconBrandApple,
  IconChecklist,
  IconLayoutGrid,
  IconShieldCheck,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";

import {
  ServiceCta,
  ServiceFeatures,
  ServiceHero,
} from "@/components/public/services/software-development";

const features = [
  {
    title: "Expert iOS Developers",
    description:
      "Hire developers for custom iOS apps in consumer, subscription, and enterprise solutions.",
    icon: IconBrandApple,
  },
  {
    title: "Apple UX Specialists",
    description:
      "Access developers skilled in Human Interface Guidelines and accessibility.",
    icon: IconLayoutGrid,
  },
  {
    title: "Secure iOS Engineering",
    description:
      "Get developers who ensure modular code, authentication, and performance.",
    icon: IconShieldCheck,
  },
  {
    title: "App Store Experts",
    description:
      "Hire developers experienced in submission, compliance, and updates.",
    icon: IconChecklist,
  },
] as const;

export const Route = createFileRoute("/(public)/resources/ios-app-developers")({
  component: IOSAppDevelopersRoute,
});

function IOSAppDevelopersRoute() {
  return (
    <main className="flex min-h-screen flex-col">
      <ServiceHero
        badges={["Swift", "SwiftUI", "UIKit", "TestFlight"]}
        description="Hire experienced iOS developers to build secure, scalable apps for your business."
        eyebrow="Hire Developers"
        primaryCta={{ href: "/contact", label: "Hire iOS Developers" }}
        title="Hire iOS App Developers"
      />
      <ServiceFeatures
        items={features}
        kicker="iOS hiring"
        technologies={[
          "Objective-C",
          "Core Data",
          "CloudKit",
          "Fastlane",
          "SPM",
          "Combine",
        ]}
        title="Skilled iOS developers for premium apps"
      />
      <ServiceCta
        actionLabel="Hire iOS Specialists"
        description="Get dedicated iOS developers to create high-quality apps with long-term maintainability."
        title="Ready to hire iOS developers?"
      />
    </main>
  );
}
