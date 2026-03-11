import { Link } from "@tanstack/react-router";

export interface ResourceCard {
  imageAlt: string;
  imageSrc: string;
  linkHref: string;
  linkText: string;
  tag: string;
  title: string;
}

interface FeatureResourceCardsSectionProps {
  bgClass?: string;
  cards: ResourceCard[];
  heading: string;
}

export function FeatureResourceCardsSection({
  heading,
  cards,
  bgClass,
}: FeatureResourceCardsSectionProps) {
  if (!cards || cards.length === 0) return null;

  return (
    <section
      className={`w-full ${bgClass || "bg-[#f8f8f8]"} py-16 sm:py-24 lg:py-32`}
    >
      <div className="mx-auto w-full max-w-[1280px] px-6 sm:px-12 lg:px-20">
        <h2 className="mb-14 text-center font-bold text-3xl text-[#1d1c1d] tracking-tight sm:text-4xl lg:text-5xl">
          {heading}
        </h2>

        <div className="grid gap-8 sm:grid-cols-3">
          {cards.map((card) => (
            <div
              className="group flex flex-col overflow-hidden bg-white shadow-sm transition-shadow hover:shadow-md"
              key={card.title}
            >
              <div className="overflow-hidden">
                <img
                  alt={card.imageAlt}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  src={card.imageSrc}
                />
              </div>
              <div className="flex flex-grow flex-col p-6">
                <span className="font-semibold text-muted-foreground text-xs">
                  {card.tag}
                </span>
                <h3 className="mt-2 line-clamp-2 font-bold text-foreground text-lg">
                  {card.title}
                </h3>
                <div className="mt-auto pt-6">
                  {card.linkHref.startsWith("http") ? (
                    <a
                      className="inline-flex items-center gap-1 font-bold text-[#0066cc] text-xs uppercase tracking-[0.1em] hover:underline"
                      href={card.linkHref}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {card.linkText}
                      <svg
                        aria-hidden="true"
                        fill="none"
                        height="14"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="14"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </a>
                  ) : (
                    <Link
                      className="inline-flex items-center gap-1 font-bold text-[#0066cc] text-xs uppercase tracking-[0.1em] hover:underline"
                      to={card.linkHref as any}
                    >
                      {card.linkText}
                      <svg
                        aria-hidden="true"
                        fill="none"
                        height="14"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="14"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
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
