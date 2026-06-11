import {
  IconArrowUpRight,
  IconBolt,
  IconChartBar,
  IconClock,
  IconGlobe,
  IconInfinity,
  IconMessage,
  IconShield,
  IconSparkles,
  IconUsers,
  type TablerIcon,
} from "@tabler/icons-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@work-holo/ui/components/accordion";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import type React from "react";
import { useRef } from "react";

// --- Constants & Types ---

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export interface Service {
  description: string;
  features: string[];
  icon: "infinity" | "zap" | "globe" | "shield" | "chart" | "users";
  id: string;
  number: string;
  title: string;
}

const ICON_MAP: Record<string, TablerIcon> = {
  infinity: IconInfinity,
  zap: IconBolt,
  globe: IconGlobe,
  shield: IconShield,
  chart: IconChartBar,
  users: IconUsers,
  clock: IconClock,
  arrowUpRight: IconArrowUpRight,
  message: IconMessage,
};

export interface ProcessStep {
  description: string;
  number: string;
  title: string;
}

export interface FAQItem {
  answer: string;
  id: number;
  question: string;
}

export interface StatItem {
  label: string;
  value: string;
}

export interface HeroProps {
  badge: string;
  description: string;
  headlineAccent: string;
  headlineLine1: string;
  /** Hero background image displayed behind the headline */
  image?: {
    src: string;
    alt: string;
  };
  primaryCta: { label: string; href: string };
  terminalCommand: string;
  terminalMessage: string;
}

export interface WorkflowFeature {
  description: string;
  icon: keyof typeof ICON_MAP;
  title: string;
}

export interface WorkflowProps {
  features: WorkflowFeature[];
  /**
   * NEW: optional image to display on the right side of the workflow section.
   * If omitted, falls back to the terminal simulator.
   */
  showcaseImage?: {
    src: string;
    alt: string;
  };
  subtitle: string;
  terminal: {
    initCommand: string;
    preparingMessage: string;
    optimizingLabel: string;
    successLines: string[];
    latencyLabel: string;
    latencyValue: string;
    latencyUnit: string;
  };
  title: string;
}

export interface ServicesProps {
  description: string;
  items: Service[];
  subtitle: string;
  title: string;
  viewAllLabel?: string;
}

export interface FAQProps {
  items: FAQItem[];
  subtitle: string;
  title: string;
}

export interface CTAProps {
  footnote: string;
  headlineAccent: string;
  headlineLine1: string;
  primaryLabel: string;
  secondaryLabel: string;
}

// --- Image Section Types ---

export interface ImageSectionBullet {
  detail: string;
  label: string;
}

export interface ImageSectionProps {
  bullets: ImageSectionBullet[];
  closingText?: string;
  cta?: { label: string; href: string };
  description: string;
  imageAlt: string;
  imagePosition: "left" | "right";
  imageSrc: string;
  title: string;
}

export interface WebPageProps {
  cta: CTAProps;
  faq: FAQProps;
  hero: HeroProps;
  imageSections?: ImageSectionProps[];
  services: ServicesProps;
  stats: StatItem[];
  workflow: WorkflowProps;
}

// --- Components ---

const MagneticButton: React.FC<{
  children: React.ReactNode;
  className?: string;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
}> = ({ children, className = "", href = "#", variant = "primary" }) => {
  const btnRef = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!btnRef.current) return;
    const { left, top, width, height } = btnRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((e.clientX - centerX) * 0.4);
    y.set((e.clientY - centerY) * 0.4);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const variants = {
    primary:
      "bg-brand hover:bg-brand-light text-white shadow-[0_0_20px_rgba(124,58,237,0.4)]",
    secondary: "glass text-white hover:bg-white/10",
    ghost: "text-zinc-200 hover:text-white transition-colors",
  };

  return (
    <motion.a
      className={`relative inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 font-bold text-sm tracking-tight transition-all duration-300 ${variants[variant]} ${className}`}
      href={href}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      ref={btnRef}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.a>
  );
};

const SpotlightCard: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { left, top } = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  return (
    <motion.div
      className={`group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-colors duration-500 hover:border-brand/60 hover:bg-white/10 ${className}`}
      onMouseMove={handleMouseMove}
      ref={containerRef}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) =>
              `radial-gradient(600px circle at ${x}px ${y}px, rgba(124, 58, 237, 0.15), transparent 40%)`
          ),
        }}
      />
      {children}
    </motion.div>
  );
};

