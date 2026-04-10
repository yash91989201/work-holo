import {
  IconClock,
  IconMapPin,
  IconShield,
  IconStar,
  IconTruck,
  IconUsers,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ProductCta,
  ProductFeatures,
  ProductHero,
} from "@/components/public/products/on-demand";

export const Route = createFileRoute("/(public)/products/food-delivery-app")({
  component: RouteComponent,
});

export default function RouteComponent() {
  const heroData = {
    title: "Revolutionary Food Delivery App",
    description:
      "Connect customers with local restaurants for fast, reliable food delivery.",
    image: "/images/food-delivery.jpg",
    ctaText: "Get Started",
    ctaLink: "/contact",
  };

  const features = [
    {
      icon: IconTruck,
      title: "Fast Delivery",
      description: "Get your food delivered in under 30 minutes.",
    },
    {
      icon: IconClock,
      title: "Real-time Tracking",
      description: "Track your order in real-time.",
    },
    {
      icon: IconMapPin,
      title: "Location Services",
      description: "Find restaurants near you.",
    },
    {
      icon: IconStar,
      title: "Ratings & Reviews",
      description: "Rate your experience.",
    },
    {
      icon: IconShield,
      title: "Secure Payments",
      description: "Safe and secure transactions.",
    },
    {
      icon: IconUsers,
      title: "Driver Network",
      description: "Large network of drivers.",
    },
  ];

  const ctaData = {
    title: "Ready to Launch Your Food Delivery App?",
    description: "Contact us to build your custom food delivery solution.",
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
