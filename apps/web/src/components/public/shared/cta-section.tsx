import { IconArrowRight } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { SectionWrapper } from "./section-wrapper";

export const CTASection = () => {
  return (
    <SectionWrapper className="bg-card py-20">
      <div className="container mx-auto text-center">
        <h2 className="mb-4 font-bold text-3xl text-foreground">
          Ready to Get Started?
        </h2>
        <p className="mb-8 text-muted-foreground">
          Join thousands of users building with our platform.
        </p>
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          size="lg"
        >
          Sign Up Now <IconArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </SectionWrapper>
  );
};
