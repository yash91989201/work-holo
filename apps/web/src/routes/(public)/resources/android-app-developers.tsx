import {
  IconBrandAndroid,
  IconComponents,
  IconDeviceMobile,
  IconPlugConnected,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";

import {
  ServiceCta,
  ServiceFeatures,
  ServiceHero,
} from "@/components/public/services/software-development";

const features = [
  {
    title: "Expert Android Developers",
    description:
      "Hire skilled developers for native Android apps in commerce, subscriptions, and enterprise solutions.",
    icon: IconBrandAndroid,
  },
  {
    title: "Kotlin Specialists",
    description:
      "Access developers proficient in Kotlin for modern, maintainable Android applications.",
    icon: IconComponents,
  },
  {
    title: "Material Design Experts",
    description:
      "Develop responsive, user-friendly interfaces optimized for Android devices.",
    icon: IconDeviceMobile,
  },
  {
    title: "Integration Proficiency",
    description:
      "Ensure seamless backend integration with APIs, payments, and third-party services.",
    icon: IconPlugConnected,
  },
] as const;

export const Route = createFileRoute(
  "/(public)/resources/android-app-developers"
)({ component: AndroidAppDevelopersRoute });

function AndroidAppDevelopersRoute() {
  return (
    <main className="flex min-h-screen flex-col">
      <ServiceHero
        badges={["Kotlin", "Android SDK", "Jetpack Compose", "Firebase"]}
        description="Hire experienced Android developers to build secure, scalable apps for your business needs."
        eyebrow="Hire Developers"
        primaryCta={{ href: "/contact", label: "Hire Android Developers" }}
        title="Hire Android App Developers"
      />
      <ServiceFeatures
        items={features}
        kicker="Android hiring"
        technologies={[
          "Room DB",
          "Retrofit",
          "Dagger/Hilt",
          "Coroutines",
          "MVVM",
        ]}
        title="Skilled Android developers for your projects"
      />
      <ServiceCta
        actionLabel="Hire Android Specialists"
        description="Get dedicated Android developers to create apps that perform and evolve with your business."
        title="Ready to hire Android developers?"
      />
    </main>
  );
}
