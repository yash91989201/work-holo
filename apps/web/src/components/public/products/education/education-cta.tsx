import { motion } from "framer-motion";

const PRIMARY_PURPLE = "#7B2CBF";

export const EducationCTA = () => {
  return (
    <section className="bg-[#7B2CBF] px-4 py-24 text-center text-white md:px-12">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="mb-6 font-extrabold text-4xl md:text-5xl">
            Ready to Transform Learning?
          </h2>
          <p className="mb-8 text-lg text-purple-100">
            Get started with our eLearning solutions today and enhance
            educational experiences.
          </p>
          <button className="rounded-lg bg-white px-10 py-4 font-bold text-[#7B2CBF] text-lg shadow-lg transition-transform hover:scale-105">
            Get Started Now
          </button>
        </motion.div>
      </div>
    </section>
  );
};
