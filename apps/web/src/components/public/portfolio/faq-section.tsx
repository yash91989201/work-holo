import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    question: "What does WorkHolo Labs portfolio include?",
    answer:
      "The portfolio showcases a wide range of digital products created by WorkHolo Labs, including mobile apps, business websites, e-commerce platforms, SaaS products, and custom software solutions across multiple industries.",
  },
  {
    question:
      "Can I request a project similar to something in WorkHolo Labs portfolio?",
    answer:
      "Yes, we specialize in custom solutions. If you see something you like, we can adapt and build a tailored version for your specific needs.",
  },
  {
    question: "Do you work on both mobile and web development projects?",
    answer:
      "Absolutely. Our team is proficient in both mobile (Android/iOS) and web technologies to provide comprehensive digital solutions.",
  },
  {
    question:
      "How can I get a quote for a project like the ones in your portfolio?",
    answer:
      "You can click on the 'Request Quote' button or contact us via email/phone. We'll discuss your requirements and provide a detailed proposal.",
  },
  {
    question: "Are all projects in the portfolio custom-built for clients?",
    answer:
      "Yes, every project we undertake is custom-built from the ground up to meet the unique business objectives of our clients.",
  },
];

export function FAQSection() {
  return (
    <section className="bg-background px-4 py-20 md:px-12">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-4 text-center font-bold text-3xl text-foreground md:text-5xl">
          Your Questions <span className="text-primary">Answered</span> Clearly
        </h2>
        <p className="mb-12 text-center font-medium text-muted-foreground">
          Everything you need to know about WorkHololabs
        </p>

        <Accordion className="space-y-4" collapsible type="single">
          {FAQS.map((faq, index) => (
            <AccordionItem
              className="rounded-xl border border-border bg-card px-6 shadow-sm"
              key={faq.question}
              value={`item-${index}`}
            >
              <AccordionTrigger className="font-bold text-foreground text-lg hover:no-underline [&[data-state=open]]:text-primary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
