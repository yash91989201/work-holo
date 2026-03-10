export function StatusOperationalMockup() {
  const services = [
    { name: "Messaging API", uptime: "99.99%" },
    { name: "Team Creation", uptime: "99.95%" },
    { name: "Voice Infrastructure", uptime: "100%" },
    { name: "Database Clusters", uptime: "99.98%" },
  ];

  return (
    <div className="mx-auto w-full max-w-xl rounded-xl border border-gray-100 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] md:ml-auto">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
          </div>
          <span className="font-bold text-gray-900 text-lg">Operational</span>
        </div>
        <span className="text-gray-400 text-sm">Last updated: Just now</span>
      </div>

      <div className="flex flex-col">
        {services.map((service, i) => (
          <div
            className={`flex items-center justify-between py-5 ${
              i !== services.length - 1 ? "border-gray-100 border-b" : ""
            }`}
            key={service.name}
          >
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-gray-900">
                {service.name}
              </span>
              <span className="font-medium text-gray-400 text-xs">
                Uptime: {service.uptime}
              </span>
            </div>
            <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-green-500 text-green-500">
              <svg
                fill="none"
                height="12"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                viewBox="0 0 24 24"
                width="12"
              >
                <title>Operational</title>
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatusTransparencyMockup() {
  return (
    <section className="w-full bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <h2 className="mb-4 text-center font-bold text-3xl text-gray-900 tracking-tight sm:text-5xl">
          System-wide transparency.
        </h2>
        <p className="mb-16 text-center text-gray-600 text-lg">
          Track the health of every core feature across our entire
          infrastructure.
        </p>

        <div className="grid gap-12 overflow-hidden rounded-2xl border border-gray-100 bg-[#faf8f5] shadow-sm lg:grid-cols-12">
          {/* Left Tabs */}
          <div className="flex flex-col p-8 lg:col-span-4">
            <div className="mb-8 h-24 rounded-xl border border-gray-100 bg-white p-6 opacity-50 shadow-sm" />

            <div className="flex flex-col space-y-2">
              <button
                className="px-6 py-4 text-left font-bold text-gray-600 transition hover:text-gray-900"
                type="button"
              >
                Team Creation
              </button>
              <button
                className="px-6 py-4 text-left font-bold text-gray-600 transition hover:text-gray-900"
                type="button"
              >
                Voice API
              </button>
              <button
                className="px-6 py-4 text-left font-bold text-gray-600 transition hover:text-gray-900"
                type="button"
              >
                Database
              </button>

              {/* Active Tab */}
              <div className="flex flex-col rounded-xl border border-gray-100 bg-white px-6 py-6 shadow-md">
                <span className="mb-2 font-bold text-gray-900">Messaging</span>
                <p className="mb-4 text-gray-500 text-sm leading-relaxed">
                  Real-time monitoring of message delivery, socket connections,
                  and chat history retrieval.
                </p>
                <a
                  className="inline-flex items-center gap-1.5 font-bold text-gray-900 text-sm hover:underline"
                  href="/status"
                >
                  View detailed metrics
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
          <div className="p-4 lg:col-span-8 lg:p-8 lg:pl-0">
            <div className="h-full min-h-[400px] w-full overflow-hidden rounded-xl shadow-md">
              <img
                alt="Mountain landscape representing broad view"
                className="h-full w-full object-cover"
                height={800}
                src="https://images.unsplash.com/photo-1542382257-80da9fb9f5c5?w=1000&q=80"
                width={1000}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function StatusUpdatesGridMockup() {
  const cards = [
    {
      badge: "Update",
      title: "Scheduled maintenance for Messaging API on March 15",
      image:
        "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80",
    },
    {
      badge: "Report",
      title: "Q1 System Reliability and Uptime Performance Review",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
    },
    {
      badge: "Guide",
      title: "How to subscribe to real-time incident notifications",
      image:
        "https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=600&q=80",
    },
    {
      badge: "Post-Mortem",
      title: "Analysis of the Database Latency Incident (Feb 22)",
      image:
        "https://images.unsplash.com/photo-1517486808506-29fa8804cbbe?w=600&q=80",
    },
  ];

  return (
    <section className="w-full bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-[1480px] px-6 lg:px-8">
        <h2 className="mb-12 text-center font-bold text-3xl text-gray-900 tracking-tight sm:text-4xl">
          Recent updates and maintenance.
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <a
              className="group flex flex-col overflow-hidden"
              href="/changelog"
              key={card.title}
            >
              <div className="mb-4 aspect-[4/3] w-full overflow-hidden rounded-xl shadow-sm">
                <img
                  alt={card.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  height={450}
                  src={card.image}
                  width={600}
                />
              </div>

              <div className="flex flex-grow flex-col">
                <span className="mb-2 font-medium text-gray-400 text-xs">
                  {card.badge}
                </span>
                <h3 className="mb-4 font-bold text-base text-gray-900 leading-snug transition-colors group-hover:text-gray-600">
                  {card.title}
                </h3>

                <div className="mt-auto flex items-center justify-between">
                  <span className="font-bold text-[10px] text-gray-900 uppercase tracking-wider">
                    READ MORE
                  </span>
                  <svg
                    className="text-gray-400 transition-colors group-hover:text-gray-900"
                    fill="none"
                    height="14"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                    width="14"
                  >
                    <title>Arrow Right</title>
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
