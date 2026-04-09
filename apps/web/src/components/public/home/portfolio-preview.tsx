import { IconArrowRight } from "@tabler/icons-react";
import { motion } from "framer-motion";

const PORTFOLIO = [
  {
    category: "WEBSITE",
    title: "Business Website Template",
    description: "A ready-to-use modern website...",
    image:
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=800",
  },
  {
    category: "SOFTWARE",
    title: "Admin Dashboard System",
    description: "A complete dashboard solution...",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800",
  },
  {
    category: "E-COMMERCE",
    title: "Online Store System",
    description: "A fully functional e-commerce platform...",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800", // Replaced broken link
  },
];

export function PortfolioPreview() {
  return (
    <section className="bg-background py-20 md:py-32" id="portfolio">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="space-y-20 md:space-y-32">
          {PORTFOLIO.map((item, i) => (
            <motion.div
              className={`grid items-center gap-12 md:gap-20 lg:grid-cols-2 ${i % 2 === 0 ? "" : "lg:flex-row-reverse"}`}
              initial={{ opacity: 0, y: 50 }}
              key={item.title}
              transition={{ duration: 0.8 }}
              viewport={{ once: false, margin: "-100px" }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <div
                className={`order-2 ${i % 2 === 0 ? "lg:order-1" : "lg:order-2"}`}
              >
                <div className="aspect-video overflow-hidden rounded-2xl lg:aspect-[4/3]">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    className="h-full w-full"
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 5 + i,
                      ease: "easeInOut",
                    }}
                  >
                    <img
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                      height={600}
                      referrerPolicy="no-referrer"
                      src={item.image}
                      width={800}
                    />
                  </motion.div>
                </div>
              </div>
              <div
                className={`order-1 space-y-6 md:space-y-8 ${i % 2 === 0 ? "lg:order-2" : "lg:order-1"}`}
              >
                <span className="font-bold text-primary text-xs uppercase tracking-widest">
                  {item.category}
                </span>
                <h2 className="font-bold font-display text-4xl text-foreground leading-tight md:text-5xl lg:text-6xl">
                  {item.title}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed md:text-xl">
                  {item.description}
                </p>
                <a
                  className="group inline-flex items-center gap-4 font-bold text-foreground text-sm uppercase tracking-widest"
                  href="#"
                >
                  Read More
                  <div className="h-px w-12 bg-border transition-all group-hover:w-20 group-hover:bg-primary" />
                  <IconArrowRight className="h-4 w-4 group-hover:text-primary" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
