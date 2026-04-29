import { motion } from "motion/react";
import { CTAButton } from "@work-holo/ui/components/cta-button";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background pt-32 lg:pt-40 pb-16">
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center"
        >
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              AI Agents for Product Teams
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground"
          >
            AI Agents
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="mt-4 text-xl sm:text-2xl text-muted-foreground font-medium"
          >
            Intelligent agents that power your product workflows
          </motion.p>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="mt-8 max-w-3xl text-lg text-muted-foreground leading-relaxed"
          >
            We build and deploy AI agents that integrate seamlessly into your product stack.
            From autonomous task execution to intelligent decision-making, our agents help
            product teams ship faster, reduce operational overhead, and deliver smarter
            user experiences at scale.
          </motion.p>

          {/* CTA */}
          <motion.div variants={itemVariants} className="mt-10">
            <CTAButton>Contact Us</CTAButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
