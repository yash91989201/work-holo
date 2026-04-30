import {
  IconBrain,
  IconChevronRight,
  IconCloud,
  IconCode,
  IconDatabase,
  IconDeviceMobile,
  IconPalette,
  IconRobot,
  IconRocket,
  IconServer,
  IconTestPipe,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";

interface ServiceItem {
  description: string;
  href: string;
  icon: React.ReactNode;
  number: string;
  title: string;
}

const services: ServiceItem[] = [
  {
    number: "01",
    title: "Agentic AI",
    description: "Autonomous AI for smarter workflows",
    href: "/services/agentic-ai",
    icon: <IconBrain className="size-6" />,
  },
  {
    number: "02",
    title: "AI Agents",
    description: "AI agents for product teams",
    href: "/services/ai-agents",
    icon: <IconRobot className="size-6" />,
  },
  {
    number: "03",
    title: "MVP Development",
    description: "Launch fast, scale with confidence",
    href: "/services/mvp",
    icon: <IconRocket className="size-6" />,
  },
  {
    number: "04",
    title: "Web App Development",
    description: "High-performance, scalable web apps",
    href: "/services/web-app-development",
    icon: <IconCode className="size-6" />,
  },
  {
    number: "05",
    title: "Mobile App Development",
    description: "Seamless iOS & Android experiences",
    href: "/services/mobile-app-development",
    icon: <IconDeviceMobile className="size-6" />,
  },
  {
    number: "06",
    title: "QA & Test Automation",
    description: "Faster releases, zero-bug quality",
    href: "/services/qa-test-automation",
    icon: <IconTestPipe className="size-6" />,
  },
  {
    number: "07",
    title: "UX/UI Design",
    description: "User-first design that drives adoption",
    href: "/services/ux-ui-design",
    icon: <IconPalette className="size-6" />,
  },
  {
    number: "08",
    title: "Data Engineering",
    description: "AI-ready data foundations for growth",
    href: "/services/data-engineering",
    icon: <IconDatabase className="size-6" />,
  },
  {
    number: "09",
    title: "AWS",
    description: "Optimize cost, security & scalability",
    href: "/services/aws",
    icon: <IconCloud className="size-6" />,
  },
  {
    number: "10",
    title: "Cloud Engineering & DevOps",
    description: "Automated pipelines, reliable deployments",
    href: "/services/cloud-engineering-devops",
    icon: <IconServer className="size-6" />,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

function ServiceCard({ service }: { service: ServiceItem }) {
  return (
    <motion.div
      className="group relative flex flex-col gap-5 overflow-hidden rounded-2xl border border-border/10 bg-card/50 p-6 transition-colors duration-300 hover:border-primary/20 hover:bg-card"
      variants={cardVariants}
      whileHover={{
        y: -6,
        scale: 1.01,
        transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const },
      }}
    >
      {/* Number badge */}
      <motion.span
        className="absolute top-4 right-4 font-mono text-muted-foreground/60 text-xs transition-colors duration-300 group-hover:text-primary/60"
        whileHover={{ scale: 1.1 }}
      >
        {service.number}.
      </motion.span>

      {/* Icon */}
      <motion.div
        className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary/15"
        transition={{ duration: 0.3 }}
        whileHover={{ rotate: 5, scale: 1.08 }}
      >
        {service.icon}
      </motion.div>

      {/* Content */}
      <div className="flex flex-col gap-3">
        <h3 className="font-heading font-semibold text-foreground text-xl">
          {service.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {service.description}
        </p>
      </div>

      {/* Learn more */}
      <div className="mt-auto pt-2">
        <Link
          className="inline-flex items-center gap-1 font-medium text-foreground text-sm transition-colors duration-300 hover:text-primary"
          to={service.href}
        >
          Learn more
          <motion.span
            className="inline-block"
            initial={{ x: 0 }}
            transition={{ duration: 0.2 }}
            whileHover={{ x: 4 }}
          >
            <IconChevronRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.span>
        </Link>
      </div>

      {/* Ambient glow on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
      </div>
    </motion.div>
  );
}

export function ServiceGrid() {
  return (
    <section className="relative bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
          viewport={{ once: true, margin: "-100px" }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="font-bold font-heading text-3xl text-foreground sm:text-4xl">
            Our Services
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            End-to-end solutions across AI, engineering, design, and cloud
            infrastructure.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          initial="hidden"
          variants={containerVariants}
          viewport={{ once: true, margin: "-50px" }}
          whileInView="visible"
        >
          {services.map((service) => (
            <ServiceCard key={service.number} service={service} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
