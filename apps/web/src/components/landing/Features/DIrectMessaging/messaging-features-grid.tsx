interface FeatureGridItem {
  title: string;
  description: string;
  /** Raw SVG path `d` values */
  iconPaths: string[];
}

const GRID_ITEMS: FeatureGridItem[] = [
  {
    title: "Organise conversations",
    description:
      "You can name and organise your channels by project, client or whatever makes sense for you and your company. Every conversation has a home and a place to move forward.",
    iconPaths: [
      "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2Z",
      "M7 11V7a5 5 0 0 1 10 0v4",
    ],
  },
  {
    title: "Put your work history to work",
    description:
      "Work smarter by referring to your private messages or open conversations in channels across your company, all of which are automatically saved and searchable.",
    iconPaths: [
      "M12 2 2 7l10 5 10-5-10-5Z",
      "M2 17l10 5 10-5",
      "M2 12l10 5 10-5",
    ],
  },
  {
    title: "Always at your fingertips",
    description:
      "Stay up to date on all your conversations and keep them going from anywhere with dedicated Slack apps for desktop or mobile.",
    iconPaths: [
      "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
    ],
  },
];

/**
 * MessagingFeaturesGrid
 * ─────────────────────────────────────────────────────
 * "Chat securely with open or private communication" section.
 * Centred heading + 3-column icon cards.
 */
export function MessagingFeaturesGrid() {
  return (
    <section className="w-full bg-white py-16 sm:py-24 lg:py-32">
      <div className="mx-auto w-full max-w-[1600px] px-6 sm:px-12 lg:px-20">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-bold text-3xl leading-[1.2] tracking-tight text-[#1d1c1d] sm:text-4xl">
            Chat securely with open or private communication
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#616061]">
            Most chat in Workholo happens in channels — open, organised spaces
            for messages, files, tools and people — but you can always find a
            place to communicate with private channels and direct messages.
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
