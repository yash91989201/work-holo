import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/(public)/company/about")({
  component: AboutPage,
});

const insights = [
  {
    category: "Case Study",
    title: "How Sales Teams use WorkHolo to close 30% more deals",
    cta: "READ STORY",
  },
  {
    category: "Guide",
    title: "Streamlining Customer Service with Unified Dialers",
    cta: "LEARN MORE",
  },
  {
    category: "Productivity",
    title: "The impact of direct messaging on team alignment",
    cta: "READ STORY",
  },
];

const faqs = [
  {
    question: "What is a Web-based dialer?",
    answer:
      "A web-based dialer is a software application that allows users to make phone calls directly from their web browser without needing traditional phone hardware. WorkHolo's dialer integrates seamlessly with team collaboration features.",
  },
  {
    question: "How does WorkHolo improve productivity?",
    answer:
      "WorkHolo improves productivity by centralizing communication tools in one platform. Teams can message, call, share files, and manage projects without switching between multiple apps, reducing context switching and saving time.",
  },
  {
    question: "Is my team's data safe?",
    answer:
      "Yes, WorkHolo employs enterprise-grade security measures including end-to-end encryption, role-based access control, SSO integration, and regular security audits to ensure your data remains protected.",
  },
  {
    question: "Can I integrate WorkHolo with other tools?",
    answer:
      "Absolutely! WorkHolo offers integrations with popular tools like Salesforce, HubSpot, Zendesk, and many more. Our API also allows for custom integrations to fit your specific workflow needs.",
  },
  {
    question: "What industries benefit most from WorkHolo?",
    answer:
      "WorkHolo is designed to benefit teams across all industries, with particular strength in sales, customer service, healthcare, financial services, technology, and manufacturing sectors.",
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

function AboutPage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-muted/40 py-20 sm:py-24 lg:py-28">
        <div className="container mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="mb-4 font-bold text-foreground/50 text-xs uppercase tracking-widest">
                ABOUT WORKHOLO
              </p>
              <h1 className="text-balance font-bold text-4xl leading-tight tracking-tight sm:text-5xl lg:text-5xl lg:leading-[1.1]">
                The Future of Team Communication & Collaboration
              </h1>
              <p className="mt-6 max-w-xl text-pretty text-base text-muted-foreground leading-relaxed sm:text-lg">
                WorkHolo is a cutting-edge SaaS platform specializing in
                web-based dialers and seamless team collaboration. We bring your
                entire workspace into one unified interface.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Button
                  asChild
                  className="rounded-md bg-[#7C5CFF] px-7 font-semibold text-sm text-white uppercase tracking-wide hover:bg-[#6B4CE6]"
                  size="lg"
                >
                  <Link to="/contact">CONTACT US</Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              {/* Visual placeholder - Team collaboration illustration */}
              <div className="relative flex aspect-square w-full max-w-md items-center justify-center rounded-2xl bg-gradient-to-br from-[#7C5CFF]/20 via-[#7C5CFF]/10 to-background">
                <div className="flex flex-col items-center gap-4">
                  <div className="flex gap-3">
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#7C5CFF] shadow-lg">
                      <svg
                        className="text-white"
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
                        className="text-white"
                        fill="none"
                        height="28"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="28"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </div>
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#7C5CFF]/60 shadow-lg">
                      <svg
                        className="text-white"
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
                  </div>
                  <div className="h-2 w-32 rounded-full bg-[#7C5CFF]/30" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Vision Section */}
      <section className="bg-background py-20 sm:py-24 lg:py-28">
        <div className="container mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-bold text-3xl tracking-tight sm:text-4xl">
              Our Vision: Unified Web Dialer, Team Management, Real-time
              Dashboards, Global Connectivity
            </h2>
          </div>
          <div className="mt-16 grid gap-12 lg:grid-cols-2">
            <div className="rounded-2xl border border-border/60 p-8">
              <h3 className="font-bold text-xl">
                Our Mission: Simplify How Teams Connect
              </h3>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                We strive to improve productivity through intuitive direct
                messaging, robust team management, organized channels, and
                real-time dashboards. Communication should be the easiest part
                of your day.
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 p-8">
              <h3 className="font-bold text-xl">
                Our Vision: Transparent & Efficient Coordination
              </h3>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                We empower organizations of all sizes to coordinate work
                efficiently, safely, and transparently. Our goal is to build a
                world where every team member is aligned and every voice is
                heard.
              </p>
              <a
                className="mt-4 inline-flex items-center gap-1 font-semibold text-[#7C5CFF] text-sm transition-colors hover:text-[#6B4CE6]"
                href="#"
              >
                Learn about our values <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Empowering Teams Section */}
      <section className="bg-muted/40 py-20 sm:py-24 lg:py-28">
        <div className="container mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex items-center justify-center">
              <div className="relative flex aspect-square w-full max-w-md items-center justify-center rounded-2xl bg-gradient-to-br from-[#7C5CFF]/20 via-[#7C5CFF]/10 to-background">
                <div className="flex flex-col items-center gap-3">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#7C5CFF] shadow-lg">
                    <svg
                      className="text-white"
                      fill="none"
                      height="32"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="32"
                    >
                      <path d="M12 2v20M2 12h20" />
                    </svg>
                  </div>
                  <div className="h-2 w-24 rounded-full bg-[#7C5CFF]/30" />
                </div>
              </div>
            </div>
            <div>
              <h2 className="font-bold text-3xl tracking-tight sm:text-4xl">
                Empowering Sales & Support Teams
              </h2>
              <p className="mt-4 text-pretty text-base text-muted-foreground leading-relaxed sm:text-lg">
                Imagine a sales team closing deals faster with integrated
                dialers, or a customer service department resolving issues
                instantly through shared channels. WorkHolo makes this a reality
                for thousands of teams.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Built on Robust Scenarios Section */}
      <section className="bg-background py-20 sm:py-24 lg:py-28">
        <div className="container mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-bold text-3xl tracking-tight sm:text-4xl">
              Built on Robust Scenarios
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              WorkHolo&apos;s foundation is built on rigorous technical
              scenarios (TS01–TS07) to ensure a seamless and secure experience
              for every team.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-border/60 p-8">
              <div className="mb-5 flex size-10 items-center justify-center rounded-lg bg-[#7C5CFF]/10 text-[#7C5CFF]">
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
              </div>
              <h3 className="font-bold text-lg">Secure Registration & Login</h3>
              <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
                Start your journey with enterprise-grade security from the very
                first click. Our TS01–TS02 protocols ensure your data is
                protected.
              </p>
              <a
                className="mt-4 inline-flex items-center gap-1 font-semibold text-[#7C5CFF] text-sm transition-colors hover:text-[#6B4CE6]"
                href="#"
              >
                View Security Specs <span aria-hidden="true">→</span>
              </a>
            </div>
            <div className="rounded-2xl border border-border/60 p-8">
              <div className="mb-5 flex size-10 items-center justify-center rounded-lg bg-[#7C5CFF]/10 text-[#7C5CFF]">
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
              </div>
              <h3 className="font-bold text-lg">Team & Channel Creation</h3>
              <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
                Structure your organization with custom teams and channels
                tailored to your specific workflows, as outlined in TS03–TS04.
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 p-8">
              <div className="mb-5 flex size-10 items-center justify-center rounded-lg bg-[#7C5CFF]/10 text-[#7C5CFF]">
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
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg">Role-Based Access Control</h3>
              <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
                Maintain full control over your data with granular permissions
                and role-based access for every user (TS05–TS07).
              </p>
              <a
                className="mt-4 inline-flex items-center gap-1 font-semibold text-[#7C5CFF] text-sm transition-colors hover:text-[#6B4CE6]"
                href="#"
              >
                Explore Roles <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Insights Section */}
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
                    href="#"
                  >
                    {insight.cta} →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-background py-20 sm:py-24 lg:py-28">
        <div className="container mx-auto max-w-3xl px-6 sm:px-8 lg:px-12">
          <h2 className="mb-10 text-center font-bold text-3xl tracking-tight sm:text-4xl">
            Common Questions
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

      {/* Bottom CTA */}
      <section className="bg-[#7C5CFF] py-20 sm:py-24 lg:py-28">
        <div className="container mx-auto max-w-7xl px-6 text-center sm:px-8 lg:px-12">
          <h2 className="mx-auto max-w-3xl font-bold text-3xl text-white leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Empower your team with WorkHolo
          </h2>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button
              asChild
              className="rounded-md bg-white px-8 font-semibold text-[#7C5CFF] text-sm uppercase tracking-wide hover:bg-white/90"
              size="lg"
            >
              <Link to="/contact">CONTACT US</Link>
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
