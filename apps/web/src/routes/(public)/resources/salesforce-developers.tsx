import {
  BarChart,
  BrandSalesforce,
  Database,
  Users,
} from "@tabler/icons-react";
import { HireDeveloperTemplate } from "~/components/public/resources";

export default function SalesforceDevelopers() {
  return (
    <HireDeveloperTemplate
      ctaButtonHref="/contact"
      ctaButtonLabel="Hire Developers"
      ctaDescription="Hire our Salesforce developers for customized CRM."
      ctaTitle="Ready for Salesforce?"
      featuresDescription="Our Salesforce developers build custom solutions on the Salesforce platform."
      featuresItems={[
        {
          icon: BrandSalesforce,
          title: "Salesforce Expertise",
          desc: "Proficiency in Apex, Visualforce, and Lightning components.",
        },
        {
          icon: Database,
          title: "Data Management",
          desc: "Customize objects, fields, and workflows.",
        },
        {
          icon: Users,
          title: "CRM Customization",
          desc: "Tailor CRM features for sales, marketing, and service.",
        },
        {
          icon: BarChart,
          title: "Integration & Analytics",
          desc: "Integrate with external systems and build reports.",
        },
      ]}
      featuresTitle="Why Choose Our Salesforce Developers?"
      heroHighlight="Salesforce Developers"
      heroSubtitle="Customize Salesforce for your business needs"
      heroTitle="Hire"
    />
  );
}
