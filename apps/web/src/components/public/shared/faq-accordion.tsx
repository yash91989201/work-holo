import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionWrapper } from "./section-wrapper";

const faqs = [
  {
    question: "What is this platform?",
    answer: "It's a tool to help you build amazing things.",
  },
  {
    question: "How do I get started?",
    answer: "Sign up and start building.",
  },
  {
    question: "Is it free?",
    answer: "We offer a free tier.",
  },
];

export const FAQAccordion = () => {
  return (
    <SectionWrapper className="py-20">
      <div className="container mx-auto">
        <h2 className="mb-8 text-center font-bold text-3xl text-foreground">
          Frequently Asked Questions
        </h2>
        <Accordion
          className="mx-auto w-full max-w-2xl"
          collapsible
          type="single"
        >
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </SectionWrapper>
  );
};
