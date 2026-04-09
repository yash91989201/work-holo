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
    title: "Mobile UX Strategists",
    desc: "Hire designers for user journeys, navigation, and conversion planning.",
  },
  {
    icon: IconDeviceMobile,
    title: "iOS & Android Designers",
    desc: "Access designers following platform guidelines for intuitive experiences.",
  },
  {
    icon: IconPencil,
    title: "Prototyping Experts",
    desc: "Get designers skilled in wireframes, prototypes, and interaction validation.",
  },
  {
    icon: IconTarget,
    title: "Conversion UI Specialists",
    desc: "Hire designers to increase sign-ups, purchases, and user retention.",
  },
  {
    icon: IconStack,
    title: "Design System Professionals",
    desc: "Get designers for scalable mobile design systems and UI consistency.",
  },
];

export const Route = createFileRoute(
  "/(public)/resources/mobile-app-designers"
)({
  component: MobileAppDesignersRoute,
});

function MobileAppDesignersRoute() {
  return (
    <main className="min-h-screen">
      <DesignHero
        description="Hire specialized mobile app designers to create intuitive, high-performance interfaces for iOS and Android."
        highlight="Designers"
        primaryCta={{ href: "/contact", label: "Hire Mobile App Designers" }}
        subtitle="Crafting High-Impact Mobile Experiences That Drive Engagement"
        title="Hire Mobile App"
      />
      <DesignFeatures
        description="From strategy to developer handoff, hire expert designers"
        items={features}
        title="Our Mobile Design Expertise"
      />
      <DesignCta
        buttonLabel="Hire Mobile App Designers"
        description="Let's discuss how our designers can create engaging mobile experiences."
        title="Ready to Hire Mobile App Designers?"
      />
    </main>
  );
}
