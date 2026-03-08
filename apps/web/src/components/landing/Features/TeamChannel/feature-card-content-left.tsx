import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FeatureCardContentLeftProps {
  /** Small uppercase category label shown above the heading */
  badge?: string;
  heading: string;
  description: string;
  /** Optional "Learn more →" link text */
  linkText?: string;
  /** Href for the optional link */
  linkHref?: string;
  /** Unsplash / any image URL — if omitted a gradient placeholder is shown */
  imageSrc?: string;
  imageAlt?: string;
  /** Optional coded UI mockup — takes priority over imageSrc */
  mockup?: ReactNode;
  /** Section background colour */
  bgVariant?: "white" | "gray";
  className?: string;
  /** Large bold stat number displayed below description (e.g. "100%") */
  stat?: string;
  /** Label text beneath the stat number */
  statLabel?: string;
  /** Small footnote / citation text */
  citation?: string;
  /** Large italic quote text */
  quote?: string;
  /** Author of the quote */
  quoteAuthor?: string;
  /** Role/Title of the author */
  quoteRole?: string;
  /** Team/Organization of the author */
  quoteTeam?: string;
}

/**
 * FeatureCardContentLeft
 * ─────────────────────────────────────────────────────
 * Layout:  [ Badge / Heading / Body / Stat / Link ]  |  [ IMAGE / MOCKUP ]
 */
export function FeatureCardContentLeft({
  badge,
  heading,
  description,
  linkText,
  linkHref,
  imageSrc,
  imageAlt = "",
  mockup,
  bgVariant = "gray",
  className,
  stat,
  statLabel,
  citation,
  quote,
  quoteAuthor,
  quoteRole,
  quoteTeam,
}: FeatureCardContentLeftProps) {
  return (
    <section
      className={cn(
        "w-full py-16 sm:py-20",
        bgVariant === "gray" ? "bg-muted/40" : "bg-background",
        className
      )}
    >
      <div className="mx-auto w-full max-w-[1280px] px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* ── Content — LEFT ── */}
          <div className="w-full">
            {badge && (
              <span className="inline-block rounded-full bg-[#7C5CFF] px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-white">
                {badge}
              </span>
            )}
            <h2
              className={cn(
                "font-bold text-3xl tracking-tight text-foreground sm:text-4xl lg:text-[2.5rem] lg:leading-[1.2]",
                badge ? "mt-4" : "mt-0"
              )}
            >
              {heading}
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
              {description}
            </p>

            {/* Stat block — shown only when stat is provided */}
            {stat && (
              <>
                <hr className="my-6 border-gray-300" />
                <p className="text-5xl font-bold text-foreground sm:text-6xl">{stat}</p>
                {statLabel && (
                  <p className="mt-2 text-sm font-medium text-muted-foreground">{statLabel}</p>
                )}
                {citation && (
                  <p className="mt-3 text-xs text-muted-foreground/60 leading-4">{citation}</p>
                )}
              </>
            )}

            {/* Quote block */}
            {quote && (
              <div className="mt-8 space-y-4">
                <blockquote className="text-2xl italic leading-9 text-foreground sm:text-3xl">
                  &lsquo;{quote}&rsquo;
                </blockquote>
                <div className="pt-4">
                  <p className="text-base font-bold text-foreground">{quoteAuthor}</p>
                  <p className="text-sm font-medium text-muted-foreground">{quoteRole}</p>
                  <p className="text-sm text-muted-foreground/60">{quoteTeam}</p>
                </div>
              </div>
            )}

            {linkText && linkHref && (
              <a
                href={linkHref}
                className="mt-5 inline-flex items-center gap-1.5 text-base font-medium text-[#7C5CFF] hover:underline"
              >
                {linkText}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </a>
            )}
          </div>

          {/* ── Image / Mockup — RIGHT ── */}
          <div className="overflow-hidden rounded-2xl">
            {mockup ? (
              mockup
            ) : imageSrc ? (
              <img
                src={imageSrc}
                alt={imageAlt}
                className="aspect-[4/3] h-full w-full object-cover rounded-2xl shadow-md"
                loading="lazy"
              />
            ) : (
              <div className="aspect-[4/3] w-full rounded-2xl bg-gradient-to-br from-[#ede9ff] via-[#f0edff] to-[#ddd5ff]" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
