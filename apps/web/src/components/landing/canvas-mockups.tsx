export function CanvasHeroMockup() {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-gray-100/50 shadow-xl">
      <img
        alt="Person looking out at airport terminal"
        className="aspect-[4/3] h-auto w-full rounded-2xl object-cover"
        height={750}
        src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1000&q=80"
        width={1000}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <button
          className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg transition-transform hover:scale-105"
          type="button"
        >
          <svg
            fill="currentColor"
            height="24"
            stroke="none"
            viewBox="0 0 24 24"
            width="24"
          >
            <title>Play</title>
            <path d="M5 3l14 9-14 9V3z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export function CanvasTabsMockup() {
  return (
    <section className="w-full bg-[#f8f9fc] py-20 sm:py-24">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-bold text-3xl text-gray-900 tracking-tight sm:text-5xl">
            Everything your team needs to build together
          </h2>
          <p className="text-gray-500 text-lg">
            A powerful workspace designed for modern collaboration.
          </p>
        </div>

        <div className="grid gap-12 overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] lg:grid-cols-12">
          {/* Left Tabs */}
          <div className="flex flex-col justify-center lg:col-span-4">
            <div className="flex flex-col space-y-2">
              <button
                className="rounded-xl px-6 py-5 text-left font-bold text-gray-600 transition hover:text-gray-900"
                type="button"
              >
                Documentation
              </button>
              <button
                className="rounded-xl px-6 py-5 text-left font-bold text-gray-600 transition hover:text-gray-900"
                type="button"
              >
                Project Planning
              </button>
              <button
                className="rounded-xl px-6 py-5 text-left font-bold text-gray-600 transition hover:text-gray-900"
                type="button"
              >
                Team Sync
              </button>

              {/* Active Tab */}
              <div className="flex flex-col rounded-xl border-[#7C5CFF] border-l-4 bg-[#f4f7fa] px-6 py-6">
                <span className="mb-2 font-bold text-gray-900">
                  Whiteboarding
                </span>
                <p className="mb-4 text-gray-500 text-sm leading-relaxed">
                  Visualize your ideas on an infinite canvas with real-time team
                  interaction.
                </p>
                <a
                  className="inline-flex items-center gap-1.5 font-bold text-gray-900 text-sm hover:underline"
                  href="/features/canvas"
                >
                  Learn more
                  <svg
                    fill="none"
                    height="16"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="16"
                  >
                    <title>Arrow Right</title>
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Right Image Content */}
          <div className="flex items-center justify-center lg:col-span-8">
            <div className="h-full min-h-[500px] w-full overflow-hidden rounded-xl">
              <img
                alt="Laptop on wooden desk with notebook and coffee"
                className="h-full w-full rounded-xl object-cover"
                height={800}
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1000&q=80"
                width={1000}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface FaqItem {
  answer: string;
  question: string;
}

export function CanvasFaqSection({ items }: { items: FaqItem[] }) {
  return (
    <section className="w-full bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <div>
            <h2 className="text-balance font-bold text-3xl text-gray-900 tracking-tight sm:text-4xl">
              Frequently asked questions
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {items.map((item) => (
              <details
                className="group py-6 [&_summary::-webkit-details-marker]:hidden"
                key={item.question}
              >
                <summary className="flex cursor-pointer items-center justify-between gap-1.5 font-bold text-gray-900 text-lg">
                  {item.question}
                  <span className="relative h-5 w-5 shrink-0">
                    <svg
                      className="absolute inset-0 h-5 w-5 opacity-100 transition-opacity group-open:opacity-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <title>Expand</title>
                      <path
                        d="M19 9l-7 7-7-7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <svg
                      className="absolute inset-0 h-5 w-5 opacity-0 transition-opacity group-open:opacity-100"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <title>Collapse</title>
                      <path
                        d="M5 15l7-7 7 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 pr-8 text-base text-gray-600 leading-relaxed">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
