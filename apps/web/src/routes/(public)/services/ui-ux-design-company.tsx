import {
  IconBolt,
  IconLayout,
  IconPalette,
  IconSearch,
  IconStack,
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
    title: "UX Strategy & Research",
    desc: "Target audience behavior analysis, business objectives alignment, user pain point mapping, conversion pathway design, and competitive benchmarking.",
  },
  {
    icon: IconLayout,
    title: "Wireframing & Prototyping",
    desc: "Low-fidelity wireframes, interactive prototypes, user journey maps, and information architecture structures to validate usability before development.",
  },
  {
    icon: IconPalette,
    title: "UI Design",
    desc: "Clean visual hierarchy, brand-consistent design systems, responsive layouts, micro-interactions, and accessibility standards for intuitive interfaces.",
  },
  {
    icon: IconStack,
    title: "Product Design",
    desc: "SaaS dashboard interfaces, enterprise application design, mobile app UI/UX, eCommerce experience, and admin panel interfaces optimized for clarity.",
  },
  {
    icon: IconBolt,
    title: "Usability Testing & Optimization",
    desc: "A/B testing, interaction flow analysis, heatmap evaluation, and performance-based UX improvements driven by real user behavior data.",
  },
];

export const Route = createFileRoute("/(public)/services/ui-ux-design-company")(
  {
    component: UiUxDesignCompanyRoute,
  }
);

function UiUxDesignCompanyRoute() {
  return (
    <main className="min-h-screen">
      <DesignHero
        description="WorkHolo Labs is a performance-focused UI/UX design company delivering user-centered digital experiences that improve engagement, usability, and conversion rates. Great design is not just visual — it's functional, measurable, and aligned with business outcomes."
        highlight="Company"
        primaryCta={{ href: "/contact", label: "Start Your Design Project" }}
        subtitle="Designing Intuitive Digital Experiences That Convert"
        title="UI/UX Design"
      />
      <DesignFeatures
        description="From research to refinement, every design is intentional"
        items={features}
        title="Our UI/UX Design Services"
      />
      <DesignCta
        buttonLabel="Start Your Design Project"
        description="Let's discuss how our UI/UX design services can improve engagement and conversions."
        title="Design Better Digital Experiences"
      />
    </main>
  );
}
