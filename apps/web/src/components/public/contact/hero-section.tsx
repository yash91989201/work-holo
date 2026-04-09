import { IconMessage } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { ContactForm } from "./contact-form";

const stats = [
  { label: "Projects Delivered", value: "1500+" },
  { label: "Global Clients", value: "1000+" },
  { label: "Client Retention", value: "98%" },
  { label: "Support Available", value: "24/7" },
];

const tags = ["React", "Node.js", "AWS", "Salesforce", "AI/ML", "DevOps"];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background pt-32 pb-20 md:pt-48 md:pb-32">
      <div className="pointer-events-none absolute top-0 left-0 h-full w-full overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute right-[-10%] bottom-[-10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-[1440px] items-center gap-16 px-6 md:px-12 lg:grid-cols-2">
        <motion.div
          animate={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-2 font-semibold text-primary text-sm">
            <IconMessage size={16} />
            GET IN TOUCH
          </div>
          <h1 className="mb-8 font-extrabold text-5xl leading-[1.1] tracking-tight md:text-7xl">
            Let's Build Something <br />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Extraordinary
            </span>
          </h1>
          <p className="mb-12 max-w-xl text-muted-foreground text-xl leading-relaxed">
            Have a project in mind? Fill out the form and let's discuss how
            WorkHolo Labs can transform your vision into reality.
          </p>

          <div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="mb-1 font-bold text-3xl">{stat.value}</div>
                <div className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => (
              <span
                className="rounded-full border border-border bg-muted/50 px-4 py-1.5 font-medium text-muted-foreground text-sm"
                key={tag}
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-border bg-card p-8 text-card-foreground shadow-2xl md:p-10"
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="mb-2 font-bold text-3xl">Send Us a Message</h2>
          <p className="mb-8 text-muted-foreground">
            We'll get back to you within 24 hours.
          </p>
          <ContactForm />
        </motion.div>
      </div>
    </section>
  );
}
