import {
  IconChefHat,
  IconClock,
  IconMapPin,
  IconShield,
  IconStar,
  IconUsers,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ProductCta,
  ProductFeatures,
  ProductHero,
} from "@/components/public/products/on-demand";

export const Route = createFileRoute("/(public)/products/chef-management-app")({
  component: RouteComponent,
});

export default function RouteComponent() {
  const heroData = {
    title: "Chef Management App Development",
    description:
      "Streamline kitchen operations with our chef management platform.",
    image: "/images/chef-management.jpg",
    ctaText: "Get Started",
    ctaLink: "/contact",
  };

  const features = [
    {
      icon: IconChefHat,
      title: "Recipe Management",
      description: "Organize and manage recipes.",
    },
    {
      icon: IconClock,
      title: "Order Tracking",
      description: "Track orders in real-time.",
    },
    {
      icon: IconMapPin,
      title: "Inventory Control",
      description: "Manage kitchen inventory.",
    },
    {
      icon: IconStar,
      title: "Staff Coordination",
      description: "Coordinate kitchen staff.",
    },
    {
      icon: IconShield,
      title: "Quality Assurance",
      description: "Maintain food quality.",
    },
    {
      icon: IconUsers,
      title: "Multi-Role Access",
      description: "Access for different roles.",
    },
  ];

  const ctaData = {
    title: "Ready to Launch Your Chef Management App?",
    description: "Contact us to build your custom chef management solution.",
    buttonText: "Contact Us",
    buttonLink: "/contact",
  };

  return (
    <>
      <ProductHero {...heroData} />
      <ProductFeatures features={features} />
      <ProductCta {...ctaData} />
    </>
  );
}
