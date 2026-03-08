import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { REAL_TIME_PAGE_DATA } from "./real-time-data";

export function RealTimeFeatures() {
  const { features } = REAL_TIME_PAGE_DATA;

  return (
    <div className="flex flex-col">
      {features.map((feature, idx) => (
        <section
          key={feature.title}
          className={cn(
            "py-16 sm:py-24 xl:py-32",
            idx % 2 === 0 ? "bg-white" : "bg-white" // Adjust logic if alternating bg colors are needed later
          )}
        >
          <div className="mx-auto w-full max-w-[1800px] px-6 sm:px-12 lg:px-8">
            <div
              className={cn(
                "grid items-center gap-12 lg:gap-24 xl:gap-32",
                feature.imageLeft
                  ? "lg:grid-cols-[1.2fr_1fr]"
                  : "lg:grid-cols-[1fr_1.2fr]"
              )}
            >
              {/* Image Left / Right Logic */}
              <div className={cn("w-full", feature.imageLeft ? "order-1" : "order-2 lg:order-2")}>
                <div className="overflow-hidden rounded-xl shadow-lg">
                  <img
                    src={feature.imgSrc}
                    alt={feature.title}
                    className="w-full h-auto object-cover aspect-[4/3]"
                  />
                </div>
              </div>

              {/* Text Logic */}
              <div className={cn("w-full", feature.imageLeft ? "order-2" : "order-1")}>
                <div
                  className={cn(
                    "max-w-xl",
                    feature.imageLeft ? "lg:ml-12" : "lg:mr-12"
                  )}
                >
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-[#616061]">
                    {feature.overline}
                  </h3>
                  <h2 className="font-bold text-3xl leading-[1.15] tracking-tight text-[#1d1c1d] sm:text-4xl lg:text-5xl">
                    {feature.title}
                  </h2>
                  <p className="mt-5 text-lg leading-relaxed text-[#616061] sm:text-xl">
                    {feature.description}
                  </p>
                  {feature.linkText && feature.linkHref && (
                    <div className="mt-8">
                      <Link
                        to={feature.linkHref as any}
                        className="group inline-flex items-center gap-1.5 text-base font-bold text-[#1264a3] hover:underline lg:text-lg"
                      >
                        {feature.linkText}
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="transition-transform group-hover:translate-x-1"
                          aria-hidden="true"
                        >
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
