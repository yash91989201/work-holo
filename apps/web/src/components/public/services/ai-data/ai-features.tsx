import { motion } from "motion/react";

interface Feature {
  description: string;
  id: string;
  title: string;
}

interface AiFeaturesProps {
  features: Feature[];
  subtitle?: string;
  title: string;
}

export default function AiFeatures({
  title,
  subtitle,
  features,
}: AiFeaturesProps) {
  return (
    <section className="bg-white px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <motion.h2
            className="mb-4 font-bold text-4xl text-slate-900 md:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            {title}
          </motion.h2>
          {subtitle && (
            <motion.p
              className="text-lg text-slate-500"
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {features.map((feature) => (
            <motion.div
              className="group rounded-3xl border border-slate-100 bg-slate-50 p-10 transition-all duration-500 hover:bg-white hover:shadow-2xl"
              key={feature.id}
              whileHover={{ y: -10 }}
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 font-bold text-lg text-white transition-transform group-hover:scale-110">
                {feature.id}
              </div>
              <h3 className="mb-4 font-bold text-2xl text-slate-900">
                {feature.title}
              </h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
