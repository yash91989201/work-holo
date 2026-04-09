import { BookingHero, BookingFeatures, BookingCta } from "@/components/public/products/booking";
import { Bell, Wallet, Star, Shield } from "@tabler/icons-react";

export default function TaxiBookingApp() {
  const heroData = {
    title: "Taxi Booking App",
    description: "Revolutionize urban transportation with our comprehensive taxi booking platform that connects riders with drivers seamlessly.",
    image: "/images/taxi-booking.jpg",
    ctaText: "Get Started",
    ctaLink: "/contact",
  };

  const features = [
    { icon: Bell, title: "Real Time Updates", description: "Get live updates on your ride status and driver location." },
    { icon: Wallet, title: "Seamless Payments", description: "Secure and easy payment options with multiple methods." },
    { icon: Star, title: "Reviewing & Rating", description: "Rate your experience and help improve our service." },
    { icon: Shield, title: "SOS Alert", description: "Emergency assistance feature for safety." },
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
