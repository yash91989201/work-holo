import { BrandApple, Cpu, DeviceMobile, Shield } from "@tabler/icons-react";
import { HireDeveloperTemplate } from "~/components/public/resources";

export default function SwiftDevelopers() {
  return (
    <HireDeveloperTemplate
      ctaButtonHref="/contact"
      ctaButtonLabel="Hire Developers"
      ctaDescription="Hire our Swift developers for premium iOS apps."
      ctaTitle="Ready for iOS Development?"
      featuresDescription="Our Swift developers create high-performance iOS applications."
      featuresItems={[
        {
          icon: BrandApple,
          title: "Swift Expertise",
          desc: "Proficiency in Swift language and Apple's development tools.",
        },
        {
          icon: DeviceMobile,
          title: "iOS App Development",
          desc: "Build apps for iPhone, iPad, and Apple Watch.",
        },
        {
          icon: Cpu,
          title: "Performance Optimization",
          desc: "Leverage Swift's speed for smooth app performance.",
        },
        {
          icon: Shield,
          title: "App Store Compliance",
          desc: "Ensure apps meet Apple's guidelines and security standards.",
        },
      ]}
      featuresTitle="Why Choose Our Swift Developers?"
      heroHighlight="Swift Developers"
      heroSubtitle="Develop native iOS apps with Swift programming"
      heroTitle="Hire"
    />
  );
}
