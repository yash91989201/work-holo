import { Analytics, Extension, ShoppingCart, Theme } from "@tabler/icons-react";
import { HireDeveloperTemplate } from "~/components/public/resources";

export default function MagentoDevelopers() {
  return (
    <HireDeveloperTemplate
      ctaButtonHref="/contact"
      ctaButtonLabel="Hire Developers"
      ctaDescription="Hire our Magento developers for thriving online stores."
      ctaTitle="Ready for E-Commerce?"
      featuresDescription="Our Magento developers create scalable online stores with advanced features."
      featuresItems={[
        {
          icon: ShoppingCart,
          title: "E-Commerce Expertise",
          desc: "Develop custom online stores with Magento's robust platform.",
        },
        {
          icon: Extension,
          title: "Custom Extensions",
          desc: "Build modules and extensions for enhanced functionality.",
        },
        {
          icon: Theme,
          title: "Theme Customization",
          desc: "Create responsive, branded themes for your store.",
        },
        {
          icon: Analytics,
          title: "Performance & Analytics",
          desc: "Optimize for speed and integrate analytics tools.",
        },
      ]}
      featuresTitle="Why Choose Our Magento Developers?"
      heroHighlight="Magento Developers"
      heroSubtitle="Build powerful e-commerce platforms with Magento"
      heroTitle="Hire"
    />
  );
}
