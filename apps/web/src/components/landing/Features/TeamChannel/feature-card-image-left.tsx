import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FeatureCardImageLeftProps {
  /** Small uppercase category label shown above the heading */
  badge?: string;
  /** Section background colour */
  bgVariant?: "white" | "gray";
  className?: string;
  /** Optional override for the main inner container class */
  containerClass?: string;
  description: string;
  heading: string;
  imageAlt?: string;
  /** Unsplash / any image URL — if omitted a gradient placeholder is shown */
  imageSrc?: string;
  /** Href for the optional link */
  linkHref?: string;
  /** Optional "Learn more →" link text */
  linkText?: string;
  /** Optional coded UI mockup — takes priority over imageSrc */
  mockup?: ReactNode;
}

/**
 * FeatureCardImageLeft
 * ─────────────────────────────────────────────────────
 * Layout:  [ IMAGE ]  |  [ Badge / Heading / Body / Link ]
 *
 * Reusable section card for feature detail pages.
 * Pair with FeatureCardContentLeft to create an alternating layout.
 */
export function FeatureCardImageLeft({
  badge,
  heading,
  description,
  linkText,
  linkHref,
  imageSrc,
  imageAlt = "",
  mockup,
  bgVariant = "white",
  className,
  containerClass,
}: FeatureCardImageLeftProps) {
  return (
    <section
      className={cn(
        "w-full py-16 sm:py-20",
        bgVariant === "gray" ? "bg-muted/40" : "bg-background",
        className
      )}
    >
      <div
        className={cn(
          "mx-auto w-full max-w-[1480px] px-6 lg:px-8",
          containerClass
        )}
      >
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* ── Image / Mockup — LEFT ── */}
          <div className="overflow-hidden rounded-2xl">
            {mockup && mockup}
            {!mockup && imageSrc && (
              <img
                alt={imageAlt}
                className="aspect-[4/3] h-full w-full rounded-2xl object-cover shadow-md"
                height={800}
                loading="lazy"
                src={imageSrc}
                width={1000}
              />
            )}
            {!(mockup || imageSrc) && (
              <div className="aspect-[4/3] w-full rounded-2xl bg-gradient-to-br from-[#ede9ff] via-[#f0edff] to-[#ddd5ff]" />
            )}
          </div>

          {/* ── Content — RIGHT ── */}
          <div className="w-full">
            {badge && (
              <span className="inline-block rounded-full bg-[#7C5CFF] px-3.5 py-1 font-bold text-white text-xs uppercase tracking-widest">
                {badge}
              </span>
            )}
            <h2
              className={cn(
                "font-bold text-3xl text-foreground tracking-tight sm:text-4xl lg:text-[2.5rem] lg:leading-[1.2]",
                badge ? "mt-4" : "mt-0"
              )}
            >
              {heading}
            </h2>
            <p className="mt-4 text-base text-muted-foreground leading-7 sm:text-lg">
              {description}
            </p>
            {linkText && linkHref && (
              <a
                className="mt-5 inline-flex items-center gap-1.5 font-medium text-[#7C5CFF] text-base hover:underline"
                href={linkHref}
              >
                {linkText}
                <svg
                  aria-hidden="true"
                  fill="none"
                  height="16"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="16"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
