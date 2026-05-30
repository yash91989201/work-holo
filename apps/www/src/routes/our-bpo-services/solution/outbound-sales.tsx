import { createFileRoute } from "@tanstack/react-router";
import BPOPage, {
  type WebPageProps,
} from "@/components/our-bpo-services/bpo-detail-page";

export const Route = createFileRoute(
  "/our-bpo-services/solution/outbound-sales"
)({
  component: RouteComponent,
});

const pageData: WebPageProps = {
  hero: {
    badge: "Outbound Sales Solutions",
    headlineLine1: "Outbound Sales Call Center",
    headlineAccent: "Solutions",
    description:
      "Every business is built on sales. If you want a bigger, better business, the solution is simple: You need to make more sales. We're here to help you achieve that dream!",
    primaryCta: {
      label: "Book Your Consultation",
      href: "/contact-us",
    },
    image: {
      src: "/assets/outbound-sales-01.jpg",
      alt: "Outbound sales professionals",
    },
    terminalCommand: "npm start",
    terminalMessage: "Talk to Our Experts",
  },
  stats: [
    {
      label: "ROI Improvement",
      value: "75%",
    },
    { label: "Sales Growth", value: "+40%" },
    {
      label: "Market Growth",
      value: "35%",
    },
    {
      label: "Efficiency Increase",
      value: "20%",
    },
  ],
  services: {
    subtitle: "Expert Services",
    title: "BPO Services for Your Bottom Line",
    description:
      "Confie BPO offers many different services that your business can take advantage of today. Our outbound sales call center services will make an impact in your day-to-day operations.",
    items: [
      {
        id: "s1",
        number: "01",
        title: "Secure Sales Reservations",
        description: "We can help you secure more sales reservations.",
        features: ["Direct booking", "Lead management", "Priority handling"],
        icon: "zap",
      },
      {
        id: "s2",
        number: "02",
        title: "Cross-sell & Upsell",
        description:
          "We can help you sell, cross-sell, and upsell different products and services.",
        features: ["Maximize value", "Diverse offerings", "Customer growth"],
        icon: "infinity",
      },
      {
        id: "s3",
        number: "03",
        title: "Market Research",
        description:
          "We can help with market research and with promoting new products.",
        features: ["Data analysis", "Trend tracking", "Promotional support"],
        icon: "globe",
      },
    ],
  },
  workflow: {
    subtitle: "Our Process",
    title: "Outbound Sales Services Made Easy",
    features: [
      {
        icon: "users",
        title: "Acquire new customers",
        description:
          "We focus on bringing new clients and fresh revenue to your brand.",
      },
      {
        icon: "chart",
        title: "Track buying patterns",
        description:
          "Dynamic data analysis to understand and predict consumer behavior.",
      },
    ],
    showcaseImage: {
      src: "/assets/outbound-sales-01.jpg",
      alt: "Confie BPO Operations",
    },
    terminal: {
      initCommand: "npm start",
      preparingMessage: "Initializing Sales Systems...",
      optimizingLabel: "Improving Lead Conversion",
      successLines: ["ROI Potential Optimized", "Expert Agents Ready"],
      latencyLabel: "Sync Speed",
      latencyValue: "15",
      latencyUnit: "ms",
    },
  },
  faq: {
    subtitle: "Knowledge Center",
    title: "Frequently Asked Questions",
    items: [
      {
        id: 1,
        question: "What is the primary goal of your outbound services?",
        answer:
          "Our goal is to help you secure more sales reservations and manage customer relationships to boost your bottom line.",
      },
      {
        id: 2,
        question:
          "How do you ensure high conversion rates in outbound campaigns?",
        answer:
          "We combine data-driven targeting, optimized scripts, and continuous A/B testing to improve engagement and maximize conversion rates.",
      },
      {
        id: 3,
        question: "Do your agents specialize in B2B and B2C sales?",
        answer:
          "Yes. Our agents are trained for both B2B and B2C environments, adapting communication styles and strategies based on your target audience.",
      },
      {
        id: 4,
        question: "Can you integrate with our CRM and sales tools?",
        answer:
          "Absolutely. We integrate seamlessly with your CRM, sales platforms, and analytics tools to ensure smooth workflows and real-time reporting.",
      },
      {
        id: 5,
        question: "How do you qualify leads before passing them to us?",
        answer:
          "We use predefined qualification criteria, customer intent signals, and conversation scoring to ensure only high-quality leads reach your sales team.",
      },
      {
        id: 6,
        question: "How quickly can outbound campaigns be launched?",
        answer:
          "Most campaigns can be launched within a few days, including agent onboarding, script optimization, and system integration.",
      },
    ],
  },
  cta: {
    headlineLine1: "Take Your Business to the Next Level",
    headlineAccent: "with Confie BPO",
    primaryLabel: "Calculate your Cost",
    secondaryLabel: "Improve your ROI",
    footnote:
      "Experts in both B2B and B2C; no matter your business, we can help.",
  },
  imageSections: [
    {
      title: "The Value You Deserve",
      description:
        "We provide all of our sales agents with the resources they need to succeed. This includes state-of-the-art equipment and IT capabilities needed to store, manage, and guard your company's data.",
      bullets: [
        {
          label: "Proactive Resources",
          detail:
            "Agents receive ongoing training and motivational activities.",
        },
        {
          label: "Soft Skill Experts",
          detail:
            "Experts who have the skills to understand and persuade diverse customers.",
        },
      ],
      closingText:
        "Get nearshore specialists who are much more than a telemarketer.",
      imageSrc: "/assets/outbound-sales.webp",
      imageAlt: "Professional Sales Environment",
      imagePosition: "right",
    },
  ],
};

function RouteComponent() {
  return <BPOPage {...pageData} />;
}
