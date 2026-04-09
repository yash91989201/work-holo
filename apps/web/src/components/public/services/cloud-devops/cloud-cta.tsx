import { IconArrowRight } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";

type CloudCtaProps = {
  actionLabel: string;
  description: string;
  title: string;
};

export function CloudCta({ actionLabel, description, title }: CloudCtaProps) {
  return (
    <section className="bg-primary py-20 text-primary-foreground lg:py-24">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="rounded-[2rem] border border-primary-foreground/10 bg-primary-foreground/5 p-8 backdrop-blur md:p-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="max-w-3xl space-y-4">
              <h2 className="font-bold font-display text-3xl md:text-5xl">
                {title}
              </h2>
              <p className="text-lg text-primary-foreground/70 leading-8">
                {description}
              </p>
            </div>
            <Button
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              size="lg"
            >
              {actionLabel}
              <IconArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
