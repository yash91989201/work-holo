import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqItem {
  answer: string;
  question: string;
}

interface FeatureFaqSectionProps {
  heading?: string;
  items: FaqItem[];
}

/**
 * FeatureFaqSection
 * ─────────────────────────────────────────────────────
 * "Frequently asked questions" section using Shadcn Accordion.
 */
export function FeatureFaqSection({ heading, items }: FeatureFaqSectionProps) {
  return (
    <section className="w-full bg-background py-16 sm:py-20">
      <div className="container mx-auto max-w-5xl px-6 sm:px-8 lg:px-12">
        <h2 className="mb-10 text-center font-bold text-3xl text-foreground tracking-tight sm:text-4xl">
          {heading || "Frequently asked questions"}
        </h2>
        <Accordion className="w-full" collapsible type="single">
          {items.map((item, i) => (
            <AccordionItem key={item.question} value={`item-${i}`}>
              <AccordionTrigger className="text-left font-semibold text-base text-foreground hover:text-[#7C5CFF] sm:text-lg">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground leading-7">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
