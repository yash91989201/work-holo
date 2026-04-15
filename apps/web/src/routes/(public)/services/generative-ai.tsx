import { createFileRoute } from "@tanstack/react-router";
import AiCta from "@/components/public/services/ai-data/ai-cta";
import AiFeatures from "@/components/public/services/ai-data/ai-features";
import AiHero from "@/components/public/services/ai-data/ai-hero";

export const Route = createFileRoute("/(public)/services/generative-ai")({
  component: GenerativeAi,
});

const CAPABILITIES = [
  {
    id: "01",
    title: "AI-Powered Digital Assistants",
    description:
      "Intelligent assistants with multi-step contextual conversations, knowledge base interaction, internal process automation, and dynamic response adaptation.",
  },
  {
    id: "02",
    title: "Intelligent Content & Document Systems",
    description:
      "Structured automation of document drafting, report summarization, contract analysis, and data interpretation reducing manual effort while maintaining quality.",
  },
  {
    id: "03",
    title: "Personalized Experience Engines",
    description:
      "Adaptive AI systems that recommend products dynamically, adjust content based on user behavior, personalize digital journeys, and optimize engagement.",
  },
  {
    id: "04",
    title: "AI-Augmented Enterprise Workflows",
    description:
      "Generative intelligence embedded into CRM systems, internal dashboards, analytics platforms, and knowledge management tools enhancing productivity.",
  },
  {
    id: "05",
    title: "Responsible & Secure AI Deployment",
    description:
      "Controlled model access, secure API architecture, data isolation frameworks, compliance-aware system design, and continuous model performance monitoring.",
  },
];

export default function GenerativeAi() {
  return (
    <div className="min-h-screen font-['Inter',sans-serif] selection:bg-primary/30">
      <AiHero
        breadcrumbs={["Home", "Services", "Generative AI Development"]}
        description="Intelligent Systems Designed to Think, Create & Evolve. WorkHolo Labs operates as a specialized generative AI development company, engineering advanced AI-driven systems that generate content, automate reasoning, and enhance decision-making across digital platforms. Innovation is no longer about automation alone — it's about intelligent generation."
        title="Generative AI Development Company"
      />
      <AiFeatures
        features={CAPABILITIES}
        subtitle="From digital assistants to enterprise workflow intelligence"
        title="Generative AI Capabilities We Engineer"
      />
      <AiCta
        ctaHref="/contact"
        ctaText="Start Your AI Project"
        description="Let's discuss how generative AI can transform your enterprise operations with intelligent automation."
        title="Ready to Build Generative AI Systems?"
      />
    </div>
  );
}
