import { motion } from "motion/react";
import { CTAButton } from "@work-holo/ui/components/cta-button";

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

const floatVariants = {
  animate: {
    y: [0, -12, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

const floatVariantsSlow = {
  animate: {
    y: [0, -10, 0],
    x: [0, 4, 0],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut" as const,
      delay: 1.5,
    },
  },
};

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background pt-32 lg:pt-40 pb-16">
      {/* Floating Chart Elements */}
      <motion.div
        variants={floatVariants}
        animate="animate"
        className="absolute top-28 left-8 lg:left-16 opacity-60 pointer-events-none"
      >
        <div className="bg-card/80 backdrop-blur-sm border border-border/40 rounded-2xl p-4 shadow-lg w-44">
          <p className="text-[10px] text-muted-foreground mb-1">Net Revenue</p>
          <p className="text-lg font-bold text-foreground">$186,122</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[10px] text-emerald-500 font-medium">+79.9%</span>
            <span className="text-[10px] text-muted-foreground">vs last period</span>
          </div>
          <svg className="w-full h-10 mt-2" viewBox="0 0 120 40">
            <path
              d="M0 35 Q20 30 30 25 T60 20 T90 15 T120 5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-primary"
            />
            <circle cx="120" cy="5" r="3" className="fill-primary" />
          </svg>
        </div>
      </motion.div>

      <motion.div
        variants={floatVariantsSlow}
        animate="animate"
        className="absolute bottom-32 left-12 lg:left-24 opacity-50 pointer-events-none"
      >
        <div className="bg-card/80 backdrop-blur-sm border border-border/40 rounded-2xl p-4 shadow-lg w-48">
          <p className="text-[10px] text-muted-foreground mb-1">MRR Growth</p>
          <p className="text-lg font-bold text-foreground">12 months</p>
          <svg className="w-full h-16 mt-2" viewBox="0 0 140 60">
            {[
              { x: 10, h: 30 },
              { x: 30, h: 45 },
              { x: 50, h: 25 },
              { x: 70, h: 50 },
              { x: 90, h: 35 },
              { x: 110, h: 55 },
              { x: 130, h: 40 },
            ].map((bar, i) => (
              <rect
                key={i}
                x={bar.x - 6}
                y={60 - bar.h}
                width="12"
                height={bar.h}
                rx="3"
                className={i % 2 === 0 ? "fill-primary/60" : "fill-primary/30"}
              />
            ))}
          </svg>
        </div>
      </motion.div>

      <motion.div
        variants={floatVariants}
        animate="animate"
        className="absolute top-40 right-8 lg:right-16 opacity-50 pointer-events-none"
      >
        <div className="bg-card/80 backdrop-blur-sm border border-border/40 rounded-2xl p-4 shadow-lg w-40">
          <p className="text-[10px] text-muted-foreground mb-2">Past 12 months</p>
          <svg className="w-full h-20" viewBox="0 0 120 80">
            {[
              { x: 10, h: 20 },
              { x: 25, h: 35 },
              { x: 40, h: 25 },
              { x: 55, h: 45 },
              { x: 70, h: 30 },
              { x: 85, h: 50 },
              { x: 100, h: 40 },
              { x: 115, h: 55 },
            ].map((bar, i) => (
              <rect
                key={i}
                x={bar.x - 5}
                y={80 - bar.h}
                width="10"
                height={bar.h}
                rx="2"
                className="fill-primary/40"
              />
            ))}
          </svg>
        </div>
      </motion.div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center"
        >
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              Agentic AI For Product Teams
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground"
          >
            Agentic AI for Product Teams
          </motion.h1>

          {/* Highlighted subheading */}
          <motion.div variants={itemVariants} className="mt-4">
            <span className="inline-flex items-center rounded-full bg-primary px-6 py-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-foreground">
              Delivery Playbook
            </span>
          </motion.div>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="mt-8 max-w-3xl text-lg text-muted-foreground leading-relaxed"
          >
            Logiciel builds AI agents that automate complex workflows and accelerate
            decision-making across sales, marketing, operations, and product teams.
            From strategy and architecture to deployment and scale, we design
            production-ready agentic systems that integrate with your stack, reduce
            manual effort, and deliver measurable performance gains.
          </motion.p>

          {/* CTA */}
          <motion.div variants={itemVariants} className="mt-10">
            <CTAButton>Contact Us</CTAButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
