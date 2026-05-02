import React, { useEffect, useRef, useState } from "react";

import {
  IconChevronDown,
  IconInfinity,
  IconArrowUp,
  IconClock,
  IconArrowUpRight,
  IconBolt,
  IconGlobe,
  IconShield,
  IconChartBar,
  IconUsers,
  IconMessage,
  IconSparkles,
  IconCheck,
} from "@tabler/icons-react";

import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  useMotionValue,
} from "framer-motion";

// --- Constants & Types ---

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export interface Service {
  id: string;
  number: string;
  title: string;
  description: string;
  features: string[];
  icon: "infinity" | "zap" | "globe" | "shield" | "chart" | "users";
}

const ICON_MAP: Record<string, any> = {
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
  number: string;
  title: string;
  description: string;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export interface StatItem {
  label: string;
  value: string;
}

export interface HeroProps {
  badge: string;
  headlineLine1: string;
  headlineAccent: string;
  description: string;
  primaryCta: { label: string; href: string };
  terminalCommand: string;
  terminalMessage: string;
}

export interface WorkflowFeature {
  icon: keyof typeof ICON_MAP;
  title: string;
  description: string;
}

export interface WorkflowProps {
  subtitle: string;
  title: string;
  features: WorkflowFeature[];
  /**
   * NEW: optional image to display on the right side of the workflow section.
   * If omitted, falls back to the terminal simulator.
   */
  showcaseImage?: {
    src: string;
    alt: string;
  };
  terminal: {
    initCommand: string;
    preparingMessage: string;
    optimizingLabel: string;
    successLines: string[];
    latencyLabel: string;
    latencyValue: string;
    latencyUnit: string;
  };
}

export interface ServicesProps {
  subtitle: string;
  title: string;
  description: string;
  items: Service[];
  viewAllLabel: string;
}

export interface FAQProps {
  subtitle: string;
  title: string;
  items: FAQItem[];
}

export interface CTAProps {
  headlineLine1: string;
  headlineAccent: string;
  primaryLabel: string;
  secondaryLabel: string;
  footnote: string;
}

// --- Image Section Types ---

export interface ImageSectionBullet {
  label: string;
  detail: string;
}

export interface ImageSectionProps {
  title: string;
  description: string;
  bullets: ImageSectionBullet[];
  closingText?: string;
  imageSrc: string;
  imageAlt: string;
  imagePosition: "left" | "right";
  cta?: { label: string; href: string };
}

export interface WebPageProps {
  hero: HeroProps;
  stats: StatItem[];
  services: ServicesProps;
  workflow: WorkflowProps;
  faq: FAQProps;
  cta: CTAProps;
  imageSections?: ImageSectionProps[];
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
      ref={btnRef}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.95 }}
      className={`relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-sm tracking-tight transition-all duration-300 ${variants[variant]} ${className}`}
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
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`relative group bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] overflow-hidden hover:border-brand/60 hover:bg-white/10 transition-colors duration-500 ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
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
      ref={ref}
      className={`mb-24 ${alignment === "center" ? "text-center mx-auto" : "text-left"}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: EASE }}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/20 border border-brand/20 text-brand-light text-[10px] font-bold uppercase tracking-[0.2em] mb-6"
      >
        <IconSparkles size={12} />
        {subtitle}
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
        className="text-4xl md:text-6xl font-display font-bold leading-[1.1] tracking-tight mb-6"
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          className="text-zinc-300 text-lg max-w-2xl mx-auto"
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
    <SpotlightCard className="h-full flex flex-col">
      <div className="flex justify-between items-start mb-8">
        <motion.div
          whileHover={{ rotate: 10, scale: 1.1 }}
          className="w-14 h-14 rounded-2xl bg-brand/20 border border-brand/20 flex items-center justify-center text-brand-light group-hover:bg-brand/20 group-hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all duration-500"
        >
          <Icon size={28} />
        </motion.div>
        <span className="text-white/10 font-display font-bold text-lg tracking-widest">
          {service.number}
        </span>
      </div>

      <h3 className="text-2xl font-display font-bold mb-4 group-hover:text-brand-light transition-colors">
        {service.title}
      </h3>
      <p className="text-zinc-300 text-sm leading-relaxed mb-8">
        {service.description}
      </p>

      <ul className="space-y-3 mb-10 grow">
        {service.features?.map((feature, i) => (
          <li
            key={i}
            className="flex items-center gap-3 text-sm text-zinc-200 group-hover:text-zinc-200 transition-colors"
          >
            <div className="w-1 h-1 rounded-full bg-brand" />
            {feature}
          </li>
        ))}
      </ul>

      <motion.a
        href="#"
        className="inline-flex items-center gap-2 text-sm font-bold group/link text-brand-light hover:text-white transition-colors"
      >
        Explore Platform
        <IconArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
      </motion.a>
    </SpotlightCard>
  );
};

