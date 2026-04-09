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
    title: "Custom iOS apps",
    description:
      "Consumer, subscription, marketplace, and enterprise mobility apps built natively with Swift-first architecture.",
    icon: IconBrandApple,
  },
  {
    title: "Apple-grade UX",
    description:
      "Interfaces aligned with Human Interface Guidelines, accessibility expectations, and high-retention interaction patterns.",
    icon: IconLayoutGrid,
  },
  {
    title: "Secure engineering",
    description:
      "Modular code, API-driven backends, strong authentication, and reliable performance optimization across releases.",
    icon: IconShieldCheck,
  },
  {
    title: "App Store readiness",
    description:
      "Submission support, compliance review, rollout planning, and sustainable update pipelines after launch.",
    icon: IconChecklist,
  },
] as const;

export const Route = createFileRoute("/(public)/services/ios-app-development")({
  component: IOSAppDevelopmentRoute,
});

function IOSAppDevelopmentRoute() {
  return (
    <main className="flex min-h-screen flex-col">
      <ServiceHero
        badges={["Swift", "SwiftUI", "UIKit", "TestFlight"]}
        description="Secure, scalable, and high-performance iPhone applications for customer-facing products and internal business tools."
        eyebrow="Software development"
        primaryCta={{ href: "/contact", label: "Start your iOS project" }}
        title="iOS App Development Company"
      />
      <ServiceFeatures
        items={features}
        kicker="iPhone engineering"
        technologies={[
          "Objective-C",
          "Core Data",
          "CloudKit",
          "Fastlane",
          "SPM",
          "Combine",
        ]}
        title="Native iOS delivery with product discipline"
      />
      <ServiceCta
        actionLabel="Plan your iOS build"
        description="Launch a premium iPhone experience with a team focused on product quality, secure architecture, and long-term maintainability."
        title="Ready to build your next iOS application?"
      />
    </main>
  );
}
