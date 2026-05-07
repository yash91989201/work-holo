import { IconPlayerPlay, IconStarFilled } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const testimonials = [
  {
    id: 1,
    name: "Mevon Lane",
    title: "Co. Founder",
    avatar: "https://i.pravatar.cc/150?u=mevon",
    quote:
      "Working with Tkmino has been a game-changer for our business. Their team's professionalism, attention to detail, and innovative solutions have helped us streamline operations and achieve our goals faster than we imagined. We truly feel like a valued partner. The results we've seen after to be our compnay partnering.",
    rating: 5,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    title: "CEO, TechStart",
    avatar: "https://i.pravatar.cc/150?u=sarah",
    quote:
      "The level of expertise and dedication brought to our project was exceptional. They transformed our outdated infrastructure into a modern, scalable system that has significantly improved our team's productivity and customer satisfaction.",
    rating: 5,
  },
  {
    id: 3,
    name: "David Chen",
    title: "CTO, InnovateCorp",
    avatar: "https://i.pravatar.cc/150?u=david",
    quote:
      "Exceptional service from start to finish. Their cybersecurity solutions gave us peace of mind, and their cloud migration strategy was flawless. I highly recommend their services to any business looking to modernize their IT infrastructure.",
    rating: 5,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const getCardIndex = (offset: number) => {
    const len = testimonials.length;
    return (activeIndex + offset + len) % len;
  };

  return (
    <section
      className="relative scroll-mt-28 overflow-hidden bg-background py-20 lg:py-28"
      id="testimonials"
    >
      {/* Video Thumbnail */}
      <motion.div
        className="mx-auto mb-16 max-w-5xl px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <div className="group relative aspect-video cursor-pointer overflow-hidden rounded-2xl">
          <img
            alt="Team meeting"
            className="h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&h=675&fit=crop"
          />
          {/* Yellow/Green overlay */}
          <div className="absolute inset-0 bg-primary/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="flex size-20 cursor-pointer items-center justify-center rounded-full bg-primary shadow-2xl"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <IconPlayerPlay className="ml-1 size-8 fill-primary-foreground text-primary-foreground" />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Marquee Text */}
      <div className="relative mb-16 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              className="mx-4 font-bold text-4xl text-muted-foreground/10 sm:text-5xl lg:text-6xl"
              key={i}
            >
              Clients Feedback /
            </span>
          ))}
        </div>
      </div>

      {/* Testimonials Carousel */}
      <motion.div
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        initial="hidden"
        variants={containerVariants}
        viewport={{ once: true, margin: "-80px" }}
        whileInView="visible"
      >
        {/* Avatars */}
        <motion.div
          className="mb-8 flex justify-center"
          variants={itemVariants}
        >
          <div className="flex items-center gap-3">
            {testimonials.map((testimonial, index) => (
              <button
                className={`relative transition-all duration-300 ${
                  index === activeIndex
                    ? "z-10 scale-110"
                    : "scale-90 opacity-60 hover:opacity-80"
                }`}
                key={testimonial.id}
                onClick={() => setActiveIndex(index)}
              >
                <div
                  className={`size-14 overflow-hidden rounded-full border-2 transition-colors duration-300 ${
                    index === activeIndex
                      ? "border-primary"
                      : "border-border/50"
                  }`}
                >
                  <img
                    alt={testimonial.name}
                    className="h-full w-full object-cover"
                    src={testimonial.avatar}
                  />
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Name & Title */}
        <motion.div className="mb-10 text-center" variants={itemVariants}>
          <AnimatePresence mode="wait">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              initial={{ opacity: 0, y: 10 }}
              key={activeIndex}
              transition={{ duration: 0.3 }}
            >
              <h3 className="font-semibold text-foreground text-lg">
                {testimonials[activeIndex].name}
              </h3>
              <p className="text-muted-foreground text-sm">
                {testimonials[activeIndex].title}
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Cards */}
        <div className="relative flex items-center justify-center gap-4 lg:gap-6">
          {/* Left Card */}
          <motion.div
            className="hidden w-[30%] shrink-0 lg:block"
            variants={itemVariants}
          >
            <TestimonialCard
              testimonial={testimonials[getCardIndex(-1)]}
              variant="side"
            />
          </motion.div>

          {/* Center Card */}
          <motion.div
            className="w-full shrink-0 lg:w-[40%]"
            variants={itemVariants}
          >
            <AnimatePresence mode="wait">
              <motion.div
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.95 }}
                key={activeIndex}
                transition={{
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1] as const,
                }}
              >
                <TestimonialCard
                  testimonial={testimonials[activeIndex]}
                  variant="center"
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Right Card */}
          <motion.div
            className="hidden w-[30%] shrink-0 lg:block"
            variants={itemVariants}
          >
            <TestimonialCard
              testimonial={testimonials[getCardIndex(1)]}
              variant="side"
            />
          </motion.div>
        </div>

        {/* Pagination Dots */}
        <motion.div
          className="mt-10 flex justify-center gap-2"
          variants={itemVariants}
        >
          {testimonials.map((_, index) => (
            <button
              aria-label={`Go to testimonial ${index + 1}`}
              className={`rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "h-2 w-6 bg-primary"
                  : "h-2 w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              key={index}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

function TestimonialCard({
  testimonial,
  variant,
}: {
  testimonial: (typeof testimonials)[number];
  variant: "center" | "side";
}) {
  const isCenter = variant === "center";

  return (
    <div
      className={`relative rounded-2xl p-6 transition-all duration-300 lg:p-8 ${
        isCenter
          ? "border border-border/50 bg-card shadow-lg"
          : "border border-border/20 bg-card/40 opacity-40"
      }`}
    >
      {/* Stars */}
      <div className="mb-4 flex justify-center gap-1">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <IconStarFilled
            className={`size-4 ${
              isCenter ? "text-primary" : "text-primary/50"
            }`}
            key={i}
          />
        ))}
      </div>

      {/* Quote */}
      <p
        className={`text-center leading-relaxed ${
          isCenter
            ? "text-muted-foreground text-sm"
            : "text-muted-foreground/60 text-xs"
        }`}
      >
        {testimonial.quote}
      </p>
    </div>
  );
}
