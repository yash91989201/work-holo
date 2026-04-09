import { ProductHero, ProductFeatures, ProductCta } from "@/components/public/products/on-demand";
import { Car, Clock, MapPin, Star, Shield, Users } from "@tabler/icons-react";

export default function CarWashApp() {
  const heroData = {
    title: "On-Demand Car Wash App",
    description: "Convenient car washing services at your location.",
    image: "/images/car-wash.jpg",
    ctaText: "Get Started",
    ctaLink: "/contact",
  };

  const features = [
    { icon: Car, title: "Professional Service", description: "Expert car washing services." },
    { icon: Clock, title: "On-Demand Booking", description: "Book services anytime." },
    { icon: MapPin, title: "Mobile Service", description: "Service at your location." },
    { icon: Star, title: "Quality Assurance", description: "High-quality cleaning." },
    { icon: Shield, title: "Eco-Friendly", description: "Environmentally friendly products." },
    { icon: Users, title: "Provider Network", description: "Network of service providers." },
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
