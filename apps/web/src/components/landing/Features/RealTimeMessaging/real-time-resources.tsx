import { Link } from "@tanstack/react-router";
import { REAL_TIME_PAGE_DATA } from "./real-time-data";

export function RealTimeResources() {
  const { resources } = REAL_TIME_PAGE_DATA;

  return (
    <section className="w-full bg-white py-16 sm:py-24 xl:py-32">
      <div className="mx-auto w-full max-w-[1400px] px-6 sm:px-12 lg:px-20">
        
        <h2 className="mb-12 text-center font-bold text-3xl leading-[1.15] tracking-tight text-[#1d1c1d] sm:text-4xl lg:mb-16 lg:text-5xl">
          {resources.heading}
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {resources.items.map((item) => (
            <Link
              key={item.title}
              to={item.linkHref as any}
              className="group flex flex-col"
            >
              {/* Image Container */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-gray-100 shadow-sm transition-shadow duration-300 group-hover:shadow-md">
                <img
                  src={item.imgSrc}
                  alt={item.title}
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="mt-6 flex flex-1 flex-col">
                <p className="mb-3 text-xs font-semibold text-[#616061]">
                  {item.type}
                </p>
                <h3 className="mb-4 text-xl font-bold leading-tight text-[#1d1c1d] transition-colors group-hover:text-[#1264a3]">
                  {item.title}
                </h3>
                
                <div className="mt-auto flex items-center font-bold text-xs uppercase tracking-widest text-[#1d1c1d] group-hover:text-[#1264a3]">
                  {item.linkText}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-2 transition-transform group-hover:translate-x-1"
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
