import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ProductCtaProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export function ProductCta({ title, description, buttonText, buttonLink }: ProductCtaProps) {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {title}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            {description}
          </p>
          <Button asChild size="lg" variant="secondary">
            <a href={buttonLink}>{buttonText}</a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
