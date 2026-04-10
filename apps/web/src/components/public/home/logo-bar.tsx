import { motion } from "framer-motion";
import { Image } from "@/components/shared/image";

const LOGOS = [
  {
    name: "slack",
    url: "/assets/brand-logos/slack.webp",
    aspectRatio: 1,
    wrapperClassName: "h-10 md:h-12 lg:h-14",
  },
  {
    name: "github",
    url: "/assets/brand-logos/github.webp",
    aspectRatio: 1600 / 594,
    wrapperClassName: "h-10 md:h-12 lg:h-14",
  },
  {
    name: "loom",
    url: "/assets/brand-logos/loom.webp",
    aspectRatio: 1,
    wrapperClassName: "h-10 md:h-12 lg:h-14",
  },
  {
    name: "miro",
    url: "/assets/brand-logos/miro.webp",
    aspectRatio: 2400 / 1260,
    wrapperClassName: "h-10 md:h-12 lg:h-14",
  },
  {
    name: "framer",
    url: "/assets/brand-logos/framer.webp",
    aspectRatio: 866 / 650,
    wrapperClassName: "h-10 md:h-12 lg:h-14",
  },
  {
    name: "airbnb",
    url: "/assets/brand-logos/airbnb.webp",
    aspectRatio: 5000 / 1560,
    wrapperClassName: "h-8 md:h-9 lg:h-10",
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
            <Image
              alt={logo.name}
              aspectRatio={logo.aspectRatio}
              className="h-full w-full"
              effect="opacity"
              key={logo.name}
              objectFit="contain"
              placeholder={false}
              sizes="(min-width: 1024px) 224px, (min-width: 768px) 192px, 160px"
              src={logo.url}
              wrapperClassName={logo.wrapperClassName}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
