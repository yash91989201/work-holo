import { IconArrowUpRight } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { getProjectList } from "./project-data";
import type { ProjectListItem } from "./project-data";

const EASE = [0.22, 1, 0.36, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: EASE,
    },
  },
};

function ProjectCard({ project }: { project: ProjectListItem }) {
  return (
    <motion.div
      className="group relative"
      variants={cardVariants}
      whileHover={{ y: -8, transition: { duration: 0.35, ease: EASE } }}
    >
      <Link className="block" to={project.href}>
        <div className="relative overflow-hidden rounded-2xl border border-border/10 bg-card/30 transition-all duration-500 hover:border-primary/20 hover:bg-card/60">
          <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-primary/8 via-primary/3 to-transparent">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/8 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/8 via-transparent to-transparent" />
            <div
              className="absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M20 20.5V18H0v-2h20V0h2v16h18v2H22v20h-2V20.5z'/%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
            <div className="absolute -right-16 -top-16 size-48 rounded-full bg-primary/8 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 size-48 rounded-full bg-primary/8 blur-3xl" />

            <div className="flex h-full items-center justify-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary backdrop-blur-sm transition-all duration-500 group-hover:scale-110 group-hover:bg-primary/15">
                <span className="size-9">{project.icon}</span>
              </div>
            </div>

            <div className="pointer-events-none absolute right-4 top-4 flex size-8 items-center justify-center rounded-full bg-background/70 text-muted-foreground opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 group-hover:text-primary">
              <IconArrowUpRight className="size-4" />
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <span className="mb-2.5 inline-block font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-primary/70">
              {project.category}
            </span>
            <h3 className="mb-2 font-heading text-lg font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
              {project.title}
            </h3>
            <p className="text-foreground/45 line-clamp-2 text-sm leading-relaxed">
              {project.description}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function ProjectGrid() {
  const projects = getProjectList();

  return (
    <section className="relative bg-background pb-20 sm:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          variants={containerVariants}
          viewport={{ once: true, margin: "-50px" }}
          whileInView="visible"
        >
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}