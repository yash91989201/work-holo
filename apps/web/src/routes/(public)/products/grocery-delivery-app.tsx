import {
  Clock,
  MapPin,
  Shield,
  ShoppingCart,
  Star,
  Users,
} from "@tabler/icons-react";
import {
  ProductCta,
  ProductFeatures,
  ProductHero,
} from "@/components/public/products/on-demand";

export default function GroceryDeliveryApp() {
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
      icon: ShoppingCart,
      title: "Easy Ordering",
      description: "Browse and order groceries with ease.",
    },
    {
      icon: Clock,
      title: "Scheduled Delivery",
      description: "Choose your preferred delivery time.",
    },
    {
      icon: MapPin,
      title: "Location Tracking",
      description: "Real-time delivery tracking.",
    },
    {
      icon: Star,
      title: "Quality Assurance",
      description: "Fresh and quality products.",
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Multiple secure payment options.",
    },
    {
      icon: Users,
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
