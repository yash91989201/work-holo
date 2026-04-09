import { Bell, DeviceMobile, Offline, Speed } from "@tabler/icons-react";
import { HireDeveloperTemplate } from "~/components/public/resources";

export default function PwaDevelopers() {
  return (
    <HireDeveloperTemplate
      ctaButtonHref="/contact"
      ctaButtonLabel="Hire Developers"
      ctaDescription="Hire our PWA developers for modern web apps."
      ctaTitle="Ready for PWAs?"
      featuresDescription="Our PWA developers create web apps that work offline and feel native."
      featuresItems={[
        {
          icon: DeviceMobile,
          title: "Responsive Design",
          desc: "Ensure PWAs work seamlessly across devices.",
        },
        {
          icon: Offline,
          title: "Offline Functionality",
          desc: "Implement service workers for offline access.",
        },
        {
          icon: Bell,
          title: "Push Notifications",
          desc: "Engage users with timely notifications.",
        },
        {
          icon: Speed,
          title: "Performance Optimization",
          desc: "Optimize loading speeds and user experience.",
        },
      ]}
      featuresTitle="Why Choose Our PWA Developers?"
      heroHighlight="PWA Developers"
      heroSubtitle="Build app-like web experiences with Progressive Web Apps"
      heroTitle="Hire"
    />
  );
}