// --- FAQ Accordion Item ---

const FAQAccordionItem: React.FC<{ item: FAQItem; index: number }> = ({
  item,
  index,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className={`bg-white/5 backdrop-blur-xl border rounded-[1.5rem] transition-colors duration-300 overflow-hidden ${
        isOpen ? "border-brand/40" : "border-white/10 hover:border-brand/30"
      }`}
    >
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full text-left px-8 py-7 flex items-center justify-between gap-4"
      >
        <span className="text-lg font-display font-bold">{item.question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className={`shrink-0 transition-colors duration-300 ${
            isOpen ? "text-brand-light" : "text-zinc-600"
          }`}
        >
          <IconChevronDown size={20} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <p className="px-8 pb-7 text-zinc-300 text-sm leading-relaxed">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- Split Image Section Component ---

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
      initial={{ opacity: 0, x: isImageLeft ? -60 : 60 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 1, ease: EASE, delay: 0.1 }}
      className="relative w-full"
    >
      <div className="absolute -inset-4 rounded-[2.5rem] bg-brand/10 blur-[60px] pointer-events-none" />
      <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl group">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          style={{ aspectRatio: "4/3" }}
        />
        <div
          className={`absolute inset-0 bg-gradient-to-${
            isImageLeft ? "r" : "l"
          } from-transparent via-transparent to-[#0a0a0f]/60 pointer-events-none`}
        />
      </div>
    </motion.div>
  );

  const TextBlock = (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isImageLeft ? 60 : -60 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 1, ease: EASE }}
      className="flex flex-col justify-center"
    >
      <h2 className="text-3xl md:text-5xl font-display font-bold leading-[1.1] tracking-tight mb-6">
        {title}
      </h2>

      <p className="text-zinc-300 text-base leading-relaxed mb-8">
        {description}
      </p>

      {bullets && bullets.length > 0 && (
        <ol className="space-y-5 mb-8">
          {bullets.map((b, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1, ease: EASE }}
              className="flex items-start gap-4"
            >
              <span className="mt-0.5 w-6 h-6 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center text-brand-light text-[11px] font-bold shrink-0">
                {i + 1}
              </span>
              <div>
                <span className="font-bold text-white">{b.label}</span>
                {b.detail && (
                  <span className="text-zinc-300 text-sm">: {b.detail}</span>
                )}
              </div>
            </motion.li>
          ))}
        </ol>
      )}

      {closingText && (
        <p className="text-zinc-400 text-sm leading-relaxed mb-8 italic border-l-2 border-brand/40 pl-4">
          {closingText}
        </p>
      )}

      {cta && (
        <MagneticButton variant="primary" href={cta.href} className="w-fit">
          {cta.label} <IconArrowUpRight size={16} />
        </MagneticButton>
      )}
    </motion.div>
  );

  return (
    <section
      className={`py-32 px-6 ${
        index % 2 === 0 ? "bg-white/2" : ""
      } relative overflow-hidden`}
    >
      <div
        className={`absolute top-1/2 -translate-y-1/2 ${
          isImageLeft ? "left-0" : "right-0"
        } w-96 h-96 bg-brand/5 blur-[120px] rounded-full pointer-events-none`}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div
          className={`grid lg:grid-cols-2 gap-16 xl:gap-24 items-center ${
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

// --- Page Component ---

export default function BPOPage(props: WebPageProps) {
  const { hero, stats, services, workflow, faq, cta, imageSections = [] } = props;

  const [scrolled, setScrolled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const midpoint = Math.ceil(imageSections.length / 2);
  const earlyImageSections = imageSections.slice(0, midpoint);
  const lateImageSections = imageSections.slice(midpoint);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#0a0a0f]">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-brand/20 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[150px] rounded-full" />
        <div className="absolute inset-0 grid-background opacity-20" />
      </div>

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero */}
        <section className="relative pt-40 pb-32 px-6 overflow-hidden min-h-screen flex flex-col justify-center">
          <div className="max-w-7xl mx-auto w-full text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE }}
              className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-10 border-brand/20"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-brand animate-ping" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-light">
                {hero.badge}
              </span>
            </motion.div>

            <motion.h1 className="text-6xl md:text-8xl lg:text-8xl font-display font-bold leading-[0.9] tracking-tighter mb-12">
              {hero.headlineLine1.split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 + i * 0.1, ease: EASE }}
                  className="inline-block mr-[0.2em]"
                >
                  {word}
                </motion.span>
              ))}
              <br />
              <motion.span
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: EASE }}
                className="bg-clip-text text-transparent bg-linear-to-r from-brand to-blue-400 text-glow inline-block"
              >
                {hero.headlineAccent}
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: EASE }}
              className="text-zinc-200 text-lg md:text-xl max-w-3xl mx-auto mb-16 leading-relaxed"
            >
              {hero.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
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
        <section className="py-24 border-y border-white/10 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="text-3xl md:text-5xl font-display font-bold mb-2">
                    {stat.value}
                  </div>
                  <div className="text-zinc-300 text-xs font-bold uppercase tracking-widest">
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
        <section id="solutions" className="py-20 px-6 max-w-7xl mx-auto">
          <SectionHeader
            subtitle={services.subtitle}
            title={services.title}
            description={services.description}
            alignment="center"
          />

          <div className="grid md:grid-cols-3 gap-8">
            {services.items.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.2, ease: EASE }}
                viewport={{ once: true }}
              >
                <ServiceCard service={service} />
              </motion.div>
            ))}
          </div>

          <div className="mt-24 text-center">
            <MagneticButton variant="ghost" className="group">
              {services.viewAllLabel}
              <IconArrowUpRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </MagneticButton>
          </div>
        </section>

        {/* Workflow Showcase */}
        <section className="py-36 px-6 bg-white/[0.03] relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-brand/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-24 items-center">
            {/* Left: feature list */}
            <div>
              <SectionHeader
                subtitle={workflow.subtitle}
                title={workflow.title}
                alignment="left"
              />
              <div className="space-y-12">
                {workflow.features.map((item, i) => {
                  const Icon = ICON_MAP[item.icon] || IconBolt;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: i * 0.1 }}
                      viewport={{ once: true }}
                      className="flex gap-6 items-start group"
                    >
                      <div className="mt-1 w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-light group-hover:bg-brand transition-all duration-300">
                        <Icon size={24} />
                      </div>
                      <div>
                        <h4 className="text-xl font-display font-bold mb-2">
                          {item.title}
                        </h4>
                        <p className="text-zinc-300 text-sm leading-relaxed max-w-sm">
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
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: EASE }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-4 shadow-3xl overflow-hidden group"
              >
                <div className="aspect-video rounded-2xl overflow-hidden relative border border-white/10">
                  <img
                    src={workflow.showcaseImage?.src}
                    alt={workflow.showcaseImage?.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Subtle brand-tinted overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand/20 via-transparent to-blue-500/10 opacity-40 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none" />
                </div>
              </motion.div>

              {/* Decorative Blur */}
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-brand/20 blur-[100px] rounded-full pointer-events-none" />
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
        <section className="py-24 px-6 max-w-4xl mx-auto">
          <SectionHeader
            subtitle={faq.subtitle}
            title={faq.title}
            alignment="center"
          />
          <div className="space-y-4">
            {faq.items.map((item, i) => (
              <FAQAccordionItem key={item.id} item={item} index={i} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}