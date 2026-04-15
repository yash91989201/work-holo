import { motion } from "motion/react";

export function TeamSection() {
  return (
    <section className="bg-background py-20 md:py-32" id="team">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid items-center gap-16 md:gap-20 lg:grid-cols-2">
          <motion.div
            className="space-y-8 md:space-y-10"
            initial={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false, amount: 0.3 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <div className="space-y-4">
              <span className="font-bold text-primary text-xs uppercase tracking-widest">
                Experts
              </span>
              <h2 className="font-bold font-display text-4xl text-foreground leading-tight md:text-5xl lg:text-6xl">
                We build solutions that businesses can launch instantly{" "}
                <span className="text-primary">excellence</span>
              </h2>
            </div>
            <p className="max-w-md text-lg text-muted-foreground leading-relaxed md:text-xl">
              Our team designs and develops ready-to-use digital products and
              custom solutions to help businesses grow faster without starting
              from scratch.
            </p>
            <button
              className="w-full bg-primary px-8 py-4 font-bold text-primary-foreground text-sm uppercase tracking-widest transition-all duration-300 hover:bg-foreground hover:text-background md:w-auto md:px-10 md:py-5"
              type="button"
            >
              The Team
            </button>
          </motion.div>
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                className="aspect-square overflow-hidden rounded-xl grayscale transition-all duration-500 hover:grayscale-0"
                initial={{ opacity: 0, scale: 0.8 }}
                key={i}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: false, amount: 0.3 }}
                whileInView={{ opacity: 1, scale: 1 }}
              >
                <motion.div
                  animate={{ y: [0, i % 2 === 0 ? -10 : 10, 0] }}
                  className="h-full w-full"
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 4 + i,
                    ease: "easeInOut",
                  }}
                >
                  <img
                    alt={`Team Member ${i}`}
                    className="h-full w-full object-cover"
                    height={300}
                    referrerPolicy="no-referrer"
                    src={`https://picsum.photos/seed/team${i}/600/600`}
                    width={300}
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
