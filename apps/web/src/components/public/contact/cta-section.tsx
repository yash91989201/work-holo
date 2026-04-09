import { IconArrowRight } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-primary py-24 text-primary-foreground">
      <div className="pointer-events-none absolute top-0 left-0 h-full w-full opacity-20">
        <div className="absolute top-[-20%] left-[-10%] h-[60%] w-[60%] rounded-full bg-background blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 text-center md:px-12">
        <h2 className="mx-auto mb-8 max-w-4xl font-extrabold text-4xl leading-tight tracking-tight md:text-6xl">
          Ready to Accelerate Your Digital Transformation?
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-primary-foreground/80 text-xl">
          Connect with WorkHolo Labs today and speak with our enterprise
          technology experts.
        </p>
        <Button
          className="mx-auto flex h-14 items-center gap-2 rounded-full px-10 font-bold text-lg text-primary shadow-xl transition-all hover:bg-secondary/90"
          size="lg"
          variant="secondary"
        >
          Get Started Now <IconArrowRight size={20} />
        </Button>
      </div>
    </section>
  );
}
