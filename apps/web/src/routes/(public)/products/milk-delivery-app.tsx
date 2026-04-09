import {
  Bottle,
  Clock,
  MapPin,
  Shield,
  Star,
  Users,
} from "@tabler/icons-react";
import {
  ProductCta,
  ProductFeatures,
  ProductHero,
} from "@/components/public/products/on-demand";

export default function MilkDeliveryApp() {
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
      icon: Bottle,
      title: "Fresh Delivery",
      description: "Daily fresh milk delivery.",
    },
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description: "Schedule deliveries as per your needs.",
    },
    {
      icon: MapPin,
      title: "Local Suppliers",
      description: "Connect with local dairy farms.",
    },
    {
      icon: Star,
      title: "Quality Control",
      description: "Ensured quality and hygiene.",
    },
    {
      icon: Shield,
      title: "Safe Handling",
      description: "Safe and hygienic delivery.",
    },
    {
      icon: Users,
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
