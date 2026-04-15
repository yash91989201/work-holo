import { createFileRoute } from "@tanstack/react-router";
import AiCta from "@/components/public/services/ai-data/ai-cta";
import AiFeatures from "@/components/public/services/ai-data/ai-features";
import AiHero from "@/components/public/services/ai-data/ai-hero";

export const Route = createFileRoute("/(public)/services/machine-learning")({
  component: MachineLearning,
});

const FEATURES = [
  {
    id: "01",
    title: "ML Consulting & Strategy",
    description:
      "AI readiness assessment, data infrastructure evaluation, ML roadmap development, and use-case identification.",
  },
  {
    id: "02",
    title: "Custom Model Development",
    description:
      "Supervised & unsupervised learning, predictive analytics, classification, regression, and time-series forecasting.",
  },
  {
    id: "03",
    title: "Natural Language Processing",
    description:
      "Chatbots, virtual assistants, sentiment analysis, text classification, and document automation.",
  },
  {
    id: "04",
    title: "Computer Vision Solutions",
    description:
      "Image recognition, facial recognition, object detection, and video analytics for visual intelligence.",
  },
  {
    id: "05",
    title: "MLOps & Model Deployment",
    description:
      "Model training & optimization, cloud deployment (AWS, Azure, GCP), CI/CD for ML pipelines, and performance monitoring.",
  },
];

export default function MachineLearning() {
  return (
    <div className="min-h-screen font-['Inter',sans-serif] selection:bg-primary/30">
      <AiHero
        breadcrumbs={["Home", "Services", "AI & Machine Learning"]}
        description="Scalable, Data-Driven AI & ML Solutions for Business Growth. WorkHolo Labs is a results-driven Machine Learning Development Company delivering scalable AI & ML solutions that help businesses automate processes, improve decision-making, and unlock predictive insights."
        title="Enterprise AI & Machine Learning Development Company"
      />
      <AiFeatures
        features={FEATURES}
        subtitle="From consulting to deployment, we cover every stage of the ML lifecycle"
        title="End-to-End ML Development Services"
      />
      <AiCta
        ctaHref="/contact"
        ctaText="Get a Free Consultation"
        description="Let's discuss how machine learning can transform your business operations and drive measurable growth."
        title="Ready to Build Intelligent Systems?"
      />
    </div>
  );
}
