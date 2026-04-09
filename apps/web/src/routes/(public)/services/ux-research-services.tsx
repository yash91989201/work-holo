import {
  IconCheck,
  IconFlask,
  IconMap,
  IconMessage,
  IconSearch,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import {
  DesignCta,
  DesignFeatures,
  DesignHero,
} from "@/components/public/services/design-experience";

const features = [
  {
    icon: IconSearch,
    title: "User Behavior Analysis",
    desc: "Navigation patterns, task completion flows, drop-off points, friction areas, and decision triggers to optimize before costly development changes.",
  },
  {
    icon: IconMessage,
    title: "Qualitative Research",
    desc: "Structured user interviews, persona refinement sessions, contextual observations, and experience walkthrough discussions revealing emotional factors.",
  },
  {
    icon: IconFlask,
    title: "Usability Testing",
    desc: "Feature discoverability, interface clarity, onboarding effectiveness, task efficiency, and accessibility compliance testing before launch.",
  },
  {
    icon: IconMap,
    title: "Journey Analysis",
    desc: "Entry touchpoints, interaction stages, decision moments, conversion pathways, and retention triggers revealing gaps between intention and execution.",
  },
  {
    icon: IconCheck,
    title: "Heuristic & Expert Evaluation",
    desc: "Usability principles assessment, cognitive load analysis, interface consistency review, and interaction efficiency benchmarking complementing user research.",
  },
];

export const Route = createFileRoute("/(public)/services/ux-research-services")(
  {
    component: UxResearchServicesRoute,
  }
);

function UxResearchServicesRoute() {
  return (
    <main className="min-h-screen">
      <DesignHero
        description="WorkHolo Labs delivers professional UX research services that uncover real user behavior, decision patterns, and usability barriers before development begins. Research reduces risk. Insight increases impact."
        highlight="Services"
        primaryCta={{ href: "/contact", label: "Start UX Research" }}
        subtitle="Evidence-Driven Insights That Shape Better Digital Experiences"
        title="UX Research"
      />
      <DesignFeatures
        description="From behavioral analysis to actionable recommendations"
        items={features}
        title="Our UX Research Capabilities"
      />
      <DesignCta
        buttonLabel="Start UX Research"
        description="Let's discuss how evidence-driven research can improve your digital product performance."
        title="Start Your UX Research Today"
      />
    </main>
  );
}
