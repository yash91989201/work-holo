import { createFileRoute } from "@tanstack/react-router";
import { SolutionPage } from "@/components/landing/solution-page";

export const Route = createFileRoute("/(public)/solutions/financial-services")({
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
                <rect height="11" rx="2" ry="2" width="18" x="3" y="11" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div>
              <div className="h-4 w-24 rounded bg-foreground/80" />
              <div className="mt-1.5 h-3 w-16 rounded bg-muted-foreground/40" />
            </div>
          </div>
          <div className="rounded-full bg-green-500/10 px-2.5 py-1 font-medium text-green-600 text-xs">
            Verified
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
              Access Record
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
            Encrypted
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
                    <rect height="11" rx="2" ry="2" width="18" x="3" y="11" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <div>
                  <div className="h-3 w-20 rounded bg-foreground/70" />
                  <div className="mt-1.5 h-2 w-12 rounded bg-muted-foreground/40" />
                </div>
              </div>
              <div className="flex h-6 w-16 items-center justify-center rounded-full bg-green-500/10 font-medium text-[10px] text-green-600">
                Secure
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
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
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
            <div className="flex h-6 w-20 items-center justify-center rounded-full bg-[#7C5CFF]/10 font-medium text-[#7C5CFF] text-[10px]">
              Export Log
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
      ctaHeadline="Secure your financial communications today"
      ctaPrimary="GET STARTED"
      eyebrow="FINANCIAL SECURITY & COMPLIANCE"
      faqs={[
        {
          question: "How secure is the call recording?",
          answer:
            "All calls are encrypted with AES-256 in transit and at rest. Keys are customer-managed via our KMS integration.",
        },
        {
          question: "Does this meet GDPR and MiFID II requirements?",
          answer:
            "Yes. Our compliant call recording and immutable audit logs are purpose-built for financial services regulation.",
        },
        {
          question: "How does customer verification work?",
          answer:
            "We use voice biometrics and multi-factor authentication integrated directly into the call flow. Customers are verified in seconds without friction.",
        },
        {
          question: "Can we export call logs for audits?",
          answer:
            "Yes. Retention periods are configurable per jurisdiction, and data deletion is auditable.",
        },
        {
          question: "What happens if a recording is tampered with?",
          answer:
            "All recordings are stored with cryptographic checksums. Any tampering is immediately detectable and flagged in the audit trail.",
        },
      ]}
      featureSections={[
        {
          headline: "End-to-end encrypted call recording.",
          body: "Capture every interaction with military-grade encryption. Our secure call recording ensures all financial advice and transactions are documented for your protection.",
          textSide: "left",
          gray: false,
          visual: <FeatureVisual1 />,
        },
        {
          headline: "Instant customer verification.",
          body: "Verify identities in real-time with multi-factor authentication and biometric checks. Prevent fraud before it happens with our integrated verification suite.",
          textSide: "right",
          gray: true,
          visual: <FeatureVisual2 />,
        },
        {
          headline: "Immutable call logs for compliance.",
          body: "Maintain a complete audit trail with automated call logging. Meet MiFID II, GDPR, and other regulatory requirements with ease and transparency.",
          textSide: "left",
          gray: false,
          visual: <FeatureVisual3 />,
        },
      ]}
      heroCtas={{ primary: "GET STARTED", secondary: "TALK TO SALES" }}
      heroHeadline="Secure financial communication for your institution."
      heroSubhead="Protect your assets and maintain full compliance with our advanced call recording and verification systems."
      heroVisual={<HeroVisual />}
    />
  );
}
