import { createFileRoute } from "@tanstack/react-router";

import BPOPage, {
  type WebPageProps,
} from "@/components/our-bpo-services/bpo-detail-page";

export const Route = createFileRoute(
  "/our-bpo-services/solution/customer-retention"
)({
  component: RouteComponent,
});

const pageData: WebPageProps = {
  hero: {
    badge: "Customer Retention",
    headlineLine1: "Customer Retention",
    headlineAccent: "Call Center Solutions",
    description: "Talk to Our Experts",
    primaryCta: {
      label: "Book Your Consultation",
      href: "/contact-us",
    },
    image: {
      src: "/assets/customer-retention.webp",
      alt: "Customer retention strategies",
    },
    terminalCommand: "npm run start",
    terminalMessage: "Quality BPO Services",
  },
  stats: [
    { label: "Global Reach", value: "100%" },
    { label: "Customer Retention Rate", value: "95%" },
    { label: "Churn Reduction", value: "-40%" },
    { label: "Active Campaigns", value: "120+" },
  ],
  services: {
    subtitle: "Maximize Potential",
    title: "BPO Solutions",
    description:
      "Comprehensive call center services designed to yield results.",
    items: [
      {
        id: "s1",
        number: "01",
        title: "Outbound Sales",
        description: "Drive revenue through targeted outbound call campaigns.",
        features: ["Lead generation", "Cold calling", "Sales closing"],
        icon: "zap",
      },
      {
        id: "s2",
        number: "02",
        title: "Customer Retention",
        description:
          "Keep your customers loyal with proven retention strategies.",
        features: ["Churn prevention", "Loyalty programs", "Re-engagement"],
        icon: "infinity",
      },
      {
        id: "s3",
        number: "03",
        title: "Inbound Sales",
        description: "Convert incoming inquiries into loyal subscribers.",
        features: ["Lead qualification", "Order processing", "Upselling"],
        icon: "users",
      },
    ],
  },
  workflow: {
    subtitle: "The Secret Weapon",
    title: "Customer Retention Call Center Outsourcing",
    features: [
      {
        icon: "shield",
        title: "Protect Resources",
        description:
          "Your current pool of customers is your company's most important resource.",
      },
      {
        icon: "users",
        title: "Skilled Agents",
        description:
          "Our experts know how to quickly determine what a customer needs.",
      },
      {
        icon: "chart",
        title: "Yield Results",
        description:
          "Build a loyal customer base and grow them into enthusiastic followers.",
      },
    ],
    showcaseImage: {
      src: "/assets/customer-retention-01.jpg",
      alt: "BPO Call Center Workflow",
    },
    terminal: {
      initCommand: "npm install bpo-sync",
      preparingMessage: "Analyzing customer data...",
      optimizingLabel: "Optimizing scripts",
      successLines: ["Campaign deployed", "KPIs tracking active"],
      latencyLabel: "Response Time",
      latencyValue: "150",
      latencyUnit: "ms",
    },
  },
  faq: {
    subtitle: "Learn More",
    title: "Frequently Asked Questions",
    items: [
      {
        id: 1,
        question: "What is BPO customer retention?",
        answer:
          "It is the process of outsourcing your customer retention strategies to a call center to improve loyalty.",
      },
      {
        id: 2,
        question: "How do you identify customers at risk of churn?",
        answer:
          "We analyze behavioral data such as inactivity, purchase frequency, and support interactions to identify at-risk customers early and trigger proactive retention campaigns.",
      },
      {
        id: 3,
        question: "What channels do you use for retention campaigns?",
        answer:
          "We use a multi-channel approach including voice calls, email, SMS, and chat support to engage customers based on their preferred communication method.",
      },
      {
        id: 4,
        question: "Can retention strategies be customized for my business?",
        answer:
          "Yes. We tailor scripts, offers, and engagement strategies based on your customer segments, industry, and business goals to maximize retention outcomes.",
      },
      {
        id: 5,
        question: "How quickly can you launch a retention campaign?",
        answer:
          "Depending on complexity, we can deploy a fully operational retention campaign within a few days, including agent training, script setup, and system integration.",
      },
    ],
  },
  cta: {
    headlineLine1: "Let Us Transform",
    headlineAccent: "Your Business",
    primaryLabel: "Calculate your Cost",
    secondaryLabel: "Improve your ROI",
    footnote: "Restrictions apply. All rights reserved.",
  },
  imageSections: [
    {
      title: "The BPO Customer Retention Revolution Is Here",
      description:
        "If you want to grow your business, it all starts with retaining more of your existing customers. You need a business process outsourcing customer retention revolution!",
      bullets: [
        {
          label: "Growth",
          detail:
            "It all starts with retaining more of your existing customers.",
        },
      ],
      closingText: "We are here to make that revolution happen.",
      imageSrc: "/assets/customer-retention.webp",
      imageAlt: "Business meeting",
      imagePosition: "left",
    },
    {
      title: "Making a Difference for Your Customers",
      description:
        "Customer retention outbound call campaigns are tricky but vital. Fortunately, our expert agents know how to quickly determine what a customer needs.",
      bullets: [
        {
          label: "Affordability",
          detail: "We try to offer customers affordable products and services.",
        },
        {
          label: "Value",
          detail:
            "We try to match your customers with your best prices and deals.",
        },
      ],
      closingText: "Expert agents at your service.",
      imageSrc: "/assets/customer-retention-02.jpg",
      imageAlt: "Customer service agent",
      imagePosition: "right",
    },
    {
      title: "BPO Services Provide The Strategies You Need",
      description:
        "We help protect your most important resource with our nearshore customer retention call center services.",
      bullets: [
        {
          label: "Prevention",
          detail: "We can convince customers who want to cancel to remain.",
        },
        {
          label: "Activation",
          detail: "We can convince inactive customers to start buying again.",
        },
        {
          label: "Loyalty",
          detail: "We can convince average customers to become loyal.",
        },
      ],
      closingText: "Protect your resource while making a difference.",
      imageSrc: "/assets/customer-retention-03.jpeg",
      imageAlt: "Team collaboration",
      imagePosition: "left",
    },
  ],
};

function RouteComponent() {
  return <BPOPage {...pageData} />;
}
