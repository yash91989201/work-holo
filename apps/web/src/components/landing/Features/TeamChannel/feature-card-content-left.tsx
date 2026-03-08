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
  /** Section background colour */
  bgVariant?: "white" | "gray";
  className?: string;
}

/**
 * FeatureCardContentLeft
 * ─────────────────────────────────────────────────────
 * Layout:  [ Badge / Heading / Body / Link ]  |  [ IMAGE ]
 *
 * Reusable section card for feature detail pages.
 * Pair with FeatureCardImageLeft to create an alternating layout.
 */
export function FeatureCardContentLeft({
  badge,
  heading,
  description,
  linkText,
  linkHref,
  imageSrc,
  imageAlt = "",
  bgVariant = "gray",
  className,
}: FeatureCardContentLeftProps) {
  return (
    <section
      className={cn(
        "w-full py-16 sm:py-20",
        bgVariant === "gray" ? "bg-muted/40" : "bg-background",
        className
      )}
    >
      <div className="container mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* ── Content — LEFT ── */}
          <div className="max-w-xl">
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

          {/* ── Image — RIGHT ── */}
          <div className="overflow-hidden rounded-2xl shadow-md">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={imageAlt}
                className="aspect-[4/3] h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="aspect-[4/3] w-full bg-gradient-to-br from-[#ede9ff] via-[#f0edff] to-[#ddd5ff]" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
