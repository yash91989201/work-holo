import {
  IconBell,
  IconCalculator,
  IconHome,
  IconSearch,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import {
  BookingCta,
  BookingFeatures,
  BookingHero,
} from "@/components/public/products/booking";

export const Route = createFileRoute("/(public)/products/real-estate-app")({
  component: RouteComponent,
});

export default function RouteComponent() {
  const heroData = {
    title: "Real Estate App",
    description: "Real estate app development for web and mobile platforms.",
    image: "/images/real-estate.jpg",
    ctaText: "Get Started",
    ctaLink: "/contact",
  };

  const features = [
    {
      icon: IconSearch,
      title: "Property Search & Filters",
      description: "Advanced search and filtering options.",
    },
    {
      icon: IconHome,
      title: "Virtual Tours & Photos",
      description: "Immersive property viewing.",
    },
    {
      icon: IconBell,
      title: "Price Alerts",
      description: "Get notified of price changes.",
    },
    {
      icon: IconCalculator,
      title: "Mortgage Calculator",
      description: "Calculate mortgage payments.",
    },
  ];

  const ctaData = {
    title: "Ready to Launch Your Real Estate App?",
    description: "Contact us to build your custom real estate solution.",
    buttonText: "Contact Us",
    buttonLink: "/contact",
  };

  return (
    <>
      <BookingHero {...heroData} />
      <BookingFeatures features={features} />
      <BookingCta {...ctaData} />
    </>
  );
}
