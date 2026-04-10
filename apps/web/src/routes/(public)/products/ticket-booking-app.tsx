import {
  IconCalendar,
  IconCreditCard,
  IconMapPin,
  IconSearch,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import {
  BookingCta,
  BookingFeatures,
  BookingHero,
} from "@/components/public/products/booking";

export const Route = createFileRoute("/(public)/products/ticket-booking-app")({
  component: RouteComponent,
});

export default function RouteComponent() {
  const heroData = {
    title: "Ticket Booking App",
    description:
      "Custom ticket booking application for events, movies, and more.",
    image: "/images/ticket-booking.jpg",
    ctaText: "Get Started",
    ctaLink: "/contact",
  };

  const features = [
    {
      icon: IconCalendar,
      title: "Easy Registration",
      description: "Quick sign-up and account creation.",
    },
    {
      icon: IconSearch,
      title: "Smart Search",
      description: "Find events by location, date, and category.",
    },
    {
      icon: IconMapPin,
      title: "Seat Selection",
      description: "Interactive seat selection.",
    },
    {
      icon: IconCreditCard,
      title: "Secure Payment",
      description: "Safe and secure transactions.",
    },
  ];

  const ctaData = {
    title: "Ready to Launch Your Ticket Booking App?",
    description: "Contact us to build your custom ticket booking solution.",
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
