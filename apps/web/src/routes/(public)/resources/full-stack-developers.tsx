import { Database, Globe, Shield, Stack } from "@tabler/icons-react";
import { HireDeveloperTemplate } from "~/components/public/resources";

export default function FullStackDevelopers() {
  return (
    <HireDeveloperTemplate
      ctaButtonHref="/contact"
      ctaButtonLabel="Hire Developers"
      ctaDescription="Hire our full stack developers for complete solutions."
      ctaTitle="Need Full Stack Expertise?"
      featuresDescription="Our full stack developers handle complete application development cycles."
      featuresItems={[
        {
          icon: Stack,
          title: "End-to-End Development",
          desc: "Manage both frontend and backend development seamlessly.",
        },
        {
          icon: Database,
          title: "Database Design",
          desc: "Design and implement efficient database schemas.",
        },
        {
          icon: Globe,
          title: "API Integration",
          desc: "Build and integrate RESTful and GraphQL APIs.",
        },
        {
          icon: Shield,
          title: "Security Implementation",
          desc: "Ensure security across all layers of the application.",
        },
      ]}
      featuresTitle="Why Choose Our Full Stack Developers?"
      heroHighlight="Full Stack Developers"
      heroSubtitle="Comprehensive development from frontend to backend"
      heroTitle="Hire"
    />
  );
}
