import { useState, useRef } from "react";
import { motion } from "motion/react";
import {
  IconArrowLeft,
  IconArrowRight,
  IconBrandOpenai,
  IconBrandNotion,
  IconBrandGitlab,
  IconBrandZoom,
  IconBrandDropbox,
} from "@tabler/icons-react";

const technologies = [
  {
    id: 1,
    name: "ChatGPT",
    description: "Offering assistance with answering frequently asked questions.",
    icon: IconBrandOpenai,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    id: 2,
    name: "Notion",
    description: "You can create rich-text document customizable formatting, images.",
    icon: IconBrandNotion,
    color: "text-foreground",
    bgColor: "bg-foreground/10",
  },
  {
    id: 3,
    name: "Gitlab",
    description: "Support more Multiple repositories to one or more channels.",
    icon: IconBrandGitlab,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    id: 4,
    name: "Zoom",
    description: "For Video conferencing platform used for virtual meeting",
    icon: IconBrandZoom,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    id: 5,
    name: "Dropbox",
    description: "Dropbox provides cloud storage where users can securely store",
    icon: IconBrandDropbox,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
  },
  {
    id: 6,
    name: "ClickUp",
    description: "ClickUp is a productivity platform for our task management",
    icon: null,
    customIcon: (
      <svg viewBox="0 0 24 24" className="size-6" fill="currentColor">
        <path d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10S2 17.52 2 12zm10 6c3.31 0 6-2.69 6-6s-2.69-6-6-6-6 2.69-6 6 2.69 6 6 6z"/>
      </svg>
    ),
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function TechnologiesSection() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollTo = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 300;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative bg-background py-20 lg:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
          className="text-center mb-12"
        >
          <p className="text-sm font-medium tracking-[0.2em] text-primary uppercase mb-5">
            [ OUR TECHNOLOGIES ]
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-foreground leading-[1.1] tracking-tight">
            Effortless IT Integration
            <br />
            for Business.
          </h2>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="hidden lg:grid grid-cols-3 gap-4"
        >
          {technologies.map((tech) => (
            <TechCard key={tech.id} tech={tech} />
          ))}
        </motion.div>

        {/* Mobile Carousel */}
        <div className="lg:hidden">
          <div
            ref={carouselRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {technologies.map((tech) => (
              <div key={tech.id} className="flex-shrink-0 w-[280px]">
                <TechCard tech={tech} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TechCard({
  tech,
}: {
  tech: (typeof technologies)[number];
}) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group relative"
    >
      <div className="relative bg-card/50 border border-border/40 hover:border-border/70 rounded-xl p-5 transition-all duration-300 h-full">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className={`flex size-12 items-center justify-center rounded-xl ${tech.bgColor} shrink-0`}
          >
            {tech.customIcon ? (
              <div className={tech.color}>{tech.customIcon}</div>
            ) : tech.icon ? (
              <tech.icon className={`size-6 ${tech.color}`} />
            ) : null}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-foreground mb-1">
              {tech.name}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {tech.description}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
