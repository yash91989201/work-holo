import { Link } from "@tanstack/react-router";
import { REAL_TIME_PAGE_DATA } from "./real-time-data";

export function RealTimeResources() {
  const { resources } = REAL_TIME_PAGE_DATA;

  return (
    <section className="w-full bg-white py-16 sm:py-24 xl:py-32">
      <div className="mx-auto w-full max-w-[1400px] px-6 sm:px-12 lg:px-20">
        <h2 className="mb-12 text-center font-bold text-3xl text-[#1d1c1d] leading-[1.15] tracking-tight sm:text-4xl lg:mb-16 lg:text-5xl">
          {resources.heading}
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {resources.items.map((item) => (
            <Link
              className="group flex flex-col"
              key={item.title}
              to={item.linkHref as any}
            >
              {/* Image Container */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-gray-100 shadow-sm transition-shadow duration-300 group-hover:shadow-md">
                <img
                  alt={item.title}
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src={item.imgSrc}
                />
              </div>

              {/* Content */}
              <div className="mt-6 flex flex-1 flex-col">
                <p className="mb-3 font-semibold text-[#616061] text-xs">
                  {item.type}
                </p>
                <h3 className="mb-4 font-bold text-[#1d1c1d] text-xl leading-tight transition-colors group-hover:text-[#1264a3]">
                  {item.title}
                </h3>

                <div className="mt-auto flex items-center font-bold text-[#1d1c1d] text-xs uppercase tracking-widest group-hover:text-[#1264a3]">
                  {item.linkText}
                  <svg
                    className="ml-2 transition-transform group-hover:translate-x-1"
                    fill="none"
                    height="14"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                    width="14"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
