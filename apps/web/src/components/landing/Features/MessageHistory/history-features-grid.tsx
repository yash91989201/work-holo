interface FeatureGridItem {
  title: string;
  description: string;
  /** Raw SVG path `d` values */
  iconPaths: string[];
}

const GRID_ITEMS: FeatureGridItem[] = [
  {
    title: "Organised message storage",
    description: "All conversations are automatically organised by channels, projects, or teams, making it easy to revisit discussions and track decisions.",
    iconPaths: [
      "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2Z",
      "M7 11V7a5 5 0 0 1 10 0v4",
    ],
  },
  {
    title: "Powerful message search",
    description: "Find any message instantly using advanced search filters like keywords, people, files, or dates.",
    iconPaths: [
      "M12 2 2 7l10 5 10-5-10-5Z",
      "M2 17l10 5 10-5",
      "M2 12l10 5 10-5",
    ],
  },
  {
    title: "Access history anytime",
    description: "Your entire conversation history stays accessible across desktop and mobile so you can stay informed wherever you work.",
    iconPaths: [
      "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
    ],
  },
];

/**
 * HistoryFeaturesGrid
 * ─────────────────────────────────────────────────────
 * "Chat securely with open or private communication" section.
 * Centred heading + 3-column icon cards.
 */
export function HistoryFeaturesGrid() {
  return (
    <section className="w-full bg-white py-16 sm:py-24 lg:py-32">
      <div className="mx-auto w-full max-w-[1600px] px-6 sm:px-12 lg:px-20">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-bold text-3xl leading-[1.2] tracking-tight text-[#1d1c1d] sm:text-4xl">
            Secure and reliable message history
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#616061]">
            Your message history is securely stored and organised. Access conversations from channels, private messages, and shared files without worrying about losing important information.
          </p>
        </div>

        {/* Grid */}
        <div className="mt-14 grid gap-10 sm:grid-cols-3">
          {GRID_ITEMS.map((item) => (
            <div key={item.title} className="text-left">
              <div className="mb-4 flex size-10 items-center justify-center">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1d1c1d"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {item.iconPaths.map((d, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: static icon paths
                    <path key={i} d={d} />
                  ))}
                </svg>
              </div>
              <h3 className="font-bold text-lg text-[#1d1c1d]">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#616061]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
