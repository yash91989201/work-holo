import type { TablerIcon } from "@tabler/icons-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type CloudFeature = {
  description: string;
  icon: TablerIcon;
  title: string;
};

type CloudFeaturesProps = {
  features: CloudFeature[];
};

export function CloudFeatures({ features }: CloudFeaturesProps) {
  return (
    <section className="bg-muted/30 py-20 lg:py-24">
      <div className="container mx-auto space-y-10 px-6 lg:px-12">
        <div className="grid gap-6 md:grid-cols-2">
          {features.map((item) => {
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
      </div>
    </section>
  );
}
