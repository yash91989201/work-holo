import { motion } from "framer-motion";

export default function EcommerceHero() {
  return (
    <section className="relative overflow-hidden bg-[#fdf2f8] pt-32 pb-20 md:pt-48 md:pb-32">
      {/* Background Patterns */}
      <div className="pointer-events-none absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 h-20 w-20 rounded-full border-4 border-pink-500" />
        <div className="absolute right-10 bottom-20 h-32 w-32 rounded-full border-4 border-blue-500" />
        <div className="absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-pink-200" />
      </div>

      <div className="container relative mx-auto grid items-center gap-12 px-4 lg:grid-cols-2">
        <motion.div
          className="max-w-xl"
          initial={{ opacity: 0, x: -50 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <h1 className="mb-8 font-black text-4xl leading-tight md:text-6xl">
            Transform Your <br />
            <span className="text-[#007bff]">E-Commerce Business</span> <br />
            with a Custom Mobile App Solution
          </h1>
          <div className="flex flex-wrap gap-4">
            <button className="rounded-xl bg-[#7B2CBF] px-10 py-4 font-bold text-lg text-white shadow-lg shadow-purple-200 transition-all hover:bg-[#6a24a3]">
              View Demo
            </button>
          </div>
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.8 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, scale: 1 }}
        >
          <div className="relative z-10 flex justify-center">
            <img
              alt="Shopping Illustration"
              className="w-full max-w-md rounded-3xl shadow-2xl"
              referrerPolicy="no-referrer"
              src="https://picsum.photos/seed/hero-shopping/800/600"
            />
          </div>
          {/* Phone Mockup Overlay */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            className="absolute -right-10 -bottom-10 z-20 hidden w-64 md:block"
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <img
              alt="App Screen"
              className="w-full rounded-[2.5rem] border-8 border-white shadow-2xl"
              referrerPolicy="no-referrer"
              src="https://picsum.photos/seed/phone-app/400/800"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
