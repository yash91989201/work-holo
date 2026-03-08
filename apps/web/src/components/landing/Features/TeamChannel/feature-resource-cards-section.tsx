import { Link } from "@tanstack/react-router";

export interface ResourceCard {
  imageSrc: string;
  imageAlt: string;
  tag: string;
  title: string;
  linkText: string;
  linkHref: string;
}

interface FeatureResourceCardsSectionProps {
  heading: string;
  cards: ResourceCard[];
  bgClass?: string;
}

export function FeatureResourceCardsSection({ heading, cards, bgClass }: FeatureResourceCardsSectionProps) {
  if (!cards || cards.length === 0) return null;

  return (
    <section className={`w-full ${bgClass || "bg-[#f8f8f8]"} py-16 sm:py-24 lg:py-32`}>
      <div className="mx-auto w-full max-w-[1280px] px-6 sm:px-12 lg:px-20">
        <h2 className="mb-14 text-center font-bold text-3xl tracking-tight text-[#1d1c1d] sm:text-4xl lg:text-5xl">
          {heading}
        </h2>

        <div className="grid gap-8 sm:grid-cols-3">
          {cards.map((card) => (
            <div key={card.title} className="group flex flex-col bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="overflow-hidden">
                <img
                  src={card.imageSrc}
                  alt={card.imageAlt}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <span className="text-xs font-semibold text-muted-foreground">
                  {card.tag}
                </span>
                <h3 className="mt-2 font-bold text-lg text-foreground line-clamp-2">
                  {card.title}
                </h3>
                <div className="mt-auto pt-6">
                  {card.linkHref.startsWith("http") ? (
                    <a
                      href={card.linkHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.1em] text-[#0066cc] hover:underline"
                    >
                      {card.linkText}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
                    </a>
                  ) : (
                    <Link
                      to={card.linkHref as any}
                      className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.1em] text-[#0066cc] hover:underline"
                    >
                      {card.linkText}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
