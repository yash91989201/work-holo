import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/landing/footer";
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
    <section className="relative overflow-hidden bg-gradient-to-br from-[#f5f3ff] via-background to-background px-6 py-16 sm:py-20 lg:px-8 ">
      <div className="container mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
        {/* Left – Text content */}
        <div className="max-w-xl">
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#7C5CFF]/20 bg-[#7C5CFF]/10 px-3.5 py-1 text-md font-semibold uppercase tracking-wider text-[#7C5CFF]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <path d="m9 11 3 3L22 4" />
            </svg>
            BPO Service
          </span>

          <h1 className="mt-5 font-bold text-4xl tracking-tight text-foreground sm:text-6xl">
            {data.title}
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">{data.subtitle}</p>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              size="lg"
              className="rounded-md h-16 bg-[#7C5CFF] px-7 text-md font-semibold uppercase tracking-wide hover:bg-[#6a4de6]"
            >
              Request a Demo
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-md h-16 px-7 text-md font-semibold uppercase tracking-wide"
            >
              Contact Sales
            </Button>
          </div>
        </div>

        {/* Right – Hero image */}
        <div className="flex justify-center lg:justify-end ">
          <div className="relative h-72 w-full max-w-md overflow-hidden rounded-2xl bg-muted shadow-xl sm:h-80 lg:h-96 lg:max-w-lg">
            <img
              src={data.heroImage}
              alt={data.title}
              className="h-full w-full object-cover"
              loading="eager"
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
            <p className="mt-4 text-md leading-7 text-foreground">
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
                  key={cap}
                  className="flex items-center gap-3 rounded-xl border border-border/60 bg-[#f9f8ff] px-5 py-4 transition-colors hover:border-[#7C5CFF]/30"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#7C5CFF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <path d="m9 11 3 3L22 4" />
                  </svg>
                  <span className="text-md font-medium text-foreground">
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
                  key={benefit}
                  className="flex items-start gap-3 bg-[#7C5CFF]/5 rounded-xl border border-border/60 px-5 py-4"
                >
                  <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[#7C5CFF]" />
                  <span className="text-md text-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Proven Results */}
          <div className="pt-6">
            <h2 className="font-bold text-3xl text-foreground">Proven Results</h2>
            <div className="mt-8 flex flex-wrap gap-5">
              {data.provenResults.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center justify-center rounded-2xl w-[250px] border border-border/60 px-6 py-8 text-center transition-shadow hover:shadow-md h-[160px]"
                >
                  <span className="font-bold text-3xl text-[#7C5CFF] sm:text-4xl">
                    {stat.value}
                  </span>
                  <span className="mt-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
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
              <div key={item.title} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#7C5CFF]/10 text-lg font-bold text-[#7C5CFF]">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="font-semibold text-lg text-foreground">
                    {item.title}
                  </h4>
                  <p className="mt-1 text-md leading-5 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t border-[#7C5CFF]/10 pt-6">
            <p className="text-md text-muted-foreground">
              Ready to transform your operations?
            </p>
            <Link
              to="/"
              className="mt-2 inline-flex items-center gap-1.5 text-md font-medium text-foreground transition-colors hover:text-[#7C5CFF]"
            >
              Talk to an Expert
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
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


