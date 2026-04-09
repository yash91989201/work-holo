import { Clock, Target, Trophy, Users } from "@tabler/icons-react";
import { HireDeveloperTemplate } from "~/components/public/resources";

export default function DedicatedDevelopers() {
  return (
    <HireDeveloperTemplate
      ctaButtonHref="/contact"
      ctaButtonLabel="Hire Developers"
      ctaDescription="Hire our dedicated developers for consistent results."
      ctaTitle="Need Dedicated Support?"
      featuresDescription="Our dedicated developers provide focused, ongoing development support."
      featuresItems={[
        {
          icon: Users,
          title: "Dedicated Team",
          desc: "Assign developers exclusively to your project.",
        },
        {
          icon: Clock,
          title: "Flexible Engagement",
          desc: "Scale team size and hours based on project needs.",
        },
        {
          icon: Target,
          title: "Goal-Oriented",
          desc: "Focus on your objectives with consistent progress.",
        },
        {
          icon: Trophy,
          title: "Proven Expertise",
          desc: "Access skilled developers with relevant experience.",
        },
      ]}
      featuresTitle="Why Choose Our Dedicated Developers?"
      heroHighlight="Dedicated Developers"
      heroSubtitle="Get committed developers for your long-term projects"
      heroTitle="Hire"
    />
  );
}
