import { createFileRoute } from "@tanstack/react-router";
import BPOPage, {
  type WebPageProps,
} from "@/components/our-bpo-services/bpo-detail-page";

export const Route = createFileRoute(
  "/our-bpo-services/solution/accounting-and-collections"
)({
  component: RouteComponent,
});

const pagedata: WebPageProps = {
  hero: {
    badge: "Home | Call Center Services | Accounting and Collections",
    headlineLine1: "Accounting and Collections",
    headlineAccent: "BPO Services",
    description:
      "An accounting and collections call center is a third-party business that provides financial services to help you manage your company's money effectively, maintain consistent cash flow, and streamline your company's finances.",
    primaryCta: {
      label: "Book Your Consultation",
      href: "/contact-us",
    },
    image: {
      src: "/assets/account-and-collections-01.jpg",
      alt: "Accounting and collections team",
    },
    terminalCommand: "Talk to Our Experts",
    terminalMessage: "Improve your ROI",
  },
  stats: [
    {
      label: "Collection Success Rate",
      value: "88%",
    },
    {
      label: "Days Sales Outstanding Reduction",
      value: "-35%",
    },
    {
      label: "Invoice Accuracy",
      value: "99.8%",
    },
    {
      label: "Recovered Revenue",
      value: "$10M+",
    },
  ],
  services: {
    subtitle: "What Do Accounting and Collections Call Centers Do?",
    title: "Core Services",
    description:
      "Call centers that handle your financial accounts can offer several core services to help you oversee your business finances, including:",
    items: [
      {
        id: "s1",
        number: "01",
        title: "Invoicing",
        description:
          "Call center teams can send out invoices to customers on behalf of your business, including reminders of upcoming payments.",
        features: ["Customer reminders", "On-behalf sending"],
        icon: "zap",
      },
      {
        id: "s2",
        number: "02",
        title: "Debt collection",
        description:
          "If an account becomes delinquent, trained representatives can call to secure payment or set up payment plans.",
        features: ["Payment plans", "Delinquency management"],
        icon: "shield",
      },
      {
        id: "s3",
        number: "03",
        title: "Bookkeeping",
        description:
          "Trained representatives can manage incoming payments and outgoing expenses to balance your books.",
        features: ["Expense tracking", "Incoming payments"],
        icon: "chart",
      },
    ],
  },
  workflow: {
    subtitle: "The Confie BPO Difference",
    title: "Ingredients for Success",
    features: [
      {
        icon: "zap",
        title: "Streamlined tech",
        description:
          "Our teams utilize advanced accounting and data collection software so you can get the most out of your financial details and eliminate human error.",
      },
      {
        icon: "users",
        title: "Specialized agents",
        description:
          "We create dedicated teams of agents who specialize in financial tasks and debt collection so that all representatives will have extensive knowledge of your unique business needs.",
      },
      {
        icon: "globe",
        title: "Bilingual support",
        description:
          "A majority of our agents are bilingual in English and Spanish, which supports effortless communication during debt collection efforts.",
      },
      {
        icon: "shield",
        title: "Data security",
        description:
          "We understand the importance of protecting your financial details and implement advanced security and privacy measures to earn your trust.",
      },
      {
        icon: "infinity",
        title: "Scalable systems",
        description:
          "As your business grows and your financial demands increase, we can effortlessly scale our services to handle the increased volume.",
      },
    ],
    showcaseImage: {
      src: "/assets/account-and-collections-01.jpg",
      alt: "Confie BPO Team",
    },
    terminal: {
      initCommand: "npm install confie-bpo",
      preparingMessage: "Initializing systems...",
      optimizingLabel: "Efficiency",
      successLines: [
        "Financial systems synchronized",
        "Growth potential unlocked",
      ],
      latencyLabel: "Processing",
      latencyValue: "0",
      latencyUnit: "ms",
    },
  },
  faq: {
    subtitle: "Common Queries",
    title: "Frequently Asked Questions About Accounting and Collections BPO",
    items: [
      {
        id: 1,
        question: "How Are Call Center Agents Trained?",
        answer: "",
      },
      {
        id: 2,
        question: "Can You Save Money by Outsourcing Accounting?",
        answer: "",
      },
      {
        id: 3,
        question: "How Do Call Centers Handle Regulatory Restrictions?",
        answer: "",
      },
      {
        id: 4,
        question: "How do you ensure compliance with financial regulations?",
        answer:
          "We follow strict compliance protocols aligned with industry standards and regulations, including secure data handling, audit trails, and regular internal reviews to ensure all financial operations remain fully compliant.",
      },
      {
        id: 5,
        question:
          "Can your team integrate with our existing accounting systems?",
        answer:
          "Yes, our teams can seamlessly integrate with popular accounting platforms and custom systems, ensuring real-time data synchronization and minimal disruption to your existing workflows.",
      },
    ],
  },
  cta: {
    headlineLine1: "Ready to grow your business? It all starts by",
    headlineAccent: "growing your family with Confie BPO!",
    primaryLabel: "Calculate your Cost",
    secondaryLabel: "Improve your ROI",
    footnote:
      "Trade/service marks are the property of Confie Holding II Co or its respective affiliates and/or subsidiaries.",
  },
  imageSections: [
    {
      title: "Benefits of Using an Accounting and Collections BPO Service",
      description:
        "When you outsource your finances, you can implement refined, trusted financial systems in your business without expensive startup costs or overhead fees.",
      bullets: [
        {
          label: "Decreasing errors",
          detail:
            "BPO teams have advanced software tools and trusted systems for managing client accounts to minimize human error.",
        },
        {
          label: "Increasing cash flow",
          detail:
            "Your BPO vendor can maximize your business's cash flow by streamlining your accounting systems.",
        },
        {
          label: "Maximizing growth potential",
          detail:
            "Proper accounting can optimize your growth through informed financial forecasting.",
        },
      ],
      closingText: "Confie BPO has the expertise you deserve.",
      imageSrc: "/assets/account-and-collections.png",
      imageAlt: "Financial Experts",
      imagePosition: "right",
    },
  ],
};

function RouteComponent() {
  return <BPOPage {...pagedata} />;
}
