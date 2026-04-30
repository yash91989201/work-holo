import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IconStarFilled, IconPlayerPlay } from "@tabler/icons-react";

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
    <section id="testimonials" className="relative bg-background py-20 lg:py-28 overflow-hidden scroll-mt-28">
      {/* Video Thumbnail */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
        className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mb-16"
      >
        <div className="relative rounded-2xl overflow-hidden aspect-video group cursor-pointer">
          <img
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&h=675&fit=crop"
            alt="Team meeting"
            className="w-full h-full object-cover"
          />
          {/* Yellow/Green overlay */}
          <div className="absolute inset-0 bg-primary/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
          
          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex size-20 items-center justify-center rounded-full bg-primary shadow-2xl cursor-pointer"
            >
              <IconPlayerPlay className="size-8 text-primary-foreground fill-primary-foreground ml-1" />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Marquee Text */}
      <div className="relative mb-16 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-muted-foreground/10 mx-4"
            >
              Clients Feedback /
            </span>
          ))}
        </div>
      </div>

      {/* Testimonials Carousel */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        {/* Avatars */}
        <motion.div variants={itemVariants} className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            {testimonials.map((testimonial, index) => (
              <button
                key={testimonial.id}
                onClick={() => setActiveIndex(index)}
                className={`relative transition-all duration-300 ${
                  index === activeIndex
                    ? "scale-110 z-10"
                    : "scale-90 opacity-60 hover:opacity-80"
                }`}
              >
                <div
                  className={`size-14 rounded-full overflow-hidden border-2 transition-colors duration-300 ${
                    index === activeIndex
                      ? "border-primary"
                      : "border-border/50"
                  }`}
                >
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Name & Title */}
        <motion.div variants={itemVariants} className="text-center mb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-foreground">
                {testimonials[activeIndex].name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {testimonials[activeIndex].title}
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Cards */}
        <div className="relative flex items-center justify-center gap-4 lg:gap-6">
          {/* Left Card */}
          <motion.div
            variants={itemVariants}
            className="hidden lg:block w-[30%] shrink-0"
          >
            <TestimonialCard
              testimonial={testimonials[getCardIndex(-1)]}
              variant="side"
            />
          </motion.div>

          {/* Center Card */}
          <motion.div variants={itemVariants} className="w-full lg:w-[40%] shrink-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
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
            variants={itemVariants}
            className="hidden lg:block w-[30%] shrink-0"
          >
            <TestimonialCard
              testimonial={testimonials[getCardIndex(1)]}
              variant="side"
            />
          </motion.div>
        </div>

        {/* Pagination Dots */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center gap-2 mt-10"
        >
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`transition-all duration-300 rounded-full ${
                index === activeIndex
                  ? "w-6 h-2 bg-primary"
                  : "w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
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
      className={`relative rounded-2xl p-6 lg:p-8 transition-all duration-300 ${
        isCenter
          ? "bg-card border border-border/50 shadow-lg"
          : "bg-card/40 border border-border/20 opacity-40"
      }`}
    >
      {/* Stars */}
      <div className="flex justify-center gap-1 mb-4">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <IconStarFilled
            key={i}
            className={`size-4 ${
              isCenter ? "text-primary" : "text-primary/50"
            }`}
          />
        ))}
      </div>

      {/* Quote */}
      <p
        className={`text-center leading-relaxed ${
          isCenter
            ? "text-sm text-muted-foreground"
            : "text-xs text-muted-foreground/60"
        }`}
      >
        {testimonial.quote}
      </p>
    </div>
  );
}
