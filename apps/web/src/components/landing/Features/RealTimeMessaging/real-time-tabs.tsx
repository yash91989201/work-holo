import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { REAL_TIME_PAGE_DATA } from "./real-time-data";

export function RealTimeTabs() {
  const { tabs } = REAL_TIME_PAGE_DATA;
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="w-full bg-white py-16 sm:py-24 xl:py-32">
      <div className="mx-auto w-full max-w-[1800px] px-6 sm:px-12 lg:px-8 ">
        
        {/* Header content */}
        <div className="mx-auto mb-16 max-w-3xl text-left lg:mb-20">
          <h2 className="font-bold text-3xl leading-[1.15] tracking-tight text-[#1d1c1d] sm:text-4xl lg:text-5xl">
            {tabs.heading}
          </h2>
          <p className="mt-5 text-lg text-[#616061]">
            {tabs.subheading}
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8 border-1 border rounded-2xl p-4 shadow-lg">
          {/* Tabs Menu (Left) */}
          <div className="lg:col-span-4 flex flex-col space-y-2">
            {tabs.items.map((tab, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={tab.title}
                  onClick={() => setActiveIndex(idx)}
                  className={cn(
                    "relative flex w-full flex-col items-start space-y-2 rounded-2xl p-6 text-left transition-all duration-200",
                    isActive
                      ? "bg-[#f2f8fa]"
                      : "bg-transparent hover:bg-gray-50"
                  )}
                >
                  <h3 className="font-bold text-lg text-[#1d1c1d]">
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
                      <p className="mt-2 text-sm text-[#616061]">
                        {tab.description}
                      </p>
                      <Link
                        to={tab.linkHref as any}
                        className="mt-4 group inline-flex items-center gap-1.5 text-sm font-bold text-[#1264a3] hover:underline"
                        onClick={(e) => e.stopPropagation()} // prevent tab click
                      >
                        {tab.linkText}
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="transition-transform group-hover:translate-x-1"
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
                  key={tab.title}
                  src={tab.imgSrc}
                  alt={tab.title}
                  className={cn(
                    "absolute inset-0 size-full object-cover transition-opacity duration-500",
                    activeIndex === idx ? "opacity-100 z-10" : "opacity-0 z-0"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
