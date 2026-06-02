import {
  IconBulb,
  IconHeartHandshake,
  IconRocket,
  IconThumbUp,
} from "@tabler/icons-react";
import { cn } from "@work-holo/ui/lib/utils";
import { motion, useAnimationControls, type Variants } from "motion/react";
import { useEffect, useState } from "react";

const logos = [
  { name: "Adobe", style: "font-bold text-base" },
  { name: "BBC Academy", style: "font-semibold text-base" },
  { name: "BBC", style: "font-medium text-base" },
  { name: "Vueling", style: "font-bold tracking-tight text-base" },
  { name: "NHS Professionals", style: "font-medium text-base" },
  { name: "Lockheed Martin", style: "font-bold text-base" },
  { name: "Pinterest", style: "font-semibold text-base" },
  { name: "Expedia", style: "font-bold text-base" },
  { name: "eBay", style: "font-medium text-base" },
  { name: "Mastercard", style: "font-semibold text-base" },
  { name: "Salesforce", style: "font-bold text-base" },
  { name: "Unilever", style: "font-medium text-base" },
  { name: "Paramount+", style: "font-bold text-base" },
  { name: "Virgin Money", style: "font-semibold text-base" },
  { name: "Royal London", style: "font-medium text-base" },
  { name: "ScottishPower", style: "font-bold tracking-tight text-base" },
  { name: "Western Union", style: "font-semibold text-base" },
  { name: "TomTom", style: "font-bold text-base" },
  { name: "AARP", style: "font-medium text-base" },
  { name: "DISH", style: "font-bold text-base" },
  { name: "Xerox", style: "font-semibold text-base" },
  { name: "Ministry of Justice", style: "font-medium text-base" },
  { name: "HughesNet", style: "font-bold text-base" },
  { name: "MillerCoors", style: "font-semibold text-base" },
  { name: "Steelcase", style: "font-medium text-base" },
  { name: "Simon-Kucher", style: "font-bold tracking-tight text-base" },
  { name: "Smith+Nephew", style: "font-bold text-base" },
  { name: "Coursera", style: "font-semibold text-base" },
  { name: "Swiggy", style: "font-medium text-base" },
  { name: "Costa Express", style: "font-bold text-base" },
  { name: "Colas", style: "font-semibold text-base" },
  { name: "David Lloyd Leisure", style: "font-medium text-base" },
  { name: "Zego", style: "font-bold text-base" },
  { name: "RSPB", style: "font-semibold text-base" },
  { name: "HealthHero", style: "font-medium text-base" },
  { name: "Infinitas Learning", style: "font-bold tracking-tight text-base" },
  { name: "Fine+Rare", style: "font-semibold text-base" },
  { name: "Winchester College", style: "font-bold text-base" },
  { name: "Decisiv", style: "font-medium text-base" },
  { name: "FIH Hockey", style: "font-bold text-base" },
  { name: "BCA Auctions", style: "font-semibold text-base" },
  { name: "The Gym Group", style: "font-medium text-base" },
  { name: "MTN BioSmart", style: "font-bold text-base" },
  { name: "Globacom", style: "font-semibold text-base" },
  { name: "Africa Prudential", style: "font-medium text-base" },
  { name: "Verified.ng", style: "font-bold tracking-tight text-base" },
  { name: "NIMC", style: "font-semibold text-base" },
  { name: "OneBank", style: "font-bold text-base" },
  { name: "PushChain", style: "font-medium text-base" },
];

const features = [
  {
    icon: IconThumbUp,
    title: "Proven Track Record",
    description:
      "With a portfolio of successful projects and satisfied clients, we have a reputation.",
  },
  {
    icon: IconBulb,
    title: "Tailored Solutions",
    description:
      "Our services are customized to meet your unique business needs, ensuring solution.",
  },
  {
    icon: IconRocket,
    title: "Future Technologies",
    description:
      "Stay ahead of the competition with AI, cloud computing, and automation solutions.",
  },
  {
    icon: IconHeartHandshake,
    title: "24/7 Support",
    description:
      "With a portfolio of successful projects and satisfied clients, we have a reputation.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
} satisfies Variants;

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
} satisfies Variants;

function LogoMarquee() {
  const controls = useAnimationControls();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) {
      controls.stop();
    } else {
      controls.start({
        x: "-50%",
        transition: {
          x: {
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            duration: 120,
            ease: "linear",
          },
        },
      });
    }
  }, [isHovered, controls]);

  const allLogos = [...logos, ...logos, ...logos, ...logos];

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Fade edges */}
      <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent sm:w-24" />
      <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-16 bg-gradient-to-l from-background to-transparent sm:w-24" />

      <motion.div
        animate={controls}
        className="flex w-max gap-5"
        initial={{ x: "0%" }}
      >
        {allLogos.map((logo, index) => (
          <div
            className="flex min-w-[160px] items-center justify-center rounded-2xl border border-border/30 bg-card/40 px-6 py-5 transition-all duration-300 hover:border-border/60 hover:bg-card/70"
            key={`${logo.name}-${index}`}
          >
            <span
              className={cn(
                "text-muted-foreground/50 transition-colors hover:text-muted-foreground",
                logo.style
              )}
            >
              {logo.name}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function WhyChooseUs() {
  return (
    <section
      className="relative scroll-mt-28 overflow-hidden bg-background py-20 lg:py-28"
      id="why-choose-us"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Badge */}
        <motion.div
          className="mb-12 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/50 px-5 py-2 text-sm">
            <span className="text-muted-foreground">Join Over</span>
            <span className="inline-flex items-center rounded-md bg-primary px-2 py-0.5 font-bold text-primary-foreground text-xs">
              100+
            </span>
            <span className="text-muted-foreground">
              Companies with Work Holo Here
            </span>
          </div>
        </motion.div>

        {/* Logo Marquee */}
        <motion.div
          className="mb-24"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1 }}
        >
          <LogoMarquee />
        </motion.div>

        {/* Section Header */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          {/* Tag */}
          <p className="mb-6 font-medium text-primary text-sm uppercase tracking-[0.2em]">
            [ WHY CHOOSE US ]
          </p>

          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            {/* Headline */}
            <h2 className="max-w-lg font-bold text-3xl text-foreground leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl">
              Reliable IT Solution, for
              <br />
              Best Results.
            </h2>

            {/* Right side */}
          </div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          variants={containerVariants}
          viewport={{ once: true, margin: "-50px" }}
          whileInView="visible"
        >
          {features.map((feature) => (
            <motion.div
              className="group relative rounded-2xl border border-border/40 bg-card/60 p-7 transition-all duration-300 hover:border-border/70"
              key={feature.title}
              transition={{ duration: 0.3 }}
              variants={itemVariants}
              whileHover={{ y: -4 }}
            >
              {/* Icon */}
              <div className="relative mb-8 flex size-14 items-center justify-center overflow-hidden rounded-full border border-border/50 bg-background transition-colors group-hover:border-primary/30">
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-full bg-primary opacity-0 transition-all duration-500 group-hover:rotate-180 group-hover:opacity-100"
                />
                <feature.icon
                  className="relative z-10 size-6 text-primary transition-colors duration-300 group-hover:text-white"
                  strokeWidth={1.5}
                />
              </div>

              {/* Title */}
              <h3 className="mb-3 font-semibold text-foreground text-lg">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
