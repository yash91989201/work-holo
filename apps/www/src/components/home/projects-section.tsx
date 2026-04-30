import { useState, useRef } from "react";
import { motion } from "motion/react";
import { IconArrowLeft, IconArrowRight, IconArrowUpRight } from "@tabler/icons-react";

const projects = [
  {
    id: 1,
    title: "Mobile App Development",
    tag: "Solution",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop",
  },
  {
    id: 2,
    title: "Business Transformation",
    tag: "Solution",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop",
  },
  {
    id: 3,
    title: "Cloud Migration System",
    tag: "Solution",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop",
  },
  {
    id: 4,
    title: "Digital Growth Strategy",
    tag: "Solution",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
  },
  {
    id: 5,
    title: "Cybersecurity Audit",
    tag: "Solution",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=400&fit=crop",
  },
];

export function ProjectsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollTo = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 340;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (carouselRef.current) {
      const scrollLeft = carouselRef.current.scrollLeft;
      const cardWidth = 340;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setActiveIndex(Math.min(newIndex, projects.length - 1));
    }
  };

  return (
    <section id="projects" className="relative bg-background py-20 lg:py-28 overflow-hidden scroll-mt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12"
        >
          <div className="flex-1">
            <p className="text-sm font-medium tracking-[0.2em] text-primary uppercase mb-5">
              [ RECENT PROJECTS ]
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-foreground leading-[1.1] tracking-tight">
              Breaking Boundaries,
              <br />
              Building Dreams.
            </h2>
          </div>

          <div className="flex items-center gap-8 lg:pb-2">
            <p className="text-sm text-muted-foreground max-w-[200px]">
              Our projects are tailored to meet your unique business needs.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => scrollTo("left")}
                className="flex size-10 items-center justify-center rounded-full border border-border/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Previous project"
              >
                <IconArrowLeft className="size-4" />
              </button>
              <button
                onClick={() => scrollTo("right")}
                className="flex size-10 items-center justify-center rounded-full border border-border/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Next project"
              >
                <IconArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div
            ref={carouselRef}
            onScroll={handleScroll}
            className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </motion.div>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-8">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (carouselRef.current) {
                  const cardWidth = 340;
                  carouselRef.current.scrollTo({
                    left: index * cardWidth,
                    behavior: "smooth",
                  });
                }
              }}
              className={`transition-all duration-300 rounded-full ${
                index === activeIndex
                  ? "w-2 h-2 bg-primary"
                  : "w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to project ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
}: {
  project: (typeof projects)[number];
}) {
  return (
    <div className="group relative flex-shrink-0 w-[320px] sm:w-[340px]">
      <div className="relative rounded-2xl overflow-hidden bg-card border border-border/40 hover:border-border/70 transition-all duration-300">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>

        {/* Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex items-end justify-between">
            <div>
              <span className="inline-block text-[11px] font-medium text-primary uppercase tracking-wider mb-2">
                {project.tag}
              </span>
              <h3 className="text-base font-semibold text-foreground">
                {project.title}
              </h3>
            </div>
            <div className="flex size-10 items-center justify-center rounded-full bg-muted/80 backdrop-blur-sm cursor-pointer hover:bg-muted transition-colors">
              <IconArrowUpRight className="size-4 text-foreground" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
