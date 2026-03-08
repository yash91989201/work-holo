import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

interface HistoryFeatureSectionProps {
  heading: string;
  description: string;
  /** Optional "See the Marketplace >" link */
  linkText?: string;
  linkHref?: string;
  /** Pass a ReactNode for the visual side — can be an image, mockup, or custom block */
  visual: ReactNode;
  /** "image-left" means the visual is on the LEFT side */
  layout?: "image-left" | "content-left";
  className?: string;
}

/**
 * HistoryFeatureSection
 * ─────────────────────────────────────────────────────
 * Alternating content + visual section.
 * Accepts a ReactNode `visual` so each section can have a unique mockup
 * (dark-themed app UI, integration list, status cards, etc.)
 */
export function HistoryFeatureSection({
  heading,
  description,
  linkText,
  linkHref,
  visual,
  layout = "image-left",
  className,
}: HistoryFeatureSectionProps) {
  const isImageLeft = layout === "image-left";

  return (
    <section className={cn("w-full bg-white py-16 sm:py-24 lg:py-32", className)}>
      <div className="mx-auto w-full max-w-[1800px] px-6 sm:px-12 lg:px-20">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-24 xl:gap-32">
          {/* Visual or Text Left */}
          <div className="w-full">
            {isImageLeft ? (
              visual
            ) : (
              <div className="max-w-xl lg:max-w-none">
                <h2 className="font-bold text-3xl leading-[1.2] tracking-tight text-[#1d1c1d] sm:text-4xl">
                  {heading}
                </h2>
                <p className="mt-4 text-base leading-7 text-[#616061] sm:text-lg">
                  {description}
                </p>
                {linkText && linkHref && (
                  <Link
                    to={linkHref as any}
                    className="mt-5 inline-flex items-center gap-1 text-base font-medium text-[#1264a3] hover:underline"
                  >
                    {linkText}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Text or Visual Right */}
          <div className="w-full">
            {isImageLeft ? (
              <div className="max-w-xl lg:max-w-none">
                <h2 className="font-bold text-3xl leading-[1.2] tracking-tight text-[#1d1c1d] sm:text-4xl">
                  {heading}
                </h2>
                <p className="mt-4 text-base leading-7 text-[#616061] sm:text-lg">
                  {description}
                </p>
                {linkText && linkHref && (
                  <Link
                    to={linkHref as any}
                    className="mt-5 inline-flex items-center gap-1 text-base font-medium text-[#1264a3] hover:underline"
                  >
                    {linkText}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </Link>
                )}
              </div>
            ) : (
              visual
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
