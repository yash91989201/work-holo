import {
  IconArrowRight,
  IconArrowUpRight,
  IconBulb,
  IconCheck,
  IconClock,
  IconRocket,
  IconSparkles,
  IconUser,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@work-holo/ui/components/accordion";
import { cn } from "@work-holo/ui/lib/utils";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import type { ProjectPageData } from "./project-data";
import { getProjectNavigationList } from "./project-data";
import { ProjectGalleryImage } from "./project-image";

interface ProjectDetailPageProps {
  data: ProjectPageData;
}

const EASE = [0.16, 1, 0.3, 1] as const;

/* ─── Reusable atoms ─────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <div className="h-px w-8 bg-primary/50" />
      <span className="font-mono font-semibold text-[10px] text-primary/70 uppercase tracking-[0.3em]">
        {children}
      </span>
    </div>
  );
}

function GradientOrb({
  className,
  color = "primary",
}: {
  className: string;
  color?: string;
}) {
  return (
    <div
      className={`pointer-events-none absolute rounded-full opacity-30 blur-[120px] ${className}`}
      style={{
        background:
          color === "primary"
            ? "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)"
            : `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      }}
    />
  );
}

/* ─── HERO ────────────────────────────────────────────────── */

function HeroSection({ data }: { data: ProjectPageData }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.6], [1, 0.96]);

  return (
    <section
      className="relative flex min-h-svh flex-col justify-center overflow-hidden"
      ref={ref}
    >
      {/* Hero Background Image */}
      {data.heroImage && (
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 z-0"
          initial={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 1.5, ease: EASE }}
        >
          <img
            alt={data.title}
            className="h-full w-full object-cover"
            src={data.heroImage}
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-background/80" />
          {/* Brand gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
        </motion.div>
      )}

      {/* Atmospheric background */}
      <GradientOrb className="-top-40 -left-40 size-150" />
      <GradientOrb
        className="top-20 -right-60 size-125"
        color="hsl(var(--primary) / 0.4)"
      />

      {/* Noise overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-[0.018]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Content — zero bottom padding so hero ends flush */}
      <motion.div
        className={cn(
          "relative z-20",
          data.heroPaddingY || "pt-0 pb-0 sm:-mt-30 sm:pb-0 lg:pt-0 lg:pb-0"
        )}
        style={{ opacity, scale }}
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 lg:py-12">
          {/* Category + meta row */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 44 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/8 px-3.5 py-1.5 font-mono font-semibold text-[10px] text-primary uppercase tracking-[0.22em]">
              <IconSparkles className="size-2.5" />
              {data.category}
            </span>

            <span className="hidden h-4 w-px bg-border/40 sm:block" />

            <span className="flex items-center gap-1.5 font-mono text-[10px] text-foreground/35 uppercase tracking-wider">
              <IconClock className="size-3" />
              {data.duration}
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-foreground/35 uppercase tracking-wider">
              <IconUser className="size-3" />
              {data.client}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 max-w-5xl font-extrabold font-heading leading-[1.04] tracking-[-0.03em]"
            initial={{ opacity: 0, y: 32 }}
            style={{ fontSize: "clamp(2rem, 5.5vw, 5rem)" }}
            transition={{ duration: 0.8, delay: 0.08, ease: EASE }}
          >
            <span className="bg-linear-to-r from-blue-400 via-blue-450 to-purple-500 bg-clip-text text-transparent">
              {data.title}
            </span>
          </motion.h1>

          {/* Subtitle with gradient */}
          {/* <motion.p
            className="mb-8 max-w-3xl font-heading font-semibold leading-[1.3] tracking-[-0.01em]"
            style={{
              fontSize: "clamp(1.1rem, 2.2vw, 1.75rem)",
              background:
                "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.55) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.16, ease: EASE }}
          >
            {data.subtitle}
          </motion.p> */}

          {/* Description */}
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="h-10 max-w-2xl text-base text-foreground/50 leading-[1.85] sm:text-lg"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.24, ease: EASE }}
          >
            {data.description}
          </motion.p>

          {/* CTA row */}
        </div>
      </motion.div>

      {/* Bottom border glow */}
      <div className="absolute right-0 bottom-0 left-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute right-0 bottom-0 left-0 h-12 bg-linear-to-t from-background to-transparent" />
    </section>
  );
}

