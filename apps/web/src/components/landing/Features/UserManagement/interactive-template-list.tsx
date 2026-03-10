import type { ReactNode } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface TemplateItem {
  description: string;
  id: string;
  imageSrc: string;
  title: string;
}

interface InteractiveTemplateListProps {
  heading: string;
  /** Optional map of template id → React mockup node. When provided,
   *  renders the mockup UI instead of the imageSrc image. */
  mockupMap?: Record<string, ReactNode>;
  subtitle: string;
  templates: TemplateItem[];
}

export function InteractiveTemplateList({
  heading,
  subtitle,
  templates,
  mockupMap,
}: InteractiveTemplateListProps) {
  const [activeId, setActiveId] = useState<string>(templates[0]?.id || "");

  const activeTemplate =
    templates.find((t) => t.id === activeId) || templates[0];
  const activeMockup =
    activeTemplate && mockupMap ? mockupMap[activeTemplate.id] : undefined;

  return (
    <section className="w-full bg-white py-16 sm:py-24">
      <div className="container mx-auto max-w-[1280px] px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="font-bold text-3xl text-foreground tracking-tight sm:text-4xl">
            {heading}
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-7 sm:text-lg">
            {subtitle}
          </p>
        </div>

        {/* Content: Left Panel + Right List */}
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Mockup or Image */}
          <div className="relative isolate w-full rounded-2xl bg-[#FFF6E5] p-6 transition-all duration-300 sm:p-8">
            {activeTemplate &&
              (activeMockup ? (
                <div className="w-full" key={activeTemplate.id}>
                  {activeMockup}
                </div>
              ) : (
                <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md">
                  <img
                    alt={activeTemplate.title}
                    className="fade-in zoom-in-95 h-full w-full animate-in object-cover duration-500"
                    key={activeTemplate.id}
                    loading="lazy"
                    src={activeTemplate.imageSrc}
                  />
                </div>
              ))}
          </div>

          {/* Right: Interactive list */}
          <div className="flex flex-col space-y-2">
            {templates.map((template) => {
              const isActive = template.id === activeId;
              return (
                <button
                  className={cn(
                    "group relative flex flex-col items-start gap-1 rounded-xl p-5 text-left transition-all duration-200",
                    isActive
                      ? "bg-white shadow-sm ring-1 ring-gray-200"
                      : "bg-transparent hover:bg-gray-50"
                  )}
                  key={template.id}
                  onClick={() => setActiveId(template.id)}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <div className="absolute top-0 bottom-0 left-0 w-1 rounded-l-xl bg-black" />
                  )}

                  <h3 className="font-bold text-base text-foreground group-hover:text-black">
                    {template.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {template.description}
                  </p>

                  {isActive && (
                    <div className="mt-2 flex items-center font-semibold text-foreground text-sm">
                      See template &rarr;
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
