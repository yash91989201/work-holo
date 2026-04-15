import { createFileRoute } from "@tanstack/react-router";
import AiCta from "@/components/public/services/ai-data/ai-cta";
import AiFeatures from "@/components/public/services/ai-data/ai-features";
import AiHero from "@/components/public/services/ai-data/ai-hero";

export const Route = createFileRoute(
  "/(public)/services/data-science-solutions"
)({
  component: DataScienceSolutions,
});

const FEATURES = [
  {
    id: "01",
    title: "Predictive Analytics & Forecasting",
    description:
      "Predictive models for demand forecasting, risk pattern identification, pricing optimization, customer retention improvement, and operational challenge anticipation.",
  },
  {
    id: "02",
    title: "Data Engineering & Infrastructure",
    description:
      "Data pipelines, ETL processes, scalable data storage, cloud-based analytics infrastructure, and real-time processing frameworks for reliable insights.",
  },
  {
    id: "03",
    title: "Business Intelligence & Visualization",
    description:
      "Interactive dashboards with real-time performance metrics, KPI tracking, trend analysis, data storytelling, and executive reporting systems.",
  },
  {
    id: "04",
    title: "Statistical & Analytical Modeling",
    description:
      "Regression analysis, clustering techniques, trend identification, anomaly detection, and scenario simulation aligned with real business objectives.",
  },
  {
    id: "05",
    title: "Data Strategy Consulting",
    description:
      "Data governance frameworks, quality standards improvement, analytics-growth alignment, measurable KPI identification, and reporting workflow optimization.",
  },
];

export default function DataScienceSolutions() {
  return (
    <div className="min-h-screen font-['Inter',sans-serif] selection:bg-primary/30">
      <AiHero
        breadcrumbs={["Home", "Services", "Data Science Solutions"]}
        description="Turning Complex Data into Strategic Business Intelligence. WorkHolo Labs delivers advanced data science solutions that help organizations transform raw data into actionable intelligence. Data is valuable — only when it becomes insight."
        title="Data Science Solutions"
      />
      <AiFeatures
        features={FEATURES}
        subtitle="From predictive analytics to data strategy consulting"
        title="Our Data Science Capabilities"
      />
      <AiCta
        ctaHref="/contact"
        ctaText="Start Your Data Project"
        description="Let's discuss how data science can transform your raw data into strategic business intelligence."
        title="Ready to Unlock Data Intelligence?"
      />
    </div>
  );
}
