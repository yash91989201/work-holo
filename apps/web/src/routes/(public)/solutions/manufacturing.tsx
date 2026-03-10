import { createFileRoute } from "@tanstack/react-router";
import { SolutionPage } from "@/components/landing/solution-page";

export const Route = createFileRoute("/(public)/solutions/manufacturing")({
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
                <rect height="14" rx="2" ry="2" width="20" x="2" y="3" />
                <line x1="8" x2="16" y1="21" y2="21" />
                <line x1="12" x2="12" y1="17" y2="21" />
              </svg>
            </div>
            <div>
              <div className="h-4 w-24 rounded bg-foreground/80" />
              <div className="mt-1.5 h-3 w-16 rounded bg-muted-foreground/40" />
            </div>
          </div>
          <div className="rounded-full bg-yellow-500/10 px-2.5 py-1 font-medium text-xs text-yellow-600">
            In Transit
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
              Update Status
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
            Vendors
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
                Active
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
              <rect height="13" width="15" x="1" y="3" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </div>
          <div className="h-4 w-32 rounded bg-foreground/80" />
        </div>
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute top-2 bottom-2 left-2 w-0.5 bg-muted" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div className="relative z-10 flex items-center gap-3" key={i}>
                  <div
                    className={`h-4 w-4 rounded-full border-2 border-background ${i === 1 ? "bg-green-500" : i === 2 ? "bg-[#7C5CFF]" : "bg-muted"}`}
                  />
                  <div>
                    <div className="h-3 w-24 rounded bg-foreground/70" />
                    <div className="mt-1 h-2 w-16 rounded bg-muted-foreground/40" />
                  </div>
                </div>
              ))}
            </div>
          </div>
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
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
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
              Send Update
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
          title: "Production Tracker",
          body: "Real-time visibility into production milestones with automated stakeholder notifications.",
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
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          ),
        },
        {
          title: "Call recording",
          body: "Capture every detail from shop floor discussions and client calls.",
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
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          ),
        },
        {
          title: "Team collaboration",
          body: "Sync your engineering, production, and sales teams in one place.",
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
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          ),
        },
        {
          title: "Bulk calling",
          body: "Reach all your vendors or clients instantly with automated notifications.",
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
              <rect height="14" rx="2" ry="2" width="20" x="2" y="3" />
              <line x1="8" x2="16" y1="21" y2="21" />
              <line x1="12" x2="12" y1="17" y2="21" />
            </svg>
          ),
        },
      ]}
      cardsHeadline="Powerful features for modern manufacturing"
      cardsSubhead="Optimize your production workflow with tools built specifically for industrial communication and team coordination."
      eyebrow=""
      faqs={[
        {
          question: "How does call recording help?",
          answer:
            "Call recording captures every vendor negotiation, client briefing, and team discussion — ensuring nothing is lost and creating a searchable archive for dispute resolution and quality reviews.",
        },
        {
          question: "Can we collaborate across sites?",
          answer:
            "Yes. Our platform unifies communication across multiple factories and offices. Teams can share notes, recordings, and updates in real time regardless of location.",
        },
        {
          question: "What is bulk calling used for?",
          answer:
            "Bulk calling lets you instantly notify all vendors of a schedule change, alert clients about delivery updates, or broadcast safety announcements to your entire workforce.",
        },
      ]}
      featureSections={[
        {
          headline: "Seamless coordination with your suppliers",
          body: "Keep track of raw material orders, delivery schedules, and quality checks. Ensure your supply chain never misses a beat with centralized vendor management.",
          textSide: "left",
          gray: false,
          visual: <FeatureVisual1 />,
        },
        {
          headline: "Precision tracking for every shipment",
          body: "From factory gate to client doorstep, monitor every logistics milestone. Real-time updates on freight status and delivery timelines ensure transparency across the board.",
          textSide: "right",
          gray: true,
          visual: <FeatureVisual2 />,
        },
        {
          headline: "Build stronger relationships with your clients",
          body: "Automate status updates and follow-up communications. Keep your clients informed about production progress and delivery estimates with professional, timely notifications.",
          textSide: "left",
          gray: false,
          visual: <FeatureVisual3 />,
        },
      ]}
      heroCtas={{ primary: "Start Manufacturing" }}
      heroHeadline="Streamline your manufacturing communication"
      heroSubhead="Connect your shop floor to the front office. Manage vendor relations, logistics, and client follow-ups in one centralized platform."
      heroVisual={<HeroVisual />}
    />
  );
}
