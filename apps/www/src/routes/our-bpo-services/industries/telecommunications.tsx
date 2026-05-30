import { createFileRoute } from "@tanstack/react-router";
import BPOPage, {
  type WebPageProps,
} from "@/components/our-bpo-services/bpo-detail-page";

export const Route = createFileRoute(
  "/our-bpo-services/industries/telecommunications"
)({
  component: RouteComponent,
});

const pageData: WebPageProps = {
  hero: {
    badge: "Industries / Telecommunications",
    headlineLine1: "Telecommunications",
    headlineAccent: "Call Center Services",
    description:
      "Confie BPO provides specialized call center solutions that include excellent inbound and outbound customer service, sales, and technology solutions.",
    primaryCta: {
      label: "Book Your Consultation",
      href: "/contact-us",
    },
    image: {
      src: "/assets/telecommunication-01.webp",
      alt: "Telecommunications industry support",
    },
    terminalCommand: "npm run start-bpo",
    terminalMessage: "Telecommunications systems active.",
  },
  stats: [],
  services: {
    subtitle: "Solutions",
    title: "Our BPO Excellence",
    description: "Expert solutions for telecommunications and beyond.",
    items: [
      {
        id: "s1",
        number: "01",
        title: "Outbound Sales",
        description: "Strategic outreach to drive revenue and growth.",
        features: ["Lead Generation", "Compliance", "Reporting"],
        icon: "zap",
      },
      {
        id: "s2",
        number: "02",
        title: "Customer Retention",
        description:
          "High-caliber service to minimize churn and protect loyalty.",
        features: ["Resolution", "Feedback", "Success"],
        icon: "users",
      },
      {
        id: "s3",
        number: "03",
        title: "Customer Support",
        description:
          "24/7 assistance to resolve issues and enhance customer experience.",
        features: [
          "24/7 Availability",
          "Issue Resolution",
          "Multi-channel Support",
        ],
        icon: "infinity",
      },
    ],
  },
  workflow: {
    subtitle: "Process",
    title: "Your Data, Our Performance",
    features: [
      {
        icon: "chart",
        title: "Data Processing",
        description:
          "Crunching numbers to provide an unequaled view into company success.",
      },
      {
        icon: "globe",
        title: "Nearshore Support",
        description:
          "Agents with high-caliber English language and communication skills.",
      },
    ],
    showcaseImage: {
      src: "/assets/telecommunication-01.webp",
      alt: "BPO Display",
    },
    terminal: {
      initCommand: "bpo --optimize",
      preparingMessage: "Scaling customer support teams...",
      optimizingLabel: "SLA",
      successLines: [
        "Customer acquisition increasing",
        "Operational efficiency achieved",
      ],
      latencyLabel: "Latency",
      latencyValue: "0.1",
      latencyUnit: "ms",
    },
  },
  faq: {
    subtitle: "Support",
    title: "If You Have Questions, We Have Answers",
    items: [],
  },
  cta: {
    headlineLine1: "Find Out What Others Already Know About the",
    headlineAccent: "Benefits of Confie BPO",
    primaryLabel: "Calculate your Cost",
    secondaryLabel: "Improve your ROI",
    footnote: "© 2023 Confie Holding II Co. All rights reserved.",
  },
  imageSections: [
    {
      title: "Your Problems, Our BPO Solutions",
      description:
        "Confie BPO provides all of the call center services you require, including customer service and data processing skills. Our agents are skilled in the hardware and software that you rely on.",
      bullets: [
        {
          label: "CRM Navigation",
          detail: "Expertly navigate any CRM platform.",
        },
        {
          label: "Tech Innovation",
          detail: "Staying on the cutting-edge of technological systems.",
        },
      ],
      closingText:
        "Confie BPO is here to provide the specialized solutions you've been looking for!",
      imageSrc: "/assets/telecommunication.jpg",
      imageAlt: "BPO Solutions Representation",
      imagePosition: "right",
      cta: {
        label: "Book Consultation",
        href: "/contact-us",
      },
    },
    {
      title: "Your Data, Our Process",
      description:
        "Data processing provides an unequaled view into your company's success and failure on every level. We provide data collecting and analytics that give a clear picture of what's working and what isn't.",
      bullets: [
        {
          label: "Analytics",
          detail: "Actionable insights through data collection.",
        },
        {
          label: "English Fluency",
          detail: "Nearshore agents with high-caliber language skills.",
        },
      ],
      closingText:
        "Increasing your customer acquisition and market share in no time.",
      imageSrc: "/assets/telecommunication-02.webp",
      imageAlt: "Data Analytics Display",
      imagePosition: "left",
    },
  ],
};

function RouteComponent() {
  return <BPOPage {...pageData} />;
}
