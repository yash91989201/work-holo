import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Separator } from "@/components/ui/separator";

const stats = [
  {
    value: "100%",
    label: "Cloud-based platform ensuring uptime and reliability.",
  },
  {
    value: "256",
    label: "Bit data encryption keeping your enterprise secure.",
  },
  {
    value: "24/7",
    label: "Real-time messaging and instant notifications.",
  },
];

const companies = [
  {
    name: "MrBeast",
    description: "Workholobot helps MrBeast to create viral videos.",
    hasVideo: true,
    tall: true,
  },
  {
    name: "box",
    tall: false,
  },
  {
    name: "Caraway",
    tall: false,
  },
  {
    name: "RIVIAN",
    tall: false,
  },
];

export function StatsCtaSection() {
  return (
    <section className="relative w-full">
      {/* Curved top edge — arch downward */}
      <div className="relative -mb-1 w-full overflow-hidden bg-[#7C5CFF]">
        <svg
          viewBox="0 0 1440 120"
          className="block w-full"
          preserveAspectRatio="none"
          style={{ height: "120px" }}
        >
          <path
            d="M0,0 L0,20 Q720,160 1440,20 L1440,0 Z"
            fill="white"
          />
        </svg>
      </div>

      {/* Purple content area */}
      <div className="bg-[#7C5CFF] px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Innovative Companies Heading */}
          <h2 className="mx-auto max-w-3xl text-center font-bold text-3xl text-white tracking-tight sm:text-4xl lg:text-5xl lg:leading-[1.15]">
            The most innovative companies run their business in{" "}
            <span className="block">Workholo.</span>
          </h2>

          {/* Company Showcase Cards */}
          <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {companies.map((company) => (
              <div
                key={company.name}
                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/15 to-white/5 ${
                  company.tall ? "row-span-1 sm:row-span-1" : ""
                }`}
              >
                {/* Placeholder image area */}
                <div
                  className={`flex w-full items-end justify-center bg-gradient-to-br from-black/20 to-black/40 ${
                    company.tall
                      ? "aspect-[3/4] sm:aspect-[3/4]"
                      : "aspect-square"
                  }`}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white/90">
                      {company.name}
                    </span>
                  </div>

                  {/* Description overlay for the first card */}
                  {company.description && (
                    <div className="relative z-10 w-full p-4">
                      <p className="text-sm text-white leading-snug">
                        {company.description}
                      </p>
                      {company.hasVideo && (
                        <div className="mt-2 flex justify-end">
                          <div className="flex size-8 items-center justify-center rounded-full border border-white/40 bg-white/10">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="white"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Stats Section */}
          <div className="mt-24">
            <h2 className="mx-auto max-w-3xl text-center font-bold text-3xl text-white tracking-tight sm:text-4xl lg:text-5xl lg:leading-[1.15]">
              Built for productivity and{" "}
              <span className="block">scale.</span>
            </h2>

            <div className="mt-16 flex flex-col items-center justify-center gap-10 sm:flex-row sm:gap-16 lg:gap-20">
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-10 sm:gap-16 lg:gap-20"
                >
                  <div className="text-center">
                    <p className="font-bold text-4xl text-white/40 sm:text-5xl lg:text-6xl">
                      {stat.value}
                    </p>
                    <p className="mt-3 max-w-[200px] text-sm text-white/85 leading-relaxed">
                      {stat.label}
                    </p>
                  </div>
                  {i < stats.length - 1 && (
                    <Separator
                      orientation="vertical"
                      className="hidden h-20 bg-white/20 sm:block"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-24 text-center">
            <h2 className="mx-auto max-w-3xl font-bold text-3xl text-white tracking-tight sm:text-4xl lg:text-5xl lg:leading-[1.15]">
              See all that you can accomplish in{" "}
              <span className="block">Workholo.</span>
            </h2>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-md border-2 border-white bg-transparent px-8 text-sm font-semibold uppercase tracking-wide text-white hover:bg-white/10"
              >
                <Link to="/">GET STARTED</Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="h-12 rounded-md bg-white px-8 text-sm font-semibold uppercase tracking-wide text-[#7C5CFF] hover:bg-white/90"
              >
                <Link to="/">REQUEST A DEMO</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Curved bottom edge — arch upward */}
      <div className="relative -mt-1 w-full overflow-hidden bg-white">
        <svg
          viewBox="0 0 1440 120"
          className="block w-full"
          preserveAspectRatio="none"
          style={{ height: "120px" }}
        >
          <path
            d="M0,0 L0,100 Q720,-40 1440,100 L1440,0 Z"
            fill="#7C5CFF"
          />
        </svg>
      </div>
    </section>
  );
}
