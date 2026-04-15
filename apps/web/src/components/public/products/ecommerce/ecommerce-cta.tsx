import { motion } from "motion/react";

export default function EcommerceCta() {
  return (
    <section className="overflow-hidden bg-pink-400 py-20 text-white">
      <div className="container mx-auto flex flex-col items-center justify-between gap-12 px-4 md:flex-row">
        <motion.h2
          className="text-center font-black text-4xl md:text-left md:text-5xl"
          initial={{ opacity: 0, x: -50 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          Custom E-Commerce <br /> Apps for All
        </motion.h2>
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.8 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, scale: 1 }}
        >
          <img
            alt="Shopping Woman"
            className="h-72 w-72 rounded-full border-8 border-white/20 object-cover md:h-96 md:w-96"
            referrerPolicy="no-referrer"
            src="https://picsum.photos/seed/shopping-woman/500/500"
          />
        </motion.div>
      </div>
    </section>
  );
}
