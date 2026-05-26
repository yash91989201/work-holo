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
    <section
      className="relative scroll-mt-28 overflow-hidden bg-background py-24 lg:py-32"
      id="process"
    >
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 h-[500px] w-[1000px] -translate-x-1/2 opacity-20">
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-primary/20 to-transparent mix-blend-screen blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-16 text-center lg:mb-20"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: easeOut }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="mb-6 inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
            <span className="font-bold text-primary text-xs uppercase tracking-widest">
              How We Work
            </span>
          </div>
          <h2 className="mb-6 font-extrabold text-4xl text-foreground leading-[1.1] tracking-tighter sm:text-5xl lg:text-6xl">
            From Vision to Reality.
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed sm:text-xl">
            We follow a streamlined, proven approach to ensure your project is
            delivered on time, within budget, and beyond expectations.
          </p>
        </motion.div>

        {/* Steps Timeline */}
        <div className="relative mx-auto max-w-5xl">
          <div className="absolute top-6 bottom-6 left-8 z-0 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-border/80 to-transparent md:left-1/2" />
          <div className="absolute top-10 bottom-10 left-8 z-0 w-[3px] -translate-x-1/2 bg-gradient-to-b from-primary/0 via-primary/25 to-primary/0 blur-sm md:left-1/2" />

          <div className="relative z-10 flex flex-col gap-8 md:gap-10">
            {steps.map((step, index) => (
              <ProcessCard index={index} key={step.num} step={step} />
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
      className={`group relative flex min-h-40 w-full md:min-h-44 ${isEven ? "md:justify-start" : "md:justify-end"}`}
      initial={{ opacity: 0, y: 28, scale: 0.98 }}
      transition={{ duration: 0.55, delay: index * 0.04, ease: easeOut }}
      viewport={{ once: true, amount: 0.25, margin: "0px 0px -8% 0px" }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
    >
      <div className="absolute top-8 left-8 z-20 -translate-x-1/2 md:left-1/2">
        <motion.div
          className="relative flex size-14 items-center justify-center rounded-full border border-primary/25 bg-background shadow-sm ring-8 ring-background transition-all duration-500 group-hover:border-primary/60 group-hover:ring-primary/10"
          transition={{ type: "spring", stiffness: 360, damping: 18 }}
          whileHover={{ scale: 1.08, rotate: isEven ? -3 : 3 }}
        >
          <span className="bg-gradient-to-br from-foreground to-foreground/55 bg-clip-text font-black text-base text-transparent transition-all duration-300 group-hover:from-primary group-hover:to-primary/70">
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
          className="relative h-full overflow-hidden rounded-3xl border border-border/55 bg-card/45 p-6 shadow-sm backdrop-blur-sm transition-all duration-500 hover:border-primary/40 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5"
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          whileHover={{ y: -6 }}
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="pointer-events-none absolute -top-16 -right-16 size-32 rounded-full bg-primary/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

          <div className="relative z-10">
            <span className="mb-3 block font-bold text-[10px] text-primary/80 uppercase tracking-[0.24em]">
              Phase {step.num}
            </span>
            <h3 className="mb-3 font-bold text-foreground text-xl tracking-tight transition-colors duration-300 group-hover:text-primary md:text-2xl">
              {step.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
              {step.description}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
