import { createFileRoute } from "@tanstack/react-router";

import BPOPage, {
  type WebPageProps,
} from "@/components/our-bpo-services/bpo-detail-page";

export const Route = createFileRoute(
  "/our-bpo-services/solution/outbound-services"
)({
  component: RouteComponent,
});

const pageData: WebPageProps = {
  hero: {
    badge: "Call Center Services",
    headlineLine1: "Outbound Call Center",
    headlineAccent: "Services",
    description:
      "To have a successful business, you need to reach new and existing customers on a regular basis. A nearshore BPO call center provides you customized solutions with measurable outcomes.",
    primaryCta: {
      label: "Book your Consultation",
      href: "/contact-us",
    },
    image: {
      src: "/assets/outbound-services-02.jpg",
      alt: "Outbound services call center",
    },
    terminalCommand: "npm run ROI --optimize",
    terminalMessage: "Connecting with global customers...",
  },
  stats: [
    {
      label: "Onshore /agent",
      value: "30",
    },
    {
      label: "Nearshore /agent",
      value: "20",
    },
    {
      label: "Offshore /agent",
      value: "15",
    },
    {
      label: "Total Agents",
      value: "65",
    },
  ],
  services: {
    subtitle: "Outbound Capabilities",
    title: "Our Solutions",
    description:
      "Any B2C or B2B business interaction requiring your company to reach out and touch your existing and potential customer base falls under our capabilities.",
    items: [
      {
        id: "s1",
        number: "01",
        title: "Customer Retention",
        description:
          "Your customers want to know you value their patronage. This is key to customer loyalty.",
        features: [
          "Scheduled contact",
          "Price drop alerts",
          "Valued customer gifts",
        ],
        icon: "users",
      },
      {
        id: "s2",
        number: "02",
        title: "Outbound Sales",
        description:
          "Utilizing proven techniques to market your business to existing and new customers.",
        features: ["Telemarketing", "Surveys", "Lead generation"],
        icon: "zap",
      },
      {
        id: "s3",
        number: "03",
        title: "Lead Generation",
        description:
          "Understand how your demographic is communicating and reach them effectively.",
        features: [
          "Demographic analysis",
          "Vast social media reach",
          "Closing sales experts",
        ],
        icon: "chart",
      },
    ],
  },
  workflow: {
    subtitle: "Execution Strategy",
    title: "Tips for Selecting a Partner",
    features: [
      {
        icon: "users",
        title: "Decide what you need",
        description:
          "Strategize with key personnel on how a BPO call center will help you save time and money.",
      },
      {
        icon: "globe",
        title: "Investigate your options",
        description:
          "Choosing the right partner comes down to solid investigation and industry experience.",
      },
      {
        icon: "chart",
        title: "Examine your budget",
        description:
          "Evaluate how much you can realistically put into this venture without denting your bottom line.",
      },
    ],
    showcaseImage: {
      src: "/assets/outbound-services-02.jpg",
      alt: "Outbound Call Center Services Showcase",
    },
    terminal: {
      initCommand: "bpo-init --strategy outbound",
      preparingMessage: "Analyzing demographic data...",
      optimizingLabel: "Optimizing ROI",
      successLines: [
        "Connection established with lead pool",
        "Agents deployed to campaign",
      ],
      latencyLabel: "Response Time",
      latencyValue: "140",
      latencyUnit: "ms",
    },
  },
  faq: {
    subtitle: "Help and Guidance",
    title: "FAQs about Outbound Call Center Services",
    items: [
      {
        id: 1,
        question:
          "What are the key differences between inbound and outbound call centers?",
        answer:
          "Outbound call center agents generate the contact, while inbound agents receive and resolve the contact.",
      },
      {
        id: 2,
        question:
          "What training do agents in inbound call centers typically receive?",
        answer: "",
      },
      {
        id: 3,
        question:
          "Which are the most common requirements for setting up a BPO outbound call center?",
        answer: "",
      },
    ],
  },
  cta: {
    headlineLine1: "Unleash Your Hidden Potential Today",
    headlineAccent: "with One Simple Click",
    primaryLabel: "Calculate your Cost",
    secondaryLabel: "Contact Us",
    footnote:
      "If the time is right to explore a partnership, reach out to the experts at Confie BPO.",
  },
  imageSections: [
    {
      title: "Benefits of an Outbound Call Center",
      description:
        "Good relationship marketing involves showing appreciation to your existing supporters and cultivating new ones.",
      bullets: [
        {
          label: "Enhanced customer experience",
          detail:
            "Motivate your clients to trumpet your brand through consistent, white-glove service.",
        },
        {
          label: "Expanded social media presence",
          detail:
            "Grow your customer base by creating a flourishing social media experience.",
        },
        {
          label: "Saved money with scalability",
          detail:
            "Your BPO call center scales up and down as you need, perfect for seasonal businesses.",
        },
      ],
      closingText:
        "You'll receive key metrics and analytics to let you know what's working.",
      imageSrc: "/assets/outbound-services.jpeg",
      imageAlt: "Call Center Benefits",
      imagePosition: "right",
    },
    {
      title: "Do You Need a Call Center?",
      description:
        "If you are weighing the pros and cons of using call center services to boost your bottom line, consider these elements:",
      bullets: [
        {
          label: "Meaningful engagement",
          detail:
            "Does your business need help engaging your current customer base in a meaningful way?",
        },
        {
          label: "Customer acquisition",
          detail:
            "Does your business need help using new technology and social media to acquire new customers?",
        },
      ],
      closingText:
        "Reach out to the experts at Confie BPO for help and guidance.",
      imageSrc: "/assets/outbound-services-01.png",
      imageAlt: "Call Center Needs Analysis",
      imagePosition: "left",
    },
  ],
};

function RouteComponent() {
  return <BPOPage {...pageData} />;
}
