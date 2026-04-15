import { IconCheck } from "@tabler/icons-react";
import { motion } from "motion/react";

export function FutureSection() {
  return (
    <section className="bg-background py-20 text-foreground md:py-32">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid items-center gap-12 md:gap-20 lg:grid-cols-2">
          <motion.div
            className="hidden aspect-[4/5] overflow-hidden rounded-2xl md:block"
            initial={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false, amount: 0.3 }}
            whileInView={{ opacity: 1, scale: 1 }}
          >
            <motion.div
              animate={{ y: [0, -15, 0] }}
              className="h-full w-full"
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 5,
                ease: "easeInOut",
              }}
            >
              <img
                alt="Future"
                className="h-full w-full object-cover"
                height={800}
                referrerPolicy="no-referrer"
                src="https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=1200"
                width={800}
              />
            </motion.div>
          </motion.div>
          <motion.div
            className="space-y-8 md:space-y-10"
            initial={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false, amount: 0.3 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <div className="space-y-4">
              <span className="font-bold text-primary text-xs uppercase tracking-widest">
                Learn More
              </span>
              <h2 className="font-bold font-display text-4xl leading-tight md:text-5xl lg:text-6xl">
                The future of ready-to-launch digital solutions
              </h2>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed md:text-xl">
              WorkHolo helps businesses launch faster by providing ready-made
              and custom-built websites and software solutions tailored to their
              needs.
            </p>
            <ul className="space-y-4 md:space-y-6">
              {[
                "Pre-built solutions ready for quick deployment",
                "Fully customizable based on client requirements",
                "Scalable systems for long-term growth",
              ].map((item, i) => (
                <motion.li
                  className="flex items-center gap-4 font-medium text-base md:text-lg"
                  initial={{ opacity: 0, x: 20 }}
                  key={item}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  viewport={{ once: false, amount: 0.3 }}
                  whileInView={{ opacity: 1, x: 0 }}
                >
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <IconCheck className="h-4 w-4 text-primary" />
                  </div>
                  {item}
                </motion.li>
              ))}
            </ul>
            <button
              className="w-full bg-primary px-8 py-4 font-bold text-primary-foreground text-sm uppercase tracking-widest transition-all duration-300 hover:bg-foreground hover:text-background md:w-auto md:px-10 md:py-5"
              type="button"
            >
              About Us
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
