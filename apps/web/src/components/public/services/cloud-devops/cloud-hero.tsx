type CloudHeroProps = {
  description: string;
  eyebrow: string;
  title: string;
};

export function CloudHero({ description, eyebrow, title }: CloudHeroProps) {
  return (
    <section className="relative overflow-hidden border-b bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.14),transparent_70%)]" />
      <div className="container relative mx-auto px-6 py-20 lg:px-12 lg:py-28">
        <div className="mb-6 flex items-center gap-2 text-muted-foreground text-sm">
          <span>{eyebrow}</span>
        </div>
        <div className="space-y-6">
          <div className="space-y-4">
            <h1 className="max-w-4xl font-bold font-display text-4xl text-foreground tracking-tight md:text-6xl">
              {title}
            </h1>
            <p className="max-w-3xl text-lg text-muted-foreground leading-8">
              {description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
