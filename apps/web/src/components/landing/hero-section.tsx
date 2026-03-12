import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SectionWrapper } from "./section-wrapper";

export function HeroSection() {
  return (
    <SectionWrapper className="relative overflow-hidden pt-10 pb-10 sm:pt-14 sm:pb-14 lg:pt-20 lg:pb-20">
      {/* CSS for floating animation */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(-8deg); }
          50% { transform: translateY(-14px) rotate(-8deg); }
        }
        @keyframes float-slow-right {
          0%, 100% { transform: translateY(0px) rotate(12deg); }
          50% { transform: translateY(-12px) rotate(12deg); }
        }
        .animate-float-slow {
          animation: float-slow 4s ease-in-out infinite;
        }
        .animate-float-slow-right {
          animation: float-slow-right 4.5s ease-in-out infinite;
        }
      `}</style>

      {/* Hero content */}
      <div className="relative mx-auto max-w-4xl text-center">
        <h1 className="text-balance font-bold text-5xl tracking-tight sm:text-6xl lg:text-7xl lg:leading-[1.08]">
          WorkHolo is your team&apos;s
          <br />
          central <span className="text-[#7C5CFF]">workspace</span>.
        </h1>

        {/* Wrapper for subtitle + CTA with floating elements positioned relative to this area */}
        <div className="relative">
          {/* JD Card — positioned at subtitle level, left side */}
          <div className="pointer-events-none absolute top-10 -left-[140px] hidden lg:block xl:-left-[-40px]">
            <div className="animate-float-slow">
              <div className="h-18 w-42 rounded-xl bg-white shadow-xl ring-1 ring-border/10 dark:bg-card">
                <div className="flex h-full items-center gap-2.5 px-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-[#7C5CFF] font-bold text-white text-xs">
                    JD
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-2 w-24 rounded-full bg-muted" />
                    <div className="h-2 w-16 rounded-full bg-muted/60" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PDF/Document Card — positioned at CTA/trusted-by level, right side */}
          <div className="pointer-events-none absolute top-[140px] -right-[120px] hidden lg:block xl:-right-[-80px]">
            <div className="animate-float-slow-right">
              <div className="h-24 w-20 rounded-2xl bg-white shadow-lg ring-1 ring-border/10 dark:bg-card">
                <div className="flex h-full items-center justify-center p-3">
                  <div className="flex h-full w-full flex-col items-center justify-center gap-[6px] rounded-xl bg-[#EEF2FF] p-3 dark:bg-muted/40">
                    <div className="h-[5px] w-full rounded-full bg-[#B4C6FC] dark:bg-primary/30" />
                    <div className="h-[5px] w-4/5 rounded-full bg-[#B4C6FC] dark:bg-primary/30" />
                    <div className="h-[5px] w-full rounded-full bg-[#B4C6FC] dark:bg-primary/30" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground leading-8 sm:text-xl">
            Experience real-time messaging, seamless file sharing, and
            intelligent collaboration in one unified, cloud-based platform.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              className="h-15 rounded-md bg-[#7C5CFF] px-8 font-semibold text-md text-white uppercase tracking-wide hover:bg-[#7C5CFF]/90 hover:text-white"
              size="lg"
            >
              <Link to="/contact">Contact Us</Link>
            </Button>
            <Button
              asChild
              className="h-15 rounded-md border-[#7C5CFF] bg-white px-8 font-semibold text-[#7C5CFF] text-md uppercase tracking-wide hover:bg-white hover:text-[#7C5CFF] hover:text-white"
              size="lg"
              variant="outline"
            >
              <Link to="/">Find Your Subscription →</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Trusted By */}
      <div className="mt-14 text-center sm:mt-18">
        <p className="font-semibold text-muted-foreground text-xs uppercase tracking-[0.2em] sm:text-sm">
          Trusted by top teams
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 sm:gap-x-14 lg:gap-x-16">
          {["GM", "OpenAI", "Target", "Paramount", "stripe", "IBM"].map(
            (company) => (
              <span
                className="font-semibold text-base text-muted-foreground/50 sm:text-lg"
                key={company}
              >
                {company}
              </span>
            )
          )}
        </div>
      </div>

      {/* Hero image / video area */}
      <div className="mt-12 sm:mt-16">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl shadow-2xl ring-1 ring-border/10">
          <div className="aspect-video w-full overflow-hidden">
            <div className="flex h-full w-full">
              {/* Sidebar */}
              <div className="flex h-full w-[22%] flex-col bg-[#1E1047]">
                <div className="flex items-center gap-1 px-3 pt-3 sm:gap-1.5 sm:px-4 sm:pt-4">
                  <div className="size-2 rounded-full bg-[#FF5F57] sm:size-3" />
                  <div className="size-2 rounded-full bg-[#FFBD2E] sm:size-3" />
                  <div className="size-2 rounded-full bg-[#28C840] sm:size-3" />
                </div>
                <div className="px-3 pt-2 sm:px-4 sm:pt-4">
                  <p className="font-bold text-[7px] text-purple-300/60 uppercase tracking-widest sm:text-[10px]">
                    Channels
                  </p>
                </div>
                <div className="mt-1 space-y-px px-1.5 sm:mt-2 sm:space-y-0.5 sm:px-2">
                  {[
                    { name: "general", active: false },
                    { name: "product-launch", active: true },
                    { name: "marketing", active: false },
                    { name: "hr-team", active: false },
                    { name: "support", active: false },
                  ].map((ch) => (
                    <div
                      className={`truncate rounded px-1.5 py-0.5 font-medium text-[7px] sm:px-2 sm:py-1 sm:text-[11px] ${ch.active ? "bg-[#7C5CFF] text-white" : "text-purple-200/60"}`}
                      key={ch.name}
                    >
                      # {ch.name}
                    </div>
                  ))}
                </div>
                <div className="mt-auto px-2 pb-3 sm:px-3 sm:pb-4">
                  <div className="h-1 w-3/4 rounded-full bg-purple-500/40 sm:h-1.5" />
                  <div className="mt-1 h-1 w-1/2 rounded-full bg-purple-500/30 sm:h-1.5" />
                </div>
              </div>

              {/* Main chat area */}
              <div className="flex flex-1 flex-col bg-white">
                {/* Channel header */}
                <div className="flex items-center justify-between border-zinc-100 border-b px-3 py-1.5 sm:px-5 sm:py-3">
                  <span className="font-bold text-[9px] text-zinc-800 sm:text-sm">
                    # project-launch
                  </span>
                  <div className="flex gap-1">
                    <div className="size-3 rounded bg-zinc-100 sm:size-5" />
                    <div className="size-3 rounded bg-zinc-100 sm:size-5" />
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 space-y-2 overflow-hidden px-3 py-2 sm:space-y-5 sm:px-5 sm:py-4">
                  {/* Message 1 — Madhu Sharma */}
                  <div className="flex gap-1.5 sm:gap-3">
                    <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-purple-100 font-bold text-[6px] text-purple-600 sm:size-9 sm:text-[11px]">
                      MS
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline gap-1">
                        <span className="font-semibold text-[8px] text-zinc-800 sm:text-sm">
                          Madhu Sharma
                        </span>
                        <span className="text-[6px] text-zinc-400 sm:text-[10px]">
                          10:42 AM
                        </span>
                      </div>
                      <p className="text-[7px] text-zinc-700 sm:text-sm">
                        Add a new user to the system here 👋 here! 👋
                      </p>
                      {/* Action card */}
                      <div className="mt-1 inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-1.5 py-0.5 sm:mt-2 sm:gap-2 sm:rounded-lg sm:px-3 sm:py-2">
                        <div className="flex size-3.5 shrink-0 items-center justify-center rounded bg-sky-100 sm:size-5">
                          <svg
                            className="size-2 text-sky-500 sm:size-3"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-[6px] text-zinc-800 sm:text-[11px]">
                            Create new user
                          </p>
                          <p className="text-[5px] text-zinc-400 sm:text-[9px]">
                            list
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Message 2 — Fathima Parveen */}
                  <div className="flex gap-1.5 sm:gap-3">
                    <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-pink-100 font-bold text-[6px] text-pink-600 sm:size-9 sm:text-[11px]">
                      FP
                    </div>
                    <div>
                      <div className="flex flex-wrap items-baseline gap-1">
                        <span className="font-semibold text-[8px] text-zinc-800 sm:text-sm">
                          Fathima Parveen
                        </span>
                        <span className="text-[6px] text-zinc-400 sm:text-[10px]">
                          10:45 AM
                        </span>
                      </div>
                      <p className="text-[7px] text-zinc-700 sm:text-sm">
                        User successfully added!
                      </p>
                      {/* Reaction */}
                      <div className="mt-0.5 inline-flex items-center gap-0.5 rounded-full border border-zinc-200 bg-zinc-50 px-1 py-0.5 text-[6px] sm:mt-1.5 sm:gap-1 sm:px-2 sm:text-[11px]">
                        <span>👍</span>
                        <span className="font-medium text-zinc-600">3</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
