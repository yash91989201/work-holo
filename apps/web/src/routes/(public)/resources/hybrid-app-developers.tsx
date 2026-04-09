import { Code, Globe, Refresh, Smartphone } from "@tabler/icons-react";
import { HireDeveloperTemplate } from "~/components/public/resources";

export default function HybridAppDevelopers() {
  return (
    <HireDeveloperTemplate
      ctaButtonHref="/contact"
      ctaButtonLabel="Hire Developers"
      ctaDescription="Hire our hybrid app developers for efficient cross-platform solutions."
      ctaTitle="Ready for Hybrid Development?"
      featuresDescription="Our hybrid app developers use web technologies to build apps that run on multiple platforms."
      featuresItems={[
        {
          icon: Globe,
          title: "Web Technologies",
          desc: "Use HTML, CSS, and JavaScript to build apps for iOS, Android, and web.",
        },
        {
          icon: Code,
          title: "Single Codebase",
          desc: "Maintain one codebase for multiple platforms, reducing development time.",
        },
        {
          icon: Smartphone,
          title: "Native-Like Experience",
          desc: "Provide a native feel with frameworks like Ionic and Cordova.",
        },
        {
          icon: Refresh,
          title: "Easy Updates",
          desc: "Deploy updates without app store approvals for web-based changes.",
        },
      ]}
      featuresTitle="Why Choose Our Hybrid App Developers?"
      heroHighlight="Hybrid App Developers"
      heroSubtitle="Create cost-effective hybrid apps with web technologies"
      heroTitle="Hire"
    />
  );
}
