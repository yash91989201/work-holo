import { motion } from "motion/react";

interface AiHeroProps {
  breadcrumbs: string[];
  ctaHref?: string;
  ctaText?: string;
  description: string;
  title: string;
}

export default function AiHero({
  title,
  description,
  breadcrumbs,
  ctaText,
  ctaHref,
}: AiHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#050B18] px-4 py-32 text-white">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-[#7B2CBF]/20 blur-[120px]" />
      <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-orange-500/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl text-center">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-6 flex justify-center gap-2 font-bold text-slate-400 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <span key={index}>
                {crumb}
                {index < breadcrumbs.length - 1 && " / "}
              </span>
            ))}
          </div>
          <h1 className="mb-8 font-black text-5xl leading-[1.1] tracking-tight md:text-7xl">
            {title}
          </h1>
          <p className="mx-auto mb-12 max-w-4xl text-lg text-slate-400 leading-relaxed">
            {description}
          </p>
          {ctaText && ctaHref && (
            <button
              className="transform rounded-xl bg-[#7B2CBF] px-12 py-5 font-black text-white text-xl shadow-[#7B2CBF]/20 shadow-xl transition-all hover:scale-105 hover:bg-[#6A25A4]"
              onClick={() => (window.location.href = ctaHref)}
            >
              {ctaText}
            </button>
          )}
        </motion.div>
      </div>
    </section>
  );
}
