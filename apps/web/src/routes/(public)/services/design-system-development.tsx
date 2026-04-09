import {
  IconAccessible,
  IconCode,
  IconDeviceMobile,
  IconLayout,
  IconPalette,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import {
  DesignCta,
  DesignFeatures,
  DesignHero,
} from "@/components/public/services/design-experience";

const features = [
  {
    icon: IconLayout,
    title: "Component Library",
    desc: "Modular UI components including buttons, input fields, navigation systems, cards, containers, modal structures, and form elements — all documented for predictable usage.",
  },
  {
    icon: IconPalette,
    title: "Visual Identity Standards",
    desc: "Color hierarchies, typography scales, iconography frameworks, grid systems, and spacing standards ensuring visual harmony at scale.",
  },
  {
    icon: IconDeviceMobile,
    title: "Cross-Platform Integration",
    desc: "Design systems adaptable to web applications, mobile apps, enterprise dashboards, and SaaS platforms while maintaining consistency.",
  },
  {
    icon: IconCode,
    title: "Dev Alignment",
    desc: "Clear developer documentation, token-based design specifications, reusable code-ready components, and version control structures reducing team gaps.",
  },
  {
    icon: IconAccessible,
    title: "Accessibility & Compliance",
    desc: "Contrast ratio validation, scalable typography, assistive technology compatibility, and interaction clarity guidelines strengthening usability for all users.",
  },
];

export const Route = createFileRoute(
  "/(public)/services/design-system-development"
)({
  component: DesignSystemDevelopmentRoute,
});

function DesignSystemDevelopmentRoute() {
  return (
    <main className="min-h-screen">
      <DesignHero
        description="WorkHolo Labs offers professional design system development services that establish unified visual and interaction standards across digital products. Consistency is not repetition — it is structured efficiency."
        highlight="Development"
        primaryCta={{ href: "/contact", label: "Start Design System" }}
        subtitle="Building Structured UI Foundations for Scalable Digital Products"
        title="Design System"
      />
      <DesignFeatures
        description="From component architecture to cross-platform governance"
        items={features}
        title="Our Design System Capabilities"
      />
      <DesignCta
        buttonLabel="Start Design System"
        description="Let's discuss how a structured design system can accelerate your product development."
        title="Build Your Design System Today"
      />
    </main>
  );
}
