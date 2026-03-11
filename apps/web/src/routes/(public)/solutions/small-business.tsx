import { createFileRoute } from "@tanstack/react-router";
import { SolutionPage } from "@/components/landing/solution-page";

export const Route = createFileRoute("/(public)/solutions/small-business")({
  component: RouteComponent,
});

function HeroVisual() {
  return (
    <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border/50 bg-background shadow-2xl">
      <div className="flex items-center gap-2 border-border/50 border-b bg-muted/30 px-4 py-3">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-500/80" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <div className="h-3 w-3 rounded-full bg-green-500/80" />
        </div>
        <div className="ml-4 h-4 w-32 rounded bg-muted-foreground/10" />
      </div>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7C5CFF]/10 text-[#7C5CFF]">
              <svg
                fill="none"
                height="20"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="20"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <div>
              <div className="h-4 w-24 rounded bg-foreground/80" />
              <div className="mt-1.5 h-3 w-16 rounded bg-muted-foreground/40" />
            </div>
          </div>
          <div className="rounded-full bg-green-500/10 px-2.5 py-1 font-medium text-green-600 text-xs">
            Active
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-16 w-full rounded-lg bg-muted/50 p-3">
            <div className="h-3 w-20 rounded bg-muted-foreground/30" />
            <div className="mt-2 h-3 w-full rounded bg-muted-foreground/20" />
            <div className="mt-1.5 h-3 w-4/5 rounded bg-muted-foreground/20" />
          </div>
          <div className="flex gap-3">
            <div className="flex h-10 flex-1 items-center justify-center rounded-lg bg-[#7C5CFF] font-medium text-sm text-white opacity-90">
              Answer Call
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureVisual1() {
  return (
    <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-border/50 bg-background shadow-xl">
      <div className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="h-4 w-32 rounded bg-foreground/80" />
          <div className="flex h-6 w-16 items-center justify-center rounded-full bg-[#7C5CFF]/10 font-medium text-[#7C5CFF] text-[10px]">
            Setup
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              className="flex items-center justify-between rounded-lg border border-border/50 p-3"
              key={i}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground text-xs">
                  {i}
                </div>
                <div>
                  <div className="h-3 w-20 rounded bg-foreground/70" />
                  <div className="mt-1.5 h-2 w-12 rounded bg-muted-foreground/40" />
                </div>
              </div>
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500/20">
                <div className="h-2 w-2 rounded-full bg-green-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeatureVisual2() {
  return (
    <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-border/50 bg-background shadow-xl">
      <div className="p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#7C5CFF]/10 text-[#7C5CFF]">
            <svg
              fill="none"
              height="14"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="14"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </div>
          <div className="h-4 w-32 rounded bg-foreground/80" />
        </div>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div className="rounded-lg border border-border/50 p-3" key={i}>
              <div className="mb-2 flex items-center justify-between">
                <div className="h-3 w-24 rounded bg-foreground/70" />
                <div className="h-3 w-12 rounded bg-muted-foreground/40" />
              </div>
              <div className="h-2 w-full rounded bg-muted-foreground/20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeatureVisual3() {
  return (
    <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-border/50 bg-background shadow-xl">
      <div className="p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
            <svg
              fill="none"
              height="14"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="14"
            >
              <path d="M3 3v18h18" />
              <path d="m19 9-5 5-4-4-3 3" />
            </svg>
          </div>
          <div className="h-4 w-32 rounded bg-foreground/80" />
        </div>
        <div className="flex h-32 items-end gap-2 border-border/50 border-b pb-2">
          {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
            <div
              className="w-full rounded-t-sm bg-[#7C5CFF]/80"
              key={i}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <div className="mt-4 flex justify-between">
          <div className="h-2 w-12 rounded bg-muted-foreground/30" />
          <div className="h-2 w-12 rounded bg-muted-foreground/30" />
          <div className="h-2 w-12 rounded bg-muted-foreground/30" />
        </div>
      </div>
    </div>
  );
}

function RouteComponent() {
  return (
    <SolutionPage
      cards={[
        {
          title: "Setup",
          body: "Get your business number and dashboard ready in less than 5 minutes.",
          icon: (
            <svg
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
            </svg>
          ),
        },
      ]}
      cardsHeadline="Simple tools for complex needs."
      cardsSubhead="Everything you need to manage your business communication in one place."
      eyebrow="AFFORDABLE BUSINESS TOOLS"
      faqs={[
        {
          question: "How much does BizConnect cost?",
          answer:
            "Our small business plans start at $29/month per user with no contracts. All features included.",
        },
        {
          question: "How long does setup take?",
          answer:
            "Most businesses are up and running within 5 minutes. Pick your number, configure your greeting, and start receiving calls.",
        },
        {
          question: "Can I keep my existing business number?",
          answer: "Yes. We offer free number porting with no downtime.",
        },
        {
          question: "What kind of analytics do I get?",
          answer:
            "Simple dashboards show call volumes, response times, missed calls, and peak hours — everything you need to make smarter staffing decisions.",
        },
        {
          question: "Is there a long-term contract?",
          answer:
            "No. All plans are month-to-month. Cancel anytime with no cancellation fees.",
        },
      ]}
      featureSections={[
        {
          headline: "Get started in minutes, not days.",
          body: "We've removed the complexity of business communication. Pick a number, set your greeting, and start receiving calls instantly.",
          textSide: "left",
          gray: false,
          visual: <FeatureVisual1 />,
        },
        {
          headline: "Never miss a customer call again.",
          body: "Intelligently route calls to your mobile, office, or team members based on your business hours and availability.",
          textSide: "right",
          gray: true,
          visual: <FeatureVisual2 />,
        },
        {
          headline: "Understand your business growth.",
          body: "Get simple, clear reports on your call volume and customer engagement. Data you can actually use to make decisions.",
          textSide: "left",
          gray: false,
          visual: <FeatureVisual3 />,
        },
      ]}
      heroCtas={{ primary: "START FREE TRIAL", secondary: "VIEW PRICING" }}
      heroHeadline="Professional communication for small businesses."
      heroSubhead="BizConnect provides simple, powerful, and affordable communication tools designed specifically for growing teams. No complex setup, just results."
      heroVisual={<HeroVisual />}
      insights={[
        {
          category: "Blog",
          title: "How to scale your small business communication",
          cta: "READ",
        },
        {
          category: "Guide",
          title: "Setting up your first professional phone system",
          cta: "READ",
        },
        {
          category: "Case Study",
          title: "How a local bakery increased sales by 30%",
          cta: "READ",
        },
        {
          category: "E-book",
          title: "The ultimate guide to small business analytics",
          cta: "DOWNLOAD",
        },
      ]}
      insightsHeadline="Resources for growing businesses."
    />
  );
}
