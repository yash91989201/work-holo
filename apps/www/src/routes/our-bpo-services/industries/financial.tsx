import { createFileRoute } from "@tanstack/react-router";
import BPOPage, {
  type WebPageProps,
} from "@/components/our-bpo-services/bpo-detail-page";

export const Route = createFileRoute("/our-bpo-services/industries/financial")({
  component: RouteComponent,
});

const pageData: WebPageProps = {
  hero: {
    badge: "Financial Call Center Services",
    headlineLine1: "Financial Call Center",
    headlineAccent: "Services",
    description: "Talk to Our Experts",
    primaryCta: {
      label: "Book Your Consultation",
      href: "/contact-us",
    },
    image: {
      src: "/assets/financial-services-01.jpg",
      alt: "Financial services team",
    },
    terminalCommand: "npm run start",
    terminalMessage: "Improve your ROI",
  },

  stats: [
    { label: "Years Experience", value: "05" },
    { label: "Years Experience", value: "23" },
    { label: "Years Experience", value: "09" },
    { label: "Years Experience", value: "11" },
  ],

  services: {
    subtitle: "BPO Functions",
    title: "Some of the financial services we support include:",
    description:
      "Strictly focused on maintaining the integrity and security of your data, we stay on top of new and innovative methods for saving you money.",
    items: [
      {
        id: "s1",
        number: "01",
        title: "Insurance",
        description: "Specialized support for insurance industry call centers.",
        features: ["Customer care", "Claims processing"],
        icon: "shield",
      },
      {
        id: "s3",
        number: "03",
        title: "Retail and Commercial Banks",
        description: "Handling routing calls and vital customer care.",
        features: ["Money management", "Banking support"],
        icon: "globe",
      },
      {
        id: "s4",
        number: "04",
        title: "Internet Banks",
        description:
          "Agile BPO assistance for digital-first financial institutions.",
        features: ["Security management", "Data entry"],
        icon: "zap",
      },
    ],
  },
  workflow: {
    subtitle: "Efficiency in Financial Services",
    title: "Efficiency made easy with Confie BPO",
    features: [
      {
        icon: "zap",
        title: "Transactional and Financial Accuracy",
        description:
          "Well-trained agents ensure accurate handling of financial paperwork.",
      },
      {
        icon: "users",
        title: "Excellent Customer Service",
        description: "Real people with empathy and active listening skills.",
      },
      {
        icon: "chart",
        title: "Optimized Productivity",
        description:
          "Handling loan applications, claims and data entry to achieve productivity gain.",
      },
      {
        icon: "shield",
        title: "Targeted Industry Compliance",
        description:
          "Our compliance teams use an active system to ensure you meet all regulatory guidelines.",
      },
    ],
    showcaseImage: {
      src: "/assets/financial-services-01.jpg",
      alt: "Financial services team collaborating",
    },
    terminal: {
      initCommand: "npm start",
      preparingMessage: "Initializing secure channel...",
      optimizingLabel: "Syncing compliance data",
      successLines: ["Security protocol active", "Compliance verified"],
      latencyLabel: "Processing",
      latencyValue: "24/7",
      latencyUnit: "Support",
    },
  },
  faq: {
    subtitle: "Common Questions",
    title: "FAQs about Financial Industry Call Center Services",
    items: [
      {
        id: 1,
        question: "What is a Financial Services Call Center?",
        answer:
          "A call center for the financial industry allows your company to focus on managing your customers' money successfully through banking, mortgages, and investing.",
      },
      {
        id: 2,
        question:
          "What Type of Financial Services Benefit from Call Center Services?",
        answer:
          "Insurance, Mortgage Brokers, Retail and Commercial Banks, Internet Banks, Credit Unions, and Money Lenders.",
      },
      {
        id: 3,
        question: "What are the Benefits to Outsourcing Financial Services?",
        answer:
          "BPO partners help improve efficiency by winnowing through incoming calls and recapturing clients who are leaving.",
      },
      {
        id: 4,
        question: "What are the Challenges to Outsourcing Financial Services?",
        answer:
          "Your industry is subject to heavy regulation and standards of security, requiring white-glove handling of clients.",
      },
    ],
  },
  cta: {
    headlineLine1: "Drive Efficiency and Profitability with",
    headlineAccent: "Confie BPO",
    primaryLabel: "Calculate your Cost",
    secondaryLabel: "Get Started",
    footnote: "Improve your ROI",
  },
  imageSections: [
    {
      title: "Secure Financial Services Support",
      description:
        "We can provide the financial services support you need from treasury reporting to accounts payable and claims processing.",
      bullets: [
        {
          label: "Reliability",
          detail: "Accurate data reporting and collection.",
        },
        {
          label: "Expertise",
          detail: "Nearshore agents are professionals in the finance industry.",
        },
      ],
      closingText:
        "Confie BPO has years of experience in the financial services call center industry.",
      imageSrc: "/assets/financial-services-02.webp",
      imageAlt: "Security specialist at desk",
      imagePosition: "right",
    },
    {
      title: "Why is Confie BPO Different?",
      description:
        "We help you mitigate financial risks by helping you better manage your balance sheets.",
      bullets: [
        {
          label: "Mitigation",
          detail: "Accurate forecasting and regulatory compliance.",
        },
        {
          label: "Unique Approach",
          detail: "Finding a better partner with customized options.",
        },
      ],
      closingText:
        "Guiding your business to success means navigating that fine line between risk and reward.",
      imageSrc: "/assets/financial.webp",
      imageAlt: "Responsive customer support team",
      imagePosition: "left",
    },
  ],
};

function RouteComponent() {
  return <BPOPage {...pageData} />;
}
