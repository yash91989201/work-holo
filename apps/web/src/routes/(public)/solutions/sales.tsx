import { createFileRoute } from "@tanstack/react-router";
import { SolutionPage } from "@/components/landing/solution-page";

export const Route = createFileRoute("/(public)/solutions/sales")({
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
          <div className="rounded-full bg-blue-500/10 px-2.5 py-1 font-medium text-blue-600 text-xs">
            Dialing...
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-16 w-full rounded-lg bg-muted/50 p-3">
            <div className="h-3 w-20 rounded bg-muted-foreground/30" />
            <div className="mt-2 h-3 w-full rounded bg-muted-foreground/20" />
            <div className="mt-1.5 h-3 w-4/5 rounded bg-muted-foreground/20" />
          </div>
          <div className="flex gap-3">
            <div className="flex h-10 flex-1 items-center justify-center rounded-lg bg-red-500/10 font-medium text-red-500 text-sm">
              End Call
            </div>
            <div className="flex h-10 flex-1 items-center justify-center rounded-lg bg-[#7C5CFF] font-medium text-sm text-white">
              Next Lead
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
          <div className="h-4 w-24 rounded bg-foreground/80" />
          <div className="h-4 w-8 rounded bg-muted-foreground/30" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              className="flex items-center justify-between rounded-lg border border-border/50 p-3"
              key={i}
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-muted" />
                <div>
                  <div className="h-3 w-20 rounded bg-foreground/70" />
                  <div className="mt-1.5 h-2 w-12 rounded bg-muted-foreground/40" />
                </div>
              </div>
              <div className="flex h-6 w-16 items-center justify-center rounded-full bg-green-500/10 font-medium text-[10px] text-green-600">
                Ready
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
              <rect height="18" rx="2" ry="2" width="18" x="3" y="4" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
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
      ctaPrimary="CONTACT US"
      ctaSecondary=""
      eyebrow="SALES ACCELERATION PLATFORM"
      faqs={[
        {
          question: "How does the automated dialer work?",
          answer:
            "We offer predictive, power, and preview dialing modes to match your team's workflow and compliance needs.",
        },
        {
          question: "Can I integrate it with my CRM?",
          answer:
            "Leads sync bidirectionally in real time. Call outcomes, notes, and dispositions are pushed back automatically.",
        },
        {
          question: "What kind of analytics do you provide?",
          answer:
            "Real-time dashboards with call metrics, conversion rates, agent performance, and pipeline insights.",
        },
        {
          question: "Is there a limit on the number of calls?",
          answer:
            "Yes. Built-in compliance tools include DNC list management, time-zone restrictions, and consent tracking.",
        },
        {
          question: "How secure is my lead data?",
          answer:
            "All data is encrypted at rest and in transit with role-based access controls and SOC 2 Type II certification.",
        },
      ]}
      featureSections={[
        {
          headline: "Stop wasting time on manual dialing.",
          body: "Manual dialing is slow and prone to errors. Our automated dialer connects your team with more prospects in less time, eliminating dead air and increasing talk time.",
          textSide: "left",
          gray: false,
          visual: <FeatureVisual1 />,
        },
        {
          headline: "Never miss a follow-up again.",
          body: "With built-in call analytics and automated reminders, your team stays on top of every lead. Track performance metrics and optimize your sales cycle with real-time data.",
          textSide: "right",
          gray: true,
          visual: <FeatureVisual2 />,
        },
        {
          headline: "Data-driven sales insights.",
          body: "Turn every conversation into actionable intelligence. Real-time analytics and call recordings help you coach reps, refine pitches, and close more deals.",
          textSide: "left",
          gray: false,
          visual: <FeatureVisual3 />,
        },
      ]}
      heroHeadline="Powerful Dialer for High-Performing Sales Teams"
      heroSubhead="Automate outbound calls, manage leads, and close deals faster. Stop manual dialing and start closing."
      heroVisual={<HeroVisual />}
    />
  );
}
