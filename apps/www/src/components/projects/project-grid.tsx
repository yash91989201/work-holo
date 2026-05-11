import {
  IconArrowRight,
  IconArrowUpRight,
  IconChevronDown,
  IconFilter,
  IconSortAscending,
  IconSortDescending,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@work-holo/ui/components/item";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import type { ProjectListItem } from "./project-data";
import { getProjectList } from "./project-data";

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
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.3,
      ease: EASE,
    },
  },
};

function ProjectCard({ project }: { project: ProjectListItem }) {
  return (
    <motion.div
      animate="visible"
      className="group relative flex h-full flex-col"
      exit="exit"
      initial="hidden"
      layout
      layoutId={`project-card-${project.slug}`}
      variants={cardVariants}
      whileHover={{ y: -4, transition: { duration: 0.35, ease: EASE } }}
    >
      <Link
        className="flex h-full flex-col rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        to={project.href}
      >
        <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-border/50 bg-card/20 p-8 transition-all duration-500 hover:border-primary/20 hover:bg-card/40 hover:shadow-sm sm:p-10">
          <div>
            {project.image && (
              <div className="mb-8 overflow-hidden rounded-2xl border border-border/20 bg-muted/20">
                <img
                  alt={`${project.title} showcase`}
                  className="aspect-[16/9] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={project.image}
                />
              </div>
            )}

            <div className="mb-8 flex items-start justify-between gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                {project.icon}
              </div>
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-background/50 text-muted-foreground/50 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:text-primary group-hover:opacity-100 group-hover:shadow-sm">
                <IconArrowUpRight className="size-4" />
              </div>
            </div>

            <div className="mb-4 flex items-center">
              <span className="inline-flex items-center rounded-full border border-border/50 bg-background/50 px-3 py-1 font-medium text-muted-foreground text-xs transition-colors group-hover:border-primary/20 group-hover:text-primary">
                {project.category || "Uncategorized"}
              </span>
            </div>

            <h3 className="mb-4 font-bold font-heading text-2xl text-foreground transition-colors duration-300 group-hover:text-primary">
              {project.title}
            </h3>

            <p className="mb-8 line-clamp-3 text-base text-muted-foreground leading-relaxed">
              {project.description}
            </p>
          </div>

          <div className="mt-auto flex items-center gap-2 font-medium text-foreground text-sm transition-colors group-hover:text-primary">
            <span>View Case Study</span>
            <IconArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function ProjectGrid() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState<"featured" | "asc" | "desc">(
    "featured"
  );
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const projects = getProjectList();

  const categories = useMemo(() => {
    const cats = new Set(projects.map((p) => p.category).filter(Boolean));
    return ["All", ...Array.from(cats)];
  }, [projects]);

  const filteredAndSortedProjects = useMemo(() => {
    let result = [...projects];

    // Filter
    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Sort
    if (sortOrder === "asc") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOrder === "desc") {
      result.sort((a, b) => b.title.localeCompare(a.title));
    }
    // "featured" retains the default array order

    return result;
  }, [projects, selectedCategory, sortOrder]);

  return (
    <section className="relative bg-background pb-20 sm:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start gap-8 lg:flex-row lg:gap-12">
          {/* Sidebar Controls */}
          <div className="z-20 w-full lg:sticky lg:top-32 lg:w-64 lg:shrink-0">
            {/* Mobile Toggle */}
            <button
              className="flex w-full items-center justify-between rounded-xl border border-border/50 bg-card/30 p-4 font-medium backdrop-blur-md transition-colors hover:bg-card/60 lg:hidden"
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            >
              <div className="flex items-center gap-2">
                <IconFilter className="size-5 text-primary" />
                <span>Filter & Sort</span>
              </div>
              <IconChevronDown
                className={`size-5 text-muted-foreground transition-transform duration-300 ${isMobileFiltersOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Filters Container */}
            <motion.div
              animate={{ height: isMobileFiltersOpen ? "auto" : undefined }}
              className={`mt-4 flex-col gap-8 overflow-hidden lg:mt-0 lg:flex lg:overflow-visible ${isMobileFiltersOpen ? "flex" : "hidden lg:flex"}`}
              initial={false}
            >
              {/* Categories */}
              <div className="flex flex-col gap-3">
                <h3 className="font-mono font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                  Categories
                </h3>
                <ItemGroup className="gap-1">
                  {categories.map((cat) => (
                    <Item
                      className={`cursor-pointer transition-all ${
                        selectedCategory === cat
                          ? "border-primary/20 bg-primary/5 text-primary shadow-sm"
                          : "text-foreground/70 hover:bg-muted/50 hover:text-foreground"
                      }`}
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      variant={selectedCategory === cat ? "outline" : "default"}
                    >
                      <ItemContent>
                        <ItemTitle
                          className={
                            selectedCategory === cat
                              ? "font-bold"
                              : "font-medium"
                          }
                        >
                          {cat}
                        </ItemTitle>
                      </ItemContent>
                    </Item>
                  ))}
                </ItemGroup>
              </div>

              {/* Sort By */}
              <div className="flex flex-col gap-3">
                <h3 className="font-mono font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                  Sort By
                </h3>
                <ItemGroup className="gap-1">
                  <Item
                    className={`cursor-pointer transition-all ${
                      sortOrder === "featured"
                        ? "border-primary/20 bg-primary/5 text-primary shadow-sm"
                        : "text-foreground/70 hover:bg-muted/50 hover:text-foreground"
                    }`}
                    onClick={() => setSortOrder("featured")}
                    variant={sortOrder === "featured" ? "outline" : "default"}
                  >
                    <ItemContent>
                      <ItemTitle
                        className={
                          sortOrder === "featured" ? "font-bold" : "font-medium"
                        }
                      >
                        Featured
                      </ItemTitle>
                    </ItemContent>
                  </Item>

                  <Item
                    className={`cursor-pointer transition-all ${
                      sortOrder === "asc"
                        ? "border-primary/20 bg-primary/5 text-primary shadow-sm"
                        : "text-foreground/70 hover:bg-muted/50 hover:text-foreground"
                    }`}
                    onClick={() => setSortOrder("asc")}
                    variant={sortOrder === "asc" ? "outline" : "default"}
                  >
                    <ItemMedia variant="icon">
                      <IconSortAscending />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle
                        className={
                          sortOrder === "asc" ? "font-bold" : "font-medium"
                        }
                      >
                        A to Z
                      </ItemTitle>
                    </ItemContent>
                  </Item>

                  <Item
                    className={`cursor-pointer transition-all ${
                      sortOrder === "desc"
                        ? "border-primary/20 bg-primary/5 text-primary shadow-sm"
                        : "text-foreground/70 hover:bg-muted/50 hover:text-foreground"
                    }`}
                    onClick={() => setSortOrder("desc")}
                    variant={sortOrder === "desc" ? "outline" : "default"}
                  >
                    <ItemMedia variant="icon">
                      <IconSortDescending />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle
                        className={
                          sortOrder === "desc" ? "font-bold" : "font-medium"
                        }
                      >
                        Z to A
                      </ItemTitle>
                    </ItemContent>
                  </Item>
                </ItemGroup>
              </div>
            </motion.div>
          </div>

          {/* Grid Area */}
          <div className="min-h-[50vh] w-full flex-1">
            <motion.div
              className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2"
              initial="hidden"
              layout
              variants={containerVariants}
              viewport={{ once: true, margin: "-50px" }}
              whileInView="visible"
            >
              <AnimatePresence mode="popLayout">
                {filteredAndSortedProjects.map((project) => (
                  <ProjectCard key={project.slug} project={project} />
                ))}
              </AnimatePresence>

              {/* Empty State */}
              {filteredAndSortedProjects.length === 0 && (
                <motion.div
                  animate={{ opacity: 1 }}
                  className="col-span-full flex flex-col items-center justify-center py-20 text-center"
                  initial={{ opacity: 0 }}
                >
                  <div className="mb-4 inline-flex size-16 items-center justify-center rounded-2xl bg-muted/50">
                    <IconFilter className="size-8 text-muted-foreground/50" />
                  </div>
                  <h3 className="mb-2 font-heading font-semibold text-foreground text-xl">
                    No projects found
                  </h3>
                  <p className="max-w-sm text-center text-muted-foreground">
                    Try adjusting your filters or category selection to see more
                    results.
                  </p>
                  <button
                    className="mt-6 rounded-full bg-primary/10 px-6 py-2 font-medium text-primary transition-colors hover:bg-primary/20"
                    onClick={() => {
                      setSelectedCategory("All");
                      setSortOrder("featured");
                    }}
                  >
                    Reset Filters
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
