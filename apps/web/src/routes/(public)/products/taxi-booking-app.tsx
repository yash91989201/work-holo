import {
  IconBell,
  IconShield,
  IconStar,
  IconWallet,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import {
  BookingCta,
  BookingFeatures,
  BookingHero,
} from "@/components/public/products/booking";

export const Route = createFileRoute("/(public)/products/taxi-booking-app")({
  component: RouteComponent,
});

export default function RouteComponent() {
  const heroData = {
    title: "Taxi Booking App",
    description:
      "Revolutionize urban transportation with our comprehensive taxi booking platform that connects riders with drivers seamlessly.",
    image: "/images/taxi-booking.jpg",
    ctaText: "Get Started",
    ctaLink: "/contact",
  };

  const features = [
    {
      icon: IconBell,
      title: "Real Time Updates",
      description: "Get live updates on your ride status and driver location.",
    },
    {
      icon: IconWallet,
      title: "Seamless Payments",
      description: "Secure and easy payment options with multiple methods.",
    },
    {
      icon: IconStar,
      title: "Reviewing & Rating",
      description: "Rate your experience and help improve our service.",
    },
    {
      icon: IconShield,
      title: "SOS Alert",
      description: "Emergency assistance feature for safety.",
    },
  ];

  const ctaData = {
    title: "Ready to Launch Your Taxi Booking App?",
    description: "Contact us to build your custom taxi booking solution.",
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
