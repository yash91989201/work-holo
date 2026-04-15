import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";

interface AboutHeroProps {
  badge?: string;
  subtitle: string;
  title: string;
}

export function AboutHero({ title, subtitle, badge }: AboutHeroProps) {
  return (
    <section className="relative overflow-hidden bg-primary py-24 text-primary-foreground md:py-32">
      <div className="container relative z-10 mx-auto px-4 text-center">
        {badge && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
          >
            <Badge
              className="rounded-full px-4 py-1 font-medium text-sm"
              variant="secondary"
            >
              {badge}
            </Badge>
          </motion.div>
        )}
        <motion.h1
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 font-bold text-4xl tracking-tight sm:text-5xl md:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.1 }}
        >
          {title}
        </motion.h1>
        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-2xl text-lg text-primary-foreground/80 sm:text-xl"
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.2 }}
        >
          {subtitle}
        </motion.p>
      </div>
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,hsl(var(--primary-foreground)/_0.1)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary-foreground)/_0.1)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black_70%,transparent_100%)]" />
    </section>
  );
}
