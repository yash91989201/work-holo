import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface BookingHeroProps {
  title: string;
  description: string;
  image: string;
  ctaText: string;
  ctaLink: string;
}

export function BookingHero({ title, description, image, ctaText, ctaLink }: BookingHeroProps) {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            {title}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {description}
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <a href={ctaLink}>{ctaText}</a>
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12"
        >
          <Image
            src={image}
            alt={title}
            width={800}
            height={600}
            className="mx-auto rounded-lg shadow-lg"
          />
        </motion.div>
      </div>
    </section>
  );
}
