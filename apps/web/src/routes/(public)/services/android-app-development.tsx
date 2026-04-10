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
    title: "Custom Android products",
    description:
      "Native Android apps for commerce, subscriptions, field operations, and enterprise mobility initiatives.",
    icon: IconBrandAndroid,
  },
  {
    title: "Kotlin-based delivery",
    description:
      "Modern Android architecture with cleaner code, lower error rates, and maintainable long-term foundations.",
    icon: IconComponents,
  },
  {
    title: "Material-first UX",
    description:
      "Responsive layouts, adaptive screen support, and gesture-friendly interactions tuned for Android users.",
    icon: IconDeviceMobile,
  },
  {
    title: "Backend integration",
    description:
      "Reliable API, payment, Firebase, and third-party SDK integrations for real-time business functionality.",
    icon: IconPlugConnected,
  },
];

export const Route = createFileRoute(
  "/(public)/services/android-app-development"
)({ component: AndroidAppDevelopmentRoute });

function AndroidAppDevelopmentRoute() {
  return (
    <main className="flex min-h-screen flex-col">
      <ServiceHero
        badges={["Kotlin", "Android SDK", "Jetpack Compose", "Firebase"]}
        description="Secure, scalable, and performance-optimized Android applications built for modern devices and business-critical use cases."
        eyebrow="Software development"
        primaryCta={{ href: "/contact", label: "Get a free consultation" }}
        title="Native Android App Development Company"
      />
      <ServiceFeatures
        items={features}
        kicker="Android expertise"
        technologies={[
          "Room DB",
          "Retrofit",
          "Dagger/Hilt",
          "Coroutines",
          "MVVM",
        ]}
        title="Android engineering built for scale and reliability"
      />
      <ServiceCta
        actionLabel="Talk to Android specialists"
        description="Create an Android experience that performs across devices, integrates with your systems, and stays easy to evolve over time."
        title="Need an Android app users can trust daily?"
      />
    </main>
  );
}
