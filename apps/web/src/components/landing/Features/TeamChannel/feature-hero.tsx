import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { UserChatMockup } from "../UserManagement/user-management-mockups";

interface FeatureHeroProps {
  bgClass?: string;
  /** Small uppercase label above the title, e.g. "WORKSPACE MANAGEMENT" */
  category: string;
  ctaPrimary: string;
  ctaSecondary: string;
  hasPlayButton?: boolean;
  /** Text rendered before the highlighted portion */
  headingBefore: string;
  /** Highlighted / coloured portion of the heading */
  headingHighlight: string;
  heroLinks?: { text: string; href: string }[];
  heroLinksTitle?: string;
  /** Optional ReactNode to render in the hero right column (overrides default) */
  heroMockup?: ReactNode;
  imageAlt?: string;
  imageSrc?: string;
  layout?:
    | "centered"
    | "image-right"
    | "media-preview-badges"
    | "drag-drop-badges"
    | "user-management-hero";
  subtitle: string;
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
  if (
    layout === "image-right" ||
    layout === "media-preview-badges" ||
    layout === "drag-drop-badges" ||
    layout === "user-management-hero"
  ) {
    return (
      <section
        className={`w-full ${bgClass || "bg-background"} px-6 pt-24 pb-16 sm:pt-28 sm:pb-20 lg:px-8 lg:pt-32 lg:pb-24`}
      >
        <div className="mx-auto w-full max-w-[1480px]">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left Content */}
            <div className="max-w-2xl text-left">
              <p className="font-bold text-muted-foreground text-xs uppercase tracking-[0.2em] sm:text-sm">
                {category}
              </p>
              <h1 className="mt-5 text-balance font-bold text-4xl text-foreground tracking-tight sm:text-5xl lg:text-6xl lg:leading-[1.1]">
                {headingBefore}{" "}
                {headingHighlight && (
                  <span className="bg-gradient-to-r from-[#7C5CFF] to-[#5BA4FF] bg-clip-text text-transparent">
                    {headingHighlight}
                  </span>
                )}
              </h1>
              <p className="mt-6 text-pretty text-base text-muted-foreground leading-7 sm:text-lg sm:leading-8">
                {subtitle}
              </p>

              {layout === "user-management-hero" && (
                <div className="mt-8 flex flex-col items-start space-y-8">
                  <div>
                    <p className="mb-4 font-semibold text-foreground text-sm">
                      {heroLinksTitle ||
                        "Learn how administrators manage users by:"}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                      {(
                        heroLinks || [
                          { text: "ADDING USERS", href: "#" },
                          { text: "MANAGING PERMISSIONS", href: "#" },
                          { text: "ORGANISING ROLES", href: "#" },
                        ]
                      ).map((item) => (
                        <div
                          className="flex items-center gap-2"
                          key={item.text}
                        >
                          <div className="flex size-4 items-center justify-center rounded-full bg-gray-100">
                            <svg
                              className="text-gray-600"
                              fill="none"
                              height="10"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="3"
                              viewBox="0 0 24 24"
                              width="10"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </div>
                          <span className="font-bold text-foreground text-xs uppercase tracking-wider underline decoration-1 underline-offset-4">
                            {item.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Button
                      asChild
                      className="h-12 rounded-sm bg-[#7C5CFF] px-8 font-bold text-white text-xs uppercase tracking-wider hover:bg-[#6a4de6]"
                      size="lg"
                    >
                      <Link to={ctaPrimary.toUpperCase().includes("CONTACT") ? "/contact" : "/contact"}>{ctaPrimary}</Link>
                    </Button>
                    <Button
                      asChild
                      className="h-12 rounded-sm border-2 border-[#7C5CFF] bg-transparent px-8 font-bold text-[#7C5CFF] text-xs uppercase tracking-wider hover:bg-[#7C5CFF]/5"
                      size="lg"
                      variant="outline"
                    >
                      <Link to={ctaSecondary.toUpperCase().includes("SIGN IN") ? "/login" : "/login"}>{ctaSecondary}</Link>
                    </Button>
                  </div>
                </div>
              )}

              {layout !== "user-management-hero" && (
                <div className="mt-9 flex items-center gap-4">
                  <Button
                    asChild
                    className="h-12 rounded-md bg-[#7C5CFF] px-8 font-semibold text-sm text-white uppercase tracking-wide hover:bg-[#6a4de6]"
                    size="lg"
                  >
                    <Link to={ctaPrimary.toUpperCase().includes("CONTACT") ? "/contact" : "/contact"}>{ctaPrimary}</Link>
                  </Button>
                  <Button
                    asChild
                    className="h-12 rounded-md border-[#7C5CFF] px-8 font-semibold text-[#7C5CFF] text-sm uppercase tracking-wide hover:bg-[#7C5CFF]/5"
                    size="lg"
                    variant="outline"
                  >
                    <Link to={ctaSecondary.toUpperCase().includes("SIGN IN") ? "/login" : "/login"}>{ctaSecondary}</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Right Side - Conditional based on layout */}
            <div className="relative aspect-[4/3] w-full lg:aspect-auto lg:h-full lg:min-h-[400px]">
              {layout === "image-right" && (
                <div className="absolute inset-0 overflow-hidden rounded-xl shadow-xl lg:aspect-[4/3]">
                  {imageSrc && (
                    <img
                      alt={imageAlt || ""}
                      className="absolute inset-0 size-full object-cover"
                      src={imageSrc}
                    />
                  )}
                  {hasPlayButton && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex size-14 cursor-pointer items-center justify-center rounded-full bg-white shadow-xl transition-transform hover:scale-105 sm:size-20">
                        <svg
                          className="ml-1 sm:h-8 sm:w-8"
                          fill="#7C5CFF"
                          height="24"
                          viewBox="0 0 24 24"
                          width="24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M5 3L19 12L5 21V3Z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {layout === "user-management-hero" && (
                <div className="w-full">{heroMockup ?? <UserChatMockup />}</div>
              )}

              {layout === "media-preview-badges" && (
                <div className="relative flex h-[400px] w-full flex-col pt-8 sm:h-[500px] sm:pt-16">
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
                  <div className="floating-badge-1 absolute top-10 left-4 z-20 sm:top-12 sm:left-12">
                    <div className="rounded-full bg-[#38bdf8] px-6 py-2.5 font-semibold text-[13px] text-white shadow-md sm:text-sm">
                      Preview your latest media
                    </div>
                  </div>

                  {/* Badge 2: White Image Card */}
                  <div className="floating-badge-2 absolute top-28 left-4 z-10 sm:top-32 sm:left-16">
                    <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white px-4 py-3 shadow-lg sm:px-5 sm:py-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-50 text-blue-500">
                        <svg
                          fill="none"
                          height="18"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          width="18"
                        >
                          <rect
                            height="18"
                            rx="2"
                            ry="2"
                            width="18"
                            x="3"
                            y="3"
                          />
                          <circle cx="9" cy="9" r="2" />
                          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                        </svg>
                      </div>
                      <span className="font-semibold text-[#1d1c1d] text-[13px] sm:text-sm">
                        Image Preview Available
                      </span>
                    </div>
                  </div>

                  {/* Badge 3: Red Pill */}
                  <div className="floating-badge-3 absolute top-56 right-4 z-20 sm:top-64 sm:right-12">
                    <div className="rounded-full bg-[#f43f5e] px-6 py-2.5 font-semibold text-[13px] text-white shadow-md sm:text-sm">
                      Watch the video without downloading
                    </div>
                  </div>

                  {/* Badge 4: White Document Card */}
                  <div className="floating-badge-4 absolute top-72 right-8 z-10 sm:top-[310px] sm:right-20">
                    <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white px-4 py-3 shadow-lg sm:px-5 sm:py-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-orange-50 text-orange-500">
                        <svg
                          fill="none"
                          height="18"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          width="18"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                          <path d="M2 12h20" />
                        </svg>
                      </div>
                      <span className="font-semibold text-[#1d1c1d] text-[13px] sm:text-sm">
                        Preview documents in real time
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {layout === "drag-drop-badges" && (
                <div className="relative flex h-[400px] w-full flex-col pt-8 sm:h-[500px] sm:pt-16">
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
                  <div className="floating-badge-1 absolute top-10 left-4 z-20 sm:top-12 sm:left-12">
                    <div className="rounded-full bg-[#38bdf8] px-6 py-2.5 font-semibold text-[13px] text-white shadow-md sm:text-sm">
                      Drag files here to upload
                    </div>
                  </div>

                  {/* Badge 2: White Image Card */}
                  <div className="floating-badge-2 absolute top-28 left-4 z-10 sm:top-32 sm:left-16">
                    <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white px-4 py-3 shadow-lg sm:px-5 sm:py-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-50 text-blue-500">
                        <svg
                          fill="none"
                          height="18"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          width="18"
                        >
                          <rect
                            height="18"
                            rx="2"
                            ry="2"
                            width="18"
                            x="3"
                            y="3"
                          />
                          <circle cx="9" cy="9" r="2" />
                          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                        </svg>
                      </div>
                      <span className="font-semibold text-[#1d1c1d] text-[13px] sm:text-sm">
                        Preview images instantly
                      </span>
                    </div>
                  </div>

                  {/* Badge 3: Red Pill */}
                  <div className="floating-badge-3 absolute top-56 right-4 z-20 sm:top-64 sm:right-12">
                    <div className="rounded-full bg-[#e11d48] px-6 py-2.5 font-semibold text-[13px] text-white shadow-md sm:text-sm">
                      Drag audio and documents easily
                    </div>
                  </div>

                  {/* Badge 4: White Document Card */}
                  <div className="floating-badge-4 absolute top-72 right-8 z-10 sm:top-[310px] sm:right-20">
                    <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white px-4 py-3 shadow-lg sm:px-5 sm:py-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-orange-50 text-orange-500">
                        <svg
                          fill="none"
                          height="18"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          width="18"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                          <path d="M2 12h20" />
                        </svg>
                      </div>
                      <span className="font-semibold text-[#1d1c1d] text-[13px] sm:text-sm">
                        Upload files from any device
                      </span>
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
    <section
      className={`w-full ${bgClass || "bg-background"} px-6 pt-20 pb-10 sm:pt-24 sm:pb-14 lg:px-8 lg:pt-28 lg:pb-16`}
    >
      <div className="mx-auto max-w-4xl text-center">
        {/* Category label */}
        <p className="font-bold text-muted-foreground text-xs uppercase tracking-[0.2em] sm:text-sm">
          {category}
        </p>

        {/* Heading */}
        <h1 className="mt-5 text-balance font-bold text-4xl text-foreground tracking-tight sm:text-5xl lg:text-6xl lg:leading-[1.1]">
          {headingBefore}{" "}
          {headingHighlight && (
            <span className="bg-gradient-to-r from-[#7C5CFF] to-[#5BA4FF] bg-clip-text text-transparent">
              {headingHighlight}
            </span>
          )}
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-base text-muted-foreground leading-7 sm:text-lg sm:leading-8">
          {subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            asChild
            className="h-12 rounded-md bg-[#7C5CFF] px-8 font-semibold text-sm text-white uppercase tracking-wide hover:bg-[#6a4de6]"
            size="lg"
          >
            <Link to={ctaPrimary.toUpperCase().includes("CONTACT") ? "/contact" : "/contact"}>{ctaPrimary}</Link>
          </Button>
          <Button
            asChild
            className="h-12 rounded-md border-[#7C5CFF] px-8 font-semibold text-[#7C5CFF] text-sm uppercase tracking-wide hover:bg-[#7C5CFF]/5"
            size="lg"
            variant="outline"
          >
            <Link to={ctaSecondary.toUpperCase().includes("SIGN IN") ? "/login" : "/login"}>{ctaSecondary}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
