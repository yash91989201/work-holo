import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { REAL_TIME_PAGE_DATA } from "./real-time-data";

export function RealTimeFeatures() {
  const { features } = REAL_TIME_PAGE_DATA;

  return (
    <div className="flex flex-col">
      {features.map((feature, idx) => (
        <section
          className={cn(
            "py-16 sm:py-24 xl:py-32",
            idx % 2 === 0 ? "bg-white" : "bg-white" // Adjust logic if alternating bg colors are needed later
          )}
          key={feature.title}
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
              <div
                className={cn(
                  "w-full",
                  feature.imageLeft ? "order-1" : "order-2 lg:order-2"
                )}
              >
                <div className="overflow-hidden rounded-xl shadow-lg">
                  <img
                    alt={feature.title}
                    className="aspect-[4/3] h-auto w-full object-cover"
                    src={feature.imgSrc}
                  />
                </div>
              </div>

              {/* Text Logic */}
              <div
                className={cn(
                  "w-full",
                  feature.imageLeft ? "order-2" : "order-1"
                )}
              >
                <div
                  className={cn(
                    "max-w-xl",
                    feature.imageLeft ? "lg:ml-12" : "lg:mr-12"
                  )}
                >
                  <h3 className="mb-4 font-bold text-[#616061] text-xs uppercase tracking-widest">
                    {feature.overline}
                  </h3>
                  <h2 className="font-bold text-3xl text-[#1d1c1d] leading-[1.15] tracking-tight sm:text-4xl lg:text-5xl">
                    {feature.title}
                  </h2>
                  <p className="mt-5 text-[#616061] text-lg leading-relaxed sm:text-xl">
                    {feature.description}
                  </p>
                  {feature.linkText && feature.linkHref && (
                    <div className="mt-8">
                      <Link
                        className="group inline-flex items-center gap-1.5 font-bold text-[#1264a3] text-base hover:underline lg:text-lg"
                        to={feature.linkHref as any}
                      >
                        {feature.linkText}
                        <svg
                          aria-hidden="true"
                          className="transition-transform group-hover:translate-x-1"
                          fill="none"
                          height="16"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          viewBox="0 0 24 24"
                          width="16"
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
