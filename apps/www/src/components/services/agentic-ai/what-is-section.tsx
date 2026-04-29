import { motion } from "motion/react";
import {
  IconBrain,
  IconSettingsAutomation,
  IconRefresh,
} from "@tabler/icons-react";

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

const cards = [
  {
    icon: IconBrain,
    title: "Embedded intelligence inside your critical workflows",
  },
  {
    icon: IconSettingsAutomation,
    title: "Decision-making systems tailored to your data and business logic",
  },
  {
    icon: IconRefresh,
    title: "Automation that acts, executes tasks, & reduces manual work",
  },
];

export function WhatIsSection() {
  return (
    <section className="relative py-20 lg:py-28 bg-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col items-center text-center"
        >
          {/* Heading */}
          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary"
          >
            What Is Agentic AI for Tech Leaders
          </motion.h2>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-3xl text-lg text-muted-foreground leading-relaxed"
          >
            Our team builds <strong className="text-foreground">Custom AI agents</strong> that go
            beyond simple chatbots or scripts. These autonomous agents think, act, and deliver real
            outcomes by responding to real-time data signals from your systems.
          </motion.p>

          {/* Sub-heading */}
          <motion.h3
            variants={itemVariants}
            className="mt-10 text-xl sm:text-2xl font-semibold text-primary"
          >
            With our AI agents, you get:
          </motion.h3>

          {/* Divider line */}
          <motion.div
            variants={itemVariants}
            className="mt-4 w-full max-w-md"
          >
            <div className="h-px bg-primary/30 w-full" />
          </motion.div>

          {/* Cards */}
          <motion.div
            variants={containerVariants}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full"
          >
            {cards.map((card, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex flex-col items-center rounded-2xl border border-border/50 bg-card/50 p-8 text-center hover:border-primary/30 transition-colors"
              >
                <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 mb-6">
                  <card.icon className="size-8 text-primary" stroke={1.5} />
                </div>
                <p className="text-base font-medium text-foreground leading-relaxed">
                  {card.title}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom tagline */}
          <motion.p
            variants={itemVariants}
            className="mt-14 max-w-2xl text-lg text-muted-foreground italic leading-relaxed"
          >
            Purpose-built for tech leaders who want faster decisions, fewer bottlenecks, and more
            efficient operations.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
