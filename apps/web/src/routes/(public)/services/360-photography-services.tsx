import {
  IconBuildingCommunity,
  IconCamera,
  IconCube,
  IconMap2,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";

import {
  ServiceCta,
  ServiceFeatures,
  ServiceHero,
} from "@/components/public/services/software-development";

const features = [
  {
    title: "Virtual tour production",
    description:
      "Immersive walkthroughs for commercial spaces, hospitality, education, healthcare, and corporate environments.",
    icon: IconCamera,
  },
  {
    title: "360 product photography",
    description:
      "Rotational product views that improve confidence, visibility, and ecommerce engagement.",
    icon: IconCube,
  },
  {
    title: "Google Street View integration",
    description:
      "Publish 360 visuals into business profiles, websites, directories, and marketing journeys.",
    icon: IconMap2,
  },
  {
    title: "Property and venue showcases",
    description:
      "High-quality capture for real estate, tourism, showrooms, and event-driven marketing experiences.",
    icon: IconBuildingCommunity,
  },
];

export const Route = createFileRoute(
  "/(public)/services/360-photography-services"
)({ component: Photography360ServicesRoute });

function Photography360ServicesRoute() {
  return (
    <main className="flex min-h-screen flex-col">
      <ServiceHero
        badges={[
          "Matterport",
          "Google Street View",
          "WebGL",
          "React integration",
        ]}
        description="Immersive visual experiences that capture every angle and help customers explore places, spaces, and products with confidence."
        eyebrow="Visual services"
        primaryCta={{ href: "/contact", label: "Get a free quote" }}
        title="360° Photography Services"
      />
      <ServiceFeatures
        items={features}
        kicker="Immersive capture"
        technologies={[
          "Ricoh Theta Z1",
          "Insta360 Pro",
          "Pano2VR",
          "Kuula",
          "AWS S3 Hosting",
        ]}
        title="Interactive visual assets for marketing and discovery"
      />
      <ServiceCta
        actionLabel="Plan a 360 experience"
        description="Create richer digital storytelling for real estate, hospitality, commerce, and branded spaces with immersive capture workflows."
        title="Want your audience to explore before they arrive?"
      />
    </main>
  );
}
