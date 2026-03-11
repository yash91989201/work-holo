import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/(public)/company/brand")({
  component: BrandPage,
});

const faqs = [
  {
    question: "Where can I find the official WorkHolo logo?",
    answer:
      "The official WorkHolo logo and all brand assets can be downloaded from our Brand Centre. We provide the logo in various formats including SVG, PNG, and EPS for different use cases.",
  },
  {
    question: "What is the primary brand color?",
    answer:
      "The primary WorkHolo brand color is Purple (#7C5CFF). This color represents innovation, creativity, and collaboration. We also use Black (#000000) and Light Gray (#E5E7EB) as supporting colors.",
  },
  {
    question: "Can I use screenshots of the app in my marketing?",
    answer:
      "Yes, you can use WorkHolo screenshots in your marketing materials. We provide high-resolution UI assets that are updated monthly to reflect the latest product features and design system.",
  },
  {
    question: "How do I request a custom brand asset?",
    answer:
      "For custom brand assets or specific use cases not covered in our Brand Centre, please contact our marketing team through the Contact Us page. We're happy to help with partnership and co-marketing opportunities.",
  },
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-border border-b last:border-b-0">
      <details className="group">
        <summary className="flex w-full cursor-pointer items-center justify-between py-5 text-left">
          <span className="font-semibold text-base text-foreground">
            {question}
          </span>
          <svg
            className="ml-4 shrink-0 transition-transform duration-200 group-open:rotate-180"
            fill="none"
            height="20"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="20"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </summary>
        <p className="pb-5 text-muted-foreground text-sm leading-relaxed">
          {answer}
        </p>
      </details>
    </div>
  );
}

