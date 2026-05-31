import { createFileRoute } from "@tanstack/react-router";
import BPOPage, {
  type WebPageProps,
} from "@/components/our-bpo-services/bpo-detail-page";

export const Route = createFileRoute(
  "/our-bpo-services/solution/direct-response-marketing"
)({
  component: RouteComponent,
});

const pageData: WebPageProps = {
  hero: {
    badge: "Home | Call Center Services | Direct Response Marketing",
    headlineLine1: "Direct Response Marketing",
    headlineAccent: "Call Center Solutions",
    description: "Talk to Our Experts",
    primaryCta: {
      label: "Book Your Consultation",
      href: "/contact-us",
    },
    image: {
      src: "/assets/direct-response-marketing-01.webp",
      alt: "Direct response marketing team",
    },
    terminalCommand: "npm run start",
    terminalMessage: "Improve your ROI",
  },
  stats: [
    { label: "Campaign Conversion Rate", value: "45%" },
    { label: "Leads Generated", value: "50K+" },
    { label: "Response Time", value: "< 5s" },
    { label: "Revenue Growth", value: "2X" },
  ],
  services: {
    subtitle: "Our Solutions",
    title: "Call Center Services",
    description:
      "Friendly and Fluent Agents Trained to Sell Your Products and Services",
    items: [
      {
        id: "s1",
        number: "01",
        title: "Outbound Sales",
        description:
          "Specialists for a fraction of what you would typically pay.",
        features: [
          "Specialized Experts",
          "Fractional Cost",
          "Advanced Software",
        ],
        icon: "zap",
      },
      {
        id: "s2",
        number: "02",
        title: "Customer Retention",
        description: "Flexible B2C and B2B professionals.",
        features: [
          "B2C & B2B Expertise",
          "Flexible Training",
          "Strategic Growth",
        ],
        icon: "users",
      },
      {
        id: "s3",
        number: "03",
        title: "Inbound Sales",
        description: "Trained professionals answering every call.",
        features: ["Immediate Response", "Fluent Agents", "Cost Effective"],
        icon: "shield",
      },
    ],
  },
  workflow: {
    subtitle: "Process",
    title: "Innovate and Elevate",
    features: [
      {
        icon: "chart",
        title: "Strategic Learning",
        description: "We learn your key demographics, products, and strategy.",
      },
      {
        icon: "zap",
        title: "Instant Action",
        description:
          "Direct response marketing pushes customers into taking the right action.",
      },
    ],
    showcaseImage: {
      src: "/assets/direct-response-marketing-01.webp",
      alt: "Direct Response Marketing Visual",
    },
    terminal: {
      initCommand: "npm run start",
      preparingMessage: "Initializing Services...",
      optimizingLabel: "Optimizing ROI",
      successLines: ["Plan activated", "Solution ready"],
      latencyLabel: "Response",
      latencyValue: "0",
      latencyUnit: "ms",
    },
  },
  faq: {
    subtitle: "Resources",
    title: "Frequently Asked Questions",
    items: [
      {
        id: 1,
        question: "Why use direct response marketing?",
        answer:
          "Simple: we want our businesses to grow and reach customers wherever they are.",
      },
      {
        id: 2,
        question: "What channels are used in direct response marketing?",
        answer:
          "Channels include phone calls, SMS campaigns, email outreach, and digital ads designed to trigger immediate customer action.",
      },
      {
        id: 3,
        question: "How do you measure campaign success?",
        answer:
          "We track KPIs like conversion rate, cost per acquisition, response time, and overall ROI to measure success.",
      },
      {
        id: 4,
        question: "Can campaigns be customized for my audience?",
        answer:
          "Yes, all campaigns are tailored based on your target demographics, behavior patterns, and business goals.",
      },
      {
        id: 5,
        question: "How quickly can campaigns go live?",
        answer:
          "Most campaigns can be launched within days after onboarding, depending on complexity and data readiness.",
      },
    ],
  },
  cta: {
    headlineLine1: "Unleash Your Hidden Potential Today with",
    headlineAccent: "One Simple Click",
    primaryLabel: "Calculate your Cost",
    secondaryLabel: "Contact Us",
    footnote: "HQ: 7711 Center Avenue, Suite 200, Huntington Beach, CA 92647",
  },
  imageSections: [
    {
      title: "The Best of BPO Worlds",
      description:
        "Confie BPO is the single best BPO provider to trust your business with because:",
      bullets: [
        {
          label: "Flexible",
          detail: "We are professionals and experts at both B2C and B2B.",
        },
        {
          label: "Affordable",
          detail:
            "Nearshore location includes unique agent training for your brand.",
        },
      ],
      closingText:
        "Confie BPO is here to put your direct response marketing on the map!",
      imageSrc: "/assets/direct-response-marketing.jpg",
      imageAlt: "Call Center Agents",
      imagePosition: "left",
    },
    {
      title: "An Extra Hand for Your Business",
      description:
        "Direct response marketing will quickly reveal the limits of almost any company. We provide more than an extra set of hands.",
      bullets: [
        {
          label: "Access",
          detail:
            "Get access to trained professionals who understand this method.",
        },
        {
          label: "Result",
          detail:
            "It will become your perfect solution for all marketing needs.",
        },
      ],
      closingText: "Innovate and elevate your business with Confie BPO.",
      imageSrc: "/assets/direct-response-marketing-02.jpg",
      imageAlt: "Digital Hand Connection",
      imagePosition: "right",
    },
  ],
};
function RouteComponent() {
  return <BPOPage {...pageData} />;
}
