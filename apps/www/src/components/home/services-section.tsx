import { motion } from "motion/react";
import {
  IconArrowUpRight,
  IconChevronRight,
  IconDeviceDesktop,
  IconCloud,
  IconShieldLock,
  IconSettings,
  IconNetwork,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";

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
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export function ServicesSection() {
  return (
    <section className="relative bg-background py-20 lg:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-6">
          {/* Left Column - Header */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-4 lg:sticky lg:top-32 lg:self-start"
          >
            <p className="text-sm font-medium tracking-[0.2em] text-primary uppercase mb-5">
              [ EXPLORE SERVICES ]
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-foreground leading-[1.1] tracking-tight mb-8">
              Reliable IT Solution
              <br />
              for a Smarter.
            </h2>
            <Link
              to="#"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/80 transition-colors"
            >
              Learn More
              <span className="flex size-7 items-center justify-center rounded-full bg-primary-foreground">
                <IconArrowUpRight className="size-4 text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          </motion.div>

          {/* Right Column - Cards Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="lg:col-span-8"
          >
            {/* Top row - 2 cards */}
            <div className="grid sm:grid-cols-2 gap-5 mb-5">
              {services.slice(0, 2).map((service) => (
                <ServiceCard key={service.num} service={service} />
              ))}
            </div>

            {/* Bottom row - 3 cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.slice(2).map((service) => (
                <ServiceCard key={service.num} service={service} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  service,
}: {
  service: (typeof services)[number];
}) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-card/50 border border-border/40 hover:border-border/70 rounded-2xl p-6 transition-all duration-300"
    >
      {/* Number badge */}
      <span className="absolute top-4 right-4 text-xs font-medium text-muted-foreground/40">
        {service.num}.
      </span>

      {/* Icon */}
      <div className="flex size-12 items-center justify-center rounded-full bg-background border border-border/50 mb-5 group-hover:border-primary/30 transition-colors">
        <service.icon className="size-5 text-primary" strokeWidth={1.5} />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {service.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-5">
        {service.description}
      </p>

      {/* Features box */}
      <div className="bg-background/60 rounded-xl p-4 mb-4">
        <ul className="space-y-2.5">
          {service.features.map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <IconChevronRight className="size-3.5 text-primary shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Learn more link */}
      <Link
        to="#"
        className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors"
      >
        Learn more
        <IconChevronRight className="size-3.5" />
      </Link>
    </motion.div>
  );
}
