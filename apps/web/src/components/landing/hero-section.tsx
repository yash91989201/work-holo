import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { SectionWrapper } from "./section-wrapper";

export function HeroSection() {
  return (
    <SectionWrapper className="relative overflow-hidden pb-10 pt-10 sm:pb-14 sm:pt-14 lg:pb-20 lg:pt-20">
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
          central{" "}
          <span className="text-[#7C5CFF]">workspace</span>.
        </h1>

        {/* Wrapper for subtitle + CTA with floating elements positioned relative to this area */}
        <div className="relative">
          {/* JD Card — positioned at subtitle level, left side */}
          <div className="pointer-events-none absolute -left-[140px] top-10 hidden lg:block xl:-left-[-40px]">
            <div className="animate-float-slow">
              <div className="h-18 w-42 rounded-xl bg-white shadow-xl ring-1 ring-border/10 dark:bg-card ">
                <div className="flex h-full items-center gap-2.5 px-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-[#7C5CFF] text-xs font-bold text-white">
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
          <div className="pointer-events-none absolute -right-[120px] top-[140px] hidden lg:block xl:-right-[-80px]">
            <div className="animate-float-slow-right">
              <div className="h-24 w-20 rounded-2xl bg-white shadow-lg ring-1 ring-border/10 dark:bg-card">
                <div className="flex h-full items-center justify-center p-3">
                  <div className="h-full w-full rounded-xl bg-[#EEF2FF] dark:bg-muted/40 flex flex-col items-center justify-center gap-[6px] p-3">
                    <div className="h-[5px] w-full rounded-full bg-[#B4C6FC] dark:bg-primary/30" />
                    <div className="h-[5px] w-4/5 rounded-full bg-[#B4C6FC] dark:bg-primary/30" />
                    <div className="h-[5px] w-full rounded-full bg-[#B4C6FC] dark:bg-primary/30" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground leading-8 sm:text-xl">
            Experience real-time messaging, seamless file sharing, and intelligent
            collaboration in one unified, cloud-based platform.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="h-15 rounded-md px-8 text-md font-semibold bg-[#7C5CFF] text-white uppercase tracking-wide hover:bg-[#7C5CFF] hover:text-white">
              <Link to="/">Get Started</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-15 rounded-md px-8 text-md font-semibold uppercase tracking-wide bg-white hover:bg-white border-[#7C5CFF] text-[#7C5CFF] hover:text-white hover:text-[#7C5CFF]"
            >
              <Link to="/">
                Find Your Subscription →
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Trusted By */}
      <div className="mt-14 text-center sm:mt-18">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:text-sm">
          Trusted by top teams
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 sm:gap-x-14 lg:gap-x-16">
          {["GM", "OpenAI", "Target", "Paramount", "stripe", "IBM"].map(
            (company) => (
              <span
                key={company}
                className="text-base font-semibold text-muted-foreground/50 sm:text-lg"
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
          <div className="aspect-video w-full bg-gradient-to-br from-primary/10 via-primary/5 to-muted/30">
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary/15">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-primary"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <p className="text-muted-foreground text-base font-medium">
                  Product Demo Video
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
