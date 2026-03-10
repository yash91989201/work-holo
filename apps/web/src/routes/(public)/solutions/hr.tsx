import { createFileRoute } from "@tanstack/react-router";
import { SolutionPage } from "@/components/landing/solution-page";

export const Route = createFileRoute("/(public)/solutions/hr")({
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
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <div className="h-4 w-24 rounded bg-foreground/80" />
              <div className="mt-1.5 h-3 w-16 rounded bg-muted-foreground/40" />
            </div>
          </div>
          <div className="rounded-full bg-[#7C5CFF]/10 px-2.5 py-1 font-medium text-[#7C5CFF] text-xs">
            Interview
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
              Call Candidate
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
            Active
          </div>
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
              <div className="flex h-6 w-16 items-center justify-center rounded-full bg-muted font-medium text-[10px] text-muted-foreground">
                Queued
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
        <div className="mb-4 grid grid-cols-7 gap-1">
          {Array.from({ length: 14 }).map((_, i) => (
            <div
              className={`aspect-square rounded-sm ${i === 5 ? "bg-[#7C5CFF]" : "bg-muted"}`}
              key={i}
            />
          ))}
        </div>
        <div className="rounded-lg border border-border/50 p-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="h-3 w-24 rounded bg-foreground/70" />
            <div className="h-3 w-12 rounded bg-muted-foreground/40" />
          </div>
          <div className="h-2 w-full rounded bg-muted-foreground/20" />
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
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10 text-green-500">
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
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" x2="8" y1="13" y2="13" />
              <line x1="16" x2="8" y1="17" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <div className="h-4 w-32 rounded bg-foreground/80" />
        </div>
        <div className="space-y-3">
          <div className="rounded-lg bg-muted/50 p-3">
            <div className="mb-2 h-2 w-full rounded bg-muted-foreground/30" />
            <div className="mb-2 h-2 w-full rounded bg-muted-foreground/30" />
            <div className="h-2 w-3/4 rounded bg-muted-foreground/30" />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-16 items-center justify-center rounded-full bg-[#7C5CFF]/10 font-medium text-[#7C5CFF] text-[10px]">
              Sync ATS
            </div>
          </div>
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
          title: "Candidate history tracking",
          body: "Get full context of every interaction, from the first outreach call to the final offer letter, all in one candidate profile.",
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
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          ),
        },
        {
          title: "Secure and compliant",
          body: "Built-in compliance for recruitment data handling. Keep candidate information safe and follow global privacy standards.",
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
              <rect height="11" rx="2" ry="2" width="18" x="3" y="11" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          ),
        },
        {
          title: "Mobile recruitment",
          body: "Call candidates and update records from anywhere. Our mobile-first interface ensures you never miss a top talent.",
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
              <rect height="20" rx="2" ry="2" width="14" x="5" y="2" />
              <line x1="12" x2="12.01" y1="18" y2="18" />
            </svg>
          ),
        },
      ]}
      cardsHeadline="Recruitment Calling at a glance"
      cardsSubhead="Everything you need to manage candidate outreach and build your dream team. Reduce time-to-hire with smarter communication tools."
      ctaHeadline="Transform your recruitment process"
      ctaSecondary="TALK TO HR EXPERT"
      eyebrow="HUMAN RESOURCES"
      faqs={[
        {
          question: "How do I start a calling campaign?",
          answer:
            "Yes. Set up targeted call campaigns with custom scripts, scheduling windows, and automated follow-up sequences.",
        },
        {
          question: "Can I record calls for training purposes?",
          answer:
            "Yes. Call recording is available for all recruitment calls with configurable retention policies.",
        },
        {
          question: "Does it integrate with my existing ATS?",
          answer:
            "We integrate with Greenhouse, Lever, Workday, and other major ATS platforms.",
        },
        {
          question: "Is candidate data secure and private?",
          answer:
            "All data is encrypted at rest and in transit. Role-based access ensures only authorized team members see candidate records.",
        },
        {
          question: "How do I track call outcomes and feedback?",
          answer:
            "Absolutely. Our platform is fully cloud-based with iOS and Android apps.",
        },
      ]}
      faqTitle="Frequently asked questions about recruitment calling"
      featureSections={[
        {
          headline: "Candidate calling campaigns",
          body: "Launch high-volume outreach campaigns to reach more candidates in less time. Automate your first-touch recruitment calls and scale your hiring efforts.",
          textSide: "left",
          gray: false,
          visual: <FeatureVisual1 />,
        },
        {
          headline: "Interview scheduling calls",
          body: "Sync with your team's calendars and schedule interviews directly during the call. Reduce back-and-forth emails and speed up the hiring cycle.",
          textSide: "right",
          gray: true,
          visual: <FeatureVisual2 />,
        },
        {
          headline: "Call notes & feedback",
          body: "Capture key insights during every conversation. Add notes and ratings to candidate profiles instantly for better team collaboration and decision making.",
          textSide: "left",
          gray: false,
          visual: <FeatureVisual3 />,
        },
      ]}
      heroCtas={{ primary: "START CAMPAIGN", secondary: "SEE DEMO" }}
      heroHeadline="Streamline Candidate Communication with Smart Calling"
      heroSubhead="Connect with top talent faster. Manage recruitment calls, schedule interviews, and track candidate history all in one place."
      heroVisual={<HeroVisual />}
      insights={[
        {
          category: "Tips",
          title: "Mastering the first candidate call for better conversion",
          cta: "READ STORY",
        },
        {
          category: "Guide",
          title: "How to scale your recruitment outreach effectively",
          cta: "LEARN MORE",
        },
        {
          category: "Tips",
          title: "Improving candidate experience via phone communication",
          cta: "READ STORY",
        },
      ]}
      insightsHeadline="Recruitment Insights"
    />
  );
}
