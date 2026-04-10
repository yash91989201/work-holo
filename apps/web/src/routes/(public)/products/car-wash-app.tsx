import {
  IconCar,
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

export const Route = createFileRoute("/(public)/products/car-wash-app")({
  component: RouteComponent,
});

export default function RouteComponent() {
  const heroData = {
    title: "On-Demand Car Wash App",
    description: "Convenient car washing services at your location.",
    image: "/images/car-wash.jpg",
    ctaText: "Get Started",
    ctaLink: "/contact",
  };

  const features = [
    {
      icon: IconCar,
      title: "Professional Service",
      description: "Expert car washing services.",
    },
    {
      icon: IconClock,
      title: "On-Demand Booking",
      description: "Book services anytime.",
    },
    {
      icon: IconMapPin,
      title: "Mobile Service",
      description: "Service at your location.",
    },
    {
      icon: IconStar,
      title: "Quality Assurance",
      description: "High-quality cleaning.",
    },
    {
      icon: IconShield,
      title: "Eco-Friendly",
      description: "Environmentally friendly products.",
    },
    {
      icon: IconUsers,
      title: "Provider Network",
      description: "Network of service providers.",
    },
  ];

  const ctaData = {
    title: "Ready to Launch Your Car Wash App?",
    description: "Contact us to build your custom car wash solution.",
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
