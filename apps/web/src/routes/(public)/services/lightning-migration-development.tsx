import { createFileRoute } from "@tanstack/react-router";
import {
  SalesforceCta,
  SalesforceFeatures,
  SalesforceHero,
} from "@/components/public/services/salesforce";

const features = [
  {
    icon: IconChartBar,
    title: "Lightning Migration",
    desc: "Structured Classic to Lightning transition with gap analysis, component refactoring, data validation, user testing, and post-migration optimization.",
  },
  {
    icon: IconRefresh,
    title: "LWC Development",
    desc: "Custom Lightning Web Components, dynamic pages, advanced reporting, and UI personalization tailored to your operational goals.",
  },
  {
    icon: IconLink,
    title: "Automation Enhancement",
    desc: "Workflow automation upgrades, dynamic dashboards, approval processes, and Einstein Analytics integration for smarter decision making.",
  },
  {
    icon: IconChartPie,
    title: "Performance Optimization",
    desc: "Page load optimization, component rendering, role-based visibility, and security hardening for a high-performance CRM.",
  },
];

export const Route = createFileRoute(
  "/(public)/services/lightning-migration-development"
)({
  component: LightningMigrationDevelopmentRoute,
});

function LightningMigrationDevelopmentRoute() {
  return (
    <main className="min-h-screen">
      <SalesforceHero
        description="Salesforce Lightning is more than a visual upgrade — it is a productivity platform designed for speed, automation, and enhanced user experience. We help organizations seamlessly transition from Classic to Lightning while optimizing workflows and scalability."
        highlight="Lightning"
        primaryCta={{ href: "/contact", label: "Start Your Migration" }}
        subtitle="Modernizing Salesforce for Performance, Productivity & Scalability"
        title="Salesforce"
      />
      <SalesforceFeatures
        description="From migration to advanced Lightning development"
        items={features}
        title="Our Lightning Services"
      />
      <SalesforceCta
        buttonLabel="Start Your Migration"
        description="Let's discuss how we can modernize your Salesforce environment for maximum productivity."
        title="Ready to Upgrade to Lightning?"
      />
    </main>
  );
}
