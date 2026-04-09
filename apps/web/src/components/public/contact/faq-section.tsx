import { IconChevronDown } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

interface FAQItemProps {
  answer: string;
  isOpen: boolean;
  onClick: () => void;
  question: string;
}

const FAQItem = ({ question, answer, isOpen, onClick }: FAQItemProps) => (
  <div
    className={`mb-4 overflow-hidden rounded-xl border transition-all duration-300 ${
      isOpen ? "border-primary bg-primary/5" : "border-border bg-card"
    }`}
  >
    <button
      className="flex w-full items-center justify-between px-6 py-5 text-left"
      onClick={onClick}
      type="button"
    >
      <span className="font-semibold text-lg">{question}</span>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform duration-300 ${
          isOpen
            ? "rotate-180 bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        }`}
      >
        <IconChevronDown size={20} />
      </div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          initial={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
            {answer}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const faqs = [
  {
    question: "How soon can we begin an enterprise software project?",
    answer:
      "Once you submit your request, our solution architects schedule a discovery call within 24–48 hours. A tailored roadmap and proposal are typically delivered within 3–5 business days.",
  },
  {
    question: "Do you work with global enterprises?",
    answer:
      "Yes, we have a strong global presence serving clients across North America, Europe, Asia Pacific, and the Middle East with dedicated teams for each region.",
  },
  {
    question: "Do you sign NDAs before discussing projects?",
    answer:
      "Absolutely. We prioritize client confidentiality and intellectual property protection. We sign standard or custom NDAs before any detailed project discussions.",
  },
  {
    question: "What industries do you specialize in?",
    answer:
      "We specialize in Fintech, Healthcare, E-commerce, Logistics, and EdTech, but our engineering expertise scales across any industry requiring digital transformation.",
  },
  {
    question: "What is the typical enterprise engagement budget?",
    answer:
      "Engagement budgets vary based on scope and complexity. We offer flexible engagement models including fixed-price, time & material, and dedicated team models.",
  },
];

export function FaqSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section className="bg-background py-24 text-foreground">
      <div className="mx-auto mb-16 max-w-[1440px] px-6 text-center md:px-12">
        <h2 className="mb-6 font-extrabold text-4xl tracking-tight md:text-5xl">
          Frequently Asked <span className="text-primary">Questions</span>
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Everything you need to know about working with WorkHolo Labs
        </p>
      </div>

      <div className="mx-auto max-w-[900px] px-6 md:px-12">
        {faqs.map((faq, i) => (
          <FAQItem
            answer={faq.answer}
            isOpen={openFaq === i}
            key={faq.question}
            onClick={() => setOpenFaq(openFaq === i ? null : i)}
            question={faq.question}
          />
        ))}
      </div>
    </section>
  );
}
