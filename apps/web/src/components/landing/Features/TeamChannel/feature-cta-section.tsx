import { Button } from "@/components/ui/button";

interface FeatureCtaSectionProps {
  heading?: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
}

/**
 * FeatureCtaSection
 * ─────────────────────────────────────────────────────
 * Purple wave bottom-CTA section identical in style to the main landing page.
 */
export function FeatureCtaSection({
  heading = "Build a better team with Workholo.",
  ctaPrimary = "Get Started",
  ctaSecondary = "Request a Demo",
}: FeatureCtaSectionProps) {
  return (
    <section className="relative w-full">
      {/* Top wave — white arch into purple */}
      <div className="relative -mb-1 w-full overflow-hidden bg-[#7C5CFF]">
        <svg
          viewBox="0 0 1440 100"
          className="block w-full"
          preserveAspectRatio="none"
          style={{ height: "100px" }}
          aria-hidden="true"
        >
          <path d="M0,0 L0,20 Q720,140 1440,20 L1440,0 Z" fill="white" />
        </svg>
      </div>

      {/* Purple content */}
      <div className="bg-[#7C5CFF] px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-bold text-3xl text-white tracking-tight sm:text-4xl lg:text-5xl lg:leading-[1.15]">
            {heading}
          </h2>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="h-12 rounded-md border-2 border-white bg-transparent px-8 text-sm font-semibold uppercase tracking-wide text-white hover:bg-white/10"
            >
              {ctaPrimary}
            </Button>
            <Button
              size="lg"
              className="h-12 rounded-md bg-white px-8 text-sm font-semibold uppercase tracking-wide text-[#7C5CFF] hover:bg-white/90"
            >
              {ctaSecondary}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
