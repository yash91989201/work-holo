import { ProductHero, ProductFeatures, ProductCta } from "@/components/public/products/on-demand";
import { Truck, Clock, MapPin, Star, Shield, Users } from "@tabler/icons-react";

export default function FoodDeliveryApp() {
  const heroData = {
    title: "Revolutionary Food Delivery App",
    description: "Connect customers with local restaurants for fast, reliable food delivery.",
    image: "/images/food-delivery.jpg",
    ctaText: "Get Started",
    ctaLink: "/contact",
  };

  const features = [
    { icon: Truck, title: "Fast Delivery", description: "Get your food delivered in under 30 minutes." },
    { icon: Clock, title: "Real-time Tracking", description: "Track your order in real-time." },
    { icon: MapPin, title: "Location Services", description: "Find restaurants near you." },
    { icon: Star, title: "Ratings & Reviews", description: "Rate your experience." },
    { icon: Shield, title: "Secure Payments", description: "Safe and secure transactions." },
    { icon: Users, title: "Driver Network", description: "Large network of drivers." },
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
