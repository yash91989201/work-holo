import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/(public)/about")({
  component: AboutPage,
});

const stats = [
  {
    value: "10,000+",
    label: "Teams Empowered",
    description:
      "Organizations across the globe rely on WorkHolo to manage channels, members, and real-time communication.",
  },
  {
    value: "40+",
    label: "Countries",
    description:
      "WorkHolo supports teams in over 40 countries with a platform built for global scale.",
  },
  {
    value: "99.9%",
    label: "Uptime SLA",
    description:
      "Enterprise-grade infrastructure ensures your workspace is always available when you need it.",
  },
];

const values = [
  {
    title: "People First",
    description:
      "We design every feature around the humans who use it. Clear workflows, minimal friction, and interfaces that get out of your team's way.",
    iconPath: (
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
  },
  {
    title: "Security Without Compromise",
    description:
      "End-to-end encryption, role-based access control, and audit logs are built in from day one — not bolted on later.",
    iconPath: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  },
  {
    title: "Speed & Reliability",
    description:
      "Sub-100ms message delivery, real-time presence indicators, and a 99.9% uptime SLA so your team is never left waiting.",
    iconPath: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
  },
  {
    title: "Transparent by Default",
    description:
      "We believe teams work better when information flows freely. WorkHolo surfaces the right context at the right time, automatically.",
    iconPath: (
      <>
        <rect height="14" rx="2" ry="2" width="20" x="2" y="3" />
        <line x1="8" x2="16" y1="21" y2="21" />
        <line x1="12" x2="12" y1="17" y2="21" />
      </>
    ),
  },
  {
    title: "Always Connected",
    description:
      "Whether your team is in one office or spread across time zones, WorkHolo keeps everyone on the same page with real-time sync.",
    iconPath: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07M8.46 8.46a5 5 0 0 0 0 7.07" />
      </>
    ),
  },
  {
    title: "Data-Driven Insights",
    description:
      "Real-time dashboards and usage reports give managers the visibility they need to keep teams productive and aligned.",
    iconPath: (
      <>
        <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
        <path d="M22 12A10 10 0 0 0 12 2v10z" />
      </>
    ),
  },
];

const milestones = [
  {
    year: "2021",
    title: "Founded",
    description:
      "WorkHolo was founded with a single mission: make team communication as seamless as a face-to-face conversation.",
  },
  {
    year: "2022",
    title: "First Enterprise Customer",
    description:
      "Onboarded our first enterprise customer and proved the WorkHolo platform could handle thousands of concurrent users.",
  },
  {
    year: "2023",
    title: "Global Expansion",
    description:
      "Expanded to 40+ countries and launched multi-language support, making WorkHolo truly global.",
  },
  {
    year: "2024",
    title: "10,000 Teams",
    description:
      "Crossed the 10,000 active teams milestone, processing over 100 million messages per month.",
  },
];

const insights = [
  {
    category: "Case Study",
    title: "How Sales Teams use WorkHolo to close 30% more deals",
    cta: "READ STORY",
  },
  {
    category: "Guide",
    title: "Streamlining Customer Service with Unified Channels",
    cta: "LEARN MORE",
  },
  {
    category: "Productivity",
    title: "The impact of real-time messaging on team alignment",
    cta: "READ STORY",
  },
];

