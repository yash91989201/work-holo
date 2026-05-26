import {
  IconBrain,
  IconChevronRight,
  IconCode,
  IconDeviceMobile,
  IconRobot,
  IconRocket,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { CTAButton } from "@work-holo/ui/components/cta-button";
import { motion, type Variants } from "motion/react";

const services = [
  {
    num: "01",
    icon: IconBrain,
    title: "Agentic AI",
    description: "Autonomous AI for smarter workflows",
    href: "/services/agentic-ai",
    features: [
      "Autonomous decision-making",
      "Workflow automation",
      "Intelligent task routing",
    ],
  },
  {
    num: "02",
    icon: IconRobot,
    title: "AI Agents",
    description: "AI agents for product teams",
    href: "/services/ai-agents",
    features: [
      "Custom agent development",
      "Multi-agent orchestration",
      "Integration with existing tools",
    ],
  },
  {
    num: "03",
    icon: IconRocket,
    title: "MVP Development",
    description: "Launch fast, scale with confidence",
    href: "/services/mvp",
    features: [
      "Rapid prototyping",
      "Market validation",
      "Scalable architecture",
    ],
  },
  {
    num: "04",
    icon: IconCode,
    title: "Web App Development",
    description: "High-performance, scalable web apps",
    href: "/services/web-app-development",
    features: [
      "Modern tech stacks",
      "Progressive Web Apps",
      "Performance optimization",
    ],
  },
  {
    num: "05",
    icon: IconDeviceMobile,
    title: "Mobile App Development",
    description: "Seamless iOS & Android experiences",
    href: "/services/mobile-app-development",
    features: [
      "Native & cross-platform",
      "UI/UX implementation",
      "App store deployment",
    ],
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

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
  hover: {
    y: -10,
    scale: 1.02,
    transition: { type: "spring", stiffness: 340, damping: 22 },
  },
} satisfies Variants;

const cardGlowVariants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 0, scale: 0.96 },
  hover: { opacity: 1, scale: 1.02 },
} satisfies Variants;

const accentBarVariants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: { scaleX: 0, opacity: 0 },
  hover: {
    scaleX: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 260, damping: 28 },
  },
} satisfies Variants;

const iconVariants = {
  hidden: { opacity: 0, scale: 0.8, rotate: -12 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { delay: 0.08, duration: 0.35 },
  },
  hover: {
    scale: 1.08,
    rotate: 8,
    transition: { type: "spring", stiffness: 260, damping: 18 },
  },
} satisfies Variants;

const contentVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  hover: { x: 3, transition: { duration: 0.18 } },
} satisfies Variants;

const featureListVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } },
  hover: {},
} satisfies Variants;

const featureItemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25 } },
  hover: { x: 5, transition: { duration: 0.16 } },
} satisfies Variants;

const featureArrowVariants = {
  hidden: { x: 0, scale: 1 },
  visible: { x: 0, scale: 1 },
  hover: {
    x: 2,
    scale: 1.08,
    transition: { type: "spring", stiffness: 400, damping: 22 },
  },
} satisfies Variants;

const linkVariants = {
  hidden: { opacity: 0, x: -6 },
  visible: { opacity: 1, x: 0, transition: { delay: 0.18, duration: 0.25 } },
  hover: { x: 4 },
} satisfies Variants;

const arrowVariants = {
  hidden: { x: 0 },
  visible: { x: 0 },
  hover: {
    x: 5,
    rotate: 12,
    transition: { type: "spring", stiffness: 380, damping: 18 },
  },
} satisfies Variants;

const underlineVariants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 0 },
  hover: {
    scaleX: 1,
    transition: { type: "spring", stiffness: 320, damping: 26 },
  },
} satisfies Variants;

