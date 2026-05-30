import { createFileRoute } from "@tanstack/react-router";
import BPOPage, {
  type WebPageProps,
} from "@/components/our-bpo-services/bpo-detail-page";

export const Route = createFileRoute(
  "/our-bpo-services/solution/back-office-processing"
)({
  component: RouteComponent,
});

const pageData: WebPageProps = {
  hero: {
    badge: "Home | Call Center Services | Back Office Processing",
    headlineLine1: "Back Office Processing",
    headlineAccent: "Call Center Solutions",
    description:
      "Leader in Back Office Processing Call Center Services. At Confie BPO, we can take care of these back office processing call center services for you.",
    primaryCta: {
      label: "Book Your Consultation",
      href: "/contact-us",
    },
    image: {
      src: "/assets/back-office-processing-01.webp",
      alt: "Back office processing operations",
    },
    terminalCommand: "npm run start",
    terminalMessage: "Improve your ROI",
  },
  stats: [
    { label: "Processes Automated", value: "80%+" },
    { label: "Data Accuracy", value: "99.9%" },
    { label: "Tasks Processed", value: "1M+" },
    { label: "Operational Cost Savings", value: "35%" },
  ],
  services: {
    subtitle: "Solutions",
    title: "Our Company Solutions",
    description:
      "Discover how Confie BPO can turn your company into a growth machine.",
    items: [
      {
        id: "s1",
        number: "01",
        title: "Outbound Sales",
        description: "Strategic outreach to drive revenue growth.",
        features: ["Sales optimization", "Relationship management"],
        icon: "zap",
      },
      {
        id: "s2",
        number: "02",
        title: "Customer Retention",
        description: "Enhancing loyalty through dedicated support.",
        features: ["Loyalty programs", "Customer support"],
        icon: "users",
      },
      {
        id: "s3",
        number: "03",
        title: "Inbound Sales",
        description: "Handling inquiries and converting prospects effectively.",
        features: ["Query resolution", "Conversion tracking"],
        icon: "chart",
      },
    ],
  },
  workflow: {
    subtitle: "Better BPO",
    title: "The Little Things Add Up",
    features: [
      {
        icon: "shield",
        title: "Administrative Support",
        description: "Customer support, billing, invoicing, and procurement.",
      },
      {
        icon: "infinity",
        title: "Scalable Flexibility",
        description: "Enough flexibility to scale with your different needs.",
      },
    ],
    showcaseImage: {
      src: "/assets/back-office-processing-01.webp",
      alt: "BPO Workflow Illustration",
    },
    terminal: {
      initCommand: "bpo start",
      preparingMessage: "Initializing back office services...",
      optimizingLabel: "Efficiency",
      successLines: ["Connection seamless", "Growth machine active"],
      latencyLabel: "Response",
      latencyValue: "0.1",
      latencyUnit: "s",
    },
  },
  faq: {
    subtitle: "Resources",
    title: "Frequently Asked Questions",
    items: [
      {
        id: 1,
        question: "What services does Confie BPO provide?",
        answer:
          "We provide administrative services in customer support, billing, invoicing, procurement, and more.",
      },
      {
        id: 2,
        question: "What is back office processing in BPO?",
        answer:
          "Back office processing involves handling non-customer-facing tasks such as data entry, billing, payroll, and administrative workflows.",
      },
      {
        id: 3,
        question: "How does outsourcing improve efficiency?",
        answer:
          "By automating repetitive tasks and leveraging trained agents, businesses can reduce errors and focus on core operations.",
      },
      {
        id: 4,
        question: "Is back office outsourcing secure?",
        answer:
          "Yes, BPO providers implement strict data security protocols, compliance standards, and access controls to protect sensitive information.",
      },
      {
        id: 5,
        question: "Can services scale with my business growth?",
        answer:
          "Absolutely, BPO solutions are designed to scale up or down based on your operational needs and workload.",
      },
    ],
  },
  cta: {
    headlineLine1: "Turn Your Company into a",
    headlineAccent: "Growth Machine",
    primaryLabel: "Calculate your Cost",
    secondaryLabel: "Contact Us",
    footnote: "Ready to discover a simple truth: not all BPO is created equal.",
  },
  imageSections: [
    {
      title: "Confie Makes BPO Better",
      description:
        "We provide support 24 hours a day and 7 days a week to help with anything at any time.",
      bullets: [
        {
          label: "24/7 Support",
          detail: "Our agents learn your business inside and out.",
        },
        {
          label: "Smooth Integration",
          detail: "Seamless with your other company functions.",
        },
      ],
      closingText: "Confie is the BPO provider you need!",
      imageSrc: "/assets/back-office-processing.webp",
      imageAlt: "Agents working in office",
      imagePosition: "left",
    },
    {
      title: "Simple Secrets to Business Growth",
      description:
        "Meeting all of your needs efficiently and economically while focusing on growth.",
      bullets: [
        {
          label: "Efficiency",
          detail: "Focus on the big swings necessary for expansion.",
        },
      ],
      closingText:
        "Find out how Confie BPO can turn your company into a growth machine.",
      imageSrc: "/assets/back-office-processing-02.webp",
      imageAlt: "Team analyzing business charts",
      imagePosition: "right",
    },
  ],
};

function RouteComponent() {
  return <BPOPage {...pageData} />;
}
