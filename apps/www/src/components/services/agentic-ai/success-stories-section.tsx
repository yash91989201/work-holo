import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const stories = [
  {
    company: "Keller Williams",
    category: "Real Estate",
    title: "To build a Digital Marketing Tool that streamlines",
    gradient: "from-amber-500/20 to-orange-600/20",
    logo: "KW",
  },
  {
    company: "KW SMART",
    category: "Real Estate",
    title: "High-Impact Automation for Realtors",
    gradient: "from-blue-500/20 to-cyan-600/20",
    logo: "KW SMART",
  },
  {
    company: "Leap",
    category: "Contractors",
    title: "Boosting Sales for Roofing & Remodeling Teams",
    gradient: "from-emerald-500/20 to-teal-600/20",
    logo: "Leap",
  },
];

export function SuccessStoriesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const visibleStories = [
    stories[currentIndex],
    stories[(currentIndex + 1) % stories.length],
    stories[(currentIndex + 2) % stories.length],
  ];

  return (
    <section className="relative py-20 lg:py-28 bg-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col items-center"
        >
          {/* Heading */}
          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary"
          >
            Real-World Success Stories
          </motion.h2>

          {/* Carousel */}
          <motion.div
            variants={itemVariants}
            className="mt-14 w-full relative"
          >
            <div className="flex items-center gap-4">
              {/* Prev button */}
              <button
                onClick={prevSlide}
                className="hidden md:flex shrink-0 size-10 items-center justify-center rounded-full border border-border/50 bg-card/80 hover:bg-card transition-colors"
                aria-label="Previous story"
              >
                <IconChevronLeft className="size-5 text-foreground" />
              </button>

              {/* Cards */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {visibleStories.map((story, index) => (
                    <motion.div
                      key={`${currentIndex}-${index}`}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="group cursor-pointer"
                    >
                      {/* Image card */}
                      <div
                        className={`relative aspect-[16/10] rounded-2xl bg-gradient-to-br ${story.gradient} overflow-hidden border border-border/30`}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="grid grid-cols-3 gap-3 p-6">
                            {Array.from({ length: 9 }).map((_, i) => (
                              <div
                                key={i}
                                className="size-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center"
                              >
                                <div className="size-4 rounded-sm bg-primary/30" />
                              </div>
                            ))}
                          </div>
                        </div>
                        {/* Bottom overlay */}
                        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-4 bg-gradient-to-t from-black/60 to-transparent">
                          <span className="text-sm font-bold text-white">
                            {story.logo}
                          </span>
                          <span className="text-xs text-white/80 flex items-center gap-1">
                            <span className="size-3 rounded-sm bg-white/40" />
                            {story.category}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="mt-4 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {story.title}
                      </h3>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Next button */}
              <button
                onClick={nextSlide}
                className="hidden md:flex shrink-0 size-10 items-center justify-center rounded-full border border-border/50 bg-card/80 hover:bg-card transition-colors"
                aria-label="Next story"
              >
                <IconChevronRight className="size-5 text-foreground" />
              </button>
            </div>

            {/* Mobile navigation */}
            <div className="flex md:hidden items-center justify-center gap-4 mt-6">
              <button
                onClick={prevSlide}
                className="flex size-10 items-center justify-center rounded-full border border-border/50 bg-card/80"
                aria-label="Previous story"
              >
                <IconChevronLeft className="size-5 text-foreground" />
              </button>
              <button
                onClick={nextSlide}
                className="flex size-10 items-center justify-center rounded-full border border-border/50 bg-card/80"
                aria-label="Next story"
              >
                <IconChevronRight className="size-5 text-foreground" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
