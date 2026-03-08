import { Card, CardContent } from "@/components/ui/card";

interface FeatureStat {
  /** Raw SVG path `d` attribute(s) rendered with inline `<svg>` */
  iconPaths: string[];
  title: string;
  description: string;
  linkText?: string;
  linkHref?: string;
}

interface FeatureStatsSectionProps {
  headline: string;
  subtitle: string;
  stats: [FeatureStat, FeatureStat, FeatureStat];
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
          <h2 className="text-balance font-bold text-3xl tracking-tight text-foreground sm:text-4xl">
            {headline}
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            {subtitle}
          </p>
        </div>

        {/* Stat cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {stats.map((stat) => (
            <Card
              key={stat.title}
              className="flex flex-col items-start gap-4 border border-border/60 p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <CardContent className="p-0">
                {/* Icon */}
                <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-[#7C5CFF]/10">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#7C5CFF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {stat.iconPaths.map((d, i) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: static icon paths
                      <path key={i} d={d} />
                    ))}
                  </svg>
                </div>
                <h3 className="font-semibold text-lg text-foreground">
                  {stat.title}
                </h3>
                <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                  {stat.description}
                </p>
                {stat.linkText && stat.linkHref && (
                  <a
                    href={stat.linkHref}
                    className="mt-4 text-sm font-semibold text-[#7C5CFF] hover:text-[#7C5CFF]/80 transition-colors"
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
