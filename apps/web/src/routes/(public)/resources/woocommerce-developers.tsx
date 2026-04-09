import {
  BarChart,
  BrandWordpress,
  Payment,
  ShoppingBag,
} from "@tabler/icons-react";
import { HireDeveloperTemplate } from "~/components/public/resources";

export default function WooCommerceDevelopers() {
  return (
    <HireDeveloperTemplate
      ctaButtonHref="/contact"
      ctaButtonLabel="Hire Developers"
      ctaDescription="Hire our WooCommerce developers for successful online shops."
      ctaTitle="Need WooCommerce Expertise?"
      featuresDescription="Our WooCommerce developers build and customize e-commerce sites on WordPress."
      featuresItems={[
        {
          icon: BrandWordpress,
          title: "WordPress Integration",
          desc: "Seamlessly integrate WooCommerce with WordPress sites.",
        },
        {
          icon: ShoppingBag,
          title: "Store Customization",
          desc: "Customize product pages, carts, and checkout processes.",
        },
        {
          icon: Payment,
          title: "Payment Gateways",
          desc: "Integrate multiple payment options securely.",
        },
        {
          icon: BarChart,
          title: "Analytics & Reporting",
          desc: "Set up tracking and reporting for sales insights.",
        },
      ]}
      featuresTitle="Why Choose Our WooCommerce Developers?"
      heroHighlight="WooCommerce Developers"
      heroSubtitle="Enhance your WordPress site with WooCommerce expertise"
      heroTitle="Hire"
    />
  );
}
