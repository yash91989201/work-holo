import { motion } from "framer-motion";

export function BigTextSection() {
  return (
    <section className="relative overflow-hidden bg-background py-20 text-foreground md:py-32">
      <div className="container relative z-10 mx-auto px-6 lg:px-12">
        <div className="mx-auto max-w-5xl text-center">
          <motion.h2
            className="relative z-50 font-black font-display text-4xl uppercase leading-[1.1] tracking-tighter md:text-6xl lg:text-8xl"
            initial={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            whileInView={{ opacity: 1, scale: 1 }}
          >
            <span className="relative inline-block">
              WE BUILD,
              <motion.div
                className="absolute -top-10 -left-10 -z-10 hidden h-20 w-20 overflow-hidden rounded-lg opacity-80 shadow-2xl md:h-24 md:w-24 lg:-left-32 lg:block"
                initial={{ rotate: -10, opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: false, amount: 0.3 }}
                whileInView={{
                  rotate: -15,
                  opacity: 1,
                  y: 0,
                }}
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  className="h-full w-full"
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 3,
                    ease: "easeInOut",
                  }}
                >
                  <img
                    alt="Design"
                    className="h-full w-full object-cover"
                    height={100}
                    referrerPolicy="no-referrer"
                    src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=400"
                    width={100}
                  />
                </motion.div>
              </motion.div>
            </span>
            <br />
            CUSTOMIZE AND SELL
            <br />
            <span className="relative inline-block">
              DIGITAL PRODUCTS
              <motion.div
                className="absolute -right-10 -bottom-10 -z-10 hidden h-24 w-24 overflow-hidden rounded-lg shadow-2xl md:h-32 md:w-32 lg:block"
                initial={{ rotate: 10, opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                viewport={{ once: false, amount: 0.3 }}
                whileInView={{
                  rotate: 15,
                  opacity: 1,
                  y: 0,
                }}
              >
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  className="h-full w-full"
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 4,
                    ease: "easeInOut",
                  }}
                >
                  <img
                    alt="Design"
                    className="h-full w-full object-cover"
                    height={128}
                    referrerPolicy="no-referrer"
                    src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=600"
                    width={128}
                  />
                </motion.div>
              </motion.div>
            </span>
          </motion.h2>
        </div>
      </div>
    </section>
  );
}
