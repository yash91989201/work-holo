import {
  IconDeviceMobile,
  IconPencil,
  IconStack,
  IconTarget,
  IconUsers,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import {
  DesignCta,
  DesignFeatures,
  DesignHero,
} from "@/components/public/services/design-experience";

const features = [
  {
    icon: IconUsers,
    title: "Mobile UX Strategy",
    desc: "Core user journeys, interaction mapping, in-app navigation structure, drop-off risk points, and conversion pathway planning.",
  },
  {
    icon: IconDeviceMobile,
    title: "iOS & Android Design",
    desc: "Platform-native interfaces following Apple Human Interface Guidelines and Android Material Design principles for natural, intuitive experiences.",
  },
  {
    icon: IconPencil,
    title: "Wireframing & Prototypes",
    desc: "Mobile wireframes, clickable prototypes, interaction simulations, and gesture validation models to validate UX before development.",
  },
  {
    icon: IconTarget,
    title: "Conversion-Focused UI",
    desc: "Interfaces designed to increase sign-ups, improve in-app purchases, boost feature adoption, enhance onboarding, and reduce churn rates.",
  },
  {
    icon: IconStack,
    title: "Design System for Apps",
    desc: "Scalable mobile design systems including typography frameworks, color strategy, component libraries, and UI consistency models for scaling apps.",
  },
];

export const Route = createFileRoute("/(public)/services/mobile-app-design")({
  component: MobileAppDesignRoute,
});

function MobileAppDesignRoute() {
  return (
    <main className="min-h-screen">
      <DesignHero
        description="WorkHolo Labs is a specialized mobile app design company delivering intuitive, high-performance app interfaces tailored for iOS and Android platforms. Mobile app success begins with intelligent design."
        highlight="Company"
        primaryCta={{ href: "/contact", label: "Start Your App Design" }}
        subtitle="Crafting High-Impact Mobile Experiences That Drive Engagement"
        title="Mobile App Design"
      />
      <DesignFeatures
        description="From strategy to developer handoff"
        items={features}
        title="Our Mobile Design Services"
      />
      <DesignCta
        buttonLabel="Start Your App Design"
        description="Let's discuss how our mobile design expertise can create engaging app experiences."
        title="Design Your Mobile App Today"
      />
    </main>
  );
}
