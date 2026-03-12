import { createFileRoute } from "@tanstack/react-router";
import { SolutionPage } from "@/components/landing/solution-page";

export const Route = createFileRoute("/(public)/solutions/retail")({
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
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </div>
            <div>
              <div className="h-4 w-24 rounded bg-foreground/80" />
              <div className="mt-1.5 h-3 w-16 rounded bg-muted-foreground/40" />
            </div>
          </div>
          <div className="rounded-full bg-blue-500/10 px-2.5 py-1 font-medium text-blue-600 text-xs">
            Order #1234
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
              Track Order
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
            Orders
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              className="flex items-center justify-between rounded-lg border border-border/50 p-3"
              key={i}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
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
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                </div>
                <div>
                  <div className="h-3 w-20 rounded bg-foreground/70" />
                  <div className="mt-1.5 h-2 w-12 rounded bg-muted-foreground/40" />
                </div>
              </div>
              <div className="flex h-6 w-16 items-center justify-center rounded-full bg-green-500/10 font-medium text-[10px] text-green-600">
                Shipped
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
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
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

function RouteComponent() {
  return (
    <SolutionPage
      cards={[
        {
          title: "Customer Order Support",
          body: "Provide instant assistance for order tracking, modifications, and returns. Keep your customers informed and satisfied throughout their journey.",
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
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          ),
        },
        {
          title: "Store Inquiries",
          body: "Handle questions about store hours, locations, and product availability in real-time. Connect customers with the right store staff immediately.",
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
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          ),
        },
        {
          title: "Delivery Updates",
          body: "Send automated alerts and provide live updates on delivery status. Reduce 'where is my order' calls and build trust with transparency.",
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
              <rect height="13" width="15" x="1" y="3" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          ),
        },
      ]}
      cardsHeadline="Retail Communication at a glance"
      cardsSubhead="Quickly resolve customer issues and manage store operations in one place. Reduce response times and boost retail efficiency with our specialized dialer tools."
      ctaHeadline="Enhance retail efficiency with our dialer"
      ctaPrimary="CONTACT US"
      ctaSecondary="SIGN IN"
      eyebrow="RETAIL SOLUTIONS"
      faqs={[
        {
          question: "How does the order support system work?",
          answer:
            "Agents see the full order history, payment status, and shipping details the moment a call connects. No tab switching, no manual lookup — just faster resolutions.",
        },
        {
          question: "Can I integrate my existing inventory system?",
          answer:
            "We integrate with Shopify, Magento, WooCommerce, and custom platforms via API.",
        },
        {
          question: "Does this support multi-store inquiries?",
          answer:
            "Yes. Calls can be routed to the nearest store or the appropriate regional team based on the caller's location and inquiry type.",
        },
        {
          question: "Are delivery updates automated?",
          answer:
            "Yes. Our cloud infrastructure auto-scales so you're never caught short during peak seasons.",
        },
        {
          question: "Can customers call stores directly?",
          answer:
            "Real-time dashboards and weekly reports cover call volumes, resolution rates, and CSAT scores.",
        },
      ]}
      faqTitle="Frequently asked questions about retail support"
      featureSections={[
        {
          headline: "Support customer orders in context",
          body: "Access order history, payment status, and customer preferences while on the call. Resolve issues faster without switching tabs.",
          textSide: "left",
          gray: false,
          visual: <FeatureVisual1 />,
        },
        {
          headline: "Handle store inquiries efficiently",
          body: "Instantly check stock levels across multiple locations and provide accurate store information to customers on the go.",
          textSide: "right",
          gray: true,
          visual: <FeatureVisual2 />,
        },
        {
          headline: "Real-time delivery coordination",
          body: "Coordinate with delivery teams and update customers in real-time. Manage logistics and communication from a single interface.",
          textSide: "left",
          gray: false,
          visual: <FeatureVisual3 />,
        },
      ]}
      heroCtas={{ primary: "CONTACT US", secondary: "SIGN IN" }}
      heroHeadline="Streamline Your Retail Operations Instantly"
      heroSubhead="Manage customer orders, store inquiries, and delivery updates with ease. Enhance your customer experience with our integrated dialer."
      heroVisual={<HeroVisual />}
      insights={[
        {
          category: "Retail Tips",
          title: "5 ways to improve customer order support",
          cta: "READ",
        },
        {
          category: "Case Study",
          title: "How top retailers handle store inquiries at scale",
          cta: "READ",
        },
        {
          category: "Strategy",
          title: "Optimizing delivery updates for better customer experience",
          cta: "READ",
        },
      ]}
      insightsHeadline="Discover Retail Insights"
    />
  );
}
