import {
  IconArrowUpRight,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@work-holo/ui/components/carousel";
import { motion } from "motion/react";
import { useState } from "react";
import { getProjectList } from "../projects/project-data";

const projects = getProjectList();

function getProjectImage(image: string | undefined, slug: string) {
  return image || `/assets/projects/${slug}.jpg`;
}

export function ProjectsSection() {
  const [api, setApi] = useState<CarouselApi>();

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

          <div className="hidden items-center gap-2 lg:flex lg:pb-2">
            <button
              aria-label="Previous project"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border/50 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
              disabled={!api?.canScrollPrev()}
              onClick={() => api?.scrollPrev()}
              type="button"
            >
              <IconChevronLeft className="size-4" />
            </button>
            <button
              aria-label="Next project"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border/50 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
              disabled={!api?.canScrollNext()}
              onClick={() => api?.scrollNext()}
              type="button"
            >
              <IconChevronRight className="size-4" />
            </button>
          </div>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1 }}
        >
          <Carousel
            className="w-full"
            opts={{
              align: "start",
              loop: true,
            }}
            setApi={setApi}
          >
            <CarouselContent className="-ml-5">
              {projects.map((project) => (
                <CarouselItem
                  className="basis-[320px] pl-5 sm:basis-[340px]"
                  key={project.slug}
                >
                  <ProjectCard project={project} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </motion.div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
}: {
  project: ReturnType<typeof getProjectList>[number];
}) {
  return (
    <a className="group relative block flex-shrink-0" href={project.href}>
      <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-card transition-all duration-300 hover:border-border/70">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            src={getProjectImage(project.image, project.slug)}
          />
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />
        </div>

        {/* Info Overlay */}
        <div className="absolute right-0 bottom-0 left-0 p-5">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="font-semibold text-base text-foreground">
                {project.title}
              </h3>
            </div>
            <div className="flex size-10 items-center justify-center rounded-full bg-muted/80 backdrop-blur-sm transition-colors group-hover:bg-muted">
              <IconArrowUpRight className="size-4 text-foreground" />
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}
