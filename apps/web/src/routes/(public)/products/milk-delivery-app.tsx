import {
  IconBottle,
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

export const Route = createFileRoute("/(public)/products/milk-delivery-app")({
  component: RouteComponent,
});

export default function RouteComponent() {
  const heroData = {
    title: "Milk Delivery App Development",
    description:
      "Fresh milk delivery at your doorstep with our innovative app.",
    image: "/images/milk-delivery.jpg",
    ctaText: "Get Started",
    ctaLink: "/contact",
  };

  const features = [
    {
      icon: IconBottle,
      title: "Fresh Delivery",
      description: "Daily fresh milk delivery.",
    },
    {
      icon: IconClock,
      title: "Flexible Scheduling",
      description: "Schedule deliveries as per your needs.",
    },
    {
      icon: IconMapPin,
      title: "Local Suppliers",
      description: "Connect with local dairy farms.",
    },
    {
      icon: IconStar,
      title: "Quality Control",
      description: "Ensured quality and hygiene.",
    },
    {
      icon: IconShield,
      title: "Safe Handling",
      description: "Safe and hygienic delivery.",
    },
    {
      icon: IconUsers,
      title: "Subscription Plans",
      description: "Flexible subscription options.",
    },
  ];

  const ctaData = {
    title: "Ready to Launch Your Milk Delivery App?",
    description: "Contact us to build your custom milk delivery solution.",
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
