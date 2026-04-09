import { IconArrowRight } from "@tabler/icons-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative flex h-[400px] items-center justify-center overflow-hidden md:h-[500px]">
      <div className="absolute inset-0 bg-zinc-950">
        <img
          alt="Hero Background"
          className="h-full w-full object-cover opacity-30"
          height="1080"
          referrerPolicy="no-referrer"
          src="https://picsum.photos/seed/office-dark/1920/1080?blur=5"
          width="1920"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-950" />
      </div>

      <div className="relative z-10 max-w-4xl px-4 text-center">
        <motion.h1
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 font-bold text-4xl text-white md:text-6xl"
          initial={{ opacity: 0, y: 20 }}
        >
          Our <span className="text-primary">Portfolio</span>
        </motion.h1>
        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="text-lg text-zinc-300 md:text-xl"
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.1 }}
        >
          See how we transform ideas into powerful digital experiences.
        </motion.p>
      </div>
    </section>
  );
}

export function HireSection() {
  return (
    <section className="overflow-hidden bg-primary/5 px-4 py-20 md:px-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 lg:flex-row">
        <div className="flex-1">
          <h2 className="mb-6 font-bold text-3xl text-foreground leading-tight md:text-5xl">
            Hire world-class Web and Mobile App development team for your
            Project
          </h2>
          <p className="mb-8 max-w-2xl text-lg text-muted-foreground">
            Contact our Web and Mobile App Development Company if you have any
            app ideas. We have a professional Android and iOS App Development
            Team who develop clients' projects excellently and deliver the
            project on a timeline.
          </p>
          <Button
            className="rounded-full font-bold shadow-lg transition-all hover:scale-105 active:scale-95"
            size="lg"
            type="button"
          >
            Start Your Project <IconArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
        <div className="relative flex-1">
          <motion.div
            className="overflow-hidden rounded-3xl shadow-2xl"
            initial={{ x: 100, opacity: 0 }}
            viewport={{ once: true }}
            whileInView={{ x: 0, opacity: 1 }}
          >
            <img
              alt="Team Working"
              className="h-auto w-full"
              height="600"
              referrerPolicy="no-referrer"
              src="https://picsum.photos/seed/team-work/800/600"
              width="800"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