function BrandPage() {
  return (
    <div className="w-full">
      <section className="bg-muted/40 py-20 sm:py-24 lg:py-28">
        <div className="container mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="mb-4 font-bold text-foreground/50 text-xs uppercase tracking-widest">
                BRAND CENTRE
              </p>
              <h1 className="text-balance font-bold text-4xl leading-tight tracking-tight sm:text-5xl lg:text-5xl lg:leading-[1.1]">
                Build with the WorkHolo identity
              </h1>
              <p className="mt-6 max-w-xl text-pretty text-base text-muted-foreground leading-relaxed sm:text-lg">
                Resources for consistent use of WorkHolo branding across
                partners, marketing materials, and internal teams.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Button
                  asChild
                  className="rounded-md bg-[#7C5CFF] px-7 font-semibold text-sm text-white uppercase tracking-wide hover:bg-[#6B4CE6]"
                  size="lg"
                >
                  <Link to="/">Download Kit</Link>
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="relative flex aspect-square w-full max-w-md items-center justify-center rounded-2xl bg-gradient-to-br from-[#7C5CFF]/20 via-[#7C5CFF]/10 to-background">
                <div className="flex flex-col items-center gap-4">
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-[#7C5CFF] shadow-lg">
                    <svg
                      className="text-white"
                      fill="none"
                      height="48"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="48"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <div className="h-2 w-32 rounded-full bg-[#7C5CFF]/30" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-20 sm:py-24 lg:py-28">
        <div className="container mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mb-12 flex flex-wrap gap-4">
            <Button
              className="rounded-full bg-[#7C5CFF] px-6 font-semibold text-sm text-white"
              size="sm"
            >
              Guidelines
            </Button>
            <Button
              className="rounded-full border-border px-6 font-semibold text-sm"
              size="sm"
              variant="outline"
            >
              Brand Assets
            </Button>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-bold text-2xl tracking-tight">
                Logos • Colors • Icons
              </h2>
              <h3 className="mt-6 font-bold text-lg">WorkHolo Identity</h3>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Access our core brand elements including high-resolution logos,
                our signature color palette (#7C5CFF), typography guidelines,
                and custom-designed icons.
              </p>

              <div className="mt-8 flex gap-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-16 w-16 rounded-xl bg-[#7C5CFF]" />
                  <span className="text-muted-foreground text-xs">#7C5CFF</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="h-16 w-16 rounded-xl bg-black" />
                  <span className="text-muted-foreground text-xs">#000000</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="h-16 w-16 rounded-xl border border-border bg-[#E5E7EB]" />
                  <span className="text-muted-foreground text-xs">#E5E7EB</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="relative flex aspect-square w-full max-w-sm items-center justify-center rounded-2xl bg-gradient-to-br from-[#7C5CFF]/20 via-[#7C5CFF]/10 to-background">
                <div className="flex flex-col items-center gap-3">
                  <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-[#7C5CFF] shadow-lg">
                    <svg
                      className="text-white"
                      fill="none"
                      height="36"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="36"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <p className="font-bold text-sm">SVG</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-20 sm:py-24 lg:py-28">
        <div className="container mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <h2 className="font-bold text-3xl tracking-tight sm:text-4xl">
            Visual Identity & Assets
          </h2>
          <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
            Access our core brand elements including high-resolution logos, our
            signature color palette (#7C5CFF), typography guidelines, and
            custom-designed icons.
          </p>

          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-background p-8">
              <h3 className="font-bold text-lg">WebApp UI Screenshots</h3>
              <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
                Showcase the WorkHolo experience with high-fidelity screenshots
                of our WebApp UI. Includes views of team collaboration, channel
                organization, and real-time dashboards.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="font-bold text-[#7C5CFF]">4K</span>
                <span className="text-muted-foreground text-sm">
                  Ultra-high resolution assets for marketing and presentations
                </span>
              </div>
              <p className="mt-4 text-muted-foreground text-xs">
                * All UI assets are updated monthly to reflect the latest
                product features and design system.
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-background p-8">
              <h3 className="font-bold text-lg">
                WorkHolo Presentation Template
              </h3>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                  <svg
                    className="text-red-600"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold">Brand_Guidelines_v2.pdf</p>
                  <p className="text-muted-foreground text-sm">12.4 MB</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <svg
                  className="text-green-600"
                  fill="none"
                  height="16"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="16"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="text-muted-foreground text-sm">
                  100% Integration documentation ready.
                </span>
              </div>
              <a
                className="mt-4 inline-flex items-center gap-1 font-semibold text-[#7C5CFF] text-sm transition-colors hover:text-[#6B4CE6]"
                href="#"
              >
                View Online <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-20 sm:py-24 lg:py-28">
        <div className="container mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="font-bold text-3xl tracking-tight sm:text-4xl">
                Integration & Documentation
              </h2>
              <p className="mt-4 text-pretty text-base text-muted-foreground leading-relaxed sm:text-lg">
                Learn how to properly integrate WorkHolo features into your
                presentations or marketing materials. Our documentation ensures
                a seamless and consistent brand experience.
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-muted/40 p-8">
              <blockquote className="text-lg leading-relaxed">
                <span className="text-4xl text-[#7C5CFF]">&ldquo;</span>
                Consistency is the foundation of trust. The WorkHolo Brand
                Centre provides our partners with everything they need to
                represent our vision accurately and beautifully.
                <span className="text-4xl text-[#7C5CFF]">&rdquo;</span>
              </blockquote>
              <div className="mt-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#7C5CFF]/10">
                  <svg
                    className="text-[#7C5CFF]"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold">WorkHolo</p>
                  <p className="text-muted-foreground text-sm">
                    Creative Director
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Brand & Marketing Strategy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-20 sm:py-24 lg:py-28">
        <div className="container mx-auto max-w-3xl px-6 sm:px-8 lg:px-12">
          <h2 className="mb-10 text-center font-bold text-3xl tracking-tight sm:text-4xl">
            Frequently asked questions
          </h2>
          <div className="divide-y-0 rounded-2xl border border-border/60 bg-background px-8">
            {faqs.map((faq) => (
              <FaqItem
                answer={faq.answer}
                key={faq.question}
                question={faq.question}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
