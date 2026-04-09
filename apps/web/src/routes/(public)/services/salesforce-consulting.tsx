import {
  IconChartDonut,
  IconChartPie,
  IconLink,
  IconRefresh,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import {
  SalesforceCta,
  SalesforceFeatures,
  SalesforceHero,
} from "@/components/public/services/salesforce";

const features = [
  {
    icon: IconChartDonut,
    title: "Salesforce Implementation",
    desc: "Business process analysis, CRM architecture design, custom object configuration, workflow automation, role-based access control, and data migration with validation.",
  },
  {
    icon: IconRefresh,
    title: "Customization & Development",
    desc: "Custom dashboards & reports, Lightning component development, automation rules, Apex & Visualforce customization, and advanced validation logic.",
  },
  {
    icon: IconLink,
    title: "Integration Services",
    desc: "Seamless integration with ERP systems, marketing automation, eCommerce platforms, payment gateways, and third-party APIs for a unified data ecosystem.",
  },
  {
    icon: IconChartPie,
    title: "Optimization & Support",
    desc: "CRM audit & health checks, automation enhancement, data cleansing, performance tuning, and user adoption training for maximum ROI.",
  },
];

export const Route = createFileRoute(
  "/(public)/services/salesforce-consulting"
)({
  component: SalesforceConsultingRoute,
});

function SalesforceConsultingRoute() {
  return (
    <main className="min-h-screen">
      <SalesforceHero
        description="At WorkHolo Labs, we help businesses unlock the full potential of Salesforce by aligning CRM technology with strategic growth objectives. We don't just deploy Salesforce — we design scalable CRM ecosystems that improve sales performance, automate workflows, and enhance customer lifecycle management."
        highlight="Consulting"
        primaryCta={{ href: "/contact", label: "Get a Free CRM Consultation" }}
        subtitle="Strategic Salesforce Implementation & CRM Transformation Experts"
        title="Salesforce"
      />
      <SalesforceFeatures
        description="End-to-end CRM transformation from strategy to optimization"
        items={features}
        title="Our Salesforce Consulting Services"
      />
      <SalesforceCta
        buttonLabel="Get a Free CRM Consultation"
        description="Let's discuss how our Salesforce consulting services can streamline your sales pipeline and drive growth."
        title="Transform Your CRM Strategy Today"
      />
    </main>
  );
}