const faqs = [
  {
    question: "What makes WorkHolo different from other team messengers?",
    answer:
      "WorkHolo is purpose-built for structured team collaboration. Unlike consumer apps, it combines channels, role-based access, admin dashboards, and real-time presence tracking in a single white-label-ready workspace — with enterprise security from day one.",
  },
  {
    question: "How does WorkHolo keep our data secure?",
    answer:
      "WorkHolo employs end-to-end encryption for messages, role-based access control (RBAC), SSO integrations, audit logging, and strict data residency policies. Security is not an add-on — it is part of the core architecture.",
  },
  {
    question: "Can WorkHolo be white-labeled for our brand?",
    answer:
      "Yes. WorkHolo is designed to be fully white-labeled. You can customize logos, color schemes, the product name, and the domain so the workspace looks and feels like your own product.",
  },
  {
    question: "What industries does WorkHolo serve?",
    answer:
      "WorkHolo serves teams across sales, customer service, healthcare, financial services, technology, manufacturing, and more. Any organization that needs structured, secure, real-time communication benefits from the platform.",
  },
  {
    question: "How do I get started?",
    answer:
      "You can deploy WorkHolo via Docker in minutes. A pre-configured admin account is included so you can invite your team, create channels, and start collaborating immediately — no complex setup required.",
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
            aria-hidden="true"
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

function AboutPage() {
  return (
    <div className="w-full">
      <section className="bg-muted/40 py-20 sm:py-24 lg:py-28">
        <div className="container mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="mb-4 font-bold text-foreground/50 text-xs uppercase tracking-widest">
                ABOUT WORKHOLO
              </p>
              <h1 className="text-balance font-bold text-4xl leading-tight tracking-tight sm:text-5xl lg:text-5xl lg:leading-[1.1]">
                The workspace where every team feels in sync
              </h1>
              <p className="mt-6 max-w-xl text-pretty text-base text-muted-foreground leading-relaxed sm:text-lg">
                WorkHolo is a modern SaaS platform purpose-built for structured
                team communication. We bring channels, user management,
                real-time messaging, and admin dashboards into one secure,
                white-label-ready workspace.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Button
                  asChild
                  className="rounded-md bg-[#7C5CFF] px-7 font-semibold text-sm text-white uppercase tracking-wide hover:bg-[#6B4CE6]"
                  size="lg"
                >
                  <Link to="/">GET STARTED FREE</Link>
                </Button>
                <Button
                  asChild
                  className="rounded-md border-[#7C5CFF] px-7 font-semibold text-[#7C5CFF] text-sm uppercase tracking-wide hover:bg-[#7C5CFF]/5"
                  size="lg"
                  variant="outline"
                >
                  <Link to="/">TALK TO SALES</Link>
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="relative flex aspect-square w-full max-w-md items-center justify-center rounded-2xl bg-gradient-to-br from-[#7C5CFF]/20 via-[#7C5CFF]/10 to-background">
                <div className="flex flex-col items-center gap-5">
                  <div className="flex gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#7C5CFF] shadow-lg">
                      <svg
                        aria-hidden="true"
                        fill="none"
                        height="28"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="28"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#7C5CFF]/80 shadow-lg">
                      <svg
                        aria-hidden="true"
                        fill="none"
                        height="28"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="28"
                      >
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                      </svg>
                    </div>
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#7C5CFF]/60 shadow-lg">
                      <svg
                        aria-hidden="true"
                        fill="none"
                        height="28"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="28"
                      >
                        <rect
                          height="11"
                          rx="2"
                          ry="2"
                          width="18"
                          x="3"
                          y="11"
                        />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                  </div>
                  <div className="h-2 w-36 rounded-full bg-[#7C5CFF]/30" />
                  <p className="font-semibold text-[#7C5CFF] text-sm uppercase tracking-widest">
                    Collaborate · Communicate · Scale
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-20 sm:py-24 lg:py-28">
        <div className="container mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="font-bold text-3xl tracking-tight sm:text-4xl">
              Trusted by high-performing teams worldwide
            </h2>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              Numbers that reflect the trust thousands of organizations place in
              WorkHolo every single day.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => (
              <div
                className="rounded-2xl border border-border/60 p-8"
                key={stat.value}
              >
                <p className="font-bold text-4xl text-[#7C5CFF]">
                  {stat.value}
                </p>
                <p className="mt-1 font-semibold text-foreground">
                  {stat.label}
                </p>
                <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-20 sm:py-24 lg:py-28">
        <div className="container mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex items-center justify-center">
              <div className="relative flex aspect-square w-full max-w-md items-center justify-center rounded-2xl bg-gradient-to-br from-[#7C5CFF]/20 via-[#7C5CFF]/10 to-background">
                <div className="flex flex-col items-center gap-4">
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-[#7C5CFF] shadow-lg">
                    <svg
                      aria-hidden="true"
                      fill="none"
                      height="40"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="40"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                      <path d="M2 12h20" />
                    </svg>
                  </div>
                  <div className="h-2 w-32 rounded-full bg-[#7C5CFF]/30" />
                </div>
              </div>
            </div>

            <div>
              <p className="mb-4 font-bold text-foreground/50 text-xs uppercase tracking-widest">
                OUR MISSION
              </p>
              <h2 className="font-bold text-3xl tracking-tight sm:text-4xl">
                Simplify how teams connect — everywhere
              </h2>
              <p className="mt-5 text-pretty text-base text-muted-foreground leading-relaxed sm:text-lg">
                Communication should never be the bottleneck in your team's
                productivity. WorkHolo centralizes every conversation, file, and
                decision into a single workspace that scales from a five-person
                startup to a 5,000-person enterprise.
              </p>
              <p className="mt-4 text-pretty text-base text-muted-foreground leading-relaxed sm:text-lg">
                Our vision is a world where every team member — regardless of
                location, role, or device — is always aligned, always informed,
                and always empowered to do their best work.
              </p>
              <a
                className="mt-6 inline-flex items-center gap-1 font-semibold text-[#7C5CFF] text-sm transition-colors hover:text-[#6B4CE6]"
                href="#values"
              >
                See our core values <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-20 sm:py-24 lg:py-28" id="values">
        <div className="container mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="font-bold text-3xl tracking-tight sm:text-4xl">
              The principles that guide everything we build
            </h2>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              WorkHolo is more than software. It is a philosophy about how
              modern teams should work together.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value) => (
              <div
                className="rounded-2xl border border-border/60 p-8"
                key={value.title}
              >
                <div className="mb-5 flex size-10 items-center justify-center rounded-lg bg-[#7C5CFF]/10 text-[#7C5CFF]">
                  <svg
                    aria-hidden="true"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                  >
                    {value.iconPath}
                  </svg>
                </div>
                <h3 className="font-bold text-lg">{value.title}</h3>
                <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-20 sm:py-24 lg:py-28">
        <div className="container mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="mb-4 font-bold text-foreground/50 text-xs uppercase tracking-widest">
              OUR STORY
            </p>
            <h2 className="font-bold text-3xl tracking-tight sm:text-4xl">
              Built in the open, grown by real teams
            </h2>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              From a single idea to a platform used by thousands — here is how
              WorkHolo got here.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {milestones.map((milestone) => (
              <div
                className="flex flex-col rounded-2xl bg-background p-8 shadow-sm"
                key={milestone.year}
              >
                <span className="mb-3 font-bold text-[#7C5CFF] text-sm uppercase tracking-widest">
                  {milestone.year}
                </span>
                <h3 className="font-bold text-lg">{milestone.title}</h3>
                <p className="mt-3 flex-1 text-muted-foreground text-sm leading-relaxed">
                  {milestone.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-20 sm:py-24 lg:py-28">
        <div className="container mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="font-bold text-3xl tracking-tight sm:text-4xl">
                Built for the teams doing the real work
              </h2>
              <p className="mt-5 text-pretty text-base text-muted-foreground leading-relaxed sm:text-lg">
                Imagine a sales team closing deals faster with shared channels
                and instant messaging. A customer service department resolving
                issues in real time through organized threads. An ops team
                coordinating logistics across time zones without a single missed
                message. WorkHolo makes this the everyday reality for thousands
                of teams.
              </p>

              <ul className="mt-8 space-y-4">
                {[
                  "Sales teams close more with unified deal channels",
                  "Support teams resolve faster with threaded conversations",
                  "Engineering teams ship confidently with dedicated project rooms",
                  "Leadership stays informed with real-time dashboards",
                ].map((item) => (
                  <li className="flex items-start gap-3" key={item}>
                    <svg
                      aria-hidden="true"
                      className="mt-0.5 shrink-0 text-[#7C5CFF]"
                      fill="none"
                      height="20"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="20"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="text-muted-foreground text-sm">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Button
                  asChild
                  className="rounded-md bg-[#7C5CFF] px-7 font-semibold text-sm text-white uppercase tracking-wide hover:bg-[#6B4CE6]"
                  size="lg"
                >
                  <Link to="/">EXPLORE USE CASES</Link>
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="relative flex aspect-square w-full max-w-md items-center justify-center rounded-2xl bg-gradient-to-br from-[#7C5CFF]/20 via-[#7C5CFF]/10 to-background">
                <div className="flex flex-col items-center gap-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-[#7C5CFF] shadow-lg">
                      <svg
                        aria-hidden="true"
                        fill="none"
                        height="32"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="32"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </div>
                    <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-[#7C5CFF]/80 shadow-lg">
                      <svg
                        aria-hidden="true"
                        fill="none"
                        height="32"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="32"
                      >
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                      </svg>
                    </div>
                    <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-[#7C5CFF]/60 shadow-lg">
                      <svg
                        aria-hidden="true"
                        fill="none"
                        height="32"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="32"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-[#7C5CFF]/40 shadow-lg">
                      <svg
                        aria-hidden="true"
                        fill="none"
                        height="32"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="32"
                      >
                        <rect
                          height="20"
                          rx="2"
                          ry="2"
                          width="20"
                          x="2"
                          y="2"
                        />
                        <path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5" />
                      </svg>
                    </div>
                  </div>
                  <div className="h-2 w-32 rounded-full bg-[#7C5CFF]/30" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-20 sm:py-24 lg:py-28">
        <div className="container mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <h2 className="mb-12 text-center font-bold text-3xl tracking-tight sm:text-4xl">
            Insights from WorkHolo
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {insights.map((insight) => (
              <div
                className="flex flex-col rounded-2xl bg-background p-8 shadow-sm"
                key={insight.title}
              >
                <p className="mb-3 font-semibold text-muted-foreground text-xs uppercase tracking-widest">
                  {insight.category}
                </p>
                <h3 className="flex-1 font-bold text-base leading-snug">
                  {insight.title}
                </h3>
                <div className="mt-6 flex items-center justify-between border-border border-t pt-4">
                  <a
                    className="font-semibold text-[#7C5CFF] text-xs uppercase tracking-wider transition-colors hover:text-[#6B4CE6]"
                    href="/"
                  >
                    {insight.cta} →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-20 sm:py-24 lg:py-28">
        <div className="container mx-auto max-w-3xl px-6 sm:px-8 lg:px-12">
          <h2 className="mb-10 text-center font-bold text-3xl tracking-tight sm:text-4xl">
            Common questions about WorkHolo
          </h2>
          <div className="divide-y-0 rounded-2xl border border-border/60 px-8">
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

      <section className="bg-[#7C5CFF] py-20 sm:py-24 lg:py-28">
        <div className="container mx-auto max-w-7xl px-6 text-center sm:px-8 lg:px-12">
          <h2 className="mx-auto max-w-3xl font-bold text-3xl text-white leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Ready to bring your team together?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            Join thousands of teams already using WorkHolo to collaborate
            faster, communicate clearly, and grow with confidence.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button
              asChild
              className="rounded-md bg-white px-8 font-semibold text-[#7C5CFF] text-sm uppercase tracking-wide hover:bg-white/90"
              size="lg"
            >
              <Link to="/">START FREE TRIAL</Link>
            </Button>
            <Button
              asChild
              className="rounded-md border-2 border-white bg-transparent px-8 font-semibold text-sm text-white uppercase tracking-wide hover:bg-white/10"
              size="lg"
              variant="outline"
            >
              <Link to="/">TALK TO SALES</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
