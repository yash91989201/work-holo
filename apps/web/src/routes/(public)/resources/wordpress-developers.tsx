import { Plugin, Shield, Theme, WordPress } from "@tabler/icons-react";
import { HireDeveloperTemplate } from "~/components/public/resources";

export default function WordPressDevelopers() {
  return (
    <HireDeveloperTemplate
      ctaButtonHref="/contact"
      ctaButtonLabel="Hire Developers"
      ctaDescription="Hire our WordPress developers for robust web solutions."
      ctaTitle="Ready to Build with WordPress?"
      featuresDescription="Our WordPress developers create custom themes, plugins, and e-commerce sites."
      featuresItems={[
        {
          icon: WordPress,
          title: "Custom Themes & Plugins",
          desc: "Develop tailored themes and plugins to meet your specific needs.",
        },
        {
          icon: Plugin,
          title: "Plugin Integration",
          desc: "Integrate popular plugins or build custom ones for enhanced functionality.",
        },
        {
          icon: Theme,
          title: "Responsive Design",
          desc: "Ensure your WordPress site looks great on all devices.",
        },
        {
          icon: Shield,
          title: "Security & Performance",
          desc: "Implement security best practices and optimize for speed.",
        },
      ]}
      featuresTitle="Why Choose Our WordPress Developers?"
      heroHighlight="WordPress Developers"
      heroSubtitle="Build powerful websites and blogs with WordPress expertise"
      heroTitle="Hire"
    />
  );
}