const SectionHeader: React.FC<{
  subtitle: string;
  title: string;
  description?: string;
  alignment?: "center" | "left";
}> = ({ subtitle, title, description, alignment = "center" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <div
      className={`mb-24 ${alignment === "center" ? "mx-auto text-center" : "text-left"}`}
      ref={ref}
    >
      <motion.div
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/20 px-3 py-1 font-bold text-[10px] text-brand-light uppercase tracking-[0.2em]"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <IconSparkles size={12} />
        {subtitle}
      </motion.div>
      <motion.h2
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        className="mb-6 font-bold font-display text-4xl leading-[1.1] tracking-tight md:text-6xl"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="mx-auto max-w-2xl text-lg text-zinc-300"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
};

const ServiceCard: React.FC<{ service: Service }> = ({ service }) => {
  const Icon = ICON_MAP[service.icon] || IconInfinity;
  return (
    <SpotlightCard className="flex h-full flex-col">
      <div className="mb-8 flex items-start justify-between">
        <motion.div
          className="flex h-14 w-14 items-center justify-center rounded-2xl border border-brand/20 bg-brand/20 text-brand-light transition-all duration-500 group-hover:bg-brand/20 group-hover:shadow-[0_0_20px_rgba(124,58,237,0.3)]"
          whileHover={{ rotate: 10, scale: 1.1 }}
        >
          <Icon size={28} />
        </motion.div>
        <span className="font-bold font-display text-lg text-white/10 tracking-widest">
          {service.number}
        </span>
      </div>

      <h3 className="mb-4 font-bold font-display text-2xl transition-colors group-hover:text-brand-light">
        {service.title}
      </h3>
      <p className="mb-8 text-sm text-zinc-300 leading-relaxed">
        {service.description}
      </p>

      <ul className="mb-10 grow space-y-3">
        {service.features?.map((feature) => (
          <li
            className="flex items-center gap-3 text-sm text-zinc-200 transition-colors group-hover:text-zinc-200"
            key={feature}
          >
            <div className="h-1 w-1 rounded-full bg-brand" />
            {feature}
          </li>
        ))}
      </ul>
    </SpotlightCard>
  );
};

const ImageSection: React.FC<ImageSectionProps & { index: number }> = ({
  title,
  description,
  bullets,
  closingText,
  imageSrc,
  imageAlt,
  imagePosition,
  cta,
  index,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const isImageLeft = imagePosition === "left";

  const ImageBlock = (
    <motion.div
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      className="relative w-full"
      initial={{ opacity: 0, x: isImageLeft ? -60 : 60 }}
      transition={{ duration: 1, ease: EASE, delay: 0.1 }}
    >
      <div className="pointer-events-none absolute -inset-4 rounded-[2.5rem] bg-brand/10 blur-[60px]" />
      <div className="group relative overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl">
        <img
          alt={imageAlt}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          src={imageSrc}
          style={{ aspectRatio: "4/3" }}
        />
        <div
          className={`absolute inset-0 bg-gradient-to-${
            isImageLeft ? "r" : "l"
          } pointer-events-none from-transparent via-transparent to-[#0a0a0f]/60`}
        />
      </div>
    </motion.div>
  );

  const TextBlock = (
    <motion.div
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      className="flex flex-col justify-center"
      initial={{ opacity: 0, x: isImageLeft ? 60 : -60 }}
      ref={ref}
      transition={{ duration: 1, ease: EASE }}
    >
      <h2 className="mb-6 font-bold font-display text-3xl leading-[1.1] tracking-tight md:text-5xl">
        {title}
      </h2>

      <p className="mb-8 text-base text-zinc-300 leading-relaxed">
        {description}
      </p>

      {bullets && bullets.length > 0 && (
        <ol className="mb-8 space-y-5">
          {bullets.map((b, i) => (
            <motion.li
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              className="flex items-start gap-4"
              initial={{ opacity: 0, x: -20 }}
              key={i}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1, ease: EASE }}
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-brand/30 bg-brand/20 font-bold text-[11px] text-brand-light">
                {i + 1}
              </span>
              <div>
                <span className="font-bold text-white">{b.label}</span>
                {b.detail && (
                  <span className="text-sm text-zinc-300">: {b.detail}</span>
                )}
              </div>
            </motion.li>
          ))}
        </ol>
      )}

      {closingText && (
        <p className="mb-8 border-brand/40 border-l-2 pl-4 text-sm text-zinc-400 italic leading-relaxed">
          {closingText}
        </p>
      )}

      {cta && (
        <MagneticButton className="w-fit" href={cta.href} variant="primary">
          {cta.label} <IconArrowUpRight size={16} />
        </MagneticButton>
      )}
    </motion.div>
  );

  return (
    <section
      className={`px-6 py-32 ${
        index % 2 === 0 ? "bg-white/2" : ""
      } relative overflow-hidden`}
    >
      <div
        className={`absolute top-1/2 -translate-y-1/2 ${
          isImageLeft ? "left-0" : "right-0"
        } pointer-events-none h-96 w-96 rounded-full bg-brand/5 blur-[120px]`}
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div
          className={`grid items-center gap-16 lg:grid-cols-2 xl:gap-24 ${
            isImageLeft ? "" : "lg:[&>*:first-child]:order-2"
          }`}
        >
          {isImageLeft ? (
            <>
              {ImageBlock}
              {TextBlock}
            </>
          ) : (
            <>
              {TextBlock}
              {ImageBlock}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default function BPOPage(props: WebPageProps) {
  const { hero, stats, services, workflow, faq, imageSections = [] } = props;

  const containerRef = useRef<HTMLDivElement>(null);

  const midpoint = Math.ceil(imageSections.length / 2);
  const earlyImageSections = imageSections.slice(0, midpoint);
  const lateImageSections = imageSections.slice(midpoint);

  return (
    <div className="relative min-h-screen bg-[#0a0a0f]" ref={containerRef}>
      {/* Background Ambience */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] h-[60%] w-[60%] animate-pulse rounded-full bg-brand/20 blur-[150px]" />
        <div className="absolute right-[-10%] bottom-[-10%] h-[50%] w-[50%] rounded-full bg-blue-500/10 blur-[150px]" />
        <div className="grid-background absolute inset-0 opacity-20" />
      </div>

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero */}
        <section className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 pt-40 pb-32">
          {/* Hero Background Image */}
          {hero.image && (
            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 z-0"
              initial={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 1.5, ease: EASE }}
            >
              <img
                alt={hero.image.alt}
                className="h-full w-full object-cover"
                src={hero.image.src}
              />
              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-[#0a0a0f]/80" />
              {/* Brand gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/40 via-[#0a0a0f]/60 to-[#0a0a0f]" />
            </motion.div>
          )}

          <div className="relative z-10 mx-auto w-full max-w-7xl text-center">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="glass mb-10 inline-flex items-center gap-2 rounded-full border-brand/20 px-4 py-2"
              initial={{ opacity: 0, y: 30 }}
              transition={{ duration: 1, ease: EASE }}
            >
              <div className="h-1.5 w-1.5 animate-ping rounded-full bg-brand" />
              <span className="font-bold text-[10px] text-brand-light uppercase tracking-[0.2em]">
                {hero.badge}
              </span>
            </motion.div>

            <motion.h1 className="mb-12 font-bold font-display text-6xl leading-[0.9] tracking-tighter md:text-8xl lg:text-8xl">
              {hero.headlineLine1.split(" ").map((word, i) => (
                <motion.span
                  animate={{ opacity: 1, y: 0 }}
                  className="mr-[0.2em] inline-block"
                  initial={{ opacity: 0, y: 40 }}
                  key={i}
                  transition={{
                    duration: 0.8,
                    delay: 0.1 + i * 0.1,
                    ease: EASE,
                  }}
                >
                  {word}
                </motion.span>
              ))}
              <br />
              <motion.span
                animate={{ opacity: 1, y: 0 }}
                className="inline-block bg-linear-to-r from-brand to-blue-400 bg-clip-text text-glow text-transparent"
                initial={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.8, delay: 0.6, ease: EASE }}
              >
                {hero.headlineAccent}
              </motion.span>
            </motion.h1>

            <motion.p
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto mb-16 max-w-3xl text-lg text-zinc-200 leading-relaxed md:text-xl"
              initial={{ opacity: 0, y: 30 }}
              transition={{ duration: 1, delay: 0.2, ease: EASE }}
            >
              {hero.description}
            </motion.p>

            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center gap-6 sm:flex-row"
              initial={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
            >
              <MagneticButton
                className="px-10 py-6 text-base"
                href={hero.primaryCta.href}
              >
                {hero.primaryCta.label} <IconArrowUpRight size={18} />
              </MagneticButton>
            </motion.div>
          </div>

          {/* Floating UI Elements */}
        </section>

        {/* Stats Section */}
        <section className="border-white/10 border-y bg-white/[0.02] py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-2 gap-12 text-center md:grid-cols-4">
              {stats.map((stat, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  key={i}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  <div className="mb-2 font-bold font-display text-3xl md:text-5xl">
                    {stat.value}
                  </div>
                  <div className="font-bold text-xs text-zinc-300 uppercase tracking-widest">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Early Image Sections */}
        {earlyImageSections.map((section, i) => (
          <ImageSection key={`early-${i}`} {...section} index={i} />
        ))}

        {/* Services Section */}
        <section className="mx-auto max-w-7xl px-6 py-20" id="solutions">
          <SectionHeader
            alignment="center"
            description={services.description}
            subtitle={services.subtitle}
            title={services.title}
          />

          <div className="grid gap-8 md:grid-cols-3">
            {services.items.map((service, i) => (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                key={service.id}
                transition={{ duration: 0.8, delay: i * 0.2, ease: EASE }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <ServiceCard service={service} />
              </motion.div>
            ))}
          </div>

          <div className="mt-24 text-center">
            <MagneticButton className="group" variant="ghost">
              {services.viewAllLabel}
              <IconArrowUpRight
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                size={16}
              />
            </MagneticButton>
          </div>
        </section>

        {/* Workflow Showcase */}
        <section className="relative overflow-hidden bg-white/[0.03] px-6 py-36">
          <div className="pointer-events-none absolute top-1/2 left-1/2 h-200 w-200 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/5 blur-[120px]" />

          <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-24 lg:grid-cols-2">
            {/* Left: feature list */}
            <div>
              <SectionHeader
                alignment="left"
                subtitle={workflow.subtitle}
                title={workflow.title}
              />
              <div className="space-y-12">
                {workflow.features.map((item, i) => {
                  const Icon = ICON_MAP[item.icon] || IconBolt;
                  return (
                    <motion.div
                      className="group flex items-start gap-6"
                      initial={{ opacity: 0, x: -30 }}
                      key={i}
                      transition={{ duration: 0.6, delay: i * 0.1 }}
                      viewport={{ once: true }}
                      whileInView={{ opacity: 1, x: 0 }}
                    >
                      <div className="mt-1 flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-brand-light transition-all duration-300 group-hover:bg-brand">
                        <Icon size={24} />
                      </div>
                      <div>
                        <h4 className="mb-2 font-bold font-display text-xl">
                          {item.title}
                        </h4>
                        <p className="max-w-sm text-sm text-zinc-300 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Right: Image (replaces terminal) */}
            <div className="relative">
              <motion.div
                className="group overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-4 shadow-3xl backdrop-blur-xl"
                initial={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 1, ease: EASE }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, scale: 1 }}
              >
                <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10">
                  <img
                    alt={workflow.showcaseImage?.alt}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src={workflow.showcaseImage?.src}
                  />
                  {/* Subtle brand-tinted overlay */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand/20 via-transparent to-blue-500/10 opacity-40 transition-opacity duration-500 group-hover:opacity-60" />
                </div>
              </motion.div>

              {/* Decorative Blur */}
              <div className="pointer-events-none absolute -top-12 -right-12 h-64 w-64 rounded-full bg-brand/20 blur-[100px]" />
            </div>
          </div>
        </section>

        {/* Late Image Sections */}
        {lateImageSections.map((section, i) => (
          <ImageSection
            key={`late-${i}`}
            {...section}
            index={earlyImageSections.length + i}
          />
        ))}

        {/* FAQ Section */}
        <section className="mx-auto max-w-4xl px-6 py-24">
          <SectionHeader
            alignment="center"
            subtitle={faq.subtitle}
            title={faq.title}
          />
          <Accordion className="space-y-4 rounded-none border-0 bg-transparent">
            {faq.items.map((item, i) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                key={item.id}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <AccordionItem
                  className="overflow-hidden rounded-[1.5rem] border border-white/10 not-last:border-b-0 bg-white/5 backdrop-blur-xl transition-colors duration-300 hover:border-brand/30 data-[state=open]:border-brand/40"
                  value={`faq-${item.id}`}
                >
                  <AccordionTrigger className="group px-8 py-7 text-left font-bold font-display text-lg hover:no-underline">
                    <span className="pr-4">{item.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-8 pb-7 text-sm text-zinc-300 leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </section>
      </main>
    </div>
  );
}
