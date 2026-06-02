import { IconAward, IconBrandLinkedin } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
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

function AwardBadge() {
  return (
    <motion.div
      className="relative size-28 sm:size-32"
      initial={{ opacity: 0, scale: 0.8, rotate: -20 }}
      transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
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
            id="circlePath"
          />
        </defs>
        <text
          className="fill-muted-foreground uppercase tracking-widest"
          style={{ fontSize: "9px" }}
        >
          <textPath href="#circlePath">
            AWARD WINNING AGENCY - SINCE 2019 - AWARD WINNING AGENCY - SINCE
            2019 -
          </textPath>
        </text>
        <circle
          className="text-muted-foreground/20"
          cx="60"
          cy="60"
          fill="none"
          r="42"
          stroke="currentColor"
          strokeDasharray="2 3"
          strokeWidth="0.5"
        />
      </motion.svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary sm:size-14">
          <IconAward className="size-6 text-primary-foreground sm:size-7" />
        </div>
      </div>
    </motion.div>
  );
}

export function AboutSection() {
  const navigate = useNavigate(); // ✅ add this

  return (
    <section
      className="relative scroll-mt-28 overflow-hidden bg-background py-20 lg:py-28"
      id="about"
    >
      {/* Background pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.02]">
        <svg
          className="absolute top-0 left-0 h-full w-full"
          fill="none"
          viewBox="0 0 1200 800"
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
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left Column - Image with overlays */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            {/* Main Image */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
              <img
                alt="Professional working on laptop"
                className="h-full w-full object-cover"
                src="/assets/hero-img.jpeg"
              />
            </div>

            {/* Experience Card */}
            <motion.div
              className="absolute -bottom-6 -left-2 sm:left-4"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
            >
              <div className="relative w-45 overflow-hidden rounded-2xl bg-primary p-5 sm:w-50 sm:p-6">
                <div className="mb-2 font-bold text-5xl text-primary-foreground leading-none sm:text-6xl">
                  20<sup className="text-2xl">+</sup>
                </div>
                <p className="text-primary-foreground/90 text-sm leading-snug">
                  Years of Excellence in IT Solutions Company.
                </p>
              </div>
            </motion.div>

            {/* Founder Card */}
            <motion.div
              className="absolute right-2 -bottom-6 sm:right-6"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
            >
              <a
                className="flex items-center gap-3 rounded-2xl border border-border/50 bg-card/95 px-4 py-3 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-primary/30 hover:shadow-2xl"
                href="https://www.linkedin.com/company/workholo/"
                rel="noopener noreferrer"
                target="_blank"
              >
                <div className="flex size-10 items-center justify-center rounded-full bg-muted font-bold text-foreground text-sm">
                  AB
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    Akhil Bisht
                  </p>
                  <p className="text-muted-foreground text-xs">Founder</p>
                </div>
                <div className="ml-1 flex size-8 items-center justify-center rounded-full bg-[#0077B5]/10 text-[#0077B5] transition-colors hover:bg-[#0077B5]/20">
                  <IconBrandLinkedin className="size-4" />
                </div>
              </a>
            </motion.div>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <div className="relative rounded-3xl border border-border/30 bg-card/40 p-8 sm:p-10 lg:p-12">
              {/* Tag */}
              <motion.p
                className="mb-5 font-medium text-primary text-sm uppercase tracking-[0.2em]"
                initial={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                [ ABOUT WORK HOLO ]
              </motion.p>

              {/* Headline */}
              <motion.h2
                className="mb-6 font-bold text-3xl text-foreground leading-[1.1] tracking-tight sm:text-4xl"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                Delivering Solution That Drive Our Innovation &amp; Fast
                Success.
              </motion.h2>

              {/* Description */}
              <motion.p
                className="mb-8 text-muted-foreground text-sm leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                We are a team of passionate tech experts delivering innovative
                IT solutions tailored to help businesses grow, adapt, and thrive
                in a digital. Stay ahead of the competition.
              </motion.p>

              {/* Stats */}
              <motion.div
                className="mb-8 flex items-center gap-8"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div>
                  <div className="font-bold text-4xl text-primary leading-none sm:text-5xl">
                    <AnimatedCounter duration={2} suffix="" target={100} />
                    <sup className="text-xl">+</sup>
                  </div>
                  <p className="mt-2 text-muted-foreground text-sm">
                    Successful Projects.
                  </p>
                </div>
                <div className="h-16 w-px bg-border/50" />
                <div>
                  <div className="font-bold text-4xl text-primary leading-none sm:text-5xl">
                    <AnimatedCounter duration={2} suffix="" target={30} />
                    <sup className="text-xl">+</sup>
                  </div>
                  <p className="mt-2 text-muted-foreground text-sm">
                    Team members
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
