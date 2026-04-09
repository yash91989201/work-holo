import { IconArrowRight, IconChevronRight } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

type DesignHeroProps = {
  title: string;
  highlight?: string;
  subtitle?: string;
  description: string;
  primaryCta?: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
};

export function DesignHero({
  title,
  highlight,
  subtitle,
  description,
  primaryCta = { href: "/contact", label: "Get started" },
  secondaryCta,
}: DesignHeroProps) {
  return (
    <section className="relative overflow-hidden bg-slate-900 pt-12 pb-24 text-white">
      <div className="pointer-events-none absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-blue-500/10 to-transparent" />
      <div className="container relative z-10 mx-auto px-6 lg:px-12">
        <div className="mb-8 flex items-center gap-2 font-medium text-white/60 text-xs">
          <Link className="hover:text-white" to="/">
            Home
          </Link>
          <IconChevronRight className="size-4" />
          <span>Services</span>
          <IconChevronRight className="size-4" />
          <span className="text-orange-500">Design & Experience</span>
        </div>
        <div className="max-w-4xl">
          <h1 className="mb-6 font-bold font-display text-5xl leading-[1.1] md:text-7xl">
            {title}{" "}
            {highlight && (
              <span className="text-orange-500 italic">{highlight}</span>
            )}
          </h1>
          {subtitle && (
            <p className="mb-6 font-display font-semibold text-white/90 text-xl md:text-2xl">
              {subtitle}
            </p>
          )}
          <p className="max-w-3xl text-lg text-white/70 leading-relaxed">
            {description}
          </p>
          <div className="mt-8 flex gap-4">
            <Button
              asChild
              className="bg-orange-500 text-black hover:bg-orange-600"
              size="lg"
            >
              <Link to={primaryCta.href}>
                {primaryCta.label}
                <IconArrowRight className="size-4" />
              </Link>
            </Button>
            {secondaryCta && (
              <Button
                asChild
                className="border-white/20 text-white hover:bg-white/10"
                size="lg"
                variant="outline"
              >
                <Link to={secondaryCta.href}>{secondaryCta.label}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
