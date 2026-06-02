import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ProjectGrid } from "@/components/projects/project-grid";

export const Route = createFileRoute("/projects/")({
  component: RouteComponent,
});

const stats = [
  { label: "Completed Projects", value: "100+" },
  { label: "Global Clients", value: "100+" },
  { label: "Professional Teams", value: "30+" },
];

function RouteComponent() {
  return (
    <div className="relative min-h-screen bg-background selection:bg-primary/30 selection:text-primary">
      {/* Ambient Background Gradients */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] h-[50%] w-[50%] rounded-full bg-primary/5 opacity-50 blur-[120px]" />
        <div className="absolute top-[20%] right-[0%] h-[40%] w-[40%] rounded-full bg-blue-500/5 opacity-50 blur-[120px]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-44 pb-16 sm:pt-44 sm:pb-24 md:pt-48 lg:pt-48 lg:pb-32 xl:pt-56">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
            {/* Left Content */}
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col justify-center lg:col-span-5"
              initial={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-px w-8 bg-primary/50" />
                <span className="font-mono font-semibold text-primary text-xs uppercase tracking-[0.3em]">
                  Our Portfolio
                </span>
              </div>

              <h1 className="mb-6 font-bold font-heading text-4xl text-foreground tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
                Digital <br />
                <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                  Excellence.
                </span>
              </h1>

              <p className="mb-10 max-w-lg text-base text-muted-foreground leading-relaxed sm:text-lg">
                We craft ambitious digital experiences. From AI-powered
                platforms to enterprise cloud migrations, explore our
                transformative work that delivers measurable impact.
              </p>

              {/* Stats Chips */}
              <div className="flex flex-wrap gap-4 sm:gap-6">
                {stats.map((stat, i) => (
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-1 border-primary/20 border-l-2 pl-4"
                    initial={{ opacity: 0, y: 20 }}
                    key={stat.label}
                    transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                  >
                    <span className="font-bold font-heading text-2xl text-foreground">
                      {stat.value}
                    </span>
                    <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                      {stat.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Image/Visual */}
            <motion.div
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="relative lg:col-span-7"
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            >
              <div className="relative w-full overflow-hidden rounded-2xl border border-border/50 bg-muted/20 shadow-2xl shadow-black/10">
                <div className="absolute inset-0 z-10 bg-gradient-to-tr from-background/80 via-transparent to-transparent mix-blend-overlay" />
                <img
                  alt="Workholo digital projects showcase"
                  className="aspect-[16/10] w-full object-cover transition-transform duration-700 hover:scale-105"
                  src="/assets/digital-transformation-solutions.webp"
                />

                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 z-20 flex gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary/40 backdrop-blur-md" />
                  <div className="h-2 w-2 rounded-full bg-primary/60 backdrop-blur-md" />
                  <div className="h-2 w-2 rounded-full bg-primary backdrop-blur-md" />
                </div>
              </div>

              {/* Offset decorative background block */}
              <div className="absolute -inset-4 -z-10 translate-x-4 translate-y-4 rounded-3xl border border-primary/10 bg-primary/5 opacity-50 blur-xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="relative z-10 border-border/50 border-t bg-background/50 pt-16 pb-24 backdrop-blur-xl sm:pt-24 sm:pb-32">
        <div className="mx-auto mb-12 max-w-7xl px-4 sm:mb-16 sm:px-6 lg:px-8">
          <motion.div
            className="flex flex-col justify-between gap-6 md:flex-row md:items-end"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div>
              <h2 className="font-bold font-heading text-3xl tracking-tight sm:text-4xl">
                Featured Projects
              </h2>
              <p className="mt-4 max-w-xl text-muted-foreground">
                Dive into our latest case studies and see how we solve complex
                problems through design and technology.
              </p>
            </div>
          </motion.div>
        </div>

        <ProjectGrid />
      </section>
    </div>
  );
}
