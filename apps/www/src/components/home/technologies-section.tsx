import {
  IconApi,
  IconArrowRight,
  IconBrain,
  IconBrandAws,
  IconBrandDocker,
  IconBrandGit,
  IconBrandGithub,
  IconBrandGitlab,
  IconBrandGolang,
  IconBrandJavascript,
  IconBrandNextjs,
  IconBrandNodejs,
  IconBrandPython,
  IconBrandReact,
  IconBrandTailwind,
  IconBrandTypescript,
  IconBrandVue,
  IconCloud,
  IconCpu,
  IconDatabase,
  IconRobot,
  IconServer,
  IconSettings,
  IconShare,
} from "@tabler/icons-react";
import { cn } from "@work-holo/ui/lib/utils";
import { motion } from "motion/react";

// Tech stack organized by category - 3 rows only
const techRows = [
  // Row 1: Languages & Databases
  [
    { name: "JavaScript", icon: IconBrandJavascript, color: "text-yellow-400" },
    { name: "TypeScript", icon: IconBrandTypescript, color: "text-blue-500" },
    { name: "Python", icon: IconBrandPython, color: "text-yellow-300" },
    { name: "Go", icon: IconBrandGolang, color: "text-cyan-400" },
    { name: "PostgreSQL", icon: IconDatabase, color: "text-blue-500" },
    { name: "MongoDB", icon: IconDatabase, color: "text-green-500" },
    { name: "Redis", icon: IconCpu, color: "text-red-500" },
    { name: "Node.js", icon: IconBrandNodejs, color: "text-green-500" },
  ],
  // Row 2: Frontend & Backend
  [
    { name: "React", icon: IconBrandReact, color: "text-cyan-400" },
    { name: "Next.js", icon: IconBrandNextjs, color: "text-foreground" },
    { name: "Vue", icon: IconBrandVue, color: "text-green-400" },
    { name: "Tailwind", icon: IconBrandTailwind, color: "text-cyan-300" },
    { name: "REST APIs", icon: IconApi, color: "text-blue-400" },
    { name: "GraphQL", icon: IconShare, color: "text-pink-500" },
    { name: "Serverless", icon: IconCloud, color: "text-sky-400" },
    { name: "Backend", icon: IconServer, color: "text-emerald-400" },
  ],
  // Row 3: DevOps & AI
  [
    { name: "Docker", icon: IconBrandDocker, color: "text-blue-400" },
    { name: "AWS", icon: IconBrandAws, color: "text-orange-400" },
    { name: "CI/CD", icon: IconSettings, color: "text-gray-400" },
    { name: "Git", icon: IconBrandGit, color: "text-orange-500" },
    { name: "AI/ML", icon: IconBrain, color: "text-purple-500" },
    { name: "LLMs", icon: IconRobot, color: "text-blue-500" },
    { name: "GitHub", icon: IconBrandGithub, color: "text-foreground" },
    { name: "GitLab", icon: IconBrandGitlab, color: "text-orange-600" },
  ],
];

interface MarqueeRowProps {
  className?: string;
  direction?: "left" | "right";
  speed?: number;
  technologies: Array<{
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }>;
}

function MarqueeRow({
  technologies,
  direction = "left",
  speed = 30,
  className,
}: MarqueeRowProps) {
  // Double the items for seamless loop
  const doubledTechs = [...technologies, ...technologies];

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Gradient masks for smooth edges */}
      <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-8 bg-gradient-to-r from-background to-transparent sm:w-16 lg:w-24" />
      <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-8 bg-gradient-to-l from-background to-transparent sm:w-16 lg:w-24" />

      <motion.div
        animate={{
          x: direction === "left" ? [0, "-50%"] : ["-50%", 0],
        }}
        className="flex gap-3 py-2 sm:gap-4 lg:gap-6"
        transition={{
          x: {
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            duration: speed,
            ease: "linear",
          },
        }}
      >
        {doubledTechs.map((tech, index) => (
          <div
            className="group flex shrink-0 items-center gap-2 rounded-full border border-border/40 bg-card/50 px-3 py-2 transition-all duration-300 hover:border-border/70 hover:bg-card/80 sm:gap-3 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3"
            key={`${tech.name}-${index}`}
          >
            <tech.icon
              className={cn(
                "h-4 w-4 shrink-0 sm:h-5 sm:w-5 lg:h-6 lg:w-6",
                tech.color
              )}
            />
            <span className="whitespace-nowrap font-medium text-foreground text-xs sm:text-sm lg:text-base">
              {tech.name}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function TechnologiesSection() {
  return (
    <section
      className="relative scroll-mt-28 overflow-hidden bg-background py-16 sm:py-20 lg:py-28"
      id="technologies"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-10 text-center sm:mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <p className="mb-4 font-medium text-primary text-xs uppercase tracking-[0.2em] sm:mb-5 sm:text-sm">
            [ OUR TECH STACK ]
          </p>
          <h2 className="font-bold text-2xl text-foreground leading-[1.1] tracking-tight sm:text-3xl lg:text-[2.75rem]">
            Technologies We Master
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground text-sm sm:mt-4 sm:text-base">
            From frontend frameworks to AI/ML, we leverage cutting-edge tools to
            build scalable solutions
          </p>
        </motion.div>

        {/* Multi-line Marquee */}
        <motion.div
          className="space-y-2 sm:space-y-3 lg:space-y-4"
          initial={{ opacity: 0, y: 20 }}
          transition={{
            duration: 0.6,
            delay: 0.2,
            ease: [0.22, 1, 0.36, 1] as const,
          }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          {techRows.map((row, index) => (
            <MarqueeRow
              className={
                index % 2 === 0 ? "translate-x-[-5%]" : "translate-x-[5%]"
              }
              direction={index % 2 === 0 ? "left" : "right"}
              key={index}
              speed={35 + index * 3}
              technologies={row}
            />
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-10 text-center sm:mt-12 lg:mt-16"
          initial={{ opacity: 0, y: 20 }}
          transition={{
            duration: 0.6,
            delay: 0.4,
            ease: [0.22, 1, 0.36, 1] as const,
          }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <p className="mb-4 text-muted-foreground text-sm sm:text-base">
            Need a specific technology? We adapt to your stack.
          </p>
          <a
            className="inline-flex items-center gap-2 font-medium text-primary text-sm transition-colors hover:text-primary/80"
            href="#contact"
          >
            Let&apos;s discuss your project
            <IconArrowRight className="h-4 w-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
