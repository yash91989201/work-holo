import { Database, Lock, Settings, Users } from "@tabler/icons-react";
import { HireDeveloperTemplate } from "~/components/public/resources";

export default function CustomCmsDevelopers() {
  return (
    <HireDeveloperTemplate
      ctaButtonHref="/contact"
      ctaButtonLabel="Hire Developers"
      ctaDescription="Hire our custom CMS developers for personalized solutions."
      ctaTitle="Need a Custom CMS?"
      featuresDescription="Our developers create bespoke CMS solutions that fit your unique requirements."
      featuresItems={[
        {
          icon: Settings,
          title: "Tailored Solutions",
          desc: "Develop CMS systems customized to your business processes.",
        },
        {
          icon: Database,
          title: "Flexible Content Management",
          desc: "Manage various content types with intuitive interfaces.",
        },
        {
          icon: Users,
          title: "User Management",
          desc: "Implement role-based access and user permissions.",
        },
        {
          icon: Lock,
          title: "Security Features",
          desc: "Build secure CMS with authentication and data protection.",
        },
      ]}
      featuresTitle="Why Choose Our Custom CMS Developers?"
      heroHighlight="Custom CMS Developers"
      heroSubtitle="Build tailored content management systems for your needs"
      heroTitle="Hire"
    />
  );
}
