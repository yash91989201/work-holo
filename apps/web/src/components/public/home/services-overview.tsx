import { IconArrowRight } from "@tabler/icons-react";
import { motion } from "framer-motion";

const SERVICES = [
  {
    title: "Custom Website Development",
    description:
      "We design and develop modern, responsive websites based on your business requirements.",
  },
  {
    title: "Ready-Made Software Solutions",
    description:
      "Choose from pre-built systems like admin dashboards, CRMs, and business tools — ready to deploy.",
  },
  {
    title: "Custom Software Development",
    description:
      "Need something unique? We build tailored software solutions from scratch for your specific needs.",
  },
];

export function ServicesOverview() {
  return (
    <section className="bg-background py-20 md:py-32" id="services">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false, amount: 0.3 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <h2 className="font-bold font-display text-5xl text-foreground leading-tight md:text-6xl lg:text-7xl">
              Empowering you and <br />
              <span className="text-primary">your business</span>
            </h2>
          </motion.div>
          <div className="space-y-12 md:space-y-16">
            {SERVICES.map((service, i) => (
              <motion.div
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                key={service.title}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: false, amount: 0.3 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div className="mb-6 flex items-start justify-between">
                  <h3 className="font-bold font-display text-3xl text-foreground transition-colors group-hover:text-primary md:text-4xl">
                    {service.title}
                  </h3>
                  <div className="ml-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-foreground/20 text-foreground transition-all group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground md:h-12 md:w-12">
                    <IconArrowRight className="h-5 w-5 -rotate-45" />
                  </div>
                </div>
                <p className="max-w-lg text-base text-muted-foreground leading-relaxed md:text-lg">
                  {service.description}
                </p>
                <div className="mt-8 h-px w-full bg-border" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
