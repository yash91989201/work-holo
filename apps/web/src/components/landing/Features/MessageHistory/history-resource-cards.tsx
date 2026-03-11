interface ResourceCard {
  imageAlt: string;
  imageSrc: string;
  linkHref: string;
  linkText: string;
  tag: string;
  title: string;
}

const RESOURCES: ResourceCard[] = [
  {
    imageSrc:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80",
    imageAlt: "Messaging essentials",
    tag: "Blog",
    title: "Workholo essentials: Getting the most out of messaging",
    linkText: "Read Story",
    linkHref: "#",
  },
  {
    imageSrc:
      "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=600&q=80",
    imageAlt: "Find conversations",
    tag: "Workholo tutorials",
    title: "Workholo 101: Find and start conversations",
    linkText: "Learn More",
    linkHref: "#",
  },
  {
    imageSrc:
      "https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=600&q=80",
    imageAlt: "Working in channels",
    tag: "Blog",
    title: "The ins and outs of working in Workholo channels",
    linkText: "Read Story",
    linkHref: "#",
  },
];

/**
 * HistoryResourceCards
 * ─────────────────────────────────────────────────────
 * "Take a closer look at messaging" — 3-column blog-style cards
 * with large images, category tag, title, and CTA link.
 */
export function HistoryResourceCards() {
  return (
    <section className="w-full bg-[#f8f8f8] py-16 sm:py-24 lg:py-32">
      <div className="mx-auto w-full max-w-[1600px] px-6 sm:px-12 lg:px-20">
        <h2 className="mb-14 text-center font-bold text-3xl text-[#1d1c1d] tracking-tight sm:text-4xl lg:text-5xl">
          Learn how to use message history effectively
        </h2>

        <div className="grid gap-8 sm:grid-cols-3">
          {RESOURCES.map((card) => (
            <div className="group" key={card.title}>
              <div className="overflow-hidden rounded-lg">
                <img
                  alt={card.imageAlt}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  src={card.imageSrc}
                />
              </div>
              <div className="mt-4">
                <span className="font-semibold text-[#611f69] text-xs">
                  {card.tag}
                </span>
                <h3 className="mt-1 font-bold text-[#1d1c1d] text-base">
                  {card.title}
                </h3>
                <a
                  className="mt-3 inline-flex items-center gap-1 font-bold text-[#1d1c1d] text-xs uppercase tracking-[0.1em] hover:text-[#611f69]"
                  href={card.linkHref}
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
