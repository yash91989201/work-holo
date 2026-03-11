import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { REAL_TIME_PAGE_DATA } from "./real-time-data";

export function RealTimeTabs() {
  const { tabs } = REAL_TIME_PAGE_DATA;
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="w-full bg-white py-16 sm:py-24 xl:py-32">
      <div className="mx-auto w-full max-w-[1800px] px-6 sm:px-12 lg:px-8">
        {/* Header content */}
        <div className="mx-auto mb-16 max-w-3xl text-left lg:mb-20">
          <h2 className="font-bold text-3xl text-[#1d1c1d] leading-[1.15] tracking-tight sm:text-4xl lg:text-5xl">
            {tabs.heading}
          </h2>
          <p className="mt-5 text-[#616061] text-lg">{tabs.subheading}</p>
        </div>

        <div className="grid gap-12 rounded-2xl border border-1 p-4 shadow-lg lg:grid-cols-12 lg:gap-8">
          {/* Tabs Menu (Left) */}
          <div className="flex flex-col space-y-2 lg:col-span-4">
            {tabs.items.map((tab, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  className={cn(
                    "relative flex w-full flex-col items-start space-y-2 rounded-2xl p-6 text-left transition-all duration-200",
                    isActive
                      ? "bg-[#f2f8fa]"
                      : "bg-transparent hover:bg-gray-50"
                  )}
                  key={tab.title}
                  onClick={() => setActiveIndex(idx)}
                >
                  <h3 className="font-bold text-[#1d1c1d] text-lg">
                    {tab.title}
                  </h3>

                  {/* Expandable content for active tab */}
                  <div
                    className={cn(
                      "grid grid-rows-[0fr] overflow-hidden transition-[grid-template-rows] duration-300",
                      isActive ? "grid-rows-[1fr]" : ""
                    )}
                  >
                    <div className="min-h-0">
                      <p className="mt-2 text-[#616061] text-sm">
                        {tab.description}
                      </p>
                      <Link
                        className="group mt-4 inline-flex items-center gap-1.5 font-bold text-[#1264a3] text-sm hover:underline"
                        onClick={(e) => e.stopPropagation()}
                        to={tab.linkHref as any} // prevent tab click
                      >
                        {tab.linkText}
                        <svg
                          className="transition-transform group-hover:translate-x-1"
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
                      </Link>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Tab Image Content (Right) */}
          <div className="lg:col-span-8">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl shadow-xl">
              {tabs.items.map((tab, idx) => (
                <img
                  alt={tab.title}
                  className={cn(
                    "absolute inset-0 size-full object-cover transition-opacity duration-500",
                    activeIndex === idx ? "z-10 opacity-100" : "z-0 opacity-0"
                  )}
                  key={tab.title}
                  src={tab.imgSrc}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
