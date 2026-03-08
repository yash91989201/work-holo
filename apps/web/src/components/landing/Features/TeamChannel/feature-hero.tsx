import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { UserChatMockup } from "../UserManagement/user-management-mockups";

interface FeatureHeroProps {
  /** Small uppercase label above the title, e.g. "WORKSPACE MANAGEMENT" */
  category: string;
  /** Text rendered before the highlighted portion */
  headingBefore: string;
  /** Highlighted / coloured portion of the heading */
  headingHighlight: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  layout?: "centered" | "image-right" | "media-preview-badges" | "drag-drop-badges" | "user-management-hero";
  imageSrc?: string;
  imageAlt?: string;
  hasPlayButton?: boolean;
  bgClass?: string;
  /** Optional ReactNode to render in the hero right column (overrides default) */
  heroMockup?: ReactNode;
  heroLinksTitle?: string;
  heroLinks?: { text: string; href: string }[];
}

/**
 * FeatureHero
 * ─────────────────────────────────────────────────────
 * Full-width centred hero section used on every feature detail page.
 * The heading highlight uses a purple-to-blue gradient text effect.
 */
export function FeatureHero({
  category,
  headingBefore,
  headingHighlight,
  subtitle,
  ctaPrimary,
  ctaSecondary,
  layout = "centered",
  imageSrc,
  imageAlt,
  hasPlayButton,
  bgClass,
  heroMockup,
  heroLinksTitle,
  heroLinks,
}: FeatureHeroProps) {
  if (layout === "image-right" || layout === "media-preview-badges" || layout === "drag-drop-badges" || layout === "user-management-hero") {
    return (
      <section className={`w-full ${bgClass || "bg-background"} px-6 pb-16 pt-24 sm:pb-20 sm:pt-28 lg:px-8 lg:pb-24 lg:pt-32`}>
        <div className="mx-auto w-full max-w-[1480px]">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            
            {/* Left Content */}
            <div className="max-w-2xl text-left">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground sm:text-sm">
                {category}
              </p>
              <h1 className="mt-5 text-balance font-bold text-4xl tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.1]">
                {headingBefore}{" "}
                {headingHighlight && (
                  <span className="bg-gradient-to-r from-[#7C5CFF] to-[#5BA4FF] bg-clip-text text-transparent">
                    {headingHighlight}
                  </span>
                )}
              </h1>
              <p className="mt-6 text-pretty text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                {subtitle}
              </p>

              {layout === "user-management-hero" && (
                <div className="mt-8 flex flex-col items-start space-y-8">
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-4">
                      {heroLinksTitle || "Learn how administrators manage users by:"}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                      {(heroLinks || [
                        { text: "ADDING USERS", href: "#" },
                        { text: "MANAGING PERMISSIONS", href: "#" },
                        { text: "ORGANISING ROLES", href: "#" },
                      ]).map((item) => (
                        <div key={item.text} className="flex items-center gap-2">
                          <div className="flex size-4 items-center justify-center rounded-full bg-gray-100">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600"><path d="M20 6 9 17l-5-5"/></svg>
                          </div>
                          <span className="text-xs font-bold tracking-wider text-foreground underline decoration-1 underline-offset-4 uppercase">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Button
                      size="lg"
                      className="h-12 rounded-sm bg-[#7C5CFF] px-8 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#6a4de6]"
                    >
                      {ctaPrimary}
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-12 rounded-sm border-2 border-[#7C5CFF] bg-transparent px-8 text-xs font-bold uppercase tracking-wider text-[#7C5CFF] hover:bg-[#7C5CFF]/5"
                    >
                      {ctaSecondary}
                    </Button>
                  </div>
                </div>
              )}

              {layout !== "user-management-hero" && (
                <div className="mt-9 flex items-center gap-4">
                  <Button
                    size="lg"
                    className="h-12 rounded-md bg-[#7C5CFF] px-8 text-sm font-semibold uppercase tracking-wide text-white hover:bg-[#6a4de6]"
                  >
                    {ctaPrimary}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 rounded-md border-[#7C5CFF] px-8 text-sm font-semibold uppercase tracking-wide text-[#7C5CFF] hover:bg-[#7C5CFF]/5"
                  >
                    {ctaSecondary}
                  </Button>
                </div>
              )}
            </div>

            {/* Right Side - Conditional based on layout */}
            <div className="relative w-full aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[400px]">
              
              {layout === "image-right" && (
                <div className="absolute inset-0 rounded-xl overflow-hidden shadow-xl lg:aspect-[4/3]">
                  {imageSrc && (
                    <img src={imageSrc} alt={imageAlt || ""} className="absolute inset-0 size-full object-cover" />
                  )}
                  {hasPlayButton && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex size-14 cursor-pointer items-center justify-center rounded-full bg-white shadow-xl transition-transform hover:scale-105 sm:size-20">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#7C5CFF" xmlns="http://www.w3.org/2000/svg" className="ml-1 sm:h-8 sm:w-8">
                          <path d="M5 3L19 12L5 21V3Z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {layout === "user-management-hero" && (
                <div className="w-full">
                  {heroMockup ?? <UserChatMockup />}
                </div>
              )}

              {layout === "media-preview-badges" && (
                <div className="relative w-full h-[400px] sm:h-[500px] flex flex-col pt-8 sm:pt-16">
                  <style>
                    {`
                      @keyframes floatFast {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-8px); }
                      }
                      @keyframes floatSlow {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-12px); }
                      }
                      .floating-badge-1 { animation: floatFast 4s ease-in-out infinite; }
                      .floating-badge-2 { animation: floatSlow 5s ease-in-out infinite 1s; }
                      .floating-badge-3 { animation: floatFast 4.5s ease-in-out infinite 2s; }
                      .floating-badge-4 { animation: floatSlow 5.5s ease-in-out infinite 0.5s; }
                    `}
                  </style>

                  {/* Badge 1: Cyan Pill */}
                  <div className="absolute left-4 top-10 sm:left-12 sm:top-12 z-20 floating-badge-1">
                    <div className="rounded-full bg-[#38bdf8] px-6 py-2.5 text-[13px] sm:text-sm font-semibold text-white shadow-md">
                      Preview your latest media
                    </div>
                  </div>

                  {/* Badge 2: White Image Card */}
                  <div className="absolute left-4 top-28 sm:left-16 sm:top-32 z-10 floating-badge-2">
                    <div className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 sm:px-5 sm:py-4 shadow-lg border border-gray-100">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-50 text-blue-500">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                      </div>
                      <span className="text-[13px] sm:text-sm font-semibold text-[#1d1c1d]">Image Preview Available</span>
                    </div>
                  </div>

                  {/* Badge 3: Red Pill */}
                  <div className="absolute right-4 top-56 sm:right-12 sm:top-64 z-20 floating-badge-3">
                    <div className="rounded-full bg-[#f43f5e] px-6 py-2.5 text-[13px] sm:text-sm font-semibold text-white shadow-md">
                      Watch the video without downloading
                    </div>
                  </div>

                  {/* Badge 4: White Document Card */}
                  <div className="absolute right-8 top-72 sm:right-20 sm:top-[310px] z-10 floating-badge-4">
                    <div className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 sm:px-5 sm:py-4 shadow-lg border border-gray-100">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-orange-50 text-orange-500">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                      </div>
                      <span className="text-[13px] sm:text-sm font-semibold text-[#1d1c1d]">Preview documents in real time</span>
                    </div>
                  </div>
                </div>
              )}

              {layout === "drag-drop-badges" && (
                <div className="relative w-full h-[400px] sm:h-[500px] flex flex-col pt-8 sm:pt-16">
                  <style>
                    {`
                      @keyframes floatFast {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-8px); }
                      }
                      @keyframes floatSlow {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-12px); }
                      }
                      .floating-badge-1 { animation: floatFast 4s ease-in-out infinite; }
                      .floating-badge-2 { animation: floatSlow 5s ease-in-out infinite 1s; }
                      .floating-badge-3 { animation: floatFast 4.5s ease-in-out infinite 2s; }
                      .floating-badge-4 { animation: floatSlow 5.5s ease-in-out infinite 0.5s; }
                    `}
                  </style>

                  {/* Badge 1: Cyan Pill */}
                  <div className="absolute left-4 top-10 sm:left-12 sm:top-12 z-20 floating-badge-1">
                    <div className="rounded-full bg-[#38bdf8] px-6 py-2.5 text-[13px] sm:text-sm font-semibold text-white shadow-md">
                      Drag files here to upload
                    </div>
                  </div>

                  {/* Badge 2: White Image Card */}
                  <div className="absolute left-4 top-28 sm:left-16 sm:top-32 z-10 floating-badge-2">
                    <div className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 sm:px-5 sm:py-4 shadow-lg border border-gray-100">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-50 text-blue-500">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                      </div>
                      <span className="text-[13px] sm:text-sm font-semibold text-[#1d1c1d]">Preview images instantly</span>
                    </div>
                  </div>

                  {/* Badge 3: Red Pill */}
                  <div className="absolute right-4 top-56 sm:right-12 sm:top-64 z-20 floating-badge-3">
                    <div className="rounded-full bg-[#e11d48] px-6 py-2.5 text-[13px] sm:text-sm font-semibold text-white shadow-md">
                      Drag audio and documents easily
                    </div>
                  </div>

                  {/* Badge 4: White Document Card */}
                  <div className="absolute right-8 top-72 sm:right-20 sm:top-[310px] z-10 floating-badge-4">
                    <div className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 sm:px-5 sm:py-4 shadow-lg border border-gray-100">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-orange-50 text-orange-500">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                      </div>
                      <span className="text-[13px] sm:text-sm font-semibold text-[#1d1c1d]">Upload files from any device</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
            
          </div>
        </div>
      </section>
    );
  }

  // Centered Dashboard Layout
  return (
    <section className={`w-full ${bgClass || "bg-background"} px-6 pb-10 pt-20 sm:pb-14 sm:pt-24 lg:px-8 lg:pb-16 lg:pt-28`}>
      <div className="mx-auto max-w-4xl text-center">
        {/* Category label */}
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground sm:text-sm">
          {category}
        </p>

        {/* Heading */}
        <h1 className="mt-5 text-balance font-bold text-4xl tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.1]">
          {headingBefore}{" "}
          {headingHighlight && (
            <span className="bg-gradient-to-r from-[#7C5CFF] to-[#5BA4FF] bg-clip-text text-transparent">
              {headingHighlight}
            </span>
          )}
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
          {subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            className="h-12 rounded-md bg-[#7C5CFF] px-8 text-sm font-semibold uppercase tracking-wide text-white hover:bg-[#6a4de6]"
          >
            {ctaPrimary}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 rounded-md border-[#7C5CFF] px-8 text-sm font-semibold uppercase tracking-wide text-[#7C5CFF] hover:bg-[#7C5CFF]/5"
          >
            {ctaSecondary}
          </Button>
        </div>
      </div>
    </section>
  );
}
