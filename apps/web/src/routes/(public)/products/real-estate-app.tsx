import { Bell, Calculator, Home, Search } from "@tabler/icons-react";
import {
  BookingCta,
  BookingFeatures,
  BookingHero,
} from "@/components/public/products/booking";

export default function RealEstateApp() {
  const heroData = {
    title: "Real Estate App",
    description: "Real estate app development for web and mobile platforms.",
    image: "/images/real-estate.jpg",
    ctaText: "Get Started",
    ctaLink: "/contact",
  };

  const features = [
    {
      icon: Search,
      title: "Property Search & Filters",
      description: "Advanced search and filtering options.",
    },
    {
      icon: Home,
      title: "Virtual Tours & Photos",
      description: "Immersive property viewing.",
    },
    {
      icon: Bell,
      title: "Price Alerts",
      description: "Get notified of price changes.",
    },
    {
      icon: Calculator,
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
