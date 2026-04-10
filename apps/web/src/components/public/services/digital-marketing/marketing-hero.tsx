import { IconChevronRight } from "@tabler/icons-react";
import { motion } from "framer-motion";

export const MarketingHero = () => (
  <section className="relative overflow-hidden bg-[#05070A] px-4 py-20 text-center text-white md:px-12">
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(circle_at_50%_50%,#7B2CBF,transparent_70%)]" />
    </div>
    <div className="relative z-10 mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-center gap-2 text-[12px] uppercase tracking-widest opacity-60">
        <span>Home</span>
        <IconChevronRight size={12} />
        <span>Services</span>
        <IconChevronRight size={12} />
        <span className="text-yellow-500">Digital Marketing Solutions</span>
      </div>
      <motion.h1
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 font-extrabold text-5xl leading-tight md:text-7xl"
        initial={{ opacity: 0, y: 20 }}
      >
        Digital <span className="text-yellow-500">Marketing</span> Solutions
      </motion.h1>
      <motion.p
        animate={{ opacity: 1 }}
        className="mx-auto mb-10 max-w-3xl text-lg leading-relaxed opacity-80 md:text-xl"
        initial={{ opacity: 0 }}
        transition={{ delay: 0.2 }}
      >
        Integrated Growth Strategies Powered by Data, Performance & Technology
      </motion.p>
      <motion.p
        animate={{ opacity: 1 }}
        className="mx-auto mb-12 max-w-2xl text-sm italic opacity-60 md:text-base"
        initial={{ opacity: 0 }}
        transition={{ delay: 0.3 }}
      >
        WorkHolo Labs delivers structured digital marketing solutions designed
        to help businesses attract, convert, and retain customers through
        measurable performance strategies. Marketing should generate predictable
        growth, not unpredictable spending.
      </motion.p>
      <motion.div
        animate={{ opacity: 1 }}
        className="flex justify-center gap-4"
        initial={{ opacity: 0 }}
        transition={{ delay: 0.4 }}
      >
        <button className="rounded-xl bg-yellow-500 px-8 py-4 font-bold text-[#05070A] text-lg shadow-xl shadow-yellow-500/20 transition-all hover:bg-yellow-600">
          Get Started
        </button>
        <button className="rounded-xl border border-white px-8 py-4 font-bold text-lg text-white transition-all hover:bg-white/10">
          Learn More
        </button>
      </motion.div>
    </div>
  </section>
);
