import { motion } from "motion/react";
import { IconCircleCheck } from "@tabler/icons-react";

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

const leftItems = [
  "Deep LLM & ML expertise",
  "Product-led engineering",
  "Rapid iteration cycles",
  "AI-first software development pricing, onshore quality",
];

const rightItems = [
  "We build smart agents, not basic bots",
  "We prioritize delivery, not experimentation",
  "Prototypes in days, full solutions in weeks",
  "High value without high burn rate",
];

export function WhyLogicielSection() {
  return (
    <section className="relative py-20 lg:py-28 bg-background">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col items-center"
        >
          {/* Heading */}
          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary"
          >
            Why Logiciel?
          </motion.h2>

          {/* Two columns */}
          <motion.div
            variants={containerVariants}
            className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-0 w-full"
          >
            {/* Left column */}
            <motion.div
              variants={itemVariants}
              className="md:pr-12 md:border-r md:border-border/40"
            >
              <h3 className="text-xl font-semibold text-foreground">
                Logiciel's Edge
              </h3>
              <div className="mt-3 h-0.5 w-24 bg-primary rounded-full" />
              <ul className="mt-8 space-y-4">
                {leftItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <IconCircleCheck
                      className="size-5 text-emerald-500 shrink-0 mt-0.5"
                      fill="currentColor"
                    />
                    <span className="text-base text-muted-foreground leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Right column */}
            <motion.div variants={itemVariants} className="md:pl-12">
              <h3 className="text-xl font-semibold text-foreground">
                What It Means for You
              </h3>
              <div className="mt-3 h-0.5 w-24 bg-primary rounded-full" />
              <ul className="mt-8 space-y-4">
                {rightItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <IconCircleCheck
                      className="size-5 text-emerald-500 shrink-0 mt-0.5"
                      fill="currentColor"
                    />
                    <span className="text-base text-muted-foreground leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
