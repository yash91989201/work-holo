import { motion } from "motion/react";

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

const capabilities = [
  {
    title: "Sales & Marketing Agents",
    items: [
      "Detect high-intent behavior from platforms like 6 sense and website data",
      "Enrich lead profiles, trigger messages, and sync to CRM",
      "Route hot leads to SDRs in real time, deprioritize cold ones",
      "Deliver qualified lead lists to your team inbox daily",
    ],
  },
  {
    title: "Meeting & Productivity Agents",
    items: [
      "Join Zoom or Meet calls, transcribe & summarize discussions",
      "Translate conversations (e.g. Hindi, Punjabi to English)",
      "Extract decisions, generate task lists, and assign in Notion or Jira",
    ],
  },
  {
    title: "Real Estate & Operations Agents",
    items: [
      "Rank deals based on urgency and potential",
      "Automate compliance documentation",
      "Push time-sensitive alerts to agents and brokers",
    ],
  },
  {
    title: "Custom SaaS Intelligence Agents",
    items: [
      "Monitor performance metrics and flag anomalies such as page speed drops",
      "Prioritize bug reports or support tickets",
      "Suggest feature rollouts based on usage signals",
      "Auto-assign engineering tasks based on ticket type & urgency",
    ],
  },
];

export function CapabilitiesSection() {
  return (
    <section className="relative py-20 lg:py-28 bg-primary">
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
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground text-center"
          >
            Where We Have the Capabilities to Help
          </motion.h2>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-3xl text-center text-lg text-primary-foreground/80 leading-relaxed"
          >
            We have the capabilities to build AI agents that cut busywork, speed up decisions, and
            drive growth.
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="mt-2 text-center text-lg font-semibold text-primary-foreground"
          >
            Trusted by SaaS, startups, and real estate teams.
          </motion.p>

          {/* Cards grid */}
          <motion.div
            variants={containerVariants}
            className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6 w-full"
          >
            {capabilities.map((cap, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="rounded-3xl bg-background p-8 sm:p-10"
              >
                <h3 className="text-xl font-semibold text-foreground">
                  {cap.title}
                </h3>
                <ul className="mt-5 space-y-3">
                  {cap.items.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-base text-muted-foreground leading-relaxed"
                    >
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
