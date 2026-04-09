import { motion } from "framer-motion";

const LOGOS = [
  {
    name: "slack",
    url: "https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg",
  },
  {
    name: "github",
    url: "https://cdn.worldvectorlogo.com/logos/github-icon-1.svg",
  },
  { name: "loom", url: "https://cdn.worldvectorlogo.com/logos/loom-4.svg" },
  { name: "miro", url: "https://cdn.worldvectorlogo.com/logos/miro-2.svg" },
  {
    name: "framer",
    url: "https://cdn.worldvectorlogo.com/logos/framer-icon.svg",
  },
  {
    name: "airbnb",
    url: "https://cdn.worldvectorlogo.com/logos/airbnb-2-1.svg",
  },
];

export function LogoBar() {
  return (
    <section className="border-border border-y py-12 md:py-16">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          className="flex flex-wrap items-center justify-center gap-8 opacity-40 grayscale transition-all hover:grayscale-0 md:gap-12 lg:gap-20"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false, amount: 0.3 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          {LOGOS.map((logo) => (
            <img
              alt={logo.name}
              className="h-6 w-auto md:h-8 lg:h-10"
              height={32}
              key={logo.name}
              referrerPolicy="no-referrer"
              src={logo.url}
              width={100}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
