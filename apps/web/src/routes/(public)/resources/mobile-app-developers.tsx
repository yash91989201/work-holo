import { Palette, Shield, Smartphone, Zap } from "@tabler/icons-react";
import { HireDeveloperTemplate } from "~/components/public/resources";

export default function MobileAppDevelopers() {
  return (
    <HireDeveloperTemplate
      ctaButtonHref="/contact"
      ctaButtonLabel="Hire Developers"
      ctaDescription="Hire our expert mobile app developers and bring your ideas to life."
      ctaTitle="Ready to Build Your Mobile App?"
      featuresDescription="Our mobile app developers specialize in creating high-performance, user-friendly applications for iOS and Android platforms."
      featuresItems={[
        {
          icon: Smartphone,
          title: "Cross-Platform Expertise",
          desc: "Develop apps that work seamlessly on both iOS and Android using frameworks like React Native and Flutter.",
        },
        {
          icon: Zap,
          title: "Performance Optimization",
          desc: "Ensure your app runs smoothly with optimized code and efficient resource management.",
        },
        {
          icon: Palette,
          title: "Intuitive UI/UX Design",
          desc: "Create engaging user interfaces that provide an excellent user experience.",
        },
        {
          icon: Shield,
          title: "Security & Scalability",
          desc: "Build secure, scalable apps that can grow with your business needs.",
        },
      ]}
      featuresTitle="Why Choose Our Mobile App Developers?"
      heroHighlight="Mobile App Developers"
      heroSubtitle="Build exceptional mobile experiences with our expert developers"
      heroTitle="Hire"
    />
  );
}
