import {
  IconCreditCard,
  IconPhone,
  IconTag,
  IconUser,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import {
  BookingCta,
  BookingFeatures,
  BookingHero,
} from "@/components/public/products/booking";

export const Route = createFileRoute("/(public)/products/hotel-booking-app")({
  component: RouteComponent,
});

export default function RouteComponent() {
  const heroData = {
    title: "Hotel Booking App",
    description:
      "Empower your business with a high-performance hotel booking application tailored to your specific needs.",
    image: "/images/hotel-booking.jpg",
    ctaText: "Get Started",
    ctaLink: "/contact",
  };

  const features = [
    {
      icon: IconTag,
      title: "Best Offers & Discounts",
      description: "Exclusive deals and discounts for members.",
    },
    {
      icon: IconCreditCard,
      title: "Seamless Payments",
      description: "Secure payment processing.",
    },
    {
      icon: IconUser,
      title: "Reviewing & Rating",
      description: "User reviews and ratings.",
    },
    {
      icon: IconPhone,
      title: "SOS Alert",
      description: "Emergency contact feature.",
    },
  ];

  const ctaData = {
    title: "Ready to Launch Your Hotel Booking App?",
    description: "Contact us to build your custom hotel booking solution.",
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
