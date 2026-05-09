import { 
  IconArrowRight,
  IconArrowUpRight, 
  IconFilter, 
  IconSortAscending, 
  IconSortDescending, 
  IconChevronDown 
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useState, useMemo } from "react";
import { getProjectList } from "./project-data";
import type { ProjectListItem } from "./project-data";
import { Item, ItemGroup, ItemContent, ItemTitle, ItemMedia } from "@work-holo/ui/components/item";

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
  }
};

function ProjectCard({ project }: { project: ProjectListItem }) {
  return (
    <motion.div
      layout
      layoutId={`project-card-${project.slug}`}
      className="group relative flex h-full flex-col"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={{ y: -4, transition: { duration: 0.35, ease: EASE } }}
    >
      <Link className="flex h-full flex-col outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-3xl" to={project.href}>
        <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-border/50 bg-card/20 p-8 transition-all duration-500 hover:border-primary/20 hover:bg-card/40 hover:shadow-sm sm:p-10">
          
          <div>
            {project.image && (
              <div className="mb-8 overflow-hidden rounded-2xl border border-border/20 bg-muted/20">
                <img 
                  src={project.image} 
                  alt={`${project.title} showcase`} 
                  className="aspect-[16/9] w-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
              </div>
            )}
            
            <div className="mb-8 flex items-start justify-between gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                {project.icon}
              </div>
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-background/50 text-muted-foreground/50 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 group-hover:text-primary group-hover:shadow-sm">
                <IconArrowUpRight className="size-4" />
              </div>
            </div>

            <div className="mb-4 flex items-center">
              <span className="inline-flex items-center rounded-full border border-border/50 bg-background/50 px-3 py-1 text-xs font-medium text-muted-foreground transition-colors group-hover:border-primary/20 group-hover:text-primary">
                {project.category || "Uncategorized"}
              </span>
            </div>
            
            <h3 className="mb-4 font-heading text-2xl font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
              {project.title}
            </h3>
            
            <p className="mb-8 text-base leading-relaxed text-muted-foreground line-clamp-3">
              {project.description}
            </p>
          </div>
          
          <div className="mt-auto flex items-center gap-2 text-sm font-medium text-foreground transition-colors group-hover:text-primary">
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
  const [sortOrder, setSortOrder] = useState<"featured" | "asc" | "desc">("featured");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const projects = getProjectList();
  
  const categories = useMemo(() => {
    const cats = new Set(projects.map(p => p.category).filter(Boolean));
    return ["All", ...Array.from(cats)];
  }, [projects]);

  const filteredAndSortedProjects = useMemo(() => {
    let result = [...projects];
    
    // Filter
    if (selectedCategory !== "All") {
      result = result.filter(p => p.category === selectedCategory);
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
        
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          
          {/* Sidebar Controls */}
          <div className="w-full lg:w-64 lg:shrink-0 lg:sticky lg:top-32 z-20">
            {/* Mobile Toggle */}
            <button 
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
              className="lg:hidden flex w-full items-center justify-between rounded-xl border border-border/50 bg-card/30 p-4 font-medium backdrop-blur-md transition-colors hover:bg-card/60"
            >
              <div className="flex items-center gap-2">
                <IconFilter className="size-5 text-primary" />
                <span>Filter & Sort</span>
              </div>
              <IconChevronDown className={`size-5 text-muted-foreground transition-transform duration-300 ${isMobileFiltersOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Filters Container */}
            <motion.div 
              initial={false}
              animate={{ height: isMobileFiltersOpen ? "auto" : undefined }}
              className={`mt-4 lg:mt-0 flex-col gap-8 overflow-hidden lg:flex lg:overflow-visible ${isMobileFiltersOpen ? "flex" : "hidden lg:flex"}`}
            >
              {/* Categories */}
              <div className="flex flex-col gap-3">
                <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">Categories</h3>
                <ItemGroup className="gap-1">
                  {categories.map(cat => (
                    <Item
                      key={cat}
                      variant={selectedCategory === cat ? "outline" : "default"}
                      className={`cursor-pointer transition-all ${
                        selectedCategory === cat 
                          ? "bg-primary/5 border-primary/20 text-primary shadow-sm" 
                          : "text-foreground/70 hover:bg-muted/50 hover:text-foreground"
                      }`}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      <ItemContent>
                        <ItemTitle className={selectedCategory === cat ? "font-bold" : "font-medium"}>{cat}</ItemTitle>
                      </ItemContent>
                    </Item>
                  ))}
                </ItemGroup>
              </div>

              {/* Sort By */}
              <div className="flex flex-col gap-3">
                <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sort By</h3>
                <ItemGroup className="gap-1">
                  <Item
                    variant={sortOrder === "featured" ? "outline" : "default"}
                    className={`cursor-pointer transition-all ${
                      sortOrder === "featured" 
                        ? "bg-primary/5 border-primary/20 text-primary shadow-sm" 
                        : "text-foreground/70 hover:bg-muted/50 hover:text-foreground"
                    }`}
                    onClick={() => setSortOrder("featured")}
                  >
                    <ItemContent>
                      <ItemTitle className={sortOrder === "featured" ? "font-bold" : "font-medium"}>Featured</ItemTitle>
                    </ItemContent>
                  </Item>
                  
                  <Item
                    variant={sortOrder === "asc" ? "outline" : "default"}
                    className={`cursor-pointer transition-all ${
                      sortOrder === "asc" 
                        ? "bg-primary/5 border-primary/20 text-primary shadow-sm" 
                        : "text-foreground/70 hover:bg-muted/50 hover:text-foreground"
                    }`}
                    onClick={() => setSortOrder("asc")}
                  >
                    <ItemMedia variant="icon"><IconSortAscending /></ItemMedia>
                    <ItemContent>
                      <ItemTitle className={sortOrder === "asc" ? "font-bold" : "font-medium"}>A to Z</ItemTitle>
                    </ItemContent>
                  </Item>

                  <Item
                    variant={sortOrder === "desc" ? "outline" : "default"}
                    className={`cursor-pointer transition-all ${
                      sortOrder === "desc" 
                        ? "bg-primary/5 border-primary/20 text-primary shadow-sm" 
                        : "text-foreground/70 hover:bg-muted/50 hover:text-foreground"
                    }`}
                    onClick={() => setSortOrder("desc")}
                  >
                    <ItemMedia variant="icon"><IconSortDescending /></ItemMedia>
                    <ItemContent>
                      <ItemTitle className={sortOrder === "desc" ? "font-bold" : "font-medium"}>Z to A</ItemTitle>
                    </ItemContent>
                  </Item>
                </ItemGroup>
              </div>
            </motion.div>
          </div>

          {/* Grid Area */}
          <div className="flex-1 w-full min-h-[50vh]">
            <motion.div
              layout
              className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2"
              initial="hidden"
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
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="col-span-full py-20 text-center flex flex-col items-center justify-center"
                >
                  <div className="inline-flex size-16 items-center justify-center rounded-2xl bg-muted/50 mb-4">
                    <IconFilter className="size-8 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-foreground mb-2">No projects found</h3>
                  <p className="text-muted-foreground max-w-sm text-center">Try adjusting your filters or category selection to see more results.</p>
                  <button 
                    onClick={() => { setSelectedCategory("All"); setSortOrder("featured"); }}
                    className="mt-6 px-6 py-2 rounded-full bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors"
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
