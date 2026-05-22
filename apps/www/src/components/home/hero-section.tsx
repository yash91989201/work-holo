import { IconCircleCheck, IconPhone } from "@tabler/icons-react";
import { CTAButton } from "@work-holo/ui/components/cta-button";
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

const floatVariants = {
  animate: {
    y: [0, -12, 0],
    transition: {
      duration: 6,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut" as const,
    },
  },
};

const heroTitleLines = [
  ["Innovative", "Tech"],
  ["Solutions", "for"],
  ["Business."],
] as const;

const wordRevealVariants = {
  hidden: {
    clipPath: "inset(0 100% 0 0)",
    opacity: 0,
  },
  visible: (delay: number) => ({
    clipPath: "inset(0 0% 0 0)",
    opacity: 1,
    transition: {
      duration: 0.72,
      delay,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

function HeroTitle() {
  return (
    <h1 className="font-bold text-4xl text-foreground leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
      <span className="sr-only">Innovative Tech Solutions for Business.</span>

      {heroTitleLines.map((line, lineIndex) => (
        <span className="block" key={line.join(" ")}>
          {line.map((word, wordIndex) => {
            const delay = 0.18 + (lineIndex * 2 + wordIndex) * 0.12;

            return (
              <span
                aria-hidden="true"
                className="relative mr-[0.24em] inline-block last:mr-0"
                key={`${lineIndex}-${wordIndex}`}
              >
                <span className="text-foreground/20">{word}</span>
                <motion.span
                  className="absolute inset-0 text-foreground"
                  custom={delay}
                  initial="hidden"
                  variants={wordRevealVariants}
                  viewport={{ amount: 0.8, once: true }}
                  whileInView="visible"
                >
                  {word}
                </motion.span>
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}

function scrollToServices() {
  document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
}

export function HeroSection() {
  return (
    <section
      className="page-gradient relative scroll-mt-28 overflow-hidden bg-background px-4 pt-44 pb-8 sm:px-6 sm:pt-44 sm:pb-10 lg:px-8 lg:pt-40 lg:pb-14"
      id="hero"
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-y-0 right-0 w-[58%] bg-center bg-cover opacity-[0.05]"
          style={{ backgroundImage: "url('/assets/hero-img.png')" }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="grid min-h-[calc(100vh-8rem)] items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column */}
          <motion.div
            animate="visible"
            className="relative z-10 flex max-w-2xl flex-col justify-center"
            initial="hidden"
            variants={containerVariants}
          >
            <motion.p
              className="mb-6 font-semibold text-primary text-sm uppercase tracking-[0.24em]"
              variants={itemVariants}
            >
              [ TRANSFORMING IDEAS ]
            </motion.p>

            <div className="mb-8">
              <HeroTitle />
            </div>

            <motion.div
              className="flex flex-wrap items-center gap-5"
              variants={itemVariants}
            >
              <CTAButton
                className="shadow-[0_18px_40px_rgba(168,85,247,0.22)]"
                onClick={scrollToServices}
                type="button"
              >
                Explore Services
              </CTAButton>

              <a
                className="inline-flex items-center gap-2 font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
                href="tel:+18883338181"
              >
                <IconPhone className="size-5 text-primary" />
                +91-9780970564
              </a>
            </motion.div>

            <motion.div
              className="mt-10 flex flex-wrap items-center gap-5"
              variants={itemVariants}
            >
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <IconCircleCheck className="size-5 text-primary" />
                <span>Innovate Smarter</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <IconCircleCheck className="size-5 text-primary" />
                <span>Technology Simplified</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Image with floating cards */}
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            className="relative z-10 mx-auto w-full max-w-152 lg:translate-y-1"
            initial={{ opacity: 0, x: 50 }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              ease: [0.22, 1, 0.36, 1] as const,
            }}
          >
            <div className="relative overflow-hidden rounded-[2.25rem] border border-border/40 bg-card/50 p-4 shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur-sm sm:p-5">
              <div className="relative aspect-square overflow-hidden rounded-[1.75rem]">
                <img
                  alt="Team collaborating"
                  className="h-full w-full object-cover"
                  src="/assets/diverse-team-planning-stockcake.webp"
                />
                <div className="absolute inset-0 bg-linear-to-t from-primary/12 via-transparent to-transparent" />
              </div>
            </div>

            <motion.div
              animate="animate"
              className="absolute top-[35%] -left-4 sm:-left-2 lg:-left-8"
              variants={floatVariants}
            >
              <div className="flex items-center gap-3 rounded-2xl border border-border/50 bg-card/90 px-4 py-3 text-foreground shadow-xl backdrop-blur-md">
                <div className="flex size-9 items-center justify-center rounded-full bg-primary/15">
                  <IconCircleCheck className="size-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    Trusted by 100+
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Tech companies.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
