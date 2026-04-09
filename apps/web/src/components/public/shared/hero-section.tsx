import { IconArrowRight } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SectionWrapper } from "./section-wrapper";

export const HeroSection = () => {
  return (
    <SectionWrapper className="bg-background py-20">
      <div className="container mx-auto text-center">
        <motion.h1
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 font-bold text-4xl text-foreground md:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
        >
          Welcome to Our Platform
        </motion.h1>
        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-muted-foreground text-xl"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Build amazing things with ease.
        </motion.p>
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            size="lg"
          >
            Get Started <IconArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </SectionWrapper>
  );
};
