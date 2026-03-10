export function ChangelogHeroPillsMockup() {
  return (
    <div className="relative ml-auto h-[280px] w-full max-w-sm">
      {/* Top pill */}
      <div className="fade-in slide-in-from-bottom-4 absolute top-2 right-12 z-10 w-fit animate-in rounded-full bg-[#7C5CFF] px-4 py-1.5 shadow-lg duration-700">
        <span className="font-medium text-sm text-white">
          New: Browser Notifications
        </span>
      </div>

      {/* Middle pill */}
      <div className="fade-in slide-in-from-bottom-4 absolute top-16 left-0 z-20 flex w-fit animate-in items-center gap-2 rounded-xl bg-white px-4 py-2.5 shadow-xl delay-150 duration-700">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f0edff]">
          <svg
            className="h-3 w-3 text-[#7C5CFF]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <title>Security Update</title>
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <span className="font-semibold text-gray-700 text-sm">
          Security Enhancement v2.4
        </span>
      </div>

      {/* Bottom right pill (blue) */}
      <div className="fade-in slide-in-from-bottom-4 absolute right-4 bottom-16 z-10 w-fit animate-in rounded-full bg-[#7C5CFF] px-4 py-1.5 shadow-lg delay-300 duration-700">
        <span className="font-medium text-sm text-white">
          UI Improvements Live
        </span>
      </div>

      {/* Bottom left pill */}
      <div className="fade-in slide-in-from-bottom-4 absolute right-10 bottom-4 z-20 flex w-fit animate-in items-center gap-2 rounded-xl bg-white px-4 py-2.5 shadow-xl delay-500 duration-700">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f0edff]">
          <svg
            className="h-3 w-3 text-[#7C5CFF]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <title>Bug Fixes</title>
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </div>
        <span className="font-semibold text-gray-700 text-sm">
          12 Critical Bug Fixes
        </span>
      </div>
    </div>
  );
}

export function ChangelogContinuousInnovation() {
  const features = [
    {
      icon: (
        <svg
          className="h-6 w-6 text-[#7C5CFF]"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <title>Browser Notifications</title>
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      ),
      title: "Browser Notifications",
      description:
        "Never miss an incoming call again. Our new real-time browser alerts keep you connected even when you're in another tab.",
      linkText: "Configure Alerts →",
    },
    {
      icon: (
        <svg
          className="h-6 w-6 text-[#7C5CFF]"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <title>Security Enhancements</title>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      title: "Security Enhancements",
      description:
        "We've upgraded our encryption protocols and added advanced threat detection to keep your communication private and secure.",
    },
    {
      icon: (
        <svg
          className="h-6 w-6 text-[#7C5CFF]"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <title>UI Improvements</title>
          <rect height="18" rx="2" ry="2" width="18" x="3" y="3" />
          <line x1="3" x2="21" y1="9" y2="9" />
          <line x1="9" x2="9" y1="21" y2="9" />
        </svg>
      ),
      title: "UI Improvements",
      description:
        "A cleaner, faster interface designed for maximum productivity. Experience smoother transitions and more intuitive call controls.",
      linkText: "Explore UI →",
    },
  ];

  return (
    <section className="w-full bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="font-bold text-3xl text-gray-900 tracking-tight sm:text-4xl">
            Continuous Innovation for Better Calling
          </h2>
          <p className="mt-4 text-gray-600 text-lg">
            Our team is dedicated to shipping high-quality updates every week.
            From performance tweaks to major feature rollouts, we're building
            the future of web-based communication.
          </p>
        </div>
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div className="flex flex-col" key={feature.title}>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#f5f3ff]">
                {feature.icon}
              </div>
              <h3 className="mb-3 font-bold text-gray-900 text-xl">
                {feature.title}
              </h3>
              <p className="flex-grow text-base text-gray-600 leading-relaxed">
                {feature.description}
              </p>
              {feature.linkText && (
                <a
                  className="mt-6 inline-flex font-medium text-[#7C5CFF] hover:underline"
                  href="/changelog"
                >
                  {feature.linkText}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ChangelogReleaseHistory() {
  const releases = [
    {
      image:
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=800&auto=format&fit=crop", // City street tracking up
      version: "v2.5.0",
      title: "The Performance Update: 40% Faster Load Times",
      linkText: "READ CHANGELOG →",
    },
    {
      image:
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop", // Canyon road/river
      version: "v2.4.2",
      title: "Bug Fixes: Resolving Audio Latency Issues",
      linkText: "VIEW FIXES →",
    },
    {
      image:
        "https://images.unsplash.com/photo-1510206109315-bb8a6a682136?q=80&w=800&auto=format&fit=crop", // Abstract smoke/dark silhouette
      version: "v2.3.0",
      title: "New Feature: Multi-Device Syncing",
      linkText: "LEARN MORE →",
    },
  ];

  return (
    <section className="w-full bg-[#faf8f5] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="mb-12 text-center font-bold text-3xl text-gray-900 tracking-tight sm:text-4xl">
          Recent Release History
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {releases.map((release) => (
            <div
              className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md"
              key={release.title}
            >
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  alt={release.title}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  height="600"
                  src={release.image}
                  width="800"
                />
              </div>
              <div className="flex flex-grow flex-col p-8">
                <span className="mb-2 font-bold text-[#7C5CFF] text-sm">
                  {release.version}
                </span>
                <h3 className="mb-6 font-bold text-gray-900 text-xl leading-tight">
                  {release.title}
                </h3>
                <div className="mt-auto">
                  <a
                    className="inline-flex font-bold text-[#7C5CFF] text-xs uppercase tracking-wider hover:underline"
                    href="/changelog"
                  >
                    {release.linkText}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
