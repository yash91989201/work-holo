import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_ITEMS = [
  {
    question: "How long are messages stored in the system?",
    answer:
      "Message history retention depends on your billing plan. Free plans store up to 90 days of history, while paid plans offer unlimited message history retention.",
  },
  {
    question: "Can I search messages by keywords or users?",
    answer:
      "Yes! Our advanced search lets you find specific messages using keywords, filter by the person who sent them, or even narrow it down to specific dates and channels.",
  },
  {
    question: "Is message history accessible on mobile devices?",
    answer:
      "Absolutely. All your conversations and message history securely sync across our desktop, web, and mobile apps so you're always up to date.",
  },
];

/**
 * HistoryFaq
 * ─────────────────────────────────────────────────────
 * FAQ accordion section tailored for the messaging feature page.
 */
export function HistoryFaq() {
  return (
    <section className="w-full bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-3xl px-6 sm:px-8 lg:px-12">
        <h2 className="mb-10 text-center font-bold text-3xl text-[#1d1c1d] tracking-tight sm:text-4xl">
          Frequently asked questions
        </h2>
        <Accordion className="w-full" collapsible type="single">
          {FAQ_ITEMS.map((item, i) => (
            <AccordionItem key={item.question} value={`item-${i}`}>
              <AccordionTrigger className="text-left font-semibold text-[#1d1c1d] text-base hover:text-[#611f69] sm:text-lg">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-[#616061] text-base leading-7">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
