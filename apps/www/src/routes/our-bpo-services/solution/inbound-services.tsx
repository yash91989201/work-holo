import { createFileRoute } from "@tanstack/react-router";
import BPOPage, {
  type WebPageProps,
} from "@/components/our-bpo-services/bpo-detail-page";

export const Route = createFileRoute(
  "/our-bpo-services/solution/inbound-services"
)({
  component: RouteComponent,
});

const pageData: WebPageProps = {
  hero: {
    badge: "Inbound Call Center Services",
    headlineLine1: "Customer Service at a New — and Better — Level",
    headlineAccent: "Confie BPO",
    description:
      "Helping you optimize your operations for maximum benefits, including revenue building and creative solutions with more than 1,500 bilingual employees staffing our BPO center.",
    primaryCta: {
      label: "Book Your Consultaion",
      href: "/contact-us",
    },
    image: {
      src: "/assets/inbound-services-01.jpg",
      alt: "Inbound services support team",
    },
    terminalCommand: "npm run start",
    terminalMessage: "1,500+ bilingual employees ready",
  },
  stats: [
    {
      label: "Bilingual Employees",
      value: "1,500+",
    },
    {
      label: "Onshore Cost",
      value: "30/hr",
    },
    {
      label: "Nearshore Cost",
      value: "20/hr",
    },
    {
      label: "Offshore Cost",
      value: "15/hr",
    },
  ],
  services: {
    subtitle: "Inbound Solutions",
    title: "Our BPO Service Capabilities",
    description:
      "Any B2C or B2B business interaction requiring your company to respond to your existing and potential customer base falls under our capabilities.",
    items: [
      {
        id: "s1",
        number: "01",
        title: "Customer Service",
        description:
          "Done right, it makes your customers happy and satisfied — and makes them want to keep coming back to your brand or services.",
        features: [
          "White-glove service",
          "Brand advocacy",
          "Direct communication",
        ],
        icon: "users",
      },
      {
        id: "s2",
        number: "02",
        title: "Technical Support",
        description:
          "Resolving issues efficiently, from resetting a password to challenging tasks like printer connectivity or virus protection.",
        features: [
          "Expert guidance",
          "Problem solving",
          "Technical efficiency",
        ],
        icon: "zap",
      },
      {
        id: "s3",
        number: "03",
        title: "Payment Processing",
        description:
          "Securely and accurately process payments for your products or services using modern, automated solutions.",
        features: [
          "PCI Compliance",
          "Sensitive data protection",
          "Error reduction",
        ],
        icon: "shield",
      },
      {
        id: "s4",
        number: "04",
        title: "Claims Processing",
        description:
          "Handling documentation and data entry with strict adherence to rules and regulations for your financial health.",
        features: [
          "Data entry accuracy",
          "Process simplification",
          "Maintenance support",
        ],
        icon: "chart",
      },
      {
        id: "s5",
        number: "05",
        title: "Inbound Sales",
        description:
          "Talk to customers about new products and services or items that complement their existing purchases.",
        features: [
          "Lead conversion",
          "Purchasing growth",
          "Robust bottom line",
        ],
        icon: "globe",
      },
      {
        id: "s6",
        number: "06",
        title: "Accounting and Collections",
        description:
          "A trusted team of accounting professionals versed in gentle collections and industry compliance.",
        features: ["Staff training", "Compliance integration", "Lowered risk"],
        icon: "infinity",
      },
    ],
  },
  workflow: {
    subtitle: "Tips for Success",
    title: "Why Choose Confie BPO?",
    features: [
      {
        icon: "users",
        title: "People-focused processes",
        description:
          "Utilizing skills like listening and problem solving combined with the latest innovative technology.",
      },
      {
        icon: "shield",
        title: "Industry Compliance",
        description:
          "Staying up-to-date with governmental regulations, HIPAA, and PCI compliance for security.",
      },
      {
        icon: "zap",
        title: "Simple Scalability",
        description:
          "No long-term commitment and simple scalability to grow your existing base and attract new clients.",
      },
    ],
    showcaseImage: {
      src: "/assets/inbound-services-01.jpg",
      alt: "Confie BPO Inbound Operations",
    },
    terminal: {
      initCommand: "npm run start",
      preparingMessage: "Initializing service infrastructure...",
      optimizingLabel: "BPO Efficiency",
      successLines: ["1500+ Agents online", "PCI/HIPAA Secure"],
      latencyLabel: "Uptime",
      latencyValue: "99.9",
      latencyUnit: "%",
    },
  },
  faq: {
    subtitle: "Knowledge Base",
    title: "FAQs about Inbound Call Center Services",
    items: [
      {
        id: 1,
        question:
          "What are the key differences between inbound and outbound call centers?",
        answer:
          "Inbound call centers serve as a direct line of communication for customers who have comments, questions, and concerns about your products.",
      },
      {
        id: 2,
        question:
          "What training do agents in inbound call centers typically receive?",
        answer:
          "Agents are trained in your brand, products, or services to handle tasks like payment processing and appointment scheduling.",
      },
      {
        id: 3,
        question:
          "Which are the most common requirements for setting up a BPO inbound call center?",
        answer:
          "You need a clear understanding of how a center helps achieve your goals and an outlined plan for customer support.",
      },
    ],
  },
  cta: {
    headlineLine1: "Find Out What Others Already Know About",
    headlineAccent: "Confie BPO",
    primaryLabel: "Calculate your Cost",
    secondaryLabel: "Improve your ROI",
    footnote:
      "Successful company leaders understand their customers want to support their favorite brands.",
  },
  imageSections: [
    {
      title: "Average Costs Associated with Setting up Your Own Call Center",
      description:
        "Hiring a third-party BPO may be less expensive than building a facility. Here is a breakdown of typical costs.",
      bullets: [
        {
          label: "Hardware",
          detail: "Up to $13,000 per agent annually",
        },
        {
          label: "Software fees",
          detail: "Up to 90 per month for one platform",
        },
      ],
      closingText:
        "Save money by hiring an inbound call center in just facility and hardware costs alone.",
      imageSrc: "/assets/inbound-services.jpg",
      imageAlt: "BPO Cost Statistics",
      imagePosition: "right",
    },
  ],
};

function RouteComponent() {
  return <BPOPage {...pageData} />;
}
