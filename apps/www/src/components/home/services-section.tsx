import {
  IconChevronRight,
  IconCloud,
  IconDeviceDesktop,
  IconNetwork,
  IconSettings,
  IconShieldLock,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { CTAButton } from "@work-holo/ui/components/cta-button";
import { motion, type Variants } from "motion/react";

const services = [
  {
    num: "01",
    icon: IconDeviceDesktop,
    title: "Managed IT Services",
    description:
      "Comprehensive IT management, including monitoring, maintenance.",
    features: [
      "24/7 system monitoring",
      "IT support & troubleshooting",
      "Remote IT assistance",
    ],
  },
  {
    num: "02",
    icon: IconCloud,
    title: "Cloud Computing",
    description:
      "Scalable cloud-based services, including migration, storage, and security.",
    features: [
      "Scalable cloud storage",
      "SaaS, PaaS, and IaaS integration",
      "Hybrid & multi-cloud",
    ],
  },
  {
    num: "03",
    icon: IconShieldLock,
    title: "Cybersecurity Solutions",
    description:
      "Advanced security measures, including firewall protection, threat detection.",
    features: [
      "Firewall & network security",
      "Threat detection & prevention",
      "Endpoint protection",
    ],
  },
  {
    num: "04",
    icon: IconSettings,
    title: "IT Consulting & Strategy",
    description:
      "Expert guidance to optimize IT infrastructure, streamline operations, and drive.",
    features: [
      "Transformation planning",
      "IT infrastructure optimization",
      "Risk assessment",
    ],
  },
  {
    num: "05",
    icon: IconNetwork,
    title: "Network Infrastructure",
    description:
      "Designing, implementing, and maintaining secure and high-performance .",
    features: [
      "Transformation planning",
      "IT infrastructure optimization",
      "Risk assessment",
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
} satisfies Variants;

export function ServicesSection() {
  return (
    <section id="services" className="relative overflow-hidden bg-background py-20 lg:py-28 scroll-mt-28">
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
            <CTAButton type="button">Learn More</CTAButton>
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
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:col-span-12"
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
      className="group relative flex h-full min-w-0 flex-col rounded-2xl border border-border/40 bg-card/50 p-6 transition-all duration-300 hover:border-border/70"
      transition={{ duration: 0.3 }}
      variants={cardVariants}
      whileHover={{ y: -4 }}
    >
      {/* Number badge */}
      <span className="absolute top-4 right-4 font-medium text-muted-foreground/40 text-xs">
        {service.num}.
      </span>

      {/* Icon */}
      <div className="mb-5 flex size-12 items-center justify-center rounded-full border border-border/50 bg-background transition-colors group-hover:border-primary/30">
        <service.icon className="size-5 text-primary" strokeWidth={1.5} />
      </div>

      {/* Title */}
      <h3 className="mb-2 font-semibold text-foreground text-lg">
        {service.title}
      </h3>

      {/* Description */}
      <p className="mb-5 text-muted-foreground text-sm leading-relaxed">
        {service.description}
      </p>

      {/* Features box */}
      <div className="mb-4 rounded-xl bg-background/60 p-4">
        <ul className="space-y-2.5">
          {service.features.map((feature) => (
            <li
              className="flex items-start gap-2 text-muted-foreground text-sm"
              key={feature}
            >
              <IconChevronRight className="mt-0.5 size-3.5 shrink-0 text-primary" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Learn more link */}
      <Link
        className="mt-auto inline-flex items-center gap-1 font-medium text-foreground text-sm transition-colors hover:text-primary"
        to="/"
      >
        Learn more
        <IconChevronRight className="size-3.5" />
      </Link>
    </motion.div>
  );
}
