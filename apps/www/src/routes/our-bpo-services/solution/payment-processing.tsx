import { createFileRoute } from "@tanstack/react-router";
import BPOPage, {
  type WebPageProps,
} from "@/components/our-bpo-services/bpo-detail-page";

export const Route = createFileRoute(
  "/our-bpo-services/solution/payment-processing"
)({
  component: RouteComponent,
});

const pageData: WebPageProps = {
  hero: {
    badge: "Improve your ROI",
    headlineLine1: "Payment Processing",
    headlineAccent: "Call Center Solutions",
    description:
      "At its core, the business world revolves around sending and receiving payments. Your company relies on its processing systems to access your income effectively, track client transactions, and keep your available funds flowing.",
    primaryCta: {
      label: "Book Your Consultation",
      href: "/contact-us",
    },
    image: {
      src: "/assets/financial-services-01.jpg",
      alt: "Payment processing operations",
    },
    terminalCommand: "npm run start",
    terminalMessage: "Talk to Our Experts",
  },
  stats: [],
  services: {
    subtitle:
      "Your processing partner can handle various tasks related to overseeing business operations and transferring customer funds into your business account. Key services to look out for include:",
    title: "What Does a Payment Processing Call Center Do?",
    description:
      "A payment processing call center is a third-party team that facilitates transactions between you and your customers, ensuring you can receive client payments quickly, affordably, and reliably.",
    items: [
      {
        id: "s1",
        number: "01",
        title: "Generating invoices",
        description:
          "Your outsourcing provider can determine how much a customer owes and then send custom invoices and bills alongside transaction methods.",
        features: ["Custom invoices", "Bill sending", "Transaction methods"],
        icon: "zap",
      },
      {
        id: "s2",
        number: "02",
        title: "Managing transaction gateways",
        description:
          "They'll manage the gateways for your credit card payments, including both in-store and online purchases.",
        features: [
          "Credit card payments",
          "In-store purchases",
          "Online gateway",
        ],
        icon: "globe",
      },
      {
        id: "s3",
        number: "03",
        title: "Reconciling disputes",
        description:
          "If a customer disputes a transaction or issues a chargeback, the call center team can review the financials to address any errors and resolve issues.",
        features: ["Chargeback review", "Financial audit", "Issue resolution"],
        icon: "shield",
      },
    ],
  },
  workflow: {
    subtitle: "Let's break down the key advantages",
    title: "Benefits of a Payment Processing BPO Service",
    features: [
      {
        icon: "zap",
        title: "Reducing errors",
        description:
          "Payment management vendors have advanced systems to reduce processing errors so you and your customers can trust that your funds are being handled appropriately.",
      },
      {
        icon: "shield",
        title: "Enhancing compliance",
        description:
          "BPO teams are strict about financial compliance and will manage your transactions according to industry best practices and legal specifications.",
      },
      {
        icon: "chart",
        title: "Saving money",
        description:
          "Setting up your own management systems can be expensive and technically complex, making outsourcing a powerful way to decrease operational costs.",
      },
      {
        icon: "users",
        title: "Improving customer service",
        description:
          "Call center agents can handle complex payments directly, provide support for managing errors, and help you develop stronger customer relationships.",
      },
    ],
    showcaseImage: {
      src: "/assets/payment-processing-01.png",
      alt: "Confie BPO Payment Processing Showcase",
    },
    terminal: {
      initCommand: "npm run analyze",
      preparingMessage: "Analyzing transaction flow...",
      optimizingLabel: "Compliance Check",
      successLines: ["Security verified", "Latency optimized"],
      latencyLabel: "Processing Speed",
      latencyValue: "0.4",
      latencyUnit: "ms",
    },
  },
  faq: {
    subtitle:
      "Learn more about outsourcing your transactions with these helpful FAQs.",
    title: "Frequently Asked Questions About Payment Processing BPO",
    items: [
      {
        id: 1,
        question: "How Does Payment Processing Outsourcing Work?",
        answer:
          "Outsourcing focuses on handing over the technical and customer-facing aspects of your transaction management to a specialized third-party team.",
      },
      {
        id: 2,
        question: "How Can Payment Processing Outsourcing Support My Business?",
        answer:
          "It allows your internal team to focus on core growth while experts handle complex financial logistics and compliance.",
      },
      {
        id: 3,
        question: "How Is Outsourcing Payment Processing Secure?",
        answer:
          "BPO teams use advanced encryption and strictly follow industry regulations like PCI-DSS to protect sensitive financial data.",
      },
      {
        id: 4,
        question:
          "What Is the Cost of Hiring a Payment Processing Contact Center?",
        answer:
          "Costs vary based on volume and complexity, but outsourcing typically significantly reduces the overhead of maintaining in-house systems.",
      },
    ],
  },
  cta: {
    headlineLine1: "Start Your Journey to Savings & Growth",
    headlineAccent: "with Confie BPO Today",
    primaryLabel: "Calculate your Cost",
    secondaryLabel: "See Our FAQ",
    footnote: "© 2023 Confie Holding II Co. All rights reserved.",
  },
  imageSections: [
    {
      title: "Our Difference",
      description:
        "At Confie BPO, we've revolutionized the world of payment processing by offering best-in-class support that outshines the competition.",
      bullets: [
        {
          label: "Streamlined systems",
          detail:
            "We leverage the latest technology to facilitate your operations.",
        },
        {
          label: "Adaptability",
          detail: "Our team can scale and adjust as your business grows.",
        },
      ],
      closingText: "Committed to your financial success.",
      imageSrc: "/assets/payment-processing.webp",
      imageAlt: "Business analytics dashboard",
      imagePosition: "right",
    },
    {
      title: "Companies That Benefit",
      description:
        "All businesses need to process financial transactions to generate income, making payment outsourcing relevant across industries.",
      bullets: [
        { label: "Healthcare", detail: "Secure patient billing management." },
        {
          label: "Travel",
          detail: "High-volume booking transaction expertise.",
        },
      ],
      closingText: "Reliable support for every industry.",
      imageSrc: "/assets/payment-processing-02.png",
      imageAlt: "Professional business meeting",
      imagePosition: "left",
    },
  ],
};

function RouteComponent() {
  return <BPOPage {...pageData} />;
}
