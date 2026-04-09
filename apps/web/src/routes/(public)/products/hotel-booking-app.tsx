import { BookingHero, BookingFeatures, BookingCta } from "@/components/public/products/booking";
import { Tag, CreditCard, User, Phone } from "@tabler/icons-react";

export default function HotelBookingApp() {
  const heroData = {
    title: "Hotel Booking App",
    description: "Empower your business with a high-performance hotel booking application tailored to your specific needs.",
    image: "/images/hotel-booking.jpg",
    ctaText: "Get Started",
    ctaLink: "/contact",
  };

  const features = [
    { icon: Tag, title: "Best Offers & Discounts", description: "Exclusive deals and discounts for members." },
    { icon: CreditCard, title: "Seamless Payments", description: "Secure payment processing." },
    { icon: User, title: "Reviewing & Rating", description: "User reviews and ratings." },
    { icon: Phone, title: "SOS Alert", description: "Emergency contact feature." },
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
