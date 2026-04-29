import { motion } from "motion/react";
import {
  IconUsers,
  IconClipboardCheck,
  IconBulb,
  IconCode,
  IconBook,
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

const steps = [
  {
    icon: IconUsers,
    title: "Discovery Workshop",
    description: "Understand your workflows, systems, and key challenges.",
  },
  {
    icon: IconClipboardCheck,
    title: "Use Case Evaluation",
    description:
      "Assess whether an AI agent is the right solution, or if traditional automation is more suitable.",
  },
  {
    icon: IconBulb,
    title: "Proof of Concept",
    description: "We build a working prototype to demonstrate the value quickly.",
  },
  {
    icon: IconCode,
    title: "Development & Deployment",
    description:
      "Custom agent development, integration, and QA in your environment.",
  },
  {
    icon: IconBook,
    title: "Training & Handover",
    description:
      "We enable your team to manage and scale the agent independently.",
  },
];

export function ProcessSection() {
  return (
    <section className="relative py-20 lg:py-28 bg-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
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
            Our Process: From Idea to AI Agent
          </motion.h2>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-2xl text-center text-lg text-muted-foreground leading-relaxed"
          >
            We don't provide tools. We deliver intelligent teammates. Here's how we do it:
          </motion.p>

          {/* Steps Grid */}
          <motion.div
            variants={containerVariants}
            className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-y-12 w-full"
          >
            {steps.slice(0, 3).map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`flex flex-col items-center text-center px-6 ${
                  index < 2 ? "md:border-r md:border-border/40" : ""
                }`}
              >
                <div className="flex size-20 items-center justify-center rounded-full border border-border/60 bg-background">
                  <step.icon className="size-8 text-foreground" stroke={1.5} />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-3 text-base text-muted-foreground leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom row - 2 items */}
          <motion.div
            variants={containerVariants}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-y-12 w-full md:w-[66%]"
          >
            {steps.slice(3, 5).map((step, index) => (
              <motion.div
                key={index + 3}
                variants={itemVariants}
                className={`flex flex-col items-center text-center px-6 ${
                  index < 1 ? "md:border-r md:border-border/40" : ""
                }`}
              >
                <div className="flex size-20 items-center justify-center rounded-full border border-border/60 bg-background">
                  <step.icon className="size-8 text-foreground" stroke={1.5} />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-3 text-base text-muted-foreground leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </motion.div>
            ))}
            {/* Empty third column for alignment */}
            <div className="hidden md:block" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
