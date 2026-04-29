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

const benefits = [
  "Contextual intelligence based on live data",
  "Reduced manual overhead for operations, GTM, product teams, and more",
  "Full integration into your existing tools & workflows",
  "Always-on action without delays or missed follow-ups",
];

export function WhyNowSection() {
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
            Why AI Agents, Why Now
          </motion.h2>

          {/* Card */}
          <motion.div
            variants={itemVariants}
            className="mt-12 w-full rounded-2xl border border-border/50 bg-muted/30 p-8 sm:p-10 lg:p-12"
          >
            {/* Lead text with left border */}
            <div className="flex gap-4">
              <div className="w-1 shrink-0 rounded-full bg-primary" />
              <p className="text-lg text-foreground leading-relaxed">
                Traditional automation hits a ceiling. Agentic AI breaks through by delivering:
              </p>
            </div>

            {/* Benefits grid */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <IconCircleCheck className="size-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-base text-muted-foreground leading-relaxed">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bottom tagline */}
          <motion.p
            variants={itemVariants}
            className="mt-10 max-w-2xl text-center text-lg text-muted-foreground italic leading-relaxed"
          >
            No-code tools solve surface-level problems. Agentic AI solves bottlenecks.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
