interface AiCtaProps {
  ctaHref: string;
  ctaText: string;
  description: string;
  title: string;
}

export default function AiCta({
  title,
  description,
  ctaText,
  ctaHref,
}: AiCtaProps) {
  return (
    <section className="relative overflow-hidden bg-[#050B18] px-4 py-24 text-center text-white">
      <div className="absolute top-0 left-0 h-full w-full opacity-10">
        <div className="absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7B2CBF] blur-[150px]" />
      </div>
      <div className="relative z-10 mx-auto max-w-4xl">
        <h2 className="mb-8 font-black text-4xl md:text-5xl">{title}</h2>
        <p className="mx-auto mb-12 max-w-2xl text-slate-300 text-xl leading-relaxed">
          {description}
        </p>
        <button
          className="transform rounded-xl bg-[#7B2CBF] px-12 py-5 font-black text-white text-xl shadow-[#7B2CBF]/20 shadow-xl transition-all hover:scale-105 hover:bg-[#6A25A4]"
          onClick={() => (window.location.href = ctaHref)}
        >
          {ctaText}
        </button>
      </div>
    </section>
  );
}
