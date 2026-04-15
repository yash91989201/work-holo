import { motion } from "motion/react";

export const EducationFeatures = () => {
  const features = [
    {
      title: "Interactive Lessons",
      icon: "https://picsum.photos/seed/feat1/60/60",
    },
    {
      title: "Progress Tracking",
      icon: "https://picsum.photos/seed/feat2/60/60",
    },
    {
      title: "Multi-Device & Accessibility",
      icon: "https://picsum.photos/seed/feat3/60/60",
    },
    { title: "Offline Mode", icon: "https://picsum.photos/seed/feat4/60/60" },
  ];

  return (
    <section className="bg-white px-4 py-20 md:px-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-16 md:flex-row">
        <motion.div
          className="md:w-1/2"
          initial={{ opacity: 0, x: -30 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <img
            alt="Features"
            className="rounded-3xl shadow-2xl"
            referrerPolicy="no-referrer"
            src="https://picsum.photos/seed/features-img/500/600"
          />
        </motion.div>
        <div className="md:w-1/2">
          <h2 className="mb-12 font-bold text-4xl text-gray-900 leading-tight">
            Key Features for Seamless Functionality
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {features.map((f, i) => (
              <motion.div
                className="flex flex-col items-start gap-4 rounded-2xl border border-gray-100 bg-white p-6 transition-shadow hover:shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                key={f.title}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <img
                  alt={f.title}
                  className="h-12 w-12 rounded-xl"
                  src={f.icon}
                />
                <h3 className="font-bold text-gray-800 text-lg">{f.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
