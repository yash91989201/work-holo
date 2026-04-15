import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

interface ProductCtaProps {
  buttonLink: string;
  buttonText: string;
  description: string;
  title: string;
}

export function ProductCta({
  title,
  description,
  buttonText,
  buttonLink,
}: ProductCtaProps) {
  return (
    <section className="bg-primary py-20 text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4 font-bold text-3xl md:text-4xl">{title}</h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl opacity-90">
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
