import { motion } from "motion/react";
import {
  IconArrowUpRight,
  IconPhone,
  IconCircleCheck,
  IconArrowDown,
  IconStarFilled,
} from "@tabler/icons-react";
import { CTAButton } from "@work-holo/ui/components/cta-button";

const avatarColors = ["bg-primary/80", "bg-primary/60", "bg-primary/40", "bg-primary/20"];
const avatarInitials = ["JD", "MK", "AL", "RK"];

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
    y: [0, -8, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const floatVariantsSlow = {
  animate: {
    y: [0, -6, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 1,
    },
  },
};

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background pt-32 lg:pt-40 pb-16">
      {/* Background wave pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <svg
          className="absolute top-0 right-0 w-[70%] h-full opacity-[0.03]"
          viewBox="0 0 800 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 100C300 200 500 0 700 150C900 300 800 600 600 700C400 800 200 600 100 400C0 200 50 100 100 100"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M150 200C350 300 550 100 750 250C950 400 850 700 650 800C450 900 250 700 150 500C50 300 100 200 150 200"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M200 300C400 400 600 200 800 350C1000 500 900 800 700 900C500 1000 300 800 200 600C100 400 150 300 200 300"
            stroke="currentColor"
            strokeWidth="0.5"
            fill="none"
          />
        </svg>
        <svg
          className="absolute bottom-0 left-0 w-[60%] h-[60%] opacity-[0.03]"
          viewBox="0 0 600 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 300C100 200 200 400 300 300C400 200 500 400 600 300"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M0 350C100 250 200 450 300 350C400 250 500 450 600 350"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M0 400C100 300 200 500 300 400C400 300 500 500 600 400"
            stroke="currentColor"
            strokeWidth="0.5"
            fill="none"
          />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[calc(100vh-12rem)]">
          {/* Left Column */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col justify-center"
          >
            {/* Tagline */}
            <motion.p
              variants={itemVariants}
              className="text-sm font-medium tracking-[0.2em] text-primary uppercase mb-6"
            >
              [ TRANSFORMING IDEAS ]
            </motion.p>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-[1.05] tracking-tight"
            >
              Innovative Tech
              <br />
              Solutions for
              <br />
              Business.
            </motion.h1>

            {/* CTA Row */}
            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-wrap items-center gap-5"
            >
              <CTAButton icon={<IconArrowUpRight className="size-4" />}>
                Explore Services
              </CTAButton>

              <a
                href="tel:+18883338181"
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                <IconPhone className="size-5 text-primary" />
                +1 (888) 333-8181
              </a>
            </motion.div>

            {/* Checkmarks */}
            <motion.div
              variants={itemVariants}
              className="mt-10 flex flex-wrap items-center gap-5"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <IconCircleCheck className="size-5 text-primary" />
                <span>Innovate Smarter</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <IconCircleCheck className="size-5 text-primary" />
                <span>Technology Simplified</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Image with floating cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
            className="relative"
          >
            {/* Main Image */}
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] lg:aspect-auto lg:h-[560px]">
              <img
                src="/assets/hero-img.png"
                alt="Professional working on laptop"
                className="w-full h-full object-cover"
              />
              {/* Subtle overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent" />
            </div>

            {/* Floating Card - Trusted by */}
            <motion.div
              variants={floatVariants}
              animate="animate"
              className="absolute top-[35%] -left-4 sm:left-4 lg:-left-8"
            >
              <div className="flex items-center gap-3 bg-card/90 backdrop-blur-md border border-border/50 rounded-2xl px-4 py-3 shadow-xl">
                <div className="flex size-9 items-center justify-center rounded-full bg-primary/20">
                  <IconCircleCheck className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Trusted by 800+
                  </p>
                  <p className="text-xs text-muted-foreground">Tech Giants.</p>
                </div>
              </div>
            </motion.div>

            {/* Floating Card - Rating */}
            <motion.div
              variants={floatVariantsSlow}
              animate="animate"
              className="absolute -bottom-4 -right-4 sm:right-4 lg:-right-6"
            >
              <div className="bg-card/95 backdrop-blur-md border border-border/50 rounded-3xl px-5 py-4 shadow-xl min-w-[200px]">
                {/* Avatar Stack */}
                <div className="flex -space-x-2.5 mb-3">
                  {avatarInitials.map((initial, i) => (
                    <div
                      key={i}
                      className={`flex size-9 items-center justify-center rounded-full ${avatarColors[i]} border-2 border-card text-xs font-bold text-primary-foreground`}
                    >
                      {initial}
                    </div>
                  ))}
                </div>

                {/* Rating */}
                <div className="flex items-end gap-2 mb-1">
                  <span className="text-4xl font-bold text-foreground leading-none">
                    4.9
                  </span>
                  <div className="flex items-center gap-0.5 pb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <IconStarFilled
                        key={i}
                        className="size-3.5 text-primary"
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  Based on 600+ Google Reviews.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-4 sm:left-8 lg:left-12 flex flex-col items-center gap-3"
      >
        <span
          className="text-[11px] font-medium text-muted-foreground tracking-wider uppercase"
          style={{ writingMode: "vertical-rl" }}
        >
          Scroll Down
        </span>
        <motion.button
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="flex size-10 items-center justify-center rounded-full bg-muted/50 border border-border/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Scroll down"
        >
          <IconArrowDown className="size-4" />
        </motion.button>
      </motion.div>
    </section>
  );
}
