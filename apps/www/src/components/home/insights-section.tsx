import { IconChevronRight } from "@tabler/icons-react";
import { motion } from "motion/react";

const posts = [
  {
    id: 1,
    title: "How to Successfully Migrate Your Business to the Cloud",
    category: "Development",
    author: "Eade Marren",
    date: { day: "08", month: "NOV" },
    image:
      "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=500&h=300&fit=crop",
  },
  {
    id: 2,
    title: "Building a Stronger Workforce with IT Training",
    category: "Cybersecurity",
    author: "Eade Marren",
    date: { day: "08", month: "NOV" },
    image:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&h=300&fit=crop",
  },
  {
    id: 3,
    title: "Optimizing Your IT Budget: Tips and Strategies",
    category: "Automation",
    author: "Eade Marren",
    date: { day: "08", month: "NOV" },
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop",
  },
];

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

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function InsightsSection() {
  return (
    <section
      className="relative scroll-mt-28 overflow-hidden bg-background py-20 lg:py-28"
      id="insights"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <p className="mb-5 font-medium text-primary text-sm uppercase tracking-[0.2em]">
            [ INSIGHTS & INNOVATION ]
          </p>
          <h2 className="font-bold text-3xl text-foreground leading-[1.1] tracking-tight sm:text-4xl lg:text-[2.75rem]">
            Explore Latest Insights, &
            <br />
            Innovations.
          </h2>
        </motion.div>

        {/* Posts Grid */}
        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
          initial="hidden"
          variants={containerVariants}
          viewport={{ once: true, margin: "-80px" }}
          whileInView="visible"
        >
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function BlogCard({ post }: { post: (typeof posts)[number] }) {
  return (
    <motion.div
      className="group"
      transition={{ duration: 0.3 }}
      variants={cardVariants}
      whileHover={{ y: -4 }}
    >
      <div className="relative h-full overflow-hidden rounded-2xl border border-border/40 bg-card/50 transition-all duration-300 hover:border-border/70">
        {/* Image */}
        <div className="relative m-3 aspect-[16/10] overflow-hidden rounded-xl">
          <img
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            src={post.image}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent" />

          {/* Date Badge */}
          <div className="absolute top-3 left-3 rounded-lg bg-background/90 px-3 py-2 text-center backdrop-blur-sm">
            <span className="block font-bold text-foreground text-lg leading-none">
              {post.date.day}
            </span>
            <span className="mt-0.5 block font-medium text-[10px] text-muted-foreground uppercase tracking-wider">
              {post.date.month}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 pt-3">
          <div className="mb-3 flex items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 font-medium text-primary text-xs">
              {post.category}
            </span>
            <span className="text-muted-foreground text-xs">
              By {post.author}
            </span>
          </div>

          <h3 className="mb-4 font-semibold text-base text-foreground leading-snug">
            {post.title}
          </h3>

          <a
            className="inline-flex items-center gap-1 font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
            href="#"
          >
            Read More
            <IconChevronRight className="size-3.5" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
