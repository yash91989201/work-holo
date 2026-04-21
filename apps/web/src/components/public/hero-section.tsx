import { Link } from "@tanstack/react-router";

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden px-6 py-16 sm:py-24 lg:px-8"
    >
      <div className="mx-auto max-w-3xl text-center">
        <h1
          className="text-balance font-bold text-4xl tracking-tight sm:text-5xl"
          id="hero-title"
        >
          Work Holo — Team Collaboration, Simplified
        </h1>
        <p className="mt-6 text-pretty text-base text-muted-foreground leading-7">
          Lightweight, white-label team workspace with secure channels, user
          management, and real-time communication. Ready to deploy and easy to
          brand as your own.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            aria-label="Get started"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm shadow hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            to="/"
          >
            Get started
          </Link>
          <a
            className="inline-flex items-center rounded-md border border-border px-4 py-2 font-medium text-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            href="#features"
          >
            See features
          </a>
        </div>
      </div>
    </section>
  );
}
