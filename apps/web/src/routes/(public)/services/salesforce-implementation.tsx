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
    title: "Business-First Architecture",
    desc: "We analyze sales funnels, service workflows, customer touchpoints, reporting requirements, and operational bottlenecks before any configuration.",
  },
  {
    icon: IconRefresh,
    title: "Clean Data Migration",
    desc: "Structured migration planning, data cleansing & deduplication, field-level mapping validation, secure transfer, and post-migration verification.",
  },
  {
    icon: IconLink,
    title: "System Integration",
    desc: "Seamless integration with ERP, accounting, marketing automation, eCommerce, and custom APIs for unified visibility across departments.",
  },
  {
    icon: IconChartPie,
    title: "Adoption Strategy",
    desc: "Role-based training, admin enablement, user onboarding frameworks, KPI tracking dashboards, and ongoing system refinement for maximum ROI.",
  },
];

export const Route = createFileRoute(
  "/(public)/services/salesforce-implementation"
)({
  component: SalesforceImplementationRoute,
});

function SalesforceImplementationRoute() {
  return (
    <main className="min-h-screen">
      <SalesforceHero
        description="Salesforce implementation is not about installing software — it is about designing a centralized intelligence system that aligns people, processes, and performance. We deliver outcome-driven Salesforce Implementation Services that help organizations streamline operations and gain real-time visibility into customer lifecycles."
        highlight="Implementation"
        primaryCta={{ href: "/contact", label: "Start Your Implementation" }}
        subtitle="Structured CRM Deployment Built for Scalable Growth"
        title="Salesforce"
      />
      <SalesforceFeatures
        description="End-to-end CRM deployment from discovery to optimization"
        items={features}
        title="Our Implementation Capabilities"
      />
      <SalesforceCta
        buttonLabel="Start Your Implementation"
        description="Let's discuss how our implementation services can transform your CRM into a growth engine."
        title="Ready to Deploy Salesforce?"
      />
    </main>
  );
}
