import { IconArrowUpRight, IconChevronRight } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { getProjectList } from "./project-data";
import type { ProjectListItem } from "./project-data";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

function ProjectCard({ project }: { project: ProjectListItem }) {
  return (
    <motion.div
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/10 bg-card/50 transition-colors duration-300 hover:border-primary/20 hover:bg-card"
      variants={cardVariants}
      whileHover={{
        y: -6,
        scale: 1.01,
        transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const },
      }}
    >
      <Link className="absolute inset-0 z-10" to={project.href} />

      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute -top-12 -right-12 size-40 rounded-full bg-primary/10 blur-2xl" />
        <div className="absolute -bottom-12 -left-12 size-40 rounded-full bg-primary/10 blur-2xl" />

        <div className="flex h-full items-center justify-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/15 text-primary backdrop-blur-sm">
            <span className="size-8">{project.icon}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
        <div>
          <span className="mb-2 inline-block font-mono text-[10px] font-medium uppercase tracking-widest text-primary">
            {project.category}
          </span>
          <h3 className="font-heading font-semibold text-foreground text-lg">
            {project.title}
          </h3>
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed">
          {project.description}
        </p>

        <div className="mt-auto flex items-center gap-1 font-medium text-foreground text-sm">
          <span>View case study</span>
          <motion.span
            className="inline-block"
            initial={{ x: 0 }}
            whileHover={{ x: 4 }}
          >
            <IconChevronRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.span>
        </div>
      </div>

      <div className="pointer-events-none absolute right-4 top-4 flex size-8 items-center justify-center rounded-full bg-background/80 text-muted-foreground opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
        <IconArrowUpRight className="size-4" />
      </div>
    </motion.div>
  );
}

export function ProjectGrid() {
  const projects = getProjectList();

  return (
    <section className="relative bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
          viewport={{ once: true, margin: "-100px" }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="font-bold font-heading text-3xl text-foreground sm:text-4xl">
            Our Projects
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            From AI-powered platforms to enterprise cloud migrations, explore our
            portfolio of impactful digital transformations.
          </p>
        </motion.div>

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