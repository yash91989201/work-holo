import { Cpu, Layers, Lock, Smartphone } from "@tabler/icons-react";
import { HireDeveloperTemplate } from "~/components/public/resources";

export default function NativeAppDevelopers() {
  return (
    <HireDeveloperTemplate
      ctaButtonHref="/contact"
      ctaButtonLabel="Hire Developers"
      ctaDescription="Hire our native app developers for top-tier mobile solutions."
      ctaTitle="Ready to Develop Native Apps?"
      featuresDescription="Our native app developers build apps that leverage platform-specific features for optimal performance."
      featuresItems={[
        {
          icon: Smartphone,
          title: "Platform-Specific Development",
          desc: "Develop tailored apps for iOS (Swift/Objective-C) and Android (Kotlin/Java).",
        },
        {
          icon: Cpu,
          title: "Optimal Performance",
          desc: "Utilize native APIs for faster execution and better user experience.",
        },
        {
          icon: Layers,
          title: "Device Integration",
          desc: "Access camera, GPS, sensors, and other hardware features seamlessly.",
        },
        {
          icon: Lock,
          title: "Enhanced Security",
          desc: "Implement robust security measures using platform-native tools.",
        },
      ]}
      featuresTitle="Why Choose Our Native App Developers?"
      heroHighlight="Native App Developers"
      heroSubtitle="Craft high-performance native applications for iOS and Android"
      heroTitle="Hire"
    />
  );
}
