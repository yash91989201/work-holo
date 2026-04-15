import { IconStarFilled } from "@tabler/icons-react";
import { motion } from "motion/react";

const TESTIMONIALS = [
  {
    name: "Yashraj Jaiswal",
    location: "India",
    text: "WorkHolo delivered exactly what we needed. The ready-made solution saved us weeks of time.",
    rating: 5,
  },
  {
    name: "Ashish Pandey",
    location: "India",
    text: "Their custom development approach helped us launch quickly with a professional product.",
    rating: 5,
  },
  {
    name: "Startup Founder",
    location: "Bangalore",
    text: "We were struggling to build our MVP, but WorkHolo provided a ready solution that worked perfectly.",
    rating: 5,
  },
  {
    name: "E-commerce Owner",
    location: "Mumbai",
    text: "The online store system was easy to customize and helped us start selling within days.",
    rating: 5,
  },
  {
    name: "Tech Entrepreneur",
    location: "Hyderabad",
    text: "Professional team with great support. They understood our requirements and delivered beyond expectations.",
    rating: 5,
  },
  {
    name: "Small Business Owner",
    location: "Delhi",
    text: "We needed a website fast, and WorkHolo delivered a clean and modern design that fits our brand perfectly.",
    rating: 4,
  },
  {
    name: "Agency Partner",
    location: "Pune",
    text: "We partnered with WorkHolo for multiple projects. Their systems are reliable and easy to scale.",
    rating: 5,
  },
  {
    name: "Product Manager",
    location: "Chennai",
    text: "The dashboard system is powerful and easy to use. It helped us manage our data efficiently.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="bg-muted py-20 text-foreground md:py-32">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          className="mb-16 space-y-4 text-center md:mb-24"
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false, amount: 0.3 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <span className="font-bold text-primary text-xs uppercase tracking-widest">
            Testimonials
          </span>
          <h2 className="font-bold font-display text-5xl md:text-6xl lg:text-7xl">
            What clients say
          </h2>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              className="group rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/30 md:p-10"
              initial={{ opacity: 0, y: 30 }}
              key={t.name}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: false, amount: 0.3 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <div className="mb-6 flex gap-1 md:mb-8">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <IconStarFilled className="h-4 w-4 text-primary" key={idx} />
                ))}
              </div>
              <p className="mb-8 text-base text-muted-foreground italic leading-relaxed md:mb-10 md:text-lg">
                &quot;{t.text}&quot;
              </p>
              <div className="space-y-1">
                <h4 className="font-bold font-display text-lg md:text-xl">
                  {t.name}
                </h4>
                <p className="text-muted-foreground text-sm">{t.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-12 flex justify-center gap-3 md:mt-16">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              className={`h-2 w-2 rounded-full md:h-2.5 md:w-2.5 ${i === 0 ? "bg-primary" : "bg-primary/20"}`}
              key={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
