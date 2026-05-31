import { createFileRoute } from "@tanstack/react-router";
import BPOPage, {
  type WebPageProps,
} from "@/components/our-bpo-services/bpo-detail-page";

export const Route = createFileRoute("/our-bpo-services/industries/retail")({
  component: RouteComponent,
});

const pageData: WebPageProps = {
  hero: {
    badge: "Retail Call Center Services",
    headlineLine1: "Call Center for",
    headlineAccent: "Retail Services",
    description:
      "In today's e-commerce and digital world, you cannot afford to fall behind your competition. Your customers want to feel connected and like they matter.",
    primaryCta: {
      label: "Book Your Consultation",
      href: "/contact-us",
    },
    image: {
      src: "/assets/retail.webp",
      alt: "Retail industry support",
    },
    terminalCommand: "npm run start",
    terminalMessage: "Talk to Our Experts",
  },
  stats: [],
  services: {
    subtitle: "BPO Functions",
    title: "BPO Functions in the Retail Industry",
    description:
      "Consumers today expect to find superior customer service through not only walking into your physical store, but also through phone, chat, video and social media.",
    items: [
      {
        id: "s1",
        number: "01",
        title: "Customer Service",
        description:
          "Stellar customer service is first on your list of ways to be successful. Your competition is waiting for your unhappy customer.",
        features: [
          "Positive encounters",
          "Superior service",
          "Walk-in & Digital",
        ],
        icon: "users",
      },
      {
        id: "s2",
        number: "02",
        title: "Inbound Sales",
        description:
          "Help you qualify leads, handle e-commerce and help sell, upsell and cross-sell your products.",
        features: [
          "Qualify leads",
          "Handle e-commerce",
          "Upsell and cross-sell",
        ],
        icon: "zap",
      },
      {
        id: "s3",
        number: "03",
        title: "Outbound Sales",
        description:
          "Acquiring new clients is key to success and growth. Reach out to potential customers through phone, text, and social media.",
        features: [
          "Acquisition strategy",
          "Proactive reaching",
          "New consumer growth",
        ],
        icon: "chart",
      },
    ],
  },
  workflow: {
    subtitle: "Why Confie BPO",
    title: "Why is Confie BPO Different?",
    features: [
      {
        icon: "infinity",
        title: "Experience Across Multichannel Communications",
        description:
          "Grow your social media presence across platforms and track your customers as they go from one to another.",
      },
      {
        icon: "zap",
        title: "Seasonal Ramp Up and Down",
        description:
          "Easily increase and decrease your call center agent numbers during your busiest times and slower periods.",
      },
      {
        icon: "shield",
        title: "Vigilant and Proven Security Measures",
        description:
          "We maintain strict security standards to protect your privacy, as well as that of your clients.",
      },
    ],
    showcaseImage: {
      src: "/assets/retail.webp",
      alt: "Retail BPO Showcase",
    },
    terminal: {
      initCommand: "confie --start",
      preparingMessage: "Initializing multichannel agents...",
      optimizingLabel: "Efficiency",
      successLines: ["Compliance verified", "Security active"],
      latencyLabel: "Uptime",
      latencyValue: "99.9",
      latencyUnit: "%",
    },
  },
  faq: {
    subtitle: "FAQs",
    title: "FAQs About Retail Call Center Services",
    items: [
      {
        id: 1,
        question: "What is a Retail Call Center?",
        answer:
          "A retail call center service offers social media growth, ramping up your channels to accommodate seasonal spurts and providing amazing experiences.",
      },
      {
        id: 2,
        question:
          "What Type of Business Benefits from Retail Call Center Services?",
        answer:
          "Any retail business that needs human resources, inbound and outbound sales, order processing, and back office tasks.",
      },
      {
        id: 3,
        question: "What are the Challenges to Outsourcing Retail Services?",
        answer:
          "Turnover with rotating cast of agents, building a trusting partnership, and potential language barriers.",
      },
    ],
  },
  cta: {
    headlineLine1: "Turn Your Company Into a",
    headlineAccent: "Growth Machine",
    primaryLabel: "Calculate your Cost",
    secondaryLabel: "Improve your ROI",
    footnote:
      "Retail call center services can boost your company's inbound sales and more.",
  },
  imageSections: [
    {
      title: "Complete Your Digital E-Commerce Transition",
      description:
        "For your retail business to survive and thrive, you need to have a successful digital presence. Even if you still run brick-and-mortar locations, online sales and innovative digital marketing are necessary.",
      bullets: [
        {
          label: "Flexibility",
          detail:
            "Be flexible and able to pivot in a post-pandemic e-commerce boom.",
        },
        {
          label: "Technology",
          detail:
            "Use newer technology your savvy customers want to see you using.",
        },
      ],
      closingText: "Achieve unprecedented success with the right BPO partner.",
      imageSrc: "/assets/retails-01.webp",
      imageAlt: "Digital Transition",
      imagePosition: "right",
      cta: {
        label: "Talk to Our Experts",
        href: "/contact-us",
      },
    },
  ],
};

function RouteComponent() {
  return <BPOPage {...pageData} />;
}