export function ServicesSection() {
  return (
    <section
      className="relative scroll-mt-28 overflow-hidden bg-background py-20 lg:py-28"
      id="services"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-6">
          {/* Left Column - Header */}
          <motion.div
            className="lg:sticky lg:top-32 lg:col-span-4 lg:self-start"
            initial={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <p className="mb-5 font-medium text-primary text-sm uppercase tracking-[0.2em]">
              [ EXPLORE SERVICES ]
            </p>
            <h2 className="mb-8 font-bold text-3xl text-foreground leading-[1.1] tracking-tight sm:text-4xl lg:text-[2.75rem]">
              Reliable IT Solution
              <br />
              for a Smarter.
            </h2>
            <CTAButton href="/services" type="button">
              View all
            </CTAButton>
          </motion.div>

          {/* Right Column - Cards Grid */}
          <motion.div
            className="grid gap-5 sm:grid-cols-2 lg:col-span-8"
            initial="hidden"
            variants={containerVariants}
            viewport={{ once: true, margin: "-80px" }}
            whileInView="visible"
          >
            {services.slice(0, 2).map((service) => (
              <ServiceCard key={service.num} service={service} />
            ))}
          </motion.div>

          <motion.div
            className="grid gap-5 sm:grid-cols-2 lg:col-span-12 lg:grid-cols-3"
            initial="hidden"
            variants={containerVariants}
            viewport={{ once: true, margin: "-80px" }}
            whileInView="visible"
          >
            {services.slice(2).map((service) => (
              <ServiceCard key={service.num} service={service} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service }: { service: (typeof services)[number] }) {
  return (
    <motion.div
      className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border/40 bg-card/50 p-6 transition-all duration-300 hover:border-border/70 hover:shadow-2xl hover:shadow-primary/5"
      transition={{ duration: 0.3 }}
      variants={cardVariants}
      whileHover="hover"
      whileTap={{ scale: 0.985 }}
    >
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_40%,rgba(255,255,255,0.03))]"
        variants={cardGlowVariants}
      />
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 -right-10 size-32 rounded-full bg-primary/10 blur-3xl"
        variants={cardGlowVariants}
      />
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-0 h-px origin-left bg-linear-to-r from-primary/70 via-primary/30 to-transparent"
        variants={accentBarVariants}
      />

      {/* Number badge */}
      <motion.span
        className="absolute top-4 right-4 font-medium text-muted-foreground/40 text-xs"
        variants={contentVariants}
      >
        {service.num}.
      </motion.span>

      {/* Icon */}
      <motion.div
        className="mb-5 flex size-12 items-center justify-center rounded-full border border-border/50 bg-background transition-colors group-hover:border-primary/30"
        variants={iconVariants}
      >
        <service.icon className="size-5 text-primary" strokeWidth={1.5} />
      </motion.div>

      {/* Title */}
      <motion.h3
        className="mb-2 font-semibold text-foreground text-lg"
        variants={contentVariants}
      >
        {service.title}
      </motion.h3>

      {/* Description */}
      <motion.p
        className="mb-5 text-muted-foreground text-sm leading-relaxed"
        variants={contentVariants}
      >
        {service.description}
      </motion.p>

      {/* Features box */}
      <div className="mb-4 rounded-xl bg-background/60 p-4">
        <motion.ul className="space-y-2.5" variants={featureListVariants}>
          {service.features.map((feature) => (
            <motion.li
              className="flex items-start gap-2 text-muted-foreground text-sm"
              key={feature}
              variants={featureItemVariants}
            >
              <motion.span variants={featureArrowVariants}>
                <IconChevronRight className="mt-0.5 size-3.5 shrink-0 text-primary" />
              </motion.span>
              {feature}
            </motion.li>
          ))}
        </motion.ul>
      </div>

      {/* Learn more link */}
      <motion.div className="mt-auto" variants={linkVariants}>
        <Link
          className="group/link relative inline-flex items-center gap-1 font-medium text-foreground text-sm transition-colors hover:text-primary"
          to={service.href}
        >
          Learn more
          <motion.span variants={arrowVariants}>
            <IconChevronRight className="size-3.5" />
          </motion.span>
          <motion.span
            aria-hidden="true"
            className="absolute -bottom-1 left-0 h-px w-full origin-left bg-primary/60"
            variants={underlineVariants}
          />
        </Link>
      </motion.div>
    </motion.div>
  );
}
