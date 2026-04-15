import { createFileRoute } from "@tanstack/react-router";
import AiCta from "@/components/public/services/ai-data/ai-cta";
import AiFeatures from "@/components/public/services/ai-data/ai-features";
import AiHero from "@/components/public/services/ai-data/ai-hero";

export const Route = createFileRoute(
  "/(public)/services/saas-development-services"
)({
  component: SaasDevelopmentServices,
});

const FEATURES = [
  {
    id: "01",
    title: "SaaS Architecture & Strategy",
    description:
      "We design scalable SaaS architectures using microservices, containerization, and cloud-native infrastructure to ensure flexibility and performance.",
  },
  {
    id: "02",
    title: "SaaS MVP Development",
    description:
      "We help startups validate ideas quickly with robust, scalable MVPs built for rapid iteration and market launch.",
  },
  {
    id: "03",
    title: "Multi-Tenant SaaS Platforms",
    description:
      "We develop secure multi-tenant systems with data isolation, performance optimization, and enterprise-grade security.",
  },
  {
    id: "04",
    title: "Subscription & Payment Systems",
    description:
      "Integration of subscription billing platforms, payment gateways, and automated revenue workflows using Stripe, Razorpay, and custom solutions.",
  },
  {
    id: "05",
    title: "SaaS Cloud Engineering & Scaling",
    description:
      "We deploy SaaS platforms on AWS, Azure, or Google Cloud with CI/CD pipelines, DevOps automation, performance optimization, and legacy architecture modernization for growing SaaS companies.",
  },
];

export default function SaasDevelopmentServices() {
  return (
    <div className="min-h-screen font-['Inter',sans-serif] selection:bg-primary/30">
      <AiHero
        breadcrumbs={["Home", "Services", "SaaS Development Services"]}
        ctaHref="/contact"
        ctaText="Speak with Our SaaS Development Experts"
        description="WorkHolo Labs delivers scalable and secure SaaS development services for startups, product companies, and enterprises looking to build high-performance cloud-based platforms. From MVP development to enterprise-scale SaaS ecosystems, we design and engineer subscription-driven software platforms built for growth."
        title="End-to-End SaaS Development Services"
      />
      <AiFeatures
        features={FEATURES}
        subtitle="End-to-end SaaS solutions from MVP to enterprise scale"
        title="Our SaaS Development Services"
      />
      <AiCta
        ctaHref="/contact"
        ctaText="Speak with Our SaaS Development Experts"
        description="Let's discuss how we can design, develop, and scale your SaaS product with enterprise-grade architecture."
        title="Ready to Build Your SaaS Platform?"
      />
    </div>
  );
}
