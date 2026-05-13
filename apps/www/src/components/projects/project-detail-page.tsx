import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import type { ProjectPageData } from "./project-data";
import { getProjectList } from "./project-data";
import { ProjectGalleryImage, ProjectImage } from "./project-image";

import {
  IconArrowRight,
  IconArrowUpRight,
  IconCheck,
  IconClock,
  IconLine,
  IconUser,
} from "@tabler/icons-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@work-holo/ui/components/accordion";

interface ProjectDetailPageProps {
  data: ProjectPageData;
}

const EASE = [0.22, 1, 0.36, 1] as const;

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-4 inline-flex items-center gap-2 font-mono font-semibold text-[11px] text-primary uppercase tracking-[0.25em]">
      <IconLine className="size-3" />
      {children}
    </span>
  );
}

function HeroSection({ data }: { data: ProjectPageData }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    /* pt-16 or pt-20 offsets the fixed navbar height so hero content is never hidden behind it */
    <section
      className="relative min-h-[100svh] overflow-hidden pt-16 lg:pt-"
      ref={ref}
    >
      {/* Parallax background */}
      {/* <motion.div className="absolute inset-0" style={{ y }}>
        <ProjectImage
          aspectRatio="auto"
          className="h-[115%] w-full object-cover"
          title={data.title}
        /> */}
        {/* Layered overlays for legibility */}
        {/* <div className="absolute inset-0 bg-background/75 backdrop-blur-[3px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-background/50" />
      </motion.div> */}

      {/* Decorative grid lines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Subtle bottom glow on mobile only */}
      <div className="pointer-events-none absolute bottom-0 left-0 h-1/2 w-full bg-gradient-to-t from-primary/[0.07] to-transparent sm:hidden" />

      {/* Hero content */}
      <motion.div
        className="relative"
        style={{ opacity }}
      >
        <div className="py-12 sm:py-20 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.85, ease: EASE }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            {/* Meta badges — compact on mobile */}
            <div className="mb-4 flex flex-wrap items-center gap-2 sm:mb-6 sm:gap-2.5">
              <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono font-semibold text-[9px] text-primary uppercase tracking-widest sm:px-3.5 sm:text-[10px]">
                {data.category}
              </span>
              <span className="flex items-center gap-1 font-mono text-[9px] text-foreground/40 uppercase tracking-widest sm:gap-1.5 sm:text-[10px]">
                <IconClock className="size-2.5 sm:size-3" />
                {data.duration}
              </span>
              <span className="flex items-center gap-1 font-mono text-[9px] text-foreground/40 uppercase tracking-widest sm:gap-1.5 sm:text-[10px]">
                <IconUser className="size-2.5 sm:size-3" />
                {data.client}
              </span>
            </div>

            {/* Title — mobile: text-2xl, scales up gracefully */}
            <h1 className="mb-3 max-w-4xl font-extrabold font-heading text-[1.65rem] text-foreground leading-[1.08] tracking-tight sm:mb-5 sm:text-4xl md:text-5xl lg:text-6xl">
              {data.title}
            </h1>

            {/* Subtitle — mobile: text-base/lg, keeps gradient accent */}
            <p className="mb-3 max-w-3xl bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text font-heading font-bold text-lg text-transparent leading-snug sm:mb-6 sm:text-2xl md:text-3xl">
              {data.subtitle}
            </p>

            {/* Description — clamp to 3 lines on mobile so it doesn't dominate */}
            <p className="line-clamp-3 max-w-2xl text-sm text-foreground/50 leading-relaxed sm:line-clamp-none sm:text-base sm:text-foreground/55">
              {data.description}
            </p>
          </motion.div>
        </div>
      </motion.div>

      <div className="absolute right-0 bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </section>
  );
}

