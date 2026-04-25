import { useEffect, useState } from "react";
import { motion, useAnimationControls } from "motion/react";
import {
  IconArrowUpRight,
  IconThumbUp,
  IconBulb,
  IconRocket,
  IconHeartHandshake,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@work-holo/ui/lib/utils";

const logos = [
  { name: "coudac", style: "tracking-tight font-bold text-lg" },
  { name: "flomodia", style: "italic font-serif text-lg" },
  { name: "WEGLOT", style: "font-bold tracking-widest text-lg" },
  { name: "Influence", suffix: "4You", style: "font-medium text-lg" },
  { name: "tse", sub: "ENERGIE DE CONFIANCE", style: "font-bold tracking-tight text-lg" },
  { name: "monceau", prefix: "m", style: "font-medium text-lg" },
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
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

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
            repeat: Infinity,
            repeatType: "loop",
            duration: 25,
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
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <motion.div
        animate={controls}
        initial={{ x: "0%" }}
        className="flex gap-5 w-max"
      >
        {allLogos.map((logo, index) => (
          <div
            key={`${logo.name}-${index}`}
            className="flex items-center justify-center rounded-2xl bg-card/40 border border-border/30 px-10 py-7 min-w-[200px] hover:border-border/60 hover:bg-card/70 transition-all duration-300"
          >
            {logo.prefix && (
              <span className="flex items-center justify-center size-7 rounded-full bg-muted mr-1.5 text-xs font-bold text-muted-foreground">
                {logo.prefix}
              </span>
            )}
            <span
              className={cn(
                "text-muted-foreground/50 hover:text-muted-foreground transition-colors",
                logo.style
              )}
            >
              {logo.name}
            </span>
            {logo.suffix && (
              <span className="text-xs font-bold text-muted-foreground/40 ml-1 align-top">
                {logo.suffix}
              </span>
            )}
            {logo.sub && (
              <span className="text-[9px] text-muted-foreground/30 ml-1.5 leading-none uppercase tracking-wider">
                {logo.sub}
              </span>
            )}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function WhyChooseUs() {
  return (
    <section className="relative bg-background py-20 lg:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/50 px-5 py-2 text-sm">
            <span className="text-muted-foreground">Join Over</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary text-primary-foreground text-xs font-bold">
              1000+
            </span>
            <span className="text-muted-foreground">
              Companies with Work Holo Here
            </span>
          </div>
        </motion.div>

        {/* Logo Marquee */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-24"
        >
          <LogoMarquee />
        </motion.div>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          {/* Tag */}
          <p className="text-sm font-medium tracking-[0.2em] text-primary uppercase mb-6">
            [ WHY CHOOSE US ]
          </p>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-[1.1] tracking-tight max-w-lg">
              Reliable IT Solution, for
              <br />
              Best Results.
            </h2>

            {/* Right side */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 lg:gap-8">
              <p className="text-sm text-muted-foreground leading-relaxed max-w-[220px]">
                Our services are customized to meet your unique.
              </p>
              <Link
                to="#"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/80 transition-colors shrink-0"
              >
                Learn More
                <span className="flex size-7 items-center justify-center rounded-full bg-primary-foreground">
                  <IconArrowUpRight className="size-4 text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="group relative p-7 rounded-2xl bg-card/60 border border-border/40 hover:border-border/70 transition-all duration-300"
            >
              {/* Icon */}
              <div className="flex size-14 items-center justify-center rounded-full bg-background border border-border/50 mb-8 group-hover:border-primary/30 transition-colors">
                <feature.icon
                  className="size-6 text-primary"
                  strokeWidth={1.5}
                />
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-foreground mb-3">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
