import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/(public)/company/careers")({
  component: CareersPage,
});

const jobOpenings = [
  {
    title: "Frontend Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "Backend Engineer",
    department: "Engineering",
    location: "Hybrid",
    type: "Full-time",
  },
  {
    title: "QA Specialist",
    department: "Quality Assurance",
    location: "Remote",
    type: "Full-time",
  },
];

const faqs = [
  {
    question: "What is the interview process like?",
    answer:
      "Our process is designed to be transparent and collaborative. It typically involves a technical discussion focused on real-world problem-solving (TS01–TS15 scenarios) and a culture fit conversation.",
  },
  {
    question: "Do you offer remote work?",
    answer:
      "Yes! We are a remote-first company with team members across the globe. We offer flexible work arrangements to support work-life balance.",
  },
  {
    question: "What kind of projects will I work on?",
    answer:
      "You'll work on challenging projects involving real-time communication, dialer technology, team collaboration features, and enterprise-grade security implementations.",
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

function CareersPage() {
  return (
    <div className="w-full">
      <section className="bg-muted/40 py-20 sm:py-24 lg:py-28">
        <div className="container mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-balance font-bold text-4xl leading-tight tracking-tight sm:text-5xl lg:text-5xl lg:leading-[1.1]">
              Build the future of communication
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-base text-muted-foreground leading-relaxed sm:text-lg">
              Join Workholo and help us redefine how teams connect. We&apos;re
              building a world-class dialer WebApp that solves real-world
              problems for thousands of users globally.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            <div className="rounded-2xl border border-border/60 bg-background p-8 text-center">
              <p className="font-bold text-foreground/50 text-xs uppercase tracking-widest">
                Why join our engineering team:
              </p>
              <p className="mt-4 font-bold text-lg">HANDS-ON EXPERIENCE</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background p-8 text-center">
              <p className="font-bold text-foreground/50 text-xs uppercase tracking-widest">
                Why join our engineering team:
              </p>
              <p className="mt-4 font-bold text-lg">REAL-WORLD TESTING</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background p-8 text-center">
              <p className="font-bold text-foreground/50 text-xs uppercase tracking-widest">
                Why join our engineering team:
              </p>
              <p className="mt-4 font-bold text-lg">TECH INNOVATION</p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button
              asChild
              className="rounded-md bg-[#7C5CFF] px-7 font-semibold text-sm text-white uppercase tracking-wide hover:bg-[#6B4CE6]"
              size="lg"
            >
              <Link to="#open-roles">Explore Open Roles</Link>
            </Button>
          </div>
        </div>
      </section>

      <section
        className="bg-background py-20 sm:py-24 lg:py-28"
        id="engineering-careers"
      >
        <div className="container mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-border/60 p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-lg">Frontend Dev</p>
                  <p className="text-muted-foreground text-sm">Now Hiring</p>
                </div>
                <span className="rounded-full bg-green-100 px-3 py-1 font-semibold text-green-700 text-xs">
                  Mastering real-time notifications and dashboard analytics 👇
                </span>
              </div>
              <Button
                className="mt-6 w-full rounded-md bg-[#7C5CFF] font-semibold text-sm text-white"
                size="sm"
              >
                Apply for Frontend
              </Button>
              <p className="mt-4 text-center text-muted-foreground text-xs">
                React • WebSockets
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-lg">Backend Engineer</p>
                  <p className="text-muted-foreground text-sm">High Priority</p>
                </div>
              </div>
              <p className="mt-4 text-muted-foreground text-sm">
                Solving complex TS01–TS15 scenarios in real-time.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-2xl">🚀</span>
                <span className="font-bold text-[#7C5CFF]">3</span>
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-lg">QA Engineer</p>
                  <p className="text-muted-foreground text-sm">
                    Scenario Backlog
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>TS01: Dialer High Concurrency</span>
                  <span className="rounded bg-green-100 px-2 py-0.5 text-green-700 text-xs">
                    Passed
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>TS08: Permission Escalation</span>
                  <span className="rounded bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700">
                    Testing
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>TS15: Real-time Sync</span>
                  <span className="rounded bg-gray-100 px-2 py-0.5 text-gray-700 text-xs">
                    Queued
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-20 sm:py-24 lg:py-28" id="tech-stack">
        <div className="container mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="font-bold text-3xl tracking-tight sm:text-4xl">
                Our Tech Stack
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Innovate with modern tools and real-time tech
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Work with React, Node.js, and WebSockets to build seamless
                communication experiences. We emphasize hands-on experience with
                our WebApp, from real-time notifications to complex dashboard
                analytics.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="rounded-xl border border-border/60 bg-background p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#7C5CFF]/10">
                    <svg
                      className="text-[#7C5CFF]"
                      fill="none"
                      height="20"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="20"
                    >
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold">Real-time Engine</p>
                    <p className="text-muted-foreground text-sm">
                      WebSockets for sub-100ms latency.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border/60 bg-background p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#7C5CFF]/10">
                    <svg
                      className="text-[#7C5CFF]"
                      fill="none"
                      height="20"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="20"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold">Security Module</p>
                    <p className="text-muted-foreground text-sm">
                      Role-based access and audit logging.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border/60 bg-background p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#7C5CFF]/10">
                    <svg
                      className="text-[#7C5CFF]"
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
                    <p className="font-semibold">Modern UI</p>
                    <p className="text-muted-foreground text-sm">
                      React 19 with Motion animations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="bg-background py-20 sm:py-24 lg:py-28"
        id="scenario-testing"
      >
        <div className="container mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex items-center justify-center">
              <div className="relative flex aspect-square w-full max-w-md items-center justify-center rounded-2xl bg-gradient-to-br from-[#7C5CFF]/20 via-[#7C5CFF]/10 to-background">
                <div className="flex flex-col items-center gap-4">
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-[#7C5CFF] shadow-lg">
                    <svg
                      className="text-white"
                      fill="none"
                      height="40"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="40"
                    >
                      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                    </svg>
                  </div>
                  <div className="h-2 w-32 rounded-full bg-[#7C5CFF]/30" />
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-bold text-3xl tracking-tight sm:text-4xl">
                Problem Solving
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Solve complex scenarios from TS01 to TS15
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Our engineers don&apos;t just code; they solve. Dive into
                real-world scenarios like role-based access control, security
                auditing, and high-concurrency dialer logic. Every line of code
                you write impacts user productivity.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        className="bg-muted/40 py-20 sm:py-24 lg:py-28"
        id="learning-path"
      >
        <div className="container mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="font-bold text-3xl tracking-tight sm:text-4xl">
                Learning & Growth
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Master security and role-based modules
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Master security features, role-based modules, and advanced data
                visualization. We provide the environment for you to grow from a
                specialist to a full-stack visionary while working on real-time
                notifications.
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-background p-8">
              <h3 className="font-bold text-lg">Growth Summary</h3>
              <div className="mt-6 flex items-center gap-4">
                <span className="text-2xl">📚</span>
                <div className="flex-1">
                  <p className="font-semibold">Full-stack Mastery</p>
                  <p className="text-muted-foreground text-sm">
                    Mastering role-based modules and dashboard analytics.
                  </p>
                  <div className="mt-2 h-2 w-full rounded-full bg-muted">
                    <div className="h-2 w-[85%] rounded-full bg-[#7C5CFF]" />
                  </div>
                  <p className="mt-1 text-right text-muted-foreground text-xs">
                    Progress: 85%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="bg-background py-20 sm:py-24 lg:py-28"
        id="open-roles"
      >
        <div className="container mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <h2 className="mb-4 text-center font-bold text-3xl tracking-tight sm:text-4xl">
            Join our growing team
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
            We&apos;re looking for talented individuals to help us build, scale,
            and support our next-generation communication platform.
          </p>

          <h3 className="mb-6 font-bold text-lg">Current Openings</h3>
          <p className="mb-8 text-muted-foreground">
            Find the role that matches your expertise
          </p>

          <div className="space-y-4">
            {jobOpenings.map((job) => (
              <div
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border/60 p-6"
                key={job.title}
              >
                <div>
                  <p className="font-semibold">{job.title}</p>
                  <p className="text-muted-foreground text-sm">
                    {job.department} • {job.location} • {job.type}
                  </p>
                </div>
                <Button
                  className="rounded-md bg-[#7C5CFF] px-6 font-semibold text-sm text-white"
                  size="sm"
                >
                  Apply
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-border/60 p-6">
              <h4 className="font-semibold">Engineering & QA</h4>
              <p className="mt-2 text-muted-foreground text-sm">
                Build and test the core dialer WebApp with real-world scenarios.
              </p>
            </div>
            <div className="rounded-xl border border-border/60 p-6">
              <h4 className="font-semibold">Product & Design</h4>
              <p className="mt-2 text-muted-foreground text-sm">
                Shape the user experience and define the roadmap for our
                modules.
              </p>
              <a
                className="mt-4 inline-flex items-center gap-1 font-semibold text-[#7C5CFF] text-sm"
                href="#"
              >
                View all roles →
              </a>
            </div>
            <div className="rounded-xl border border-border/60 p-6">
              <h4 className="font-semibold">Customer Success</h4>
              <p className="mt-2 text-muted-foreground text-sm">
                Help our users master the dashboard and solve their
                communication needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-20 sm:py-24 lg:py-28">
        <div className="container mx-auto max-w-3xl px-6 sm:px-8 lg:px-12">
          <h2 className="mb-10 text-center font-bold text-3xl tracking-tight sm:text-4xl">
            Careers FAQ
          </h2>
          <div className="divide-y-0 rounded-2xl border border-border/60 bg-background px-8">
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
    </div>
  );
}
