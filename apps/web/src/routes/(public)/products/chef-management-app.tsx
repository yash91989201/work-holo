import {
  ChefHat,
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

export default function ChefManagementApp() {
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
      icon: ChefHat,
      title: "Recipe Management",
      description: "Organize and manage recipes.",
    },
    {
      icon: Clock,
      title: "Order Tracking",
      description: "Track orders in real-time.",
    },
    {
      icon: MapPin,
      title: "Inventory Control",
      description: "Manage kitchen inventory.",
    },
    {
      icon: Star,
      title: "Staff Coordination",
      description: "Coordinate kitchen staff.",
    },
    {
      icon: Shield,
      title: "Quality Assurance",
      description: "Maintain food quality.",
    },
    {
      icon: Users,
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
