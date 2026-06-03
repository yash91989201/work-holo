import {
  IconBrandLinkedin,
  IconBulb,
  IconHeartHandshake,
  IconRocket,
  IconTarget,
  IconUsers,
  IconWorld,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ContactCard } from "@/components/shared/contact-card";

export const Route = createFileRoute("/about-us")({
  component: RouteComponent,
});

function AnimatedCounter({
  target,
  suffix,
  duration = 2,
}: {
  target: number;
  suffix: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let startTime: number;
    let animationFrame: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const eased = 1 - (1 - progress) ** 3;
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, target, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

const values = [
  {
    icon: IconTarget,
    title: "Mission Driven",
    description:
      "We exist to empower businesses with technology that creates real, measurable impact and sustainable growth.",
  },
  {
    icon: IconBulb,
    title: "Innovation First",
    description:
      "Embracing emerging technologies to deliver cutting-edge solutions that keep our clients ahead of the curve.",
  },
  {
    icon: IconUsers,
    title: "People Focused",
    description:
      "Building lasting partnerships through transparent communication, trust, and a deep understanding of client needs.",
  },
  {
    icon: IconHeartHandshake,
    title: "Integrity Always",
    description:
      "Operating with honesty and accountability in every interaction, ensuring ethical and reliable partnerships.",
  },
];

const milestones = [
  {
    year: "2019",
    title: "Founded",
    description:
      "Work Holo established with a vision to transform IT services.",
  },
  {
    year: "2020",
    title: "First 50 Clients",
    description: "Rapid growth as businesses embraced our tailored solutions.",
  },
  {
    year: "2022",
    title: "Global Expansion",
    description: "Extended operations to serve international markets.",
  },
  {
    year: "2024",
    title: "AI & Cloud Leadership",
    description: "Pioneered agentic AI and cloud-native solutions.",
  },
  {
    year: "2025",
    title: "100+ Projects",
    description: "Surpassed 100 successful project deliveries worldwide.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function RouteComponent() {
  return (
    <div className="relative overflow-hidden bg-background">
      {/* Hero Section */}
      <section className="relative">
        <motion.div
          className="relative w-full overflow-hidden"
          initial={{ opacity: 0, scale: 1.05 }}
          style={{ aspectRatio: "21/9" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, scale: 1 }}
        >
          <img
            alt="Our team collaborating"
            className="h-full w-full object-cover"
            src="/assets/diverse-team-planning-stockcake.webp"
          />
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-r from-background/60 via-transparent to-background/60" />
        </motion.div>

        {/* Hero Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="px-4 text-center"
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <span className="mb-4 inline-flex items-center gap-2 font-mono font-semibold text-[11px] text-primary uppercase tracking-[0.25em]">
              [ About Work Holo ]
            </span>
            <h1 className="mb-4 font-bold font-heading text-3xl text-foreground sm:text-4xl lg:text-5xl xl:text-6xl">
              About Us
            </h1>
            <p className="mx-auto max-w-xl text-muted-foreground text-sm leading-relaxed sm:text-base">
              We are a team of passionate tech experts delivering innovative IT
              solutions that help businesses grow, adapt, and thrive.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Intro / Story Section */}
      <section className="relative py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left - Content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <p className="mb-5 font-medium text-primary text-sm uppercase tracking-[0.2em]">
                [ Our Story ]
              </p>
              <h2 className="mb-6 font-bold text-3xl text-foreground leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl">
                Building the Future,
                <br />
                One Solution at a Time.
              </h2>
              <p className="mb-6 text-muted-foreground text-sm leading-relaxed">
                Founded in 2019, Work Holo began with a simple belief:
                technology should empower businesses, not complicate them. What
                started as a small team of dedicated engineers has grown into a
                global force of 30+ team members delivering transformative
                solutions.
              </p>
              <p className="mb-8 text-muted-foreground text-sm leading-relaxed">
                We partner with organizations across healthcare, finance,
                telecommunications, retail, and beyond — tailoring our expertise
                to meet unique challenges. From cloud engineering to agentic AI,
                our mission remains constant: drive innovation that creates
                lasting value.
              </p>

              {/* Stats */}
              <div className="flex items-center gap-8">
                <div>
                  <div className="font-bold text-4xl text-primary leading-none sm:text-5xl">
                    <AnimatedCounter duration={2} suffix="" target={100} />
                    <sup className="text-xl">+</sup>
                  </div>
                  <p className="mt-2 text-muted-foreground text-sm">
                    Projects Delivered
                  </p>
                </div>
                <div className="h-16 w-px bg-border/50" />
                <div>
                  <div className="font-bold text-4xl text-primary leading-none sm:text-5xl">
                    <AnimatedCounter duration={2} suffix="" target={30} />
                    <sup className="text-xl">+</sup>
                  </div>
                  <p className="mt-2 text-muted-foreground text-sm">
                    Team Members
                  </p>
                </div>
                <div className="h-16 w-px bg-border/50" />
                <div>
                  <div className="font-bold text-4xl text-primary leading-none sm:text-5xl">
                    <AnimatedCounter duration={2} suffix="" target={20} />
                    <sup className="text-xl">+</sup>
                  </div>
                  <p className="mt-2 text-muted-foreground text-sm">
                    Years Experience
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right - Image with Badge */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 40 }}
              transition={{
                duration: 0.7,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
                <img
                  alt="Work Holo office"
                  className="h-full w-full object-cover"
                  src="/assets/hero-img.jpeg"
                />
              </div>

              {/* LinkedIn Badge */}
              <motion.div
                className="absolute -right-2 -bottom-6 sm:right-6"
                initial={{ opacity: 0, scale: 0.8 }}
                transition={{
                  duration: 0.7,
                  delay: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, scale: 1 }}
              >
                <a
                  className="relative flex size-28 items-center justify-center sm:size-32"
                  href="https://www.linkedin.com/company/workholo/"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <motion.svg
                    animate={{ rotate: 360 }}
                    className="absolute inset-0 size-full"
                    transition={{
                      duration: 20,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                    viewBox="0 0 120 120"
                  >
                    <defs>
                      <path
                        d="M 60, 60 m -48, 0 a 48,48 0 1,1 96,0 a 48,48 0 1,1 -96,0"
                        id="circlePathAbout"
                      />
                    </defs>
                    <text
                      className="fill-muted-foreground uppercase tracking-widest"
                      style={{ fontSize: "9px" }}
                    >
                      <textPath href="#circlePathAbout">
                        FOLLOW US ON LINKEDIN - WORKHOLO - FOLLOW US ON LINKEDIN
                        - WORKHOLO -
                      </textPath>
                    </text>
                  </motion.svg>
                  <div className="flex size-12 items-center justify-center rounded-full bg-[#0077B5] sm:size-14">
                    <IconBrandLinkedin className="size-6 text-white sm:size-7" />
                  </div>
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="relative bg-muted/30 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-14 text-center"
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <p className="mb-5 font-medium text-primary text-sm uppercase tracking-[0.2em]">
              [ What We Stand For ]
            </p>
            <h2 className="font-bold text-3xl text-foreground leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl">
              Our Core Values
            </h2>
          </motion.div>

          <motion.div
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
            initial="hidden"
            variants={containerVariants}
            viewport={{ once: true, margin: "-50px" }}
            whileInView="visible"
          >
            {values.map((value) => (
              <motion.div
                className="group relative rounded-2xl border border-border/40 bg-card/60 p-7 transition-all duration-300 hover:border-border/70"
                key={value.title}
                transition={{ duration: 0.3 }}
                variants={itemVariants}
                whileHover={{ y: -4 }}
              >
                <div className="relative mb-8 flex size-14 items-center justify-center overflow-hidden rounded-full border border-border/50 bg-background transition-colors group-hover:border-primary/30">
                  <motion.div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-full bg-primary opacity-0 transition-all duration-500 group-hover:rotate-180 group-hover:opacity-100"
                  />
                  <value.icon
                    className="relative z-10 size-6 text-primary transition-colors duration-300 group-hover:text-white"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="mb-3 font-semibold text-foreground text-lg">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Milestones / Timeline Section */}
      <section className="relative py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-14 text-center"
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <p className="mb-5 font-medium text-primary text-sm uppercase tracking-[0.2em]">
              [ Our Journey ]
            </p>
            <h2 className="font-bold text-3xl text-foreground leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl">
              Key Milestones
            </h2>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute top-0 bottom-0 left-4 w-px bg-border/50 sm:left-1/2 sm:-translate-x-px" />

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  className={`relative flex items-start gap-8 sm:gap-0 ${
                    index % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                  }`}
                  initial={{ opacity: 0, y: 30 }}
                  key={milestone.year}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  {/* Content */}
                  <div
                    className={`flex-1 sm:px-12 ${
                      index % 2 === 0 ? "sm:text-right" : "sm:text-left"
                    }`}
                  >
                    <div className="rounded-2xl border border-border/40 bg-card/60 p-6 transition-all duration-300 hover:border-border/70 sm:p-8">
                      <span className="mb-2 inline-block font-bold text-primary text-xl">
                        {milestone.year}
                      </span>
                      <h3 className="mb-2 font-semibold text-foreground text-lg">
                        {milestone.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  {/* Dot */}
                  <div className="absolute left-4 mt-6 size-3 -translate-x-1.5 rounded-full border-2 border-background bg-primary sm:left-1/2 sm:mt-8" />

                  {/* Spacer for other side */}
                  <div className="hidden flex-1 sm:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Global Presence Section */}
      <section className="relative bg-muted/30 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <p className="mb-5 font-medium text-primary text-sm uppercase tracking-[0.2em]">
                [ Global Reach ]
              </p>
              <h2 className="mb-6 font-bold text-3xl text-foreground leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl">
                Serving Clients
                <br />
                Worldwide.
              </h2>
              <p className="mb-6 text-muted-foreground text-sm leading-relaxed">
                With teams and clients spanning multiple continents, we bring a
                global perspective to every project. Our distributed workforce
                enables round-the-clock development and support, ensuring your
                business never misses a beat.
              </p>
              <p className="mb-8 text-muted-foreground text-sm leading-relaxed">
                From startups in Silicon Valley to enterprises in Europe and
                Asia, we have helped organizations of every scale harness
                technology to achieve their ambitions.
              </p>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                    <IconWorld className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      15+ Countries
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Global Presence
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                    <IconUsers className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      100+ Clients
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Trusted Partners
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                    <IconRocket className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      24/7 Support
                    </p>
                    <p className="text-muted-foreground text-xs">Always On</p>
                  </div>
                </div>
                <a
                  className="flex items-center gap-3 transition-opacity hover:opacity-80"
                  href="https://www.linkedin.com/company/workholo/"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <div className="flex size-10 items-center justify-center rounded-full bg-[#0077B5]/10">
                    <IconBrandLinkedin className="size-5 text-[#0077B5]" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      Follow Us
                    </p>
                    <p className="text-muted-foreground text-xs">LinkedIn</p>
                  </div>
                </a>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 40 }}
              transition={{
                duration: 0.7,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border/40 bg-card">
                <img
                  alt="Global network visualization"
                  className="h-full w-full object-cover"
                  src="/assets/global-reach-globe.webp"
                />
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-primary/5" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="relative py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ContactCard />
        </div>
      </section>
    </div>
  );
}
