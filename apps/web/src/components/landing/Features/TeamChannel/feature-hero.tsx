import { Button } from "@/components/ui/button";

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
}: FeatureHeroProps) {
  return (
    <section className="w-full bg-background px-6 pb-10 pt-20 sm:pb-14 sm:pt-24 lg:px-8 lg:pb-16 lg:pt-28">
      <div className="mx-auto max-w-4xl text-center">
        {/* Category label */}
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground sm:text-sm">
          {category}
        </p>

        {/* Heading */}
        <h1 className="mt-5 text-balance font-bold text-4xl tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.1]">
          {headingBefore}{" "}
          <span className="bg-gradient-to-r from-[#7C5CFF] to-[#5BA4FF] bg-clip-text text-transparent">
            {headingHighlight}
          </span>
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
