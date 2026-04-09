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
    title: "UX Strategy Experts",
    desc: "Hire designers for audience analysis, user pain points, and conversion design.",
  },
  {
    icon: IconLayout,
    title: "Prototyping Specialists",
    desc: "Access designers skilled in wireframes, prototypes, and user journey maps.",
  },
  {
    icon: IconPalette,
    title: "UI Design Professionals",
    desc: "Get designers for visual hierarchy, responsive layouts, and accessibility.",
  },
  {
    icon: IconStack,
    title: "Product Design Experts",
    desc: "Hire designers for SaaS, mobile, and eCommerce interfaces.",
  },
  {
    icon: IconBolt,
    title: "Usability Testing Specialists",
    desc: "Get designers experienced in A/B testing and UX optimization.",
  },
];

export const Route = createFileRoute("/(public)/resources/ui-ux-designers")({
  component: UiUxDesignersRoute,
});

function UiUxDesignersRoute() {
  return (
    <main className="min-h-screen">
      <DesignHero
        description="Hire experienced UI/UX designers to create user-centered digital experiences that improve engagement and conversions."
        highlight="Designers"
        primaryCta={{ href: "/contact", label: "Hire UI/UX Designers" }}
        subtitle="Designing Intuitive Digital Experiences That Convert"
        title="Hire UI/UX"
      />
      <DesignFeatures
        description="From research to refinement, hire intentional designers"
        items={features}
        title="Our UI/UX Design Expertise"
      />
      <DesignCta
        buttonLabel="Hire UI/UX Designers"
        description="Let's discuss how our designers can improve your digital experiences."
        title="Ready to Hire UI/UX Designers?"
      />
    </main>
  );
}
