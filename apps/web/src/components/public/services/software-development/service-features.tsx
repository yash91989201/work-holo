import type { TablerIcon } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ServiceFeature = {
  description: string;
  icon: TablerIcon;
  title: string;
};

type ServiceFeaturesProps = {
  items: ServiceFeature[];
  kicker?: string;
  technologies?: string[];
  title: string;
};

export function ServiceFeatures({
  items,
  kicker,
  technologies = [],
  title,
}: ServiceFeaturesProps) {
  return (
    <section className="bg-muted/30 py-20 lg:py-24">
      <div className="container mx-auto space-y-10 px-6 lg:px-12">
        <div className="max-w-3xl space-y-3">
          {kicker ? (
            <p className="font-medium text-primary text-sm uppercase tracking-[0.24em]">
              {kicker}
            </p>
          ) : null}
          <h2 className="font-bold font-display text-3xl text-foreground md:text-4xl">
            {title}
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <Card
                className="border-border/60 bg-background/90"
                key={item.title}
              >
                <CardHeader>
                  <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="size-6" />
                  </div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                  <CardDescription className="text-base leading-7">
                    {item.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
        {technologies.length > 0 ? (
          <Card className="border-primary/30 border-dashed bg-background/80">
            <CardContent className="flex flex-wrap gap-3 pt-6">
              {technologies.map((tech) => (
                <Badge
                  className="px-3 py-1 text-sm"
                  key={tech}
                  variant="outline"
                >
                  {tech}
                </Badge>
              ))}
            </CardContent>
          </Card>
        ) : null}
      </div>
    </section>
  );
}
