import { motion } from "motion/react";

const steps = [
  {
    num: "01",
    title: "Discovery & Strategy",
    description:
      "We dive deep into your business landscape, aligning on goals and mapping out a comprehensive strategic roadmap before writing a single line of code.",
  },
  {
    num: "02",
    title: "UX Architecture",
    description:
      "Structuring the foundation. We map out user journeys, wireframes, and information architecture to ensure intuitive navigation and seamless flow.",
  },
  {
    num: "03",
    title: "Design & Prototyping",
    description:
      "Bringing the vision to life. We craft pixel-perfect, accessible interfaces and interactive prototypes that perfectly embody your brand identity.",
  },
  {
    num: "04",
    title: "Build & Integration",
    description:
      "Our engineering team develops robust, scalable architectures using modern tech stacks, seamlessly integrating with your existing systems.",
  },
  {
    num: "05",
    title: "Launch & Iteration",
    description:
      "We ensure a flawless deployment, followed by continuous monitoring, performance tuning, and data-driven enhancements to keep you ahead.",
  },
];

const easeOut = [0.22, 1, 0.36, 1] as const;

export function ProcessSection() {
  return (
    <section id="process" className="relative bg-background py-24 lg:py-32 overflow-hidden scroll-mt-28">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent blur-3xl rounded-full mix-blend-screen" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="text-center mb-16 lg:mb-20"
        >
          <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 mb-6">
            <span className="text-xs font-bold tracking-widest text-primary uppercase">
              How We Work
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.1] tracking-tighter mb-6">
            From Vision to Reality.
          </h2>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            We follow a streamlined, proven approach to ensure your project is delivered on time, within budget, and beyond expectations.
          </p>
        </motion.div>

        {/* Steps Timeline */}
        <div className="relative mx-auto max-w-5xl">
          <div className="absolute left-8 top-6 bottom-6 z-0 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-border/80 to-transparent md:left-1/2" />
          <div className="absolute left-8 top-10 bottom-10 z-0 w-[3px] -translate-x-1/2 bg-gradient-to-b from-primary/0 via-primary/25 to-primary/0 blur-sm md:left-1/2" />

          <div className="relative z-10 flex flex-col gap-8 md:gap-10">
            {steps.map((step, index) => (
              <ProcessCard key={step.num} step={step} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessCard({
  step,
  index,
}: {
  step: (typeof steps)[number];
  index: number;
}) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.55, delay: index * 0.04, ease: easeOut }}
      className={`group relative flex min-h-40 w-full md:min-h-44 ${isEven ? "md:justify-start" : "md:justify-end"}`}
    >
      <div className="absolute left-8 top-8 z-20 -translate-x-1/2 md:left-1/2">
        <motion.div
          whileHover={{ scale: 1.08, rotate: isEven ? -3 : 3 }}
          transition={{ type: "spring", stiffness: 360, damping: 18 }}
          className="relative flex size-14 items-center justify-center rounded-full border border-primary/25 bg-background shadow-sm ring-8 ring-background transition-all duration-500 group-hover:border-primary/60 group-hover:ring-primary/10"
        >
          <span className="text-base font-black bg-gradient-to-br from-foreground to-foreground/55 bg-clip-text text-transparent transition-all duration-300 group-hover:from-primary group-hover:to-primary/70">
            {step.num}
          </span>
          <span className="absolute inset-[-7px] -z-10 rounded-full bg-primary/0 blur-md transition-colors duration-500 group-hover:bg-primary/20" />
        </motion.div>
      </div>

      <div
        className={`relative w-full pl-20 md:w-[calc(50%-3.5rem)] md:pl-0 ${isEven ? "md:pr-2 md:text-right" : "md:pl-2 md:text-left"}`}
      >
        <div
          className={`pointer-events-none absolute top-14 hidden h-px w-12 bg-gradient-to-r from-primary/45 to-transparent md:block ${isEven ? "-right-12" : "-left-12 rotate-180"}`}
        />

        <motion.div
          whileHover={{ y: -6 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="relative h-full overflow-hidden rounded-3xl border border-border/55 bg-card/45 p-6 shadow-sm backdrop-blur-sm transition-all duration-500 hover:border-primary/40 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="pointer-events-none absolute -right-16 -top-16 size-32 rounded-full bg-primary/10 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <div className="relative z-10">
            <span className="mb-3 block text-[10px] font-bold uppercase tracking-[0.24em] text-primary/80">
              Phase {step.num}
            </span>
            <h3 className="mb-3 text-xl font-bold tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary md:text-2xl">
              {step.title}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              {step.description}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
