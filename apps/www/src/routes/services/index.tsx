import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ServiceGrid } from "@/components/services/service-grid";
import { Image } from "@/components/shared/image";

export const Route = createFileRoute("/services/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="relative overflow-hidden bg-background">
      {/* Hero with background image */}
      <section className="relative min-h-[70vh] overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            alt="Our Services"
            className="h-full w-full object-cover"
            height={1080}
            src="/assets/digital-transformation-solutions.webp"
            unoptimized
            width={1920}
          />
          {/* Dark tint */}
          <div className="absolute inset-0 bg-black/30" />
          {/* Gradient fade to page bg at bottom */}
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />
          {/* Edge vignette */}
          <div className="absolute inset-0 bg-linear-to-r from-background/50 via-transparent to-background/50" />
        </div>

        {/* Hero content pinned to bottom */}
        <div className="relative z-10 flex min-h-[70vh] items-end pt-32">
          <div className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              {/* Category badge */}
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 font-mono font-semibold text-[11px] text-primary uppercase tracking-widest">
                  Our Services
                </span>
              </div>

              {/* Title */}
              <h1 className="mb-4 font-extrabold font-heading text-4xl text-white leading-[0.95] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                AI-First
                <br />
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  Engineering
                </span>
              </h1>

              {/* Description */}
              <p className="max-w-2xl text-base text-white/55 leading-relaxed sm:text-lg">
                We build, scale, and optimize digital products with AI-first
                engineering. From MVP to enterprise platforms — every service
                designed to accelerate your growth.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="absolute right-0 bottom-0 left-0 z-10 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </section>

      <div id="services">
        <ServiceGrid />
      </div>
    </div>
  );
}
