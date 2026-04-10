import {
  IconClock,
  IconMapPin,
  IconShield,
  IconShoppingCart,
  IconStar,
  IconUsers,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ProductCta,
  ProductFeatures,
  ProductHero,
} from "@/components/public/products/on-demand";

export const Route = createFileRoute("/(public)/products/grocery-delivery-app")(
  {
    component: RouteComponent,
  }
);

export default function RouteComponent() {
  const heroData = {
    title: "Grocery Delivery App Development",
    description:
      "Streamline grocery shopping with our on-demand delivery platform.",
    image: "/images/grocery-delivery.jpg",
    ctaText: "Get Started",
    ctaLink: "/contact",
  };

  const features = [
    {
      icon: IconShoppingCart,
      title: "Easy Ordering",
      description: "Browse and order groceries with ease.",
    },
    {
      icon: IconClock,
      title: "Scheduled Delivery",
      description: "Choose your preferred delivery time.",
    },
    {
      icon: IconMapPin,
      title: "Location Tracking",
      description: "Real-time delivery tracking.",
    },
    {
      icon: IconStar,
      title: "Quality Assurance",
      description: "Fresh and quality products.",
    },
    {
      icon: IconShield,
      title: "Secure Payments",
      description: "Multiple secure payment options.",
    },
    {
      icon: IconUsers,
      title: "Vendor Network",
      description: "Wide range of grocery vendors.",
    },
  ];

  const ctaData = {
    title: "Ready to Launch Your Grocery Delivery App?",
    description: "Contact us to build your custom grocery delivery solution.",
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