/* ─── METRICS ─────────────────────────────────────────────── */

function MetricsStrip({ data }: { data: ProjectPageData }) {
  return (
    <section className="relative border-border/8 border-y">
      {/* Tinted stripe */}
      <div className="absolute inset-0 bg-linear-to-r from-primary/[0.03] via-primary/[0.06] to-primary/[0.03]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 divide-x divide-border/10 sm:grid-cols-4">
          {data.metrics.map((metric, index) => (
            <motion.div
              className="group px-6 py-10 text-center sm:px-8 sm:py-12 lg:py-20"
              initial={{ opacity: 0, y: 24 }}
              key={metric.label}
              transition={{ duration: 0.55, delay: index * 0.09, ease: EASE }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <div
                className="mb-2 font-extrabold font-heading text-primary tracking-[-0.03em] transition-colors"
                style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)" }}
              >
                {metric.value}
              </div>
              <div className="font-mono text-[9.5px] text-foreground/35 uppercase tracking-[0.25em]">
                {metric.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── OVERVIEW ────────────────────────────────────────────── */

function OverviewSection({ data }: { data: ProjectPageData }) {
  return (
    <section className="relative pt-7.5 pb-12 sm:pb-16 lg:pb-32">
      <GradientOrb className="top-0 right-0 size-100 translate-x-1/2 -translate-y-1/4 opacity-20" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-14">
          {/* Sticky label column */}
          <div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
            <motion.div
              initial={{ opacity: 0, x: -28 }}
              transition={{ duration: 0.7, ease: EASE }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <SectionLabel>Overview</SectionLabel>
              <h2
                className="font-bold font-heading text-foreground leading-[1.1] tracking-tight"
                style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}
              >
                The story
                <br />
                <span className="text-primary">behind it</span>
              </h2>
            </motion.div>
          </div>

          {/* Body */}
          <motion.div
            className="lg:col-span-8"
            initial={{ opacity: 0, y: 28 }}
            transition={{ duration: 0.7, delay: 0.14, ease: EASE }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <p className="text-base text-foreground/60 leading-[1.95] sm:text-[1.0625rem] sm:leading-loose">
              {data.overview}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── CHALLENGE / SOLUTION ────────────────────────────────── */

function ChallengeSolutionSection({ data }: { data: ProjectPageData }) {
  return (
    <section className="relative">
      {/* Full-bleed divider lines */}
      <div className="absolute top-0 right-0 left-0 h-px bg-linear-to-r from-transparent via-border/20 to-transparent" />
      <div className="absolute right-0 bottom-0 left-0 h-px bg-linear-to-r from-transparent via-border/20 to-transparent" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid gap-0 lg:grid-cols-2 lg:divide-x lg:divide-border/10">
          {/* Challenge */}
          <motion.div
            className="relative overflow-hidden py-12 sm:py-14 lg:py-16 lg:pr-16"
            initial={{ opacity: 0, x: -36 }}
            transition={{ duration: 0.75, ease: EASE }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-red-500/6 blur-3xl" />
            <div className="relative">
              <SectionLabel>The Challenge</SectionLabel>
              <div className="mb-4 inline-flex size-10 items-center justify-center rounded-2xl border border-red-500/15 bg-red-500/8">
                <IconBulb className="size-5 text-red-400" />
              </div>
              <h3
                className="mb-6 font-bold font-heading text-foreground leading-tight tracking-tight"
                style={{ fontSize: "clamp(1.2rem, 2.2vw, 1.6rem)" }}
              >
                What stood in the way
              </h3>
              <p className="text-foreground/55 text-sm leading-[1.9] sm:text-[0.9375rem]">
                {data.challenge}
              </p>
            </div>
          </motion.div>

          {/* Solution */}
          <motion.div
            className="relative overflow-hidden py-12 sm:py-14 lg:py-16 lg:pl-16"
            initial={{ opacity: 0, x: 36 }}
            transition={{ duration: 0.75, ease: EASE }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <div className="pointer-events-none absolute -bottom-24 -left-24 size-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="relative">
              <SectionLabel>Our Solution</SectionLabel>
              <div className="mb-4 inline-flex size-10 items-center justify-center rounded-2xl border border-primary/20 bg-primary/8">
                <IconRocket className="size-5 text-primary" />
              </div>
              <h3
                className="mb-6 font-bold font-heading text-foreground leading-tight tracking-tight"
                style={{ fontSize: "clamp(1.2rem, 2.2vw, 1.6rem)" }}
              >
                How we made it happen
              </h3>
              <p className="text-foreground/55 text-sm leading-[1.9] sm:text-[0.9375rem]">
                {data.solution}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── RESULTS ─────────────────────────────────────────────── */

function ResultsSection({ data }: { data: ProjectPageData }) {
  return (
    <section className="relative py-12 sm:py-16 lg:py-20">
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-primary/[0.025] to-transparent" />
      <GradientOrb className="top-1/2 -left-40 size-125 -translate-y-1/2 opacity-15" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <motion.div
          className="mb-10 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: EASE }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <SectionLabel>Key Results</SectionLabel>
          <h2
            className="font-bold font-heading text-foreground tracking-tight"
            style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}
          >
            Impact that speaks
          </h2>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-3 sm:gap-6 lg:gap-8">
          {data.results.map((result, index) => (
            <motion.div
              className="group relative overflow-hidden rounded-[28px] border border-border/8 bg-card/25 p-8 transition-all duration-500 hover:border-primary/20 hover:bg-card/50 sm:p-10"
              initial={{ opacity: 0, y: 32 }}
              key={result.title}
              transition={{ duration: 0.6, delay: index * 0.12, ease: EASE }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              {/* Hover glow */}
              <div className="pointer-events-none absolute -top-10 -right-10 size-40 rounded-full bg-primary/6 blur-2xl transition-all duration-500 group-hover:size-56 group-hover:bg-primary/12" />

              {/* Number line accent */}
              <div className="relative mb-4 h-px bg-linear-to-r from-primary/40 to-transparent" />

              <div className="relative">
                <div
                  className="mb-3 font-extrabold font-heading text-primary leading-none tracking-[-0.04em]"
                  style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
                >
                  {result.stat}
                </div>
                <h4 className="mb-3 font-heading font-semibold text-base text-foreground leading-snug tracking-tight">
                  {result.title}
                </h4>
                <p className="text-foreground/45 text-xs leading-[1.85] sm:text-[0.8125rem]">
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

/* ─── GALLERY ─────────────────────────────────────────────── */

function GallerySection({ data }: { data: ProjectPageData }) {
  return (
    <section className="relative py-12 sm:py-16 lg:py-20">
      {/* Top separator */}
      <div className="absolute top-0 right-0 left-0 h-px bg-linear-to-r from-transparent via-border/20 to-transparent" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <motion.div
          className="mb-8 sm:mb-10"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: EASE }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <SectionLabel>Gallery</SectionLabel>
          <h2
            className="font-bold font-heading text-foreground tracking-tight"
            style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}
          >
            A closer look
          </h2>
        </motion.div>

        {/* Uniform equal-height grid — all cards identical size */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6">
          {data.galleryImages.map((_, index) => (
            <motion.div
              className="group relative overflow-hidden rounded-2xl"
              initial={{ opacity: 0, scale: 0.97 }}
              key={index}
              style={{ aspectRatio: "16/10" }}
              transition={{ duration: 0.6, delay: index * 0.08, ease: EASE }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.012 }}
              whileInView={{ opacity: 1, scale: 1 }}
            >
              <ProjectGalleryImage
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                index={index}
                src={data.galleryImages[index]}
                title={data.title}
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FEATURES ────────────────────────────────────────────── */

function FeaturesSection({ data }: { data: ProjectPageData }) {
  return (
    <section className="relative py-12 sm:py-16 lg:py-20">
      <div className="absolute top-0 right-0 left-0 h-px bg-linear-to-r from-transparent via-border/20 to-transparent" />
      <GradientOrb className="top-1/2 -right-40 size-112.5 -translate-y-1/2 opacity-15" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-14">
          <div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, ease: EASE }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <SectionLabel>Features</SectionLabel>
              <h2
                className="font-bold font-heading text-foreground leading-tight tracking-tight"
                style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}
              >
                What we
                <br />
                <span className="text-primary">delivered</span>
              </h2>
              <p className="mt-4 text-foreground/40 text-sm leading-relaxed">
                Every feature was built with purpose, performance, and user
                experience at its core.
              </p>
            </motion.div>
          </div>

          <div className="lg:col-span-8">
            <div className="grid gap-3 sm:grid-cols-2">
              {data.features.map((feature, index) => (
                <motion.div
                  className="group flex items-start gap-3.5 rounded-2xl border border-border/6 bg-card/15 p-5 transition-all duration-300 hover:border-primary/15 hover:bg-card/35"
                  initial={{ opacity: 0, y: 16 }}
                  key={feature}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.045,
                    ease: EASE,
                  }}
                  viewport={{ once: true }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-lg bg-primary/12 transition-colors group-hover:bg-primary/20">
                    <IconCheck className="size-3.5 text-primary" />
                  </span>
                  <span className="text-foreground/70 text-sm leading-[1.75]">
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

/* ─── TECH STACK ──────────────────────────────────────────── */

function TechStackSection({ data }: { data: ProjectPageData }) {
  return (
    <section className="relative border-border/8 border-y py-12 sm:py-16">
      <div className="absolute inset-0 bg-card/20" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: EASE }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <SectionLabel>Tech Stack</SectionLabel>
          <h2
            className="font-bold font-heading text-foreground tracking-tight"
            style={{ fontSize: "clamp(1.25rem, 2.5vw, 2rem)" }}
          >
            Tools & technologies
          </h2>
        </motion.div>

        <div className="flex flex-wrap gap-2.5 sm:gap-3">
          {data.techStack.map((tech, index) => (
            <motion.span
              className="inline-flex cursor-default items-center gap-2 rounded-xl border border-border/12 bg-background/50 px-4 py-2.5 font-mono text-[0.8125rem] text-foreground/60 transition-all duration-300 hover:border-primary/25 hover:bg-primary/6 hover:text-primary"
              initial={{ opacity: 0, scale: 0.88 }}
              key={tech}
              transition={{ duration: 0.3, delay: index * 0.038, ease: EASE }}
              viewport={{ once: true }}
              whileHover={{ y: -2 }}
              whileInView={{ opacity: 1, scale: 1 }}
            >
              <span className="size-1.5 rounded-full bg-primary/50" />
              {tech}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── TIMELINE ────────────────────────────────────────────── */

function TimelineSection({ data }: { data: ProjectPageData }) {
  return (
    <section className="relative py-12 sm:py-16 lg:py-20">
      <GradientOrb className="top-1/3 -left-32 size-100 opacity-15" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <motion.div
          className="mb-10 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: EASE }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <SectionLabel>Timeline</SectionLabel>
          <h2
            className="font-bold font-heading text-foreground tracking-tight"
            style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}
          >
            From concept to launch
          </h2>
        </motion.div>

        {/* Centered vertical timeline */}
        <div className="relative mx-auto max-w-3xl">
          {/* Vertical spine */}
          <div className="absolute top-2 bottom-2 left-5.5 w-px bg-linear-to-b from-primary/40 via-primary/20 to-transparent sm:left-1/2 sm:-translate-x-px" />

          <div className="space-y-10 sm:space-y-0">
            {data.timeline.map((phase, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  className={`relative sm:grid sm:grid-cols-2 sm:gap-8 sm:py-8 ${
                    isEven ? "" : "sm:direction-rtl"
                  }`}
                  initial={{ opacity: 0, y: 28 }}
                  key={phase.title}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.12,
                    ease: EASE,
                  }}
                  viewport={{ once: true }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  {/* Center dot */}
                  <div className="absolute top-0 left-3.5 z-10 flex size-4.25 items-center justify-center rounded-full border-2 border-primary/50 bg-background sm:top-1/2 sm:left-1/2 sm:-translate-x-[8.5px] sm:-translate-y-[8.5px]">
                    <div className="size-2 rounded-full bg-primary" />
                  </div>

                  {/* Left col (label) */}
                  <div
                    className={`pb-1 pl-12 sm:pb-0 sm:pl-0 ${
                      isEven
                        ? "sm:pr-12 sm:text-right"
                        : "sm:col-start-2 sm:pl-12"
                    }`}
                  >
                    <span className="font-bold font-mono text-[9px] text-primary uppercase tracking-[0.25em]">
                      {phase.label}
                    </span>
                    <h4 className="mt-1 font-bold font-heading text-base text-foreground tracking-tight">
                      {phase.title}
                    </h4>
                  </div>

                  {/* Right col (description) */}
                  <div
                    className={`pl-12 sm:pl-0 ${
                      isEven
                        ? "sm:col-start-2 sm:pl-12"
                        : "sm:col-start-1 sm:row-start-1 sm:pr-12 sm:text-right"
                    }`}
                  >
                    <p className="text-foreground/45 text-sm leading-[1.85]">
                      {phase.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ ─────────────────────────────────────────────────── */

function FAQSection({ data }: { data: ProjectPageData }) {
  return (
    <section className="relative border-border/8 border-t py-12 sm:py-16 lg:py-20">
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-card/30 to-transparent" />
      <GradientOrb className="-right-32 bottom-0 size-100 opacity-15" />

      <div className="relative mx-auto max-w-2xl px-5 sm:px-8">
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: EASE }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <SectionLabel>FAQ</SectionLabel>
          <h2
            className="font-bold font-heading text-foreground tracking-tight"
            style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
          >
            Common questions
          </h2>
        </motion.div>

        <Accordion className="space-y-4 rounded-none border-0 bg-transparent">
          {data.faqs.map((faq, index) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              key={index}
              transition={{ duration: 0.4, delay: index * 0.07, ease: EASE }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <AccordionItem
                className="overflow-hidden rounded-[1.5rem] border border-white/10 not-last:border-b-0 bg-white/5 backdrop-blur-xl transition-colors duration-300 hover:border-primary/30 data-[state=open]:border-primary/40"
                value={`item-${index}`}
              >
                <AccordionTrigger className="group px-8 py-7 text-left font-bold font-display text-lg hover:no-underline">
                  <span className="pr-4">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-8 pb-7 text-sm text-zinc-300 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

/* ─── CTA ─────────────────────────────────────────────────── */

function CTASection() {
  return (
    <section className="relative py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <motion.div
          className="relative overflow-hidden rounded-[36px] bg-primary px-8 py-16 sm:px-16 sm:py-20 lg:px-24 lg:py-20"
          initial={{ opacity: 0, y: 32 }}
          transition={{ duration: 0.75, ease: EASE }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          {/* Decorative orbs inside CTA */}
          <div className="pointer-events-none absolute -top-20 -left-20 size-64 rounded-full bg-primary-foreground/6 blur-2xl" />
          <div className="pointer-events-none absolute -right-16 -bottom-16 size-80 rounded-full bg-primary-foreground/6 blur-2xl" />
          <div className="pointer-events-none absolute top-1/2 left-1/2 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground/4 blur-3xl" />

          {/* Grid pattern overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(to right, hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(to bottom, hsl(0 0% 100%) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          <div className="relative text-center">
            <span className="mb-5 inline-block font-mono font-semibold text-[10px] text-primary-foreground/40 uppercase tracking-[0.3em]">
              Ready to start?
            </span>
            <h2
              className="mx-auto mb-5 max-w-2xl font-bold font-heading text-primary-foreground leading-tight tracking-[-0.02em]"
              style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.75rem)" }}
            >
              Let's build something remarkable together
            </h2>
            <p className="mx-auto mb-10 max-w-lg text-primary-foreground/55 text-sm leading-[1.85] sm:text-base">
              We'd love to discuss how we can help bring your vision to life.
              Our team has extensive experience across AI, web, mobile, and
              cloud technologies.
            </p>
            <Link
              className="group inline-flex items-center gap-2.5 rounded-full bg-primary-foreground px-8 py-3.5 font-bold font-heading text-primary text-sm transition-all duration-300 hover:gap-4 hover:bg-primary-foreground/92 hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)]"
              to="/contact-us"
            >
              Start a conversation
              <IconArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── MORE PROJECTS ───────────────────────────────────────── */

function MoreProjectsSection({ currentSlug }: { currentSlug: string }) {
  const projects = getProjectNavigationList().filter(
    (project) => project.slug !== currentSlug
  );

  return (
    <section className="relative border-border/8 border-t py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Header row */}
        <div className="mb-8 flex items-end justify-between">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: EASE }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <SectionLabel>Explore</SectionLabel>
            <h2
              className="font-bold font-heading text-foreground tracking-tight"
              style={{ fontSize: "clamp(1.25rem, 2.5vw, 2rem)" }}
            >
              More projects
            </h2>
          </motion.div>

          <Link
            className="hidden items-center gap-1.5 font-mono text-[10px] text-foreground/40 uppercase tracking-widest transition-colors hover:text-primary sm:inline-flex"
            to="/projects"
          >
            View all
            <IconArrowUpRight className="size-3.5" />
          </Link>
        </div>

        {/* Project cards */}
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {projects.slice(0, 3).map((project, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              key={project.slug}
              transition={{ duration: 0.5, delay: index * 0.09, ease: EASE }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <Link
                className="group block overflow-hidden rounded-2xl border border-border/8 bg-card/20 p-6 transition-all duration-350 hover:border-primary/15 hover:bg-card/50 hover:shadow-[0_8px_40px_hsl(var(--primary)/0.08)]"
                to={project.href}
              >
                {/* Top accent line */}
                <div className="mb-5 h-px bg-linear-to-r from-primary/40 via-primary/20 to-transparent transition-all duration-350 group-hover:from-primary/70" />

                <span className="mb-3 inline-block font-mono font-semibold text-[9.5px] text-primary/55 uppercase tracking-[0.22em]">
                  {project.category}
                </span>
                <h3 className="mb-3 font-heading font-semibold text-base text-foreground leading-snug tracking-tight transition-colors group-hover:text-primary">
                  {project.title}
                </h3>
                <p className="line-clamp-2 text-foreground/38 text-xs leading-[1.8]">
                  {project.description}
                </p>

                <div className="mt-6 flex items-center gap-1.5 font-medium text-primary/50 text-xs transition-all duration-300 group-hover:gap-2.5 group-hover:text-primary">
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

/* ─── ROOT EXPORT ─────────────────────────────────────────── */

export function ProjectDetailPage({ data }: ProjectDetailPageProps) {
  return (
    <div className="relative overflow-x-hidden bg-background">
      <HeroSection data={data} />
      <OverviewSection data={data} />
      <MetricsStrip data={data} />
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
