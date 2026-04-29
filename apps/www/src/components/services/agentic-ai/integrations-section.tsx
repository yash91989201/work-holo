import { motion } from "motion/react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const integrations = [
  { name: "HubSpot", color: "#ff7a59" },
  { name: "Salesforce", color: "#00a1e0" },
  { name: "Notion", color: "#000000" },
  { name: "ClickUp", color: "#7b68ee" },
  { name: "Jira", color: "#0052cc" },
  { name: "Google Meet", color: "#00832d" },
  { name: "Zoom", color: "#2d8cff" },
  { name: "AWS", color: "#ff9900" },
  { name: "Google Cloud", color: "#4285f4" },
  { name: "Azure", color: "#0078d4" },
  { name: "API", color: "#6b7280" },
  { name: "Internal Platforms", color: "#6b7280" },
];

export function IntegrationsSection() {
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
            Agentic AI That Fits Into Your Stack
          </motion.h2>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-3xl text-center text-lg text-muted-foreground leading-relaxed"
          >
            We design agents that plug directly into the tools and systems you already use:
          </motion.p>

          {/* Integration cards */}
          <motion.div
            variants={containerVariants}
            className="mt-14 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 w-full"
          >
            {integrations.slice(0, 7).map((integration, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex items-center justify-center rounded-xl border border-border/50 bg-card/50 px-4 py-5 hover:border-primary/30 transition-colors"
              >
                <span
                  className="text-sm font-semibold"
                  style={{ color: integration.color }}
                >
                  {integration.name}
                </span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 w-full md:w-[71%]"
          >
            {integrations.slice(7, 12).map((integration, index) => (
              <motion.div
                key={index + 7}
                variants={itemVariants}
                className="flex items-center justify-center rounded-xl border border-border/50 bg-card/50 px-4 py-5 hover:border-primary/30 transition-colors"
              >
                <span
                  className="text-sm font-semibold"
                  style={{ color: integration.color }}
                >
                  {integration.name}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
