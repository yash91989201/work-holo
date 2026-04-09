import { Star } from "@tabler/icons-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionWrapper } from "./section-wrapper";

const testimonials = [
  { name: "John Doe", text: "Great platform!", rating: 5 },
  { name: "Jane Smith", text: "Easy to use.", rating: 5 },
  { name: "Bob Johnson", text: "Highly recommend.", rating: 5 },
];

export const TestimonialsSection = () => {
  return (
    <SectionWrapper className="py-20">
      <div className="container mx-auto">
        <h2 className="mb-8 text-center font-bold text-3xl text-foreground">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card className="bg-card" key={index}>
              <CardContent className="pt-6">
                <div className="mb-4 flex">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      className="h-4 w-4 fill-current text-yellow-500"
                      key={i}
                    />
                  ))}
                </div>
                <p className="mb-4 text-muted-foreground">
                  "{testimonial.text}"
                </p>
                <p className="font-semibold text-foreground">
                  - {testimonial.name}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};
