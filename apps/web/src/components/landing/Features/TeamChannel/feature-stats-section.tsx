import { Card, CardContent } from "@/components/ui/card";

interface FeatureStat {
  description: string;
  /** Raw SVG path `d` attribute(s) rendered with inline `<svg>` */
  iconPaths: string[];
  linkHref?: string;
  linkText?: string;
  title: string;
}

interface FeatureStatsSectionProps {
  headline: string;
  stats: [FeatureStat, FeatureStat, FeatureStat];
  subtitle: string;
}

/**
 * FeatureStatsSection
 * ─────────────────────────────────────────────────────
 * Centred headline + subtitle followed by a 3-column card grid.
 * Each card has an inline SVG icon (NO Lucide), title & description.
 */
export function FeatureStatsSection({
  headline,
  subtitle,
  stats,
}: FeatureStatsSectionProps) {
  return (
    <section className="w-full bg-background py-16 sm:py-20">
      <div className="container mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance font-bold text-3xl text-foreground tracking-tight sm:text-4xl">
            {headline}
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-7 sm:text-lg">
            {subtitle}
          </p>
        </div>

        {/* Stat cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {stats.map((stat) => (
            <Card
              className="flex flex-col items-start gap-4 border border-border/60 p-6 shadow-sm transition-shadow hover:shadow-md"
              key={stat.title}
            >
              <CardContent className="p-0">
                {/* Icon */}
                <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-[#7C5CFF]/10">
                  <svg
                    aria-hidden="true"
                    fill="none"
                    height="22"
                    stroke="#7C5CFF"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="22"
                  >
                    {stat.iconPaths.map((d, i) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: static icon paths
                      <path d={d} key={i} />
                    ))}
                  </svg>
                </div>
                <h3 className="font-semibold text-foreground text-lg">
                  {stat.title}
                </h3>
                <p className="mt-1.5 text-muted-foreground text-sm leading-6">
                  {stat.description}
                </p>
                {stat.linkText && stat.linkHref && (
                  <a
                    className="mt-4 font-semibold text-[#7C5CFF] text-sm transition-colors hover:text-[#7C5CFF]/80"
                    href={stat.linkHref}
                  >
                    {stat.linkText}
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
