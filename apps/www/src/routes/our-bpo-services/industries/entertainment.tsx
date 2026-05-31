import { createFileRoute } from "@tanstack/react-router";

import BPOPage, {
  type WebPageProps,
} from "@/components/our-bpo-services/bpo-detail-page";

export const Route = createFileRoute(
  "/our-bpo-services/industries/entertainment"
)({
  component: RouteComponent,
});

const pageData: WebPageProps = {
  hero: {
    badge: "Home | Industries | Entertainment Call Center Services",
    headlineLine1: "Entertainment",
    headlineAccent: "Call Center Services",
    description:
      "Unleash Your Hidden Potential Today with One Simple Click. Talk to Our Experts to scale your entertainment operations seamlessly.",
    primaryCta: {
      label: "Book Your Consultation",
      href: "/contact-us",
    },
    image: {
      src: "/assets/entertainment.webp",
      alt: "Entertainment industry support",
    },
    terminalCommand: "Improve your ROI",
    terminalMessage: "One Simple Click",
  },
  stats: [],
  services: {
    subtitle: "Solutions",
    title: "Our Expertise",
    description:
      "Comprehensive BPO solutions tailored for demanding industries.",
    items: [
      {
        id: "s1",
        number: "01",
        title: "Outbound Sales",
        description: "Driven sales strategies to grow your revenue.",
        features: ["Lead Generation", "Direct Sales"],
        icon: "zap",
      },
      {
        id: "s2",
        number: "02",
        title: "Customer Retention",
        description: "Keep your customers happy and loyal.",
        features: ["Support", "Feedback"],
        icon: "users",
      },
      {
        id: "s3",
        number: "03",
        title: "Inbound Sales",
        description: "Maximize every incoming opportunity.",
        features: ["Query Handling", "Closing"],
        icon: "chart",
      },
    ],
  },
  workflow: {
    subtitle: "Strategy",
    title: "Confie BPO is There When You Need to Move Fast",
    features: [
      {
        icon: "infinity",
        title: "Scalable Support",
        description:
          "Get as much or as little help as you need as deadlines approach.",
      },
      {
        icon: "shield",
        title: "Secure Operations",
        description:
          "Move fast, secure in the knowledge that someone is there to help.",
      },
    ],
    showcaseImage: {
      src: "/assets/entertainment.jpg",
      alt: "Confie BPO Office Setting",
    },
    terminal: {
      initCommand: "npm run ROI",
      preparingMessage: "Optimizing workflows...",
      optimizingLabel: "Efficiency",
      successLines: ["Integration Successful", "Capacity Scaled"],
      latencyLabel: "Uptime",
      latencyValue: "100",
      latencyUnit: "%",
    },
  },
  faq: {
    subtitle: "Support",
    title: "If You Have Questions, We Have Answers",
    items: [
      {
        id: 1,
        question: "Do you disrupt my brand image?",
        answer:
          "No. Our teams are trained to fully align with your brand voice, tone, and customer experience standards, ensuring seamless integration without disruption.",
      },
      {
        id: 2,
        question:
          "How do you handle high call volumes during campaigns or releases?",
        answer:
          "We provide scalable support that can quickly expand during peak periods like launches, promotions, or live events, ensuring no opportunity is missed.",
      },
      {
        id: 3,
        question: "Can your agents handle entertainment-specific audiences?",
        answer:
          "Yes. Our agents are trained to manage diverse audiences, including fans, subscribers, and event participants, while maintaining a high-quality experience.",
      },
      {
        id: 4,
        question: "What channels do you support?",
        answer:
          "We support multiple channels including phone, email, live chat, and social media, allowing you to engage your audience wherever they are.",
      },
      {
        id: 5,
        question: "How quickly can we get started?",
        answer:
          "Onboarding is fast and efficient. Depending on your requirements, we can deploy a trained team within days to start handling operations.",
      },
      {
        id: 6,
        question: "Do you provide performance tracking and reporting?",
        answer:
          "Yes. We offer real-time reporting and analytics so you can track performance, customer satisfaction, and campaign effectiveness.",
      },
      {
        id: 7,
        question: "Is your service secure and compliant?",
        answer:
          "Absolutely. We follow strict security protocols and compliance standards to ensure your data and customer interactions are fully protected.",
      },
    ],
  },
  cta: {
    headlineLine1: "Unleash Your Hidden Potential Today with",
    headlineAccent: "One Simple Click",
    primaryLabel: "Calculate your Cost",
    secondaryLabel: "See Our FAQ",
    footnote:
      "At Confie BPO, we are up to date on the latest technology and innovations.",
  },
  imageSections: [
    {
      title: "Seamless Services to Seamless Integration",
      description:
        "If you work in entertainment, then you understand that image is everything. When you decide to bring a BPO provider to help out, the most important thing is that they don’t do anything to disrupt your brand.",
      bullets: [
        {
          label: "Technology",
          detail:
            "We use the latest technology and innovations to help with any project.",
        },
      ],
      closingText:
        "Our seamless services are designed to cut your operational costs while helping to boost your bottom line.",
      imageSrc: "/assets/entertainment-01.jpg",
      imageAlt: "Team collaboration",
      imagePosition: "right",
    },
    {
      title: "Advertisement at the Speed of “Lights!”",
      description:
        "In the entertainment industry, marketing is essential. First, you need to come up with the perfect ads tailor-made to a specific audience. Next, you need to deliver those in a dynamic and impactful way.",
      bullets: [
        {
          label: "Campaign Support",
          detail:
            "Get trained professionals to help you handle the calls received from your campaigns.",
        },
      ],
      closingText:
        "Simply put, it can be difficult for your business to handle everything on its own.",
      imageSrc: "/assets/entertainment-02.jpg",
      imageAlt: "Marketing concept",
      imagePosition: "left",
    },
  ],
};

function RouteComponent() {
  return <BPOPage {...pageData} />;
}
