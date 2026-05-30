import { createFileRoute } from "@tanstack/react-router";
import type {
  CTAProps,
  FAQProps,
  HeroProps,
  ImageSectionProps,
  ServicesProps,
  StatItem,
  WebPageProps,
  WorkflowProps,
} from "@/components/our-bpo-services/bpo-detail-page";
import BPOPage from "@/components/our-bpo-services/bpo-detail-page";

export const Route = createFileRoute(
  "/our-bpo-services/industries/logistics-supply-chain"
)({
  component: RouteComponent,
});

// ✅ HERO
const hero: HeroProps = {
  badge: "Logistics & Supply Chain",
  headlineLine1: "Logistics and Supply Chain",
  headlineAccent: "Call Center Services",
  description:
    "Protect your operations with expert data processing, organization, and back office services to ensure every link in your supply chain stays unbreakable.",
  primaryCta: {
    label: "Book Your Consultation",
    href: "/contact-us",
  },
  image: {
    src: "/assets/logistics-and-supply-chain-01.jpg",
    alt: "Logistics and supply chain support",
  },
  terminalCommand: "npm run logistics",
  terminalMessage: "Optimizing Supply Chain...",
};

// ✅ STATS
const stats: StatItem[] = [
  { label: "Daily Support", value: "24/7" },
  { label: "Accuracy Rate", value: "99%" },
  { label: "Faster Processing", value: "3x" },
  { label: "Global Clients", value: "120+" },
];

// ✅ SERVICES
const services: ServicesProps = {
  subtitle: "Solutions",
  title: "The Secret to Logistics Efficiency",
  description:
    "Get trained BPO support exactly where you need it to run your logistics operations smoothly and efficiently.",
  items: [
    {
      id: "s1",
      number: "01",
      title: "Data Processing",
      description:
        "Expert help in processing and organizing critical supply chain data.",
      features: [
        "Data organization",
        "Real-time updates",
        "Error-free processing",
      ],
      icon: "chart",
    },
    {
      id: "s2",
      number: "02",
      title: "Back Office Services",
      description:
        "Reduce operational burden by outsourcing administrative workflows.",
      features: ["Cost reduction", "Faster turnaround", "Process optimization"],
      icon: "users",
    },
    {
      id: "s3",
      number: "03",
      title: "Customer Support",
      description:
        "Highly trained agents to manage logistics-related customer queries.",
      features: ["24/7 support", "Issue resolution", "Client satisfaction"],
      icon: "infinity",
    },
  ],
};

// ✅ WORKFLOW
const workflow: WorkflowProps = {
  subtitle: "Process Guide",
  title: "How We Optimize Logistics Operations",
  features: [
    {
      icon: "chart",
      title: "Analyze Data",
      description:
        "We process and organize supply chain data for maximum efficiency.",
    },
    {
      icon: "users",
      title: "Streamline Operations",
      description: "Improve coordination across teams and logistics systems.",
    },
    {
      icon: "zap",
      title: "Boost Performance",
      description:
        "Increase speed, reduce errors, and enhance delivery timelines.",
    },
  ],
  showcaseImage: {
    src: "/assets/logistics-and-supply-chain.jpg",
    alt: "Logistics workflow",
  },
  terminal: {
    initCommand: "npm run logistics",
    preparingMessage: "Optimizing Supply Chain...",
    optimizingLabel: "Efficiency Boost",
    successLines: ["Accuracy: 99%", "Speed: Increased"],
    latencyLabel: "Response Time",
    latencyValue: "1.2",
    latencyUnit: "ms",
  },
};

// ✅ FAQ
const faq: FAQProps = {
  subtitle: "FAQ",
  title: "Frequently Asked Questions",
  items: [
    {
      id: 1,
      question: "How does BPO improve logistics efficiency?",
      answer:
        "By outsourcing repetitive tasks like data processing and support, your team can focus on core logistics operations, improving overall efficiency.",
    },
    {
      id: 2,
      question: "Can BPO reduce supply chain costs?",
      answer:
        "Yes. It reduces staffing, infrastructure, and operational costs while maintaining high efficiency.",
    },
  ],
};

// ✅ CTA
const cta: CTAProps = {
  headlineLine1: "Unleash Your Logistics Potential",
  headlineAccent: "with One Simple Step",
  primaryLabel: "Calculate your Cost",
  secondaryLabel: "Improve your ROI",
  footnote: "© 2026 Confie Holding II Co. All rights reserved.",
};

// ✅ IMAGE SECTIONS
const imageSections: ImageSectionProps[] = [
  {
    title: "Be Ready for Tomorrow, Today",
    description:
      "Logistics companies face challenges like workforce shortages and digital transformation. BPO helps you stay ahead.",
    bullets: [
      {
        label: "Preparedness",
        detail: "Stay future-ready with scalable logistics support solutions.",
      },
    ],
    closingText:
      "Prepare your logistics operations for the future with confidence.",
    imageSrc: "/assets/logistics-and-supply-chain-01.jpg",
    imageAlt: "Logistics warehouse",
    imagePosition: "right",
  },
  {
    title: "Efficiency is Everything",
    description:
      "Meeting customer expectations depends on how efficiently your supply chain operates.",
    bullets: [
      {
        label: "Speed",
        detail: "Faster processing and delivery timelines.",
      },
    ],
    closingText:
      "Build a faster, more reliable logistics system with expert BPO support.",
    imageSrc: "/assets/logistics-and-supply-chain-02.jpg",
    imageAlt: "Logistics team",
    imagePosition: "left",
  },
];

// ✅ FINAL PAGE OBJECT
export const bpoPageProps: WebPageProps = {
  hero,
  stats,
  services,
  workflow,
  faq,
  cta,
  imageSections,
};

// ✅ ROUTE COMPONENT
function RouteComponent() {
  return <BPOPage {...bpoPageProps} />;
}