function MetricsStrip({ data }: { data: ProjectPageData }) {
  return (
    <section className="relative border-border/10 border-y bg-card/50">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.02] via-transparent to-primary/[0.02]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 divide-x divide-border/10 sm:grid-cols-4">
          {data.metrics.map((metric, index) => (
            <motion.div
              className="px-4 py-8 text-center sm:px-6 sm:py-10 lg:py-12"
              initial={{ opacity: 0, y: 20 }}
              key={metric.label}
              transition={{ duration: 0.6, delay: index * 0.1, ease: EASE }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <div className="mb-1 font-extrabold font-heading text-3xl text-primary tracking-tight sm:text-4xl">
                {metric.value}
              </div>
              <div className="font-medium font-mono text-[10px] text-foreground/40 uppercase tracking-[0.2em]">
                {metric.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OverviewSection({ data }: { data: ProjectPageData }) {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.7, ease: EASE }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <SectionLabel>Overview</SectionLabel>
              <h2 className="font-bold font-heading text-2xl text-foreground tracking-tight sm:text-3xl">
                The story behind
                <br />
                <span className="text-primary">{data.title}</span>
              </h2>
            </motion.div>
          </div>
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <p className="text-base text-foreground/70 leading-[1.8] sm:text-lg sm:leading-[1.9]">
                {data.overview}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChallengeSolutionSection({ data }: { data: ProjectPageData }) {
  return (
    <section className="relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-0 divide-y divide-border/10 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
          <motion.div
            className="relative overflow-hidden p-8 sm:p-12 lg:p-16"
            initial={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.8, ease: EASE }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <div className="pointer-events-none absolute -top-20 -right-20 size-60 rounded-full bg-red-500/5 blur-3xl" />
            <div className="relative">
              <SectionLabel>The Challenge</SectionLabel>
              <h3 className="mb-6 font-bold font-heading text-xl text-foreground sm:text-2xl">
                What stood in the way
              </h3>
              <p className="text-foreground/60 text-sm leading-relaxed sm:text-base">
                {data.challenge}
              </p>
            </div>
          </motion.div>

          <motion.div
            className="relative overflow-hidden bg-primary/[0.02] p-8 sm:p-12 lg:p-16"
            initial={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.8, ease: EASE }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <div className="pointer-events-none absolute -bottom-20 -left-20 size-60 rounded-full bg-primary/10 blur-3xl" />
            <div className="relative">
              <SectionLabel>Our Solution</SectionLabel>
              <h3 className="mb-6 font-bold font-heading text-xl text-foreground sm:text-2xl">
                How we made it happen
              </h3>
              <p className="text-foreground/60 text-sm leading-relaxed sm:text-base">
                {data.solution}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ResultsSection({ data }: { data: ProjectPageData }) {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: EASE }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <SectionLabel>Key Results</SectionLabel>
          <h2 className="font-bold font-heading text-2xl text-foreground tracking-tight sm:text-3xl">
            Impact that speaks
          </h2>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-3 sm:gap-6">
          {data.results.map((result, index) => (
            <motion.div
              className="group relative overflow-hidden rounded-3xl border border-border/10 bg-card/30 p-6 transition-all duration-500 hover:border-primary/20 hover:bg-card/60 sm:p-8"
              initial={{ opacity: 0, y: 30 }}
              key={result.title}
              transition={{ duration: 0.6, delay: index * 0.12, ease: EASE }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <div className="pointer-events-none absolute -top-8 -right-8 size-32 rounded-full bg-primary/5 blur-2xl transition-all duration-500 group-hover:size-40 group-hover:bg-primary/10" />
              <div className="relative">
                <div className="mb-3 font-extrabold font-heading text-4xl text-primary sm:text-5xl">
                  {result.stat}
                </div>
                <h4 className="mb-2 font-heading font-semibold text-foreground text-base">
                  {result.title}
                </h4>
                <p className="text-foreground/50 text-xs leading-relaxed sm:text-sm">
                  {result.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GallerySection({ data }: { data: ProjectPageData }) {
  return (
    <section className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: EASE }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <SectionLabel>Gallery</SectionLabel>
          <h2 className="font-bold font-heading text-2xl text-foreground tracking-tight sm:text-3xl">
            A closer look
          </h2>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
          {data.galleryImages.map((_, index) => (
            <motion.div
              className="group overflow-hidden rounded-2xl"
              key={index}
              transition={{ duration: 0.4, ease: EASE }}
              whileHover={{ scale: 1.02 }}
            >
              <ProjectGalleryImage
                className="aspect-4/3 w-full transition-transform duration-700 group-hover:scale-105"
                index={index}
                title={data.title}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection({ data }: { data: ProjectPageData }) {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, ease: EASE }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <SectionLabel>Features</SectionLabel>
              <h2 className="font-bold font-heading text-2xl text-foreground tracking-tight sm:text-3xl">
                What we
                <br />
                delivered
              </h2>
            </motion.div>
          </div>
          <div className="lg:col-span-8">
            <div className="grid gap-3 sm:grid-cols-2">
              {data.features.map((feature, index) => (
                <motion.div
                  className="flex items-start gap-3 rounded-xl border border-border/5 bg-card/20 p-4 transition-colors hover:border-primary/10 hover:bg-card/40"
                  initial={{ opacity: 0, y: 15 }}
                  key={feature}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.05,
                    ease: EASE,
                  }}
                  viewport={{ once: true }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-primary/10">
                    <IconCheck className="size-3 text-primary" />
                  </span>
                  <span className="text-foreground/80 text-sm leading-relaxed">
                    {feature}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TechStackSection({ data }: { data: ProjectPageData }) {
  return (
    <section className="relative border-border/10 border-y bg-card/30 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: EASE }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <SectionLabel>Tech Stack</SectionLabel>
          <h2 className="font-bold font-heading text-xl text-foreground tracking-tight sm:text-2xl">
            Tools & technologies
          </h2>
        </motion.div>

        <div className="flex flex-wrap gap-3">
          {data.techStack.map((tech, index) => (
            <motion.span
              className="inline-flex items-center gap-2 rounded-xl border border-border/15 bg-background/60 px-4 py-2.5 font-mono text-foreground/70 text-sm transition-all duration-300 hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
              initial={{ opacity: 0, scale: 0.9 }}
              key={tech}
              transition={{
                duration: 0.3,
                delay: index * 0.04,
                ease: EASE,
              }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, scale: 1 }}
            >
              <IconCheck className="size-3.5 text-primary/60" />
              {tech}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineSection({ data }: { data: ProjectPageData }) {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: EASE }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <SectionLabel>Timeline</SectionLabel>
          <h2 className="font-bold font-heading text-2xl text-foreground tracking-tight sm:text-3xl">
            From concept to launch
          </h2>
        </motion.div>

        <div className="relative">
          <div className="absolute top-0 bottom-0 left-[18px] w-px bg-border/20 sm:left-1/2 sm:-translate-x-px" />

          <div className="space-y-12">
            {data.timeline.map((phase, index) => (
              <motion.div
                className="relative grid gap-6 sm:grid-cols-2 sm:gap-12"
                initial={{ opacity: 0, y: 30 }}
                key={phase.title}
                transition={{ duration: 0.6, delay: index * 0.15, ease: EASE }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div
                  className={`flex items-start gap-4 sm:flex-row-reverse sm:text-right ${
                    index % 2 === 0 ? "" : "sm:flex-row"
                  }`}
                >
                  <div className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-primary/30 bg-background">
                    <div className="size-3 rounded-full bg-primary" />
                  </div>
                  <div className={index % 2 === 0 ? "sm:text-right" : ""}>
                    <span className="font-bold font-mono text-[10px] text-primary uppercase tracking-[0.2em]">
                      {phase.label}
                    </span>
                    <h4 className="mt-1 font-bold font-heading text-foreground text-base">
                      {phase.title}
                    </h4>
                  </div>
                </div>
                <div
                  className={`pl-13 sm:pl-0 ${
                    index % 2 === 0
                      ? "sm:col-start-2"
                      : "sm:col-start-1 sm:text-right"
                  }`}
                >
                  <p className="text-foreground/50 text-sm leading-relaxed">
                    {phase.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQSection({ data }: { data: ProjectPageData }) {
  const [openFAQ, setOpenFAQ] = useState<string[]>(["item-0"]);

  return (
    <section className="relative border-border/10 border-t py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: EASE }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="font-bold font-heading text-2xl text-foreground tracking-tight sm:text-3xl">
            Common questions
          </h2>
        </motion.div>

        <Accordion onValueChange={(value) => setOpenFAQ(value)} value={openFAQ}>
          {data.faqs.map((faq, index) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              key={index}
              transition={{ duration: 0.4, delay: index * 0.08, ease: EASE }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <AccordionItem
                className="border-border/10 border-b last:border-b-0"
                value={`item-${index}`}
              >
                <AccordionTrigger className="py-5 pr-4 text-left font-heading font-semibold text-foreground text-sm hover:no-underline sm:text-base">
                  <span className="pr-4">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <p className="text-foreground/50 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 text-center sm:px-16 sm:py-20"
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: EASE }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="pointer-events-none absolute -top-32 -left-32 size-64 rounded-full bg-primary-foreground/5" />
          <div className="pointer-events-none absolute -right-24 -bottom-24 size-80 rounded-full bg-primary-foreground/5" />
          <div className="pointer-events-none absolute top-1/3 left-1/2 size-96 -translate-x-1/2 rounded-full bg-primary-foreground/5 blur-3xl" />

          <div className="relative">
            <span className="mb-4 inline-block font-mono font-semibold text-[11px] text-primary-foreground/50 uppercase tracking-[0.25em]">
              Ready to start?
            </span>
            <h2 className="mx-auto mb-5 max-w-2xl font-bold font-heading text-2xl text-primary-foreground sm:text-3xl lg:text-4xl">
              Let&apos;s build something remarkable together
            </h2>
            <p className="mx-auto mb-10 max-w-lg text-primary-foreground/60 text-sm leading-relaxed sm:text-base">
              We&apos;d love to discuss how we can help bring your vision to
              life. Our team has extensive experience across AI, web, mobile,
              and cloud technologies.
            </p>
            <Link
              className="inline-flex items-center gap-2 rounded-full bg-primary-foreground px-8 py-3.5 font-bold font-heading text-primary text-sm transition-all duration-300 hover:gap-3 hover:bg-primary-foreground/90"
              to="/contact-us"
            >
              Start a conversation
              <IconArrowRight className="size-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function MoreProjectsSection({ currentSlug }: { currentSlug: string }) {
  const projects = getProjectList(currentSlug).filter((p) => !p.isActive);

  return (
    <section className="relative border-border/10 border-t py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: EASE }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <SectionLabel>Explore</SectionLabel>
            <h2 className="font-bold font-heading text-xl text-foreground tracking-tight sm:text-2xl">
              More projects
            </h2>
          </motion.div>
          <Link
            className="hidden items-center gap-1.5 font-medium text-foreground/60 text-sm transition-colors hover:text-primary sm:inline-flex"
            to="/projects"
          >
            View all
            <IconArrowUpRight className="size-3.5" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, 3).map((project, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              key={project.slug}
              transition={{ duration: 0.5, delay: index * 0.1, ease: EASE }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <Link
                className="group block overflow-hidden rounded-2xl border border-border/10 bg-card/30 p-5 transition-all duration-300 hover:border-primary/15 hover:bg-card/60"
                to={project.href}
              >
                <span className="mb-2 inline-block font-mono font-semibold text-[10px] text-primary/60 uppercase tracking-[0.2em]">
                  {project.category}
                </span>
                <h3 className="mb-2 font-heading font-semibold text-base text-foreground transition-colors group-hover:text-primary">
                  {project.title}
                </h3>
                <p className="line-clamp-2 text-foreground/40 text-xs leading-relaxed">
                  {project.description}
                </p>
                <div className="mt-4 flex items-center gap-1 font-medium text-primary/60 text-xs transition-all duration-300 group-hover:gap-2 group-hover:text-primary">
                  View case study
                  <IconArrowRight className="size-3" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProjectDetailPage({ data }: ProjectDetailPageProps) {
  return (
    <div className="relative overflow-hidden bg-background">
      <HeroSection data={data} />
      <MetricsStrip data={data} />
      <OverviewSection data={data} />
      <ChallengeSolutionSection data={data} />
      <ResultsSection data={data} />
      <GallerySection data={data} />
      <FeaturesSection data={data} />
      <TechStackSection data={data} />
      <TimelineSection data={data} />
      <FAQSection data={data} />
      <CTASection />
      <MoreProjectsSection currentSlug={data.slug} />
    </div>
  );
}