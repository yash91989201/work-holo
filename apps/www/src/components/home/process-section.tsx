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
    <section className="relative bg-background py-20 lg:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium tracking-[0.2em] text-primary uppercase mb-5">
            [ OUR WORKING PROCESS ]
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-foreground leading-[1.1] tracking-tight">
            Transform Your Business
            <br />
            in 3 Simple Steps.
          </h2>
        </motion.div>

        {/* Steps Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="relative"
        >
          {/* Connecting dashed line */}
          <div className="hidden lg:block absolute top-[60px] left-[10%] right-[10%] h-0">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 border-t-2 border-dashed border-primary/30" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6">
            {steps.map((step, index) => (
              <ProcessCard
                key={step.num}
                step={step}
                isLast={index === steps.length - 1}
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
    <motion.div variants={cardVariants} className="relative">
      <div className="relative bg-card/60 border border-border/40 rounded-2xl p-8 pt-14">
        {/* Number Badge */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2">
          <div className="relative">
            <div className="flex size-20 items-center justify-center rounded-full bg-primary">
              <span className="text-2xl font-bold text-primary-foreground">
                {step.num}
              </span>
            </div>
            {/* Inner shadow ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-black/10 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Content */}
        <div className="mt-6 text-center">
          <h3 className="text-xl font-semibold text-foreground mb-4">
            {step.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {step.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
