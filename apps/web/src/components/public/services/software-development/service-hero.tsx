import { IconArrowRight, IconChevronRight } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ServiceHeroProps = {
  badges?: string[];
  description: string;
  eyebrow: string;
  primaryCta?: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
  title: string;
};

export function ServiceHero({
  badges = [],
  description,
  eyebrow,
  primaryCta = { href: "/contact", label: "Start your project" },
  secondaryCta = { href: "/portfolio", label: "View our work" },
  title,
}: ServiceHeroProps) {
  return (
    <section className="relative overflow-hidden border-b bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.14),transparent_38%),radial-gradient(circle_at_bottom_right,hsl(var(--accent)/0.16),transparent_34%)]" />
      <div className="container relative mx-auto px-6 py-20 lg:px-12 lg:py-28">
        <div className="mb-6 flex items-center gap-2 text-muted-foreground text-sm">
          <Link className="transition-colors hover:text-foreground" to="/">
            Home
          </Link>
          <IconChevronRight className="size-4" />
          <span>Services</span>
        </div>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
          <div className="space-y-6">
            <Badge variant="outline">{eyebrow}</Badge>
            <div className="space-y-4">
              <h1 className="max-w-4xl font-bold font-display text-4xl text-foreground tracking-tight md:text-6xl">
                {title}
              </h1>
              <p className="max-w-3xl text-lg text-muted-foreground leading-8">
                {description}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to={primaryCta.href}>
                  {primaryCta.label}
                  <IconArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to={secondaryCta.href}>{secondaryCta.label}</Link>
              </Button>
            </div>
          </div>
          {badges.length > 0 ? (
            <div className="flex flex-wrap gap-2 lg:justify-end">
              {badges.map((badge) => (
                <Badge
                  className="bg-card px-3 py-1 text-sm"
                  key={badge}
                  variant="secondary"
                >
                  {badge}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
