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
    title: "Implementation & Setup",
    desc: "Lead & opportunity config, sales stage mapping, territory hierarchy, role-based visibility, and approval process automation.",
  },
  {
    icon: IconRefresh,
    title: "Sales Automation",
    desc: "Automated lead routing, follow-up reminders, opportunity stage triggers, task automation rules, and activity tracking.",
  },
  {
    icon: IconLink,
    title: "Pipeline & Forecasting",
    desc: "Custom dashboards, real-time revenue tracking, conversion analytics, performance reporting, and executive KPI views.",
  },
  {
    icon: IconChartPie,
    title: "Customization & LWC",
    desc: "Custom objects & fields, Lightning Web Components, dynamic page layouts, advanced reporting, and governance rules.",
  },
];

export const Route = createFileRoute("/(public)/services/sales-cloud")({
  component: SalesCloudRoute,
});

function SalesCloudRoute() {
  return (
    <main className="min-h-screen">
      <SalesforceHero
        description="Modern sales teams need more than a CRM — they need visibility, automation, and predictive insights to close deals faster. We deliver specialized Sales Cloud Services designed to optimize pipelines, automate processes, and improve forecasting accuracy."
        highlight="Sales Cloud"
        primaryCta={{ href: "/contact", label: "Optimize Your Sales Cloud" }}
        subtitle="Transforming Sales Operations with Intelligent CRM Automation"
        title="Salesforce"
      />
      <SalesforceFeatures
        description="From setup to optimization and integration"
        items={features}
        title="Our Sales Cloud Services"
      />
      <SalesforceCta
        buttonLabel="Optimize Your Sales Cloud"
        description="Let's discuss how Sales Cloud can transform your pipeline into a revenue engine."
        title="Accelerate Your Sales Revenue"
      />
    </main>
  );
}
