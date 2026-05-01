import { motion } from "motion/react";

const steps = [
  {
    num: "01",
    title: "Deep Discovery & Planning",
    description:
      "Every great solution starts understanding. We take the time to learn about your business, challenges, and goals.",
  },
  {
    num: "02",
    title: "Development & Implement",
    description:
      "Every great solution starts understanding. We take the time to learn about your business, challenges, and goals.",
  },
  {
    num: "03",
    title: "Optimization & Support",
    description:
      "Every great solution starts understanding. We take the time to learn about your business, challenges, and goals.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function ProcessSection() {
  return (
    <section
      className="relative scroll-mt-28 overflow-hidden bg-background py-20 lg:py-28"
      id="process"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <p className="mb-5 font-medium text-primary text-sm uppercase tracking-[0.2em]">
            [ OUR WORKING PROCESS ]
          </p>
          <h2 className="font-bold text-3xl text-foreground leading-[1.1] tracking-tight sm:text-4xl lg:text-[2.75rem]">
            Transform Your Business
            <br />
            in 3 Simple Steps.
          </h2>
        </motion.div>

        {/* Steps Grid */}
        <motion.div
          className="relative"
          initial="hidden"
          variants={containerVariants}
          viewport={{ once: true, margin: "-80px" }}
          whileInView="visible"
        >
          {/* Connecting dashed line */}
          <div className="absolute top-[60px] right-[10%] left-[10%] hidden h-0 lg:block">
            <div className="relative h-full w-full">
              <div className="absolute inset-0 border-primary/30 border-t-2 border-dashed" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-6">
            {steps.map((step, index) => (
              <ProcessCard
                isLast={index === steps.length - 1}
                key={step.num}
                step={step}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ProcessCard({
  step,
  isLast,
}: {
  step: (typeof steps)[number];
  isLast: boolean;
}) {
  return (
    <motion.div className="relative" variants={cardVariants}>
      <div className="relative rounded-2xl border border-border/40 bg-card/60 p-8 pt-14">
        {/* Number Badge */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2">
          <div className="relative">
            <div className="flex size-20 items-center justify-center rounded-full bg-primary">
              <span className="font-bold text-2xl text-primary-foreground">
                {step.num}
              </span>
            </div>
            {/* Inner shadow ring */}
            <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-black/10 to-transparent" />
          </div>
        </div>

        {/* Content */}
        <div className="mt-6 text-center">
          <h3 className="mb-4 font-semibold text-foreground text-xl">
            {step.title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {step.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
