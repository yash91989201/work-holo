import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

interface FeatureCtaSectionProps {
  ctaPrimary?: string;
  ctaSecondary?: string;
  heading?: string;
}

/**
 * FeatureCtaSection
 * ─────────────────────────────────────────────────────
 * Purple wave bottom-CTA section identical in style to the main landing page.
 */
export function FeatureCtaSection({
  heading = "Build a better team with Workholo.",
  ctaPrimary = "Contact Us",
  ctaSecondary = "Sign In",
}: FeatureCtaSectionProps) {
  return (
    <section className="relative w-full">
      {/* Top wave — white arch into purple */}
      <div className="relative -mb-1 w-full overflow-hidden bg-[#7C5CFF]">
        <svg
          aria-hidden="true"
          className="block w-full"
          preserveAspectRatio="none"
          style={{ height: "100px" }}
          viewBox="0 0 1440 100"
        >
          <path d="M0,0 L0,20 Q720,140 1440,20 L1440,0 Z" fill="white" />
        </svg>
      </div>

      {/* Purple content */}
      <div className="bg-[#7C5CFF] px-4 pt-6 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-bold text-3xl text-white tracking-tight sm:text-4xl lg:text-5xl lg:leading-[1.15]">
            {heading}
          </h2>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              className="h-12 rounded-md border-2 border-white bg-transparent px-8 font-semibold text-sm text-white uppercase tracking-wide hover:bg-white/10"
              size="lg"
            >
              <Link to="/contact">{ctaPrimary}</Link>
            </Button>
            <Button
              asChild
              className="h-12 rounded-md bg-white px-8 font-semibold text-[#7C5CFF] text-sm uppercase tracking-wide hover:bg-white/90"
              size="lg"
            >
              <Link to="/login">{ctaSecondary}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
