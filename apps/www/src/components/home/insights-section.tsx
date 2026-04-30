import { motion } from "motion/react";
import { IconChevronRight } from "@tabler/icons-react";

const posts = [
  {
    id: 1,
    title: "How to Successfully Migrate Your Business to the Cloud",
    category: "Development",
    author: "Eade Marren",
    date: { day: "08", month: "NOV" },
    image: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=500&h=300&fit=crop",
  },
  {
    id: 2,
    title: "Building a Stronger Workforce with IT Training",
    category: "Cybersecurity",
    author: "Eade Marren",
    date: { day: "08", month: "NOV" },
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&h=300&fit=crop",
  },
  {
    id: 3,
    title: "Optimizing Your IT Budget: Tips and Strategies",
    category: "Automation",
    author: "Eade Marren",
    date: { day: "08", month: "NOV" },
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop",
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
    <section id="insights" className="relative bg-background py-20 lg:py-28 overflow-hidden scroll-mt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
          className="text-center mb-12"
        >
          <p className="text-sm font-medium tracking-[0.2em] text-primary uppercase mb-5">
            [ INSIGHTS & INNOVATION ]
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-foreground leading-[1.1] tracking-tight">
            Explore Latest Insights, &
            <br />
            Innovations.
          </h2>
        </motion.div>

        {/* Posts Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function BlogCard({
  post,
}: {
  post: (typeof posts)[number];
}) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <div className="relative bg-card/50 border border-border/40 hover:border-border/70 rounded-2xl overflow-hidden transition-all duration-300 h-full">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden m-3 rounded-xl">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent" />

          {/* Date Badge */}
          <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 text-center">
            <span className="block text-lg font-bold text-foreground leading-none">
              {post.date.day}
            </span>
            <span className="block text-[10px] font-medium text-muted-foreground uppercase tracking-wider mt-0.5">
              {post.date.month}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 pt-3">
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {post.category}
            </span>
            <span className="text-xs text-muted-foreground">
              By {post.author}
            </span>
          </div>

          <h3 className="text-base font-semibold text-foreground mb-4 leading-snug">
            {post.title}
          </h3>

          <a
            href="#"
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Read More
            <IconChevronRight className="size-3.5" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
