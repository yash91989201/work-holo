import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import type { BpoPageData } from "./bpo-data";

/* ═══════════════════════════════════════════════════
   Reusable BPO page template
   Renders: Hero → Overview + Why Choose sidebar →
            Key Caps → Business Benefits → Proven Results → Footer
   ═══════════════════════════════════════════════════ */

interface BpoPageTemplateProps {
  data: BpoPageData;
}

export function BpoPageTemplate({ data }: BpoPageTemplateProps) {
  return (
    <div className="w-full">
      <HeroSection data={data} />
      <ContentSection data={data} />
    </div>
  );
}

/* ─────────────────── Hero Section ─────────────────── */

function HeroSection({ data }: { data: BpoPageData }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#f5f3ff] via-background to-background px-6 py-16 sm:py-20 lg:px-8">
      <div className="container mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
        {/* Left – Text content */}
        <div className="max-w-xl">
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#7C5CFF]/20 bg-[#7C5CFF]/10 px-3.5 py-1 font-semibold text-[#7C5CFF] text-md uppercase tracking-wider">
            <svg
              fill="none"
              height="14"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="14"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <path d="m9 11 3 3L22 4" />
            </svg>
            BPO Service
          </span>

          <h1 className="mt-5 font-bold text-4xl text-foreground tracking-tight sm:text-6xl">
            {data.title}
          </h1>
          <p className="mt-4 text-muted-foreground text-xl">{data.subtitle}</p>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              className="h-16 rounded-md bg-[#7C5CFF] px-7 font-semibold text-md uppercase tracking-wide hover:bg-[#6a4de6]"
              size="lg"
            >
              Request a Demo
            </Button>
            <Button
              className="h-16 rounded-md px-7 font-semibold text-md uppercase tracking-wide"
              size="lg"
              variant="outline"
            >
              Contact Sales
            </Button>
          </div>
        </div>

        {/* Right – Hero image */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative h-72 w-full max-w-md overflow-hidden rounded-2xl bg-muted shadow-xl sm:h-80 lg:h-96 lg:max-w-lg">
            <img
              alt={data.title}
              className="h-full w-full object-cover"
              loading="eager"
              src={data.heroImage}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────── Overview + Why Choose + Capabilities + Benefits ────────── */

function ContentSection({ data }: { data: BpoPageData }) {
  return (
    <section className="px-6 py-16 lg:px-8">
      <div className="container mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_420px]">
        {/* Left column */}
        <div className="space-y-14">
          {/* Overview */}
          <div>
            <h2 className="font-bold text-3xl text-foreground">Overview</h2>
            <p className="mt-4 text-foreground text-md leading-7">
              {data.overview}
            </p>
          </div>

          {/* Key Capabilities */}
          <div>
            <h2 className="font-bold text-3xl text-foreground">
              Key Capabilities
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {data.keyCapabilities.map((cap) => (
                <div
                  className="flex items-center gap-3 rounded-xl border border-border/60 bg-[#f9f8ff] px-5 py-4 transition-colors hover:border-[#7C5CFF]/30"
                  key={cap}
                >
                  <svg
                    className="shrink-0"
                    fill="none"
                    height="20"
                    stroke="#7C5CFF"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <path d="m9 11 3 3L22 4" />
                  </svg>
                  <span className="font-medium text-foreground text-md">
                    {cap}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Business Benefits */}
          <div>
            <h2 className="font-bold text-3xl text-foreground">
              Business Benefits
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {data.businessBenefits.map((benefit) => (
                <div
                  className="flex items-start gap-3 rounded-xl border border-border/60 bg-[#7C5CFF]/5 px-5 py-4"
                  key={benefit}
                >
                  <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[#7C5CFF]" />
                  <span className="text-foreground text-md">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Proven Results */}
          <div className="pt-6">
            <h2 className="font-bold text-3xl text-foreground">
              Proven Results
            </h2>
            <div className="mt-8 flex flex-wrap gap-5">
              {data.provenResults.map((stat) => (
                <div
                  className="flex h-[160px] w-[250px] flex-col items-center justify-center rounded-2xl border border-border/60 px-6 py-8 text-center transition-shadow hover:shadow-md"
                  key={stat.label}
                >
                  <span className="font-bold text-3xl text-[#7C5CFF] sm:text-4xl">
                    {stat.value}
                  </span>
                  <span className="mt-2 font-semibold text-muted-foreground text-sm uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column – Why Choose Workholo? */}
        <aside className="h-fit rounded-2xl border border-[#7C5CFF]/15 bg-[#f9f8ff] p-7 lg:sticky lg:top-28">
          <h3 className="font-bold text-2xl text-[#7C5CFF]">
            Why Choose Workholo?
          </h3>

          <div className="mt-6 space-y-6">
            {data.whyChoose.map((item, idx) => (
              <div className="flex gap-4" key={item.title}>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#7C5CFF]/10 font-bold text-[#7C5CFF] text-lg">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="font-semibold text-foreground text-lg">
                    {item.title}
                  </h4>
                  <p className="mt-1 text-md text-muted-foreground leading-5">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 border-[#7C5CFF]/10 border-t pt-6">
            <p className="text-md text-muted-foreground">
              Ready to transform your operations?
            </p>
            <Link
              className="mt-2 inline-flex items-center gap-1.5 font-medium text-foreground text-md transition-colors hover:text-[#7C5CFF]"
              to="/"
            >
              Talk to an Expert
              <svg
                fill="none"
                height="16"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
