import type { ReactNode } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface TemplateItem {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
}

interface InteractiveTemplateListProps {
  heading: string;
  subtitle: string;
  templates: TemplateItem[];
  /** Optional map of template id → React mockup node. When provided,
   *  renders the mockup UI instead of the imageSrc image. */
  mockupMap?: Record<string, ReactNode>;
}

export function InteractiveTemplateList({ heading, subtitle, templates, mockupMap }: InteractiveTemplateListProps) {
  const [activeId, setActiveId] = useState<string>(templates[0]?.id || "");

  const activeTemplate = templates.find(t => t.id === activeId) || templates[0];
  const activeMockup = activeTemplate && mockupMap ? mockupMap[activeTemplate.id] : undefined;

  return (
    <section className="w-full bg-white py-16 sm:py-24">
      <div className="container mx-auto max-w-[1280px] px-6 lg:px-8">

        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {heading}
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            {subtitle}
          </p>
        </div>

        {/* Content: Left Panel + Right List */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">

          {/* Left: Mockup or Image */}
          <div className="relative isolate w-full rounded-2xl bg-[#FFF6E5] p-6 sm:p-8 transition-all duration-300">
            {activeTemplate && (
              activeMockup ? (
                <div key={activeTemplate.id} className="w-full">
                  {activeMockup}
                </div>
              ) : (
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-white shadow-md border border-gray-100 flex items-center justify-center">
                  <img
                    key={activeTemplate.id}
                    src={activeTemplate.imageSrc}
                    alt={activeTemplate.title}
                    className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-500"
                    loading="lazy"
                  />
                </div>
              )
            )}
          </div>

          {/* Right: Interactive list */}
          <div className="flex flex-col space-y-2">
            {templates.map((template) => {
              const isActive = template.id === activeId;
              return (
                <button
                  key={template.id}
                  onClick={() => setActiveId(template.id)}
                  className={cn(
                    "group relative flex flex-col items-start gap-1 rounded-xl p-5 text-left transition-all duration-200",
                    isActive
                      ? "bg-white shadow-sm ring-1 ring-gray-200"
                      : "hover:bg-gray-50 bg-transparent"
                  )}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-black" />
                  )}

                  <h3 className="text-base font-bold text-foreground group-hover:text-black">
                    {template.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {template.description}
                  </p>

                  {isActive && (
                    <div className="mt-2 flex items-center text-sm font-semibold text-foreground">
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
