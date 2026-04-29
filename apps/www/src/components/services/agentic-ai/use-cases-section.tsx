import { motion } from "motion/react";
import {
  IconBulb,
  IconUserCog,
  IconTrendingUp,
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

const leftColumn = [
  {
    icon: IconBulb,
    title: "Qualify Leads Smarter",
    description:
      "Filter high-value leads using firmographic and behavioral data.",
  },
  {
    icon: IconUserCog,
    title: "Tool-Using Agents",
    description:
      "Agents that call APIs, update records, trigger workflows, and coordinate actions.",
  },
];

const rightColumn = [
  {
    icon: IconTrendingUp,
    title: "Proactively Manage Deals & Risks",
    description:
      "Prioritize deals, flag risks early, and trigger actions without manual effort.",
  },
  {
    icon: IconRefresh,
    title: "Sync Insights Across Systems",
    description:
      "Automatically update HubSpot, Jira, Notion, AWS, and other tools with the latest insights.",
  },
];

function UseCaseColumn({
  items,
}: {
  items: { icon: typeof IconBulb; title: string; description: string }[];
}) {
  return (
    <div className="relative flex flex-col gap-0">
      {items.map((item, index) => (
        <div key={index} className="relative flex gap-5 pb-10 last:pb-0">
          {/* Icon + connector line */}
          <div className="relative flex flex-col items-center">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-background">
              <item.icon className="size-5 text-primary" stroke={1.5} />
            </div>
            {index < items.length - 1 && (
              <div className="mt-2 h-full min-h-[60px] w-px bg-primary/20" />
            )}
          </div>

          {/* Content */}
          <div className="pt-1">
            <h4 className="text-lg font-semibold text-foreground">
              {item.title}
            </h4>
            <p className="mt-2 text-base text-muted-foreground leading-relaxed">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function UseCasesSection() {
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
            Example Use Cases
          </motion.h2>

          {/* Grid */}
          <motion.div
            variants={containerVariants}
            className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 w-full"
          >
            <motion.div variants={itemVariants}>
              <UseCaseColumn items={leftColumn} />
            </motion.div>
            <motion.div variants={itemVariants}>
              <UseCaseColumn items={rightColumn} />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
