import {
  IconChartBar,
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
    icon: IconChartBar,
    title: "ERP Integration",
    desc: "Automated order sync, real-time invoice tracking, inventory updates, financial reporting, and unified customer data across sales and finance.",
  },
  {
    icon: IconRefresh,
    title: "API Integration",
    desc: "Secure REST & SOAP APIs, middleware platforms, custom connectors, OAuth authentication, and encrypted data transmission.",
  },
  {
    icon: IconLink,
    title: "Marketing Integration",
    desc: "Lead & campaign sync, attribution tracking, customer engagement automation, and improved marketing ROI visibility.",
  },
  {
    icon: IconChartPie,
    title: "eCommerce & Payments",
    desc: "Storefronts, subscription systems, payment gateways, and customer self-service portals for unified lifecycle management.",
  },
];

export const Route = createFileRoute(
  "/(public)/services/salesforce-integration"
)({
  component: SalesforceIntegrationRoute,
});

function SalesforceIntegrationRoute() {
  return (
    <main className="min-h-screen">
      <SalesforceHero
        description="Salesforce delivers its true power when it operates as the central intelligence layer of your organization — connected, automated, and synchronized with every critical business system. We eliminate data silos and create secure, real-time data ecosystems."
        highlight="Integration"
        primaryCta={{ href: "/contact", label: "Start Your Integration" }}
        subtitle="Enterprise Salesforce Integration for Unified Business Systems"
        title="Salesforce"
      />
      <SalesforceFeatures
        description="End-to-end Salesforce connectivity solutions"
        items={features}
        title="Our Integration Services"
      />
      <SalesforceCta
        buttonLabel="Start Your Integration"
        description="Let's discuss how Salesforce integration can unify your data and automate your operations."
        title="Connect Your Business Systems Today"
      />
    </main>
  );
}
