import { BookingHero, BookingFeatures, BookingCta } from "@/components/public/products/booking";
import { Calendar, Search, MapPin, CreditCard } from "@tabler/icons-react";

export default function TicketBookingApp() {
  const heroData = {
    title: "Ticket Booking App",
    description: "Custom ticket booking application for events, movies, and more.",
    image: "/images/ticket-booking.jpg",
    ctaText: "Get Started",
    ctaLink: "/contact",
  };

  const features = [
    { icon: Calendar, title: "Easy Registration", description: "Quick sign-up and account creation." },
    { icon: Search, title: "Smart Search", description: "Find events by location, date, and category." },
    { icon: MapPin, title: "Seat Selection", description: "Interactive seat selection." },
    { icon: CreditCard, title: "Secure Payment", description: "Safe and secure transactions." },
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
