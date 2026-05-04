import { IconAward } from "@tabler/icons-react";
import { CTAButton } from "@work-holo/ui/components/cta-button";
import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

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
      const eased = 1 - Math.pow(1 - progress, 3);
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

function AwardBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotate: -20 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative size-28 sm:size-32"
    >
      <motion.svg
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        viewBox="0 0 120 120"
        className="absolute inset-0 size-full"
      >
        <defs>
          <path
            id="circlePath"
            d="M 60, 60 m -48, 0 a 48,48 0 1,1 96,0 a 48,48 0 1,1 -96,0"
          />
        </defs>
        <text
          className="fill-muted-foreground uppercase tracking-widest"
          style={{ fontSize: "9px" }}
        >
          <textPath href="#circlePath">
            AWARD WINNING AGENCY - SINCE 2019 - AWARD WINNING AGENCY
            - SINCE 2019 -
          </textPath>
        </text>
        <circle
          cx="60"
          cy="60"
          r="42"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeDasharray="2 3"
          className="text-muted-foreground/20"
        />
      </motion.svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex size-12 sm:size-14 items-center justify-center rounded-full bg-primary">
          <IconAward className="size-6 sm:size-7 text-primary-foreground" />
        </div>
      </div>
    </motion.div>
  );
}

export function AboutSection() {
  return (
    <section id="about" className="relative bg-background py-20 lg:py-28 overflow-hidden scroll-mt-28">
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 1200 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 400C200 300 400 500 600 400C800 300 1000 500 1200 400"
            stroke="currentColor"
            strokeWidth="1"
          />
          <path
            d="M0 450C200 350 400 550 600 450C800 350 1000 550 1200 450"
            stroke="currentColor"
            strokeWidth="0.5"
          />
          <path
            d="M0 350C200 250 400 450 600 350C800 250 1000 450 1200 350"
            stroke="currentColor"
            strokeWidth="0.5"
          />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Image with overlays */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Main Image */}
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3]">
              <img
                src="/assets/diverse-team-planning-stockcake.webp"
                alt="Team collaborating"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Experience Card */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="absolute -bottom-6 -left-2 sm:left-4"
            >
              <div className="relative bg-primary rounded-2xl p-5 sm:p-6 w-[180px] sm:w-[200px] overflow-hidden">
                <div className="absolute -top-1 -right-8">
                  <div
                    className="bg-background text-primary-foreground text-[9px] font-bold uppercase tracking-wider px-8 py-1"
                    style={{ transform: "rotate(45deg)" }}
                  >
                    Experience
                  </div>
                </div>
                <div className="text-5xl sm:text-6xl font-bold text-primary-foreground leading-none mb-2">
                  20<sup className="text-2xl">+</sup>
                </div>
                <p className="text-sm text-primary-foreground/90 leading-snug">
                  Years of Excellence in IT Solutions Company.
                </p>
              </div>
            </motion.div>

            {/* Founder Card */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="absolute -bottom-6 right-2 sm:right-6"
            >
              <div className="flex items-center gap-3 bg-card/95 backdrop-blur-md border border-border/50 rounded-2xl px-4 py-3 shadow-xl">
                <div className="flex size-10 items-center justify-center rounded-full bg-muted text-sm font-bold text-foreground">
                  BN
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Burdee Nicolas</p>
                  <p className="text-xs text-muted-foreground">Co. Founder</p>
                </div>
                <div className="ml-2 text-lg italic text-muted-foreground/40 font-serif">
                  Bn
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative bg-card/40 border border-border/30 rounded-3xl p-8 sm:p-10 lg:p-12">
              {/* Tag */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="text-sm font-medium tracking-[0.2em] text-primary uppercase mb-5"
              >
                [ ABOUT WORK HOLO ]
              </motion.p>

              {/* Headline */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-3xl sm:text-4xl font-bold text-foreground leading-[1.1] tracking-tight mb-6"
              >
                Delivering Solution That Drive Our Innovation &amp; Fast Success.
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-sm text-muted-foreground leading-relaxed mb-8"
              >
                We are a team of passionate tech experts delivering innovative IT
                solutions tailored to help businesses grow, adapt, and thrive in a
                digital. Stay ahead of the competition.
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex items-center gap-8 mb-8"
              >
                <div>
                  <div className="text-4xl sm:text-5xl font-bold text-primary leading-none">
                    <AnimatedCounter target={3} suffix="K" duration={2} />
                    <sup className="text-xl">+</sup>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Successful Projects.</p>
                </div>
                <div className="w-px h-16 bg-border/50" />
                <div>
                  <div className="text-4xl sm:text-5xl font-bold text-primary leading-none">
                    <AnimatedCounter target={98} suffix="" duration={2} />
                    <sup className="text-xl">+</sup>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">IT Professionals.</p>
                </div>
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="flex items-center justify-between"
              >
                <CTAButton type="button">Learn More</CTAButton>

                {/* Award Badge */}
                <div className="hidden sm:block">
                  <AwardBadge />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
