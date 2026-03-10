import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/(public)/company/news")({
  component: NewsPage,
});

const milestones = [
  {
    stat: "1,000+",
    label: "Organizations",
    description:
      "Over 1,000 organizations are now using WorkHolo to manage teams, messages, and channels.",
  },
  {
    stat: "Enterprise Ready",
    label: "",
    description:
      "Our security protocols have been upgraded to meet global enterprise standards.",
  },
  {
    stat: "Global Reach",
    label: "",
    description:
      "WorkHolo now supports teams in over 40 countries with localized communication tools.",
  },
];

function NewsPage() {
  return (
    <div className="w-full">
      <section className="bg-muted/40 py-20 sm:py-24 lg:py-28">
        <div className="container mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 font-bold text-foreground/50 text-xs uppercase tracking-widest">
              Latest News & Updates
            </p>
            <h1 className="text-balance font-bold text-4xl leading-tight tracking-tight sm:text-5xl lg:text-5xl lg:leading-[1.1]">
              Major Feature Update: Enhanced Communication Control
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-base text-muted-foreground leading-relaxed sm:text-lg">
              Introducing browser notifications, granular communication
              preferences, and improved role-based access.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Button
                asChild
                className="rounded-md bg-[#7C5CFF] px-7 font-semibold text-sm text-white uppercase tracking-wide hover:bg-[#6B4CE6]"
                size="lg"
              >
                <Link to="/">Try New Features</Link>
              </Button>
              <Button
                asChild
                className="rounded-md border-[#7C5CFF] px-7 font-semibold text-[#7C5CFF] text-sm uppercase tracking-wide hover:bg-[#7C5CFF]/5"
                size="lg"
                variant="outline"
              >
                <Link to="/">Contact Support</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-20 sm:py-24 lg:py-28">
        <div className="container mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="font-bold text-3xl tracking-tight sm:text-4xl">
                Release Overview
              </h2>
              <p className="mt-4 text-pretty text-base text-muted-foreground leading-relaxed sm:text-lg">
                We&apos;ve rolled out a significant update to the WorkHolo
                platform, focusing on user experience and administrative
                control. This release includes real-time browser notifications
                to ensure you never miss a call or message, even when the tab is
                inactive.
              </p>

              <h3 className="mt-8 font-bold text-lg">Key Updates</h3>
              <ul className="mt-4 space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <svg
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
                  <span>Real-time Browser Notifications (TS07)</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
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
                  <span>Granular Communication Preferences (TS12)</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
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
                  <span>Improved Role Access Control (TS13)</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
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
                  <span>Enhanced Channel Management</span>
                </li>
              </ul>
            </div>

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
                      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                    </svg>
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
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h3 className="font-bold text-xl">What This Means For You</h3>
              <ul className="mt-6 space-y-4 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-[#7C5CFF]" />
                  <span>Increased response times with instant alerts</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-[#7C5CFF]" />
                  <span>Personalized notification settings for every user</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-[#7C5CFF]" />
                  <span>Secure and precise permission management</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-[#7C5CFF]" />
                  <span>Streamlined team collaboration</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-xl">Impact Statistics</h3>
              <div className="mt-6 grid grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="font-bold text-3xl text-[#7C5CFF]">+45%</p>
                  <p className="mt-1 text-muted-foreground text-sm">
                    User Engagement
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-3xl text-[#7C5CFF]">&lt;100ms</p>
                  <p className="mt-1 text-muted-foreground text-sm">
                    Notification Latency
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-3xl text-[#7C5CFF]">100%</p>
                  <p className="mt-1 text-muted-foreground text-sm">
                    Security Compliance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-20 sm:py-24 lg:py-28">
        <div className="container mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <h2 className="mb-12 text-center font-bold text-3xl tracking-tight sm:text-4xl">
            Company Milestones
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {milestones.map((milestone) => (
              <div
                className="rounded-2xl border border-border/60 p-8"
                key={milestone.stat}
              >
                <p className="font-bold text-3xl text-[#7C5CFF]">
                  {milestone.stat}
                </p>
                {milestone.label && (
                  <p className="mt-1 font-semibold text-foreground">
                    {milestone.label}
                  </p>
                )}
                <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
                  {milestone.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#7C5CFF] py-20 sm:py-24 lg:py-28">
        <div className="container mx-auto max-w-7xl px-6 text-center sm:px-8 lg:px-12">
          <h2 className="mx-auto max-w-3xl font-bold text-3xl text-white leading-tight tracking-tight sm:text-4xl">
            Want to stay in the loop?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            Subscribe to our newsletter for the latest updates, feature
            releases, and company news.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button
              asChild
              className="rounded-md bg-white px-8 font-semibold text-[#7C5CFF] text-sm uppercase tracking-wide hover:bg-white/90"
              size="lg"
            >
              <Link to="/">Subscribe to Newsletter</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
