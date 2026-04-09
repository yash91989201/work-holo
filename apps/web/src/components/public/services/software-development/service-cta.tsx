import { IconArrowRight } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

type ServiceCtaProps = {
  actionHref?: string;
  actionLabel: string;
  description: string;
  title: string;
};

export function ServiceCta({
  actionHref = "/contact",
  actionLabel,
  description,
  title,
}: ServiceCtaProps) {
  return (
    <section className="bg-foreground py-20 text-background lg:py-24">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="rounded-[2rem] border border-background/10 bg-background/5 p-8 backdrop-blur md:p-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="max-w-3xl space-y-4">
              <h2 className="font-bold font-display text-3xl md:text-5xl">
                {title}
              </h2>
              <p className="text-background/70 text-lg leading-8">
                {description}
              </p>
            </div>
            <Button
              asChild
              className="bg-background text-foreground hover:bg-background/90"
              size="lg"
            >
              <Link to={actionHref}>
                {actionLabel}
                <IconArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
