import { motion } from "motion/react";

const PRIMARY_PURPLE = "#7B2CBF";

export const EducationHero = () => {
  return (
    <section className="relative overflow-hidden bg-[#F5F3FF] px-4 pt-20 pb-32 md:px-12">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <motion.div
          className="z-10"
          initial={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <h1 className="mb-6 font-extrabold text-4xl text-gray-900 leading-[1.1] md:text-6xl">
            Responsive and Scalable <br />
            <span className="text-[#7B2CBF]">eLearning</span> <br />
            Development
          </h1>
          <div className="mb-8 flex items-center gap-3">
            <p className="max-w-md text-gray-600 text-lg">
              Powerful Features to Enhance Learning and Engagement!
            </p>
          </div>
          <button
            className="rounded-lg px-10 py-4 font-bold text-lg text-white shadow-lg transition-transform hover:scale-105"
            style={{ backgroundColor: PRIMARY_PURPLE }}
          >
            View Demo
          </button>
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, scale: 1 }}
        >
          <div className="relative z-10">
            <img
              alt="E-Learning App"
              className="mx-auto w-full max-w-md rounded-[3rem] border-[12px] border-white drop-shadow-2xl"
              referrerPolicy="no-referrer"
              src="https://picsum.photos/seed/hero-app/600/800"
            />
          </div>
          <div className="absolute -right-10 -bottom-10 z-20 hidden md:block">
            <img
              alt="Student"
              className="h-64 w-64 rounded-full border-8 border-white object-cover shadow-xl"
              referrerPolicy="no-referrer"
              src="https://picsum.photos/seed/student/400/400"
            />
          </div>
          {/* Decorative elements */}
          <div className="absolute top-1/2 left-1/2 -z-10 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-200 opacity-30 blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
};
