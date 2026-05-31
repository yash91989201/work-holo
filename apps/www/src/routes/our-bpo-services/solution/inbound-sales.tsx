import { createFileRoute } from "@tanstack/react-router";
import BPOPage, {
  type WebPageProps,
} from "@/components/our-bpo-services/bpo-detail-page";

export const Route = createFileRoute(
  "/our-bpo-services/solution/inbound-sales"
)({
  component: RouteComponent,
});

const pageData: WebPageProps = {
  hero: {
    badge: "Home | Call Center Services | Inbound Sales",
    headlineLine1: "Inbound Sales",
    headlineAccent: "Call Center Solutions",
    description: "Talk to Our Experts",
    primaryCta: {
      label: "Book Your Consultation",
      href: "/contact-us",
    },
    image: {
      src: "/assets/inbound-sales-01.jpeg",
      alt: "Inbound sales team collaborating",
    },
    terminalCommand: "npm run start",
    terminalMessage: "Improve your ROI",
  },
  stats: [
    {
      label: "Lead Conversion Rate",
      value: "32%",
    },
    {
      label: "First Response Time",
      value: "< 20s",
    },
    {
      label: "Revenue Growth",
      value: "+45%",
    },
    {
      label: "Customer Satisfaction",
      value: "96%",
    },
  ],
  services: {
    subtitle: "Learn the Secrets of Amazing Inbound Sales Numbers",
    title: "BPO Services You Can Count On",
    description:
      "Confie BPO won't stop until we have learned everything we need to know about your company, products, and services.",
    items: [
      {
        id: "s1",
        number: "01",
        title: "BPO Services You Can Count On",
        description:
          "Confie BPO helps you land more sales and build the kind of loyal brand ambassadors among your customers that will help your business continue to grow.",
        features: [
          "Proven phone sales techniques",
          "Excellent language skills",
          "Nearshore call center agents",
        ],
        icon: "users",
      },
      {
        id: "s2",
        number: "02",
        title: "Sales, Service and Everything In Between",
        description:
          "The amount of inbound sales functions our BPO team can take care of for you might surprise you.",
        features: [
          "Qualify leads",
          "Handle e-commerce management",
          "Help sell, upsell, and cross-sell",
        ],
        icon: "zap",
      },
      {
        id: "s3",
        number: "03",
        title: "Conversion Optimization",
        description:
          "We refine every step of your inbound funnel to ensure more inquiries turn into paying customers with minimal drop-offs.",
        features: [
          "Call script optimization",
          "Real-time lead qualification",
          "Sales funnel improvement",
        ],
        icon: "chart",
      },
    ],
  },
  workflow: {
    subtitle: "Driving Your Company Forward",
    title: "The Evolution of Your Business",
    features: [
      {
        icon: "chart",
        title: "Mastering Sales",
        description:
          "Demographics and pain points change over time, so your products and services need to change as well.",
      },
      {
        icon: "zap",
        title: "Dynamic Experts",
        description:
          "You need dynamic sales experts who are willing to roll with the changes if you want your business to evolve.",
      },
      {
        icon: "users",
        title: "Lead Closing",
        description:
          "Get the dynamic experts you need to close leads and take your sales to the next level.",
      },
    ],
    showcaseImage: {
      src: "/assets/inbound-sales-01.jpeg",
      alt: "Business analytics and strategy",
    },
    terminal: {
      initCommand: "inbound-sales --optimize",
      preparingMessage: "Analyzing market demographics...",
      optimizingLabel: "Boosting Revenue",
      successLines: ["Sales funnel optimized", "Lead conversion active"],
      latencyLabel: "Consultation",
      latencyValue: "0",
      latencyUnit: "sec",
    },
  },
  faq: {
    subtitle: "Resources",
    title: "Frequently Asked Questions",
    items: [
      {
        id: 1,
        question: "Where is Confie BPO located?",
        answer: "HQ: 7711 Center Avenue, Suite 200, Huntington Beach, CA 92647",
      },
      {
        id: 2,
        question: "How can I contact Confie BPO?",
        answer: "Main: 800-684-2276",
      },
      {
        id: 3,
        question: "How do inbound sales agents improve conversion rates?",
        answer:
          "Inbound sales agents engage with high-intent customers in real time, understand their needs, and guide them through the buying process using proven sales techniques to maximize conversions.",
      },
      {
        id: 4,
        question:
          "What types of businesses benefit from inbound sales outsourcing?",
        answer:
          "Any business that receives customer inquiries — including eCommerce, SaaS, healthcare, and service-based companies — can benefit from faster response times and higher conversion rates.",
      },
      {
        id: 5,
        question: "Can inbound sales teams handle peak traffic periods?",
        answer:
          "Yes, inbound sales teams are designed to scale quickly, ensuring consistent customer support and sales coverage during high-demand periods without impacting performance.",
      },
    ],
  },
  cta: {
    headlineLine1: "Unleash Your Hidden Potential Today with",
    headlineAccent: "One Simple Click",
    primaryLabel: "Calculate your Cost",
    secondaryLabel: "Contact Us",
    footnote:
      "Trade/service marks are the property of Confie Holding II Co. © 2023",
  },
  imageSections: [
    {
      title: "Sales, Service and Everything In Between",
      description:
        "The amount of inbound sales functions our BPO team can take care of for you might surprise you.",
      bullets: [
        {
          label: "Qualify leads",
          detail: "Identify high-value prospects for your sales team",
        },
        {
          label: "E-commerce",
          detail: "Handle management and customer transactions",
        },
        {
          label: "Upsell",
          detail: "Help sell, upsell, and cross-sell your products",
        },
      ],
      closingText:
        "Confie BPO understands that reliable sales require constant time, attention, and effort.",
      imageSrc: "/assets/inbound-sales.jpg",
      imageAlt: "Team collaborating during a sale",
      imagePosition: "left",
    },
  ],
};

function RouteComponent() {
  return <BPOPage {...pageData} />;
}
