import { motion } from "framer-motion";
import { Image } from "@/components/shared/image";
import { Button } from "@/components/ui/button";

interface ProductHeroProps {
  ctaLink: string;
  ctaText: string;
  description: string;
  image: string;
  title: string;
}

export function ProductHero({
  title,
  description,
  image,
  ctaText,
  ctaLink,
}: ProductHeroProps) {
  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="mb-6 font-bold text-4xl text-foreground md:text-6xl">
            {title}
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-muted-foreground text-xl">
            {description}
          </p>
          <Button asChild className="bg-primary hover:bg-primary/90" size="lg">
            <a href={ctaLink}>{ctaText}</a>
          </Button>
        </motion.div>
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="mt-12"
          initial={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Image
            alt={title}
            className="h-full w-full"
            height={600}
            objectFit="cover"
            priority
            sizes="(max-width: 768px) 100vw, 800px"
            src={image}
            width={800}
            wrapperClassName="mx-auto max-w-full rounded-lg shadow-lg"
          />
        </motion.div>
      </div>
    </section>
  );
}
