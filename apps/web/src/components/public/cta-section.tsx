export function CTASection() {
  return (
    <section aria-labelledby="cta-title" className="px-6 py-12 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-lg border p-6 text-center">
        <h2 className="font-semibold text-2xl" id="cta-title">
          Ready to get started?
        </h2>
        <p className="mt-2 text-muted-foreground text-sm">
          Spin up a Docker container and be live in minutes. Add your brand and
          invite your team when you’re ready.
        </p>
        <div className="mt-6 flex items-center justify-center gap-4">
          <a
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm shadow hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            href="/"
          >
            Deploy with Docker
          </a>
          <a
            className="inline-flex items-center rounded-md border border-border px-4 py-2 font-medium text-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            href="#features"
          >
            Explore features
          </a>
        </div>
      </div>
    </section>
  );
}
