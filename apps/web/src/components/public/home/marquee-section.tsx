import { motion } from "framer-motion";

export function MarqueeSection() {
  return (
    <motion.section
      className="overflow-hidden border-border border-y bg-background py-12 md:py-20"
      initial={{ opacity: 0, y: 40 }}
      transition={{ duration: 1 }}
      viewport={{ once: false, amount: 0.3 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className="flex animate-marquee whitespace-nowrap">
        {[1, 2].map((i) => (
          <div
            className="mx-6 flex items-center gap-12 md:mx-10 md:gap-20"
            key={i}
          >
            <span className="font-black font-display text-5xl text-foreground uppercase tracking-tighter md:text-8xl lg:text-[120px]">
              Custom Website Development
            </span>
            <div className="flex h-10 w-10 rotate-45 items-center justify-center rounded-lg bg-primary md:h-16 md:w-16">
              <div className="h-5 w-5 rounded-sm border-2 border-primary-foreground md:h-8 md:w-8 md:border-4" />
            </div>
            <span className="font-black font-display text-5xl text-foreground uppercase tracking-tighter md:text-8xl lg:text-[120px]">
              Ready-Made Software
            </span>
            <div className="flex h-10 w-10 rotate-45 items-center justify-center rounded-lg bg-primary md:h-16 md:w-16">
              <div className="h-5 w-5 rounded-sm border-2 border-primary-foreground md:h-8 md:w-8 md:border-4" />
            </div>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }

        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </motion.section>
  );
}
