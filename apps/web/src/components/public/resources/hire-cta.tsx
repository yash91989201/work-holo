import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

type HireCtaProps = {
  title: string;
  description: string;
  buttonLabel: string;
  buttonHref?: string;
};

export function HireCta({
  title,
  description,
  buttonLabel,
  buttonHref = "/contact",
}: HireCtaProps) {
  return (
    <section className="relative overflow-hidden bg-slate-900 py-20 text-center text-white lg:py-24">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-green-500/5 to-transparent" />
      <div className="container relative z-10 mx-auto px-6 lg:px-12">
        <h2 className="mb-6 font-bold font-display text-4xl md:text-6xl">
          {title}
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-lg text-white/70">
          {description}
        </p>
        <Button
          asChild
          className="bg-green-500 text-white hover:bg-green-600"
          size="lg"
        >
          <Link to={buttonHref}>{buttonLabel}</Link>
        </Button>
      </div>
    </section>
  );
}
