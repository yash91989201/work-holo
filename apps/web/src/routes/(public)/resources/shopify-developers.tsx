import {
  BrandShopify,
  Extension,
  ShoppingBag,
  Theme,
} from "@tabler/icons-react";
import { HireDeveloperTemplate } from "~/components/public/resources";

export default function ShopifyDevelopers() {
  return (
    <HireDeveloperTemplate
      ctaButtonHref="/contact"
      ctaButtonLabel="Hire Developers"
      ctaDescription="Hire our Shopify developers for stunning stores."
      ctaTitle="Need Shopify Help?"
      featuresDescription="Our Shopify developers build and customize online stores on the Shopify platform."
      featuresItems={[
        {
          icon: BrandShopify,
          title: "Shopify Expertise",
          desc: "Proficiency in Liquid, themes, and Shopify APIs.",
        },
        {
          icon: ShoppingBag,
          title: "Store Customization",
          desc: "Create custom product pages and checkout flows.",
        },
        {
          icon: Theme,
          title: "Theme Development",
          desc: "Design and develop responsive Shopify themes.",
        },
        {
          icon: Extension,
          title: "App Integration",
          desc: "Integrate third-party apps and build custom solutions.",
        },
      ]}
      featuresTitle="Why Choose Our Shopify Developers?"
      heroHighlight="Shopify Developers"
      heroSubtitle="Customize Shopify stores for unique e-commerce experiences"
      heroTitle="Hire"
    />
  );
}
