import { createFileRoute } from "@tanstack/react-router";
import { SolutionPage } from "@/components/landing/solution-page";

export const Route = createFileRoute("/(public)/solutions/customer-service")({
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
            02:45
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-16 w-full rounded-lg bg-muted/50 p-3">
            <div className="h-3 w-20 rounded bg-muted-foreground/30" />
            <div className="mt-2 h-3 w-full rounded bg-muted-foreground/20" />
            <div className="mt-1.5 h-3 w-4/5 rounded bg-muted-foreground/20" />
          </div>
          <div className="flex gap-3">
            <div className="h-10 flex-1 rounded-lg bg-[#7C5CFF] opacity-90" />
            <div className="h-10 flex-1 rounded-lg bg-muted" />
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
              <div className="h-6 w-16 rounded-full bg-[#7C5CFF]/10" />
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
        <div className="mb-5 flex items-end gap-4">
          <div className="flex-1">
            <div className="h-3 w-16 rounded bg-muted-foreground/50" />
            <div className="mt-2 h-8 w-24 rounded bg-foreground/90" />
          </div>
          <div className="flex-1">
            <div className="h-3 w-16 rounded bg-muted-foreground/50" />
            <div className="mt-2 h-8 w-24 rounded bg-foreground/90" />
          </div>
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
      </div>
    </div>
  );
}

function FeatureVisual3() {
  return (
    <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-border/50 bg-background shadow-xl">
      <div className="p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/10 text-red-500">
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
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <div className="h-4 w-32 rounded bg-foreground/80" />
        </div>
        <div className="space-y-2">
          <div className="h-2 w-full rounded bg-muted-foreground/20" />
          <div className="h-2 w-full rounded bg-muted-foreground/20" />
          <div className="h-2 w-4/5 rounded bg-muted-foreground/20" />
        </div>
        <div className="mt-4 flex items-center gap-2">
          <div className="h-1 w-full rounded-full bg-muted">
            <div className="h-1 w-1/3 rounded-full bg-[#7C5CFF]" />
          </div>
          <div className="h-3 w-8 rounded bg-muted-foreground/30" />
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
          title: "Comprehensive Customer History",
          body: "Access a complete timeline of every customer interaction, including previous calls, emails, and chat transcripts for personalized support.",
          link: { text: "Learn about data sync", href: "#" },
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
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" x2="8" y1="13" y2="13" />
              <line x1="16" x2="8" y1="17" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          ),
        },
        {
          title: "Seamless Ticket Integration",
          body: "Automatically create support tickets from calls. Sync data with your CRM to keep your team informed and your records up to date.",
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
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" x2="12" y1="22.08" y2="12" />
            </svg>
          ),
        },
        {
          title: "Global Support Infrastructure",
          body: "Manage calls across different regions and time zones with a unified platform designed for global support teams.",
          link: { text: "View global features", href: "#" },
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
              <line x1="2" x2="22" y1="12" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          ),
        },
      ]}
      cardsHeadline="Unified tools for world-class support"
      cardsSubhead="Our platform integrates call management with your existing support workflows. From customer history to ticket creation, everything is designed to help your agents work faster."
      ctaHeadline="Transform your customer support experience today"
      eyebrow="CUSTOMER SUPPORT"
      faqs={[
        {
          question: "How does inbound call routing work?",
          answer:
            "Our AI analyzes agent skills, current availability, and customer history to route each call to the best-fit agent in real time.",
        },
        {
          question: "Can I integrate this with my existing CRM?",
          answer:
            "We integrate natively with Salesforce, HubSpot, Zendesk, and many more via our open API.",
        },
        {
          question: "Is call recording compliant with privacy laws?",
          answer:
            "Yes. Call recording is available for all call types with configurable retention policies.",
        },
        {
          question: "How do I manage high call volumes?",
          answer:
            "Real-time dashboards plus historical reports on AHT, FCR, CSAT, and queue metrics.",
        },
        {
          question: "Can agents work remotely with this system?",
          answer:
            "Yes. Our platform is fully cloud-based with iOS and Android apps for remote agents.",
        },
      ]}
      featureSections={[
        {
          headline: "Smart Inbound Call Routing",
          body: "Automatically direct customers to the right agent based on their needs, language, or previous history. Reduce wait times and improve first-call resolution.",
          textSide: "left",
          gray: false,
          visual: <FeatureVisual1 />,
        },
        {
          headline: "Real-time Call Queue Management",
          body: "Monitor live call volumes and agent availability. Dynamically adjust queues to handle peak times and ensure no customer is left waiting.",
          link: { text: "Explore queue analytics", href: "#" },
          textSide: "right",
          gray: true,
          visual: <FeatureVisual2 />,
        },
        {
          headline: "High-Quality Call Recording",
          body: "Securely record and store every customer interaction for quality assurance, training, and compliance. Access recordings instantly from the customer profile.",
          textSide: "left",
          gray: false,
          visual: <FeatureVisual3 />,
        },
      ]}
      heroHeadline="Deliver Faster Customer Support with Smart Call Management"
      heroSubhead="Empower your support team with advanced call routing, real-time queue management, and integrated customer data to provide exceptional service every time."
      heroVisual={<HeroVisual />}
      insights={[
        {
          category: "Tips",
          title: "How to reduce average handle time with smart routing",
          cta: "READ STORY",
        },
        {
          category: "Guide",
          title: "Best practices for call queue management during peak hours",
          cta: "LEARN MORE",
        },
        {
          category: "Tips",
          title: "Using call recordings to train world-class support agents",
          cta: "READ STORY",
        },
      ]}
      insightsHeadline="Insights for support leaders"
    />
  );
}
