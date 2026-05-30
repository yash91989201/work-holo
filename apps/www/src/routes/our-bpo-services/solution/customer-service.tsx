import { createFileRoute } from "@tanstack/react-router";
import BPOPage, {
  type WebPageProps,
} from "@/components/our-bpo-services/bpo-detail-page";

export const Route = createFileRoute(
  "/our-bpo-services/solution/customer-service"
)({
  component: RouteComponent,
});

const pageData: WebPageProps = {
  hero: {
    badge: "Home | Call Center Services | Customer Service",
    headlineLine1: "Call Center for",
    headlineAccent: "Customer Service",
    description:
      "Confie BPO manages your entire client care process, from answering questions to troubleshooting common issues. Our agents use hands-on experience and training to truly understand your customers' needs and provide satisfying resolutions.",
    primaryCta: {
      label: "Book Your Consultation",
      href: "/contact-us",
    },
    image: {
      src: "/assets/customer-service.webp",
      alt: "Customer service agent helping clients",
    },
    terminalCommand: "npm start",
    terminalMessage:
      "Largest personal lines agency in the U.S. handling millions of calls across industries.",
  },
  stats: [
    {
      label: "Customer Satisfaction",
      value: "98%",
    },
    {
      label: "Talented Individuals",
      value: "1,000+",
    },
    {
      label: "Calls Handled",
      value: "Millions",
    },
    {
      label: "U.S. Agency",
      value: "Largest",
    },
  ],
  services: {
    subtitle: "7 Benefits",
    title: "Why Use a Call Center",
    description:
      "Offload your customer service needs to a qualified BPO to provide a better experience for your audience while enhancing internal operations.",
    items: [
      {
        id: "s1",
        number: "01",
        title: "Prompt response times",
        description:
          "Representatives available to field all incoming messages so your customers won't have to wait.",
        features: ["Fast responses", "Hyper-connected"],
        icon: "zap",
      },

      {
        id: "s2",
        number: "02",
        title: "Brand consistency",
        description:
          "Thoroughly trained agents ensure they're sticking to your brand voice and following best practices.",
        features: ["Internal training", "Brand voice"],
        icon: "shield",
      },
      {
        id: "s3",
        number: "03",
        title: "Reducing costs",
        description:
          "Call center outsourcing costs are often much more affordable than managing an in-house team.",
        features: ["Budget friendly", "Scalable"],
        icon: "chart",
      },
    ],
  },
  workflow: {
    subtitle: "Selection Guide",
    title: "3 Steps to Choose a Center",
    features: [
      {
        icon: "users",
        title: "Assess experience",
        description:
          "Select a provider known for its customer support skills and strong history of support.",
      },
      {
        icon: "shield",
        title: "Review training",
        description:
          "Ensure they have an in-depth understanding of your business and specific support practices.",
      },
      {
        icon: "chart",
        title: "Discuss pricing",
        description:
          "Understand the pricing structure and how costs vary as your business scales.",
      },
    ],
    showcaseImage: {
      src: "/assets/customer-service-01.jpg",
      alt: "Confie BPO Customer Service Agent",
    },
    terminal: {
      initCommand: "npm run start",
      preparingMessage: "Initializing support channels...",
      optimizingLabel: "Efficiency",
      successLines: ["Data analytics enhanced", "Bilingual team active"],
      latencyLabel: "Uptime",
      latencyValue: "24/7",
      latencyUnit: "support",
    },
  },
  faq: {
    subtitle: "Common Questions",
    title: "Frequently Asked Questions",
    items: [
      {
        id: 1,
        question: "How Do Call Centers Improve the Customer Experience?",
        answer:
          "By providing attentive, knowledgeable, and accessible support leveraging tact and patience with each call.",
      },
      {
        id: 2,
        question: "How Do BPO Providers Maintain Brand Consistency?",
        answer:
          "Agents are thoroughly trained on products, policies, and goals through an in-depth company knowledge base.",
      },
      {
        id: 3,
        question: "How Do Call Centers Keep Data Secure?",
        answer:
          "Trustworthy call centers have extensive security measures and strict privacy protocols to keep information private.",
      },
    ],
  },
  cta: {
    headlineLine1: "Revolutionize Your Business with",
    headlineAccent: "Confie BPO",
    primaryLabel: "Calculate your Cost",
    secondaryLabel: "Improve your ROI",
    footnote:
      "Service Anywhere, Anytime! Enhance your consumer experience today.",
  },
  imageSections: [
    {
      title: "Why Confie BPO is Different",
      description:
        "Providing the best experience to your customers hinges on having a BPO partner who's truly invested in your business.",
      bullets: [
        {
          label: "Bilingual support",
          detail:
            "Offering support in both English and Spanish for a global audience.",
        },
        {
          label: "Technological innovation",
          detail:
            "Implementing the latest innovations in call center technology to help you remain competitive.",
        },
      ],
      closingText:
        "We elevate your client communications and ensure every interaction builds loyalty.",
      imageSrc: "/assets/customer-service.webp",
      imageAlt: "BPO Operations",
      imagePosition: "right",
      cta: {
        label: "Book Your Consultation",
        href: "/contact-us",
      },
    },
  ],
};

function RouteComponent() {
  return <BPOPage {...pageData} />;
}
