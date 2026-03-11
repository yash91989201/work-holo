import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_ITEMS = [
  {
    question: "Why is Workholo better than email?",
    answer:
      "Workholo brings all your communication together in one place, making it easier to find information, collaborate in real-time, and keep everyone on the same page without the clutter of long email chains.",
  },
  {
    question: "Are Workholo direct messages private?",
    answer:
      "Yes. Direct messages are private between participants. Workspace admins can enable or disable the DM feature but cannot read individual message content.",
  },
  {
    question: "How do I message someone outside my company?",
    answer:
      "You can use shared channels to collaborate with external partners and clients. This keeps external communication organized within your workspace without compromising security.",
  },
];

/**
 * MessagingFaq
 * ─────────────────────────────────────────────────────
 * FAQ accordion section tailored for the messaging feature page.
 */
export function MessagingFaq() {
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
