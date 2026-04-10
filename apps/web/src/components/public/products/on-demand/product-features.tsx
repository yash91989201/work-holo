import type { TablerIcon } from "@tabler/icons-react";
import { motion } from "framer-motion";

interface Feature {
  description: string;
  icon: TablerIcon;
  title: string;
}

interface ProductFeaturesProps {
  features: Feature[];
}

export function ProductFeatures({ features }: ProductFeaturesProps) {
  return (
    <section className="bg-muted/50 py-20">
      <div className="container mx-auto px-4">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4 font-bold text-3xl text-foreground md:text-4xl">
            Key Features
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border bg-card p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              key={index}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <feature.icon className="mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-2 font-semibold text-card-foreground text-xl">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
