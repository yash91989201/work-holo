import {
  IconCpu,
  IconRocket,
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
    title: "Product Discovery & Strategy",
    desc: "Business objectives clarification, target audience analysis, core value proposition, competitive positioning, and product roadmap alignment.",
  },
  {
    icon: IconRocket,
    title: "MVP Design & Validation",
    desc: "Minimum viable product interfaces, lean feature sets, rapid validation prototypes, user feedback loops, and market-ready design systems.",
  },
  {
    icon: IconStack,
    title: "SaaS Product Design",
    desc: "Dashboard systems, data-heavy interfaces, role-based environments, subscription workflow experiences, and modular component libraries.",
  },
  {
    icon: IconCpu,
    title: "Experience Architecture",
    desc: "Information hierarchy planning, user journey mapping, interaction flow optimization, and multi-device experience consistency.",
  },
];

export const Route = createFileRoute(
  "/(public)/services/product-design-services"
)({
  component: ProductDesignServicesRoute,
});

function ProductDesignServicesRoute() {
  return (
    <main className="min-h-screen">
      <DesignHero
        description="WorkHolo Labs provides strategic product design services that transform ideas into scalable, user-centered digital products. Design is not decoration — it's product strategy in action."
        highlight="Services"
        primaryCta={{ href: "/contact", label: "Start Product Design" }}
        subtitle="Designing Digital Products That Solve Real Business Problems"
        title="Product Design"
      />
      <DesignFeatures
        description="From discovery to scalable design systems"
        items={features}
        title="Our Product Design Capabilities"
      />
      <DesignCta
        buttonLabel="Start Product Design"
        description="Let's discuss how product design can transform your idea into a scalable digital solution."
        title="Design Your Digital Product Today"
      />
    </main>
  );
}
