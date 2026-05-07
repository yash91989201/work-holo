import {
  IconArrowLeft,
  IconArrowRight,
  IconArrowUpRight,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";

const projects = [
  {
    id: 1,
    title: "Mobile App Development",
    tag: "Solution",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop",
  },
  {
    id: 2,
    title: "Business Transformation",
    tag: "Solution",
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop",
  },
  {
    id: 3,
    title: "Cloud Migration System",
    tag: "Solution",
    image:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop",
  },
  {
    id: 4,
    title: "Digital Growth Strategy",
    tag: "Solution",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
  },
  {
    id: 5,
    title: "Cybersecurity Audit",
    tag: "Solution",
    image:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=400&fit=crop",
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
    <section
      className="relative scroll-mt-28 overflow-hidden bg-background py-20 lg:py-28"
      id="projects"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="flex-1">
            <p className="mb-5 font-medium text-primary text-sm uppercase tracking-[0.2em]">
              [ RECENT PROJECTS ]
            </p>
            <h2 className="font-bold text-3xl text-foreground leading-[1.1] tracking-tight sm:text-4xl lg:text-[2.75rem]">
              Breaking Boundaries,
              <br />
              Building Dreams.
            </h2>
          </div>

          <div className="flex items-center gap-8 lg:pb-2">
            <p className="max-w-[200px] text-muted-foreground text-sm">
              Our projects are tailored to meet your unique business needs.
            </p>
            <div className="flex gap-2">
              <button
                aria-label="Previous project"
                className="flex size-10 items-center justify-center rounded-full border border-border/50 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={() => scrollTo("left")}
              >
                <IconArrowLeft className="size-4" />
              </button>
              <button
                aria-label="Next project"
                className="flex size-10 items-center justify-center rounded-full border border-border/50 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={() => scrollTo("right")}
              >
                <IconArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1 }}
        >
          <div
            className="scrollbar-hide -mx-4 flex gap-5 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
            onScroll={handleScroll}
            ref={carouselRef}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </motion.div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center gap-2">
          {projects.map((_, index) => (
            <button
              aria-label={`Go to project ${index + 1}`}
              className={`rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "h-2 w-2 bg-primary"
                  : "h-2 w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
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
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  return (
    <div className="group relative w-[320px] flex-shrink-0 sm:w-[340px]">
      <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-card transition-all duration-300 hover:border-border/70">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            src={project.image}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>

        {/* Info Overlay */}
        <div className="absolute right-0 bottom-0 left-0 p-5">
          <div className="flex items-end justify-between">
            <div>
              <span className="mb-2 inline-block font-medium text-[11px] text-primary uppercase tracking-wider">
                {project.tag}
              </span>
              <h3 className="font-semibold text-base text-foreground">
                {project.title}
              </h3>
            </div>
            <div className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-muted/80 backdrop-blur-sm transition-colors hover:bg-muted">
              <IconArrowUpRight className="size-4 text-foreground" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
