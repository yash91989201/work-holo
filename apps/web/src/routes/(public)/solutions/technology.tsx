import { createFileRoute } from "@tanstack/react-router";
import { SolutionPage } from "@/components/landing/solution-page";

export const Route = createFileRoute("/(public)/solutions/technology")({
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
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" x2="12" y1="22.08" y2="12" />
              </svg>
            </div>
            <div>
              <div className="h-4 w-24 rounded bg-foreground/80" />
              <div className="mt-1.5 h-3 w-16 rounded bg-muted-foreground/40" />
            </div>
          </div>
          <div className="rounded-full bg-green-500/10 px-2.5 py-1 font-medium text-green-600 text-xs">
            Synced
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
              View in CRM
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
            CRM
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
              <div className="flex h-6 w-16 items-center justify-center rounded-full bg-green-500/10 font-medium text-[10px] text-green-600">
                Connected
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
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
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
            <div className="flex h-6 w-20 items-center justify-center rounded-full bg-[#7C5CFF]/10 font-medium text-[#7C5CFF] text-[10px]">
              Auto-Dial
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
      ctaHeadline="Ready to scale your communications?"
      ctaPrimary="GET STARTED"
      ctaSecondary="BOOK A DEMO"
      eyebrow="INTELLIGENT CALLING"
      faqs={[
        {
          question: "How does the CRM integration work?",
          answer:
            "We natively integrate with Salesforce, HubSpot, Pipedrive, Zoho, and 50+ others via our REST API. Every call, note, and recording is automatically synced — no manual data entry required.",
        },
        {
          question: "What analytics are available?",
          answer:
            "Our AI transcription achieves 95%+ accuracy with speaker diarization and keyword highlighting. Analytics include sentiment scoring, call duration trends, and rep performance dashboards.",
        },
        {
          question: "Can we automate our dialing process?",
          answer:
            "Yes. Predictive and power dialing modes boost connect rates by 3x. Built-in compliance tools ensure you stay within legal dialing windows automatically.",
        },
        {
          question: "Is the platform secure?",
          answer:
            "Yes. We are SOC 2 Type II certified with annual third-party audits. All data is encrypted in transit and at rest.",
        },
      ]}
      featureSections={[
        {
          headline: "Seamlessly sync with your existing stack.",
          body: "Connect your CRM in minutes. Automatically log calls, recordings, and notes without leaving your workflow.",
          textSide: "left",
          gray: false,
          visual: <FeatureVisual1 />,
        },
        {
          headline: "Turn every conversation into data.",
          body: "Gain deep insights into your team's performance with AI-powered sentiment analysis and conversion tracking.",
          textSide: "right",
          gray: true,
          visual: <FeatureVisual2 />,
        },
        {
          headline: "Maximize your team's reach.",
          body: "Eliminate manual dialing and wait times. Our smart dialer ensures your reps spend more time talking to prospects.",
          textSide: "left",
          gray: false,
          visual: <FeatureVisual3 />,
        },
      ]}
      heroCtas={{ primary: "EXPLORE PLATFORM" }}
      heroHeadline="Accelerate your sales with smart technology."
      heroSubhead="Empower your team with automated dialing, deep CRM integrations, and real-time call analytics. Built for modern SaaS sales and support teams."
      heroVisual={<HeroVisual />}
      insights={[
        {
          category: "Customer Support",
          title:
            "Resolve tickets faster with intelligent call routing and screen pop",
          cta: "LEARN MORE",
        },
        {
          category: "SaaS Sales",
          title:
            "Increase pipeline velocity with automated dialing and real-time coaching",
          cta: "LEARN MORE",
        },
        {
          category: "Enterprise",
          title:
            "Enterprise-grade security, compliance, and multi-site management",
          cta: "LEARN MORE",
        },
      ]}
      insightsHeadline="Built for high-performance teams"
    />
  );
}
