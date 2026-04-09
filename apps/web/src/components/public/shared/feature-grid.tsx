import { IconCircleCheck } from "@tabler/icons-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionWrapper } from "./section-wrapper";

const features = [
  { title: "Feature 1", description: "Description of feature 1." },
  { title: "Feature 2", description: "Description of feature 2." },
  { title: "Feature 3", description: "Description of feature 3." },
];

export const FeatureGrid = () => {
  return (
    <SectionWrapper className="bg-muted/50 py-20">
      <div className="container mx-auto">
        <h2 className="mb-8 text-center font-bold text-3xl text-foreground">
          Features
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <Card className="bg-card" key={index}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <IconCircleCheck className="mr-2 h-5 w-5 text-primary" />
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};
