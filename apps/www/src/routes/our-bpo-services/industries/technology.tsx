import { createFileRoute } from "@tanstack/react-router";

import BPOPage, {
  type WebPageProps,
} from "@/components/our-bpo-services/bpo-detail-page";

export const Route = createFileRoute("/our-bpo-services/industries/technology")(
  {
    component: RouteComponent,
  }
);

const pageData: WebPageProps = {
  hero: {
    badge: "Technology Call Center Services",
    headlineLine1: "Confie BPO Has A Range of Technological Call Center",
    headlineAccent: "Solutions for You",
    description:
      "If you really want to close the gap between your innovation and consumer understanding, Confie BPO is the bridge you've been looking for.",
    primaryCta: {
      label: "Book Your Consultation",
      href: "/contact-us",
    },
    image: {
      src: "/assets/technology-01.webp",
      alt: "Technology industry support",
    },
    terminalCommand: "npm run start",
    terminalMessage: "Improve your ROI",
  },
  services: {
    subtitle: "Solutions",
    title: "Industrial Expertise",
    description:
      "Comprehensive BPO solutions for cutting-edge industries including Technology, Healthcare, and Finance.",
    items: [
      {
        id: "s1",
        number: "01",
        title: "Outbound Sales",
        description:
          "Drive revenue with expert outbound sales strategies designed for high-growth tech companies.",
        features: ["Lead Generation", "Direct Sales", "Market Analysis"],
        icon: "zap",
      },
      {
        id: "s2",
        number: "02",
        title: "Customer Retention",
        description:
          "Protect your churn rate with dedicated experts who understand customer lifetime value.",
        features: ["Loyalty Support", "Account Recovery", "Success Management"],
        icon: "users",
      },
      {
        id: "s3",
        number: "03",
        title: "Inbound Sales",
        description:
          "Convert incoming interest into long-term partnerships with expert technical support.",
        features: [
          "Technical Upselling",
          "Inquiry Resolution",
          "Order Management",
        ],
        icon: "chart",
      },
    ],
  },
  workflow: {
    subtitle: "Communication",
    title: "Speaks the Customers' Language",
    features: [
      {
        icon: "globe",
        title: "Technical Expertise",
        description:
          "Agents with high-level technical expertise who won't rest until they understand every aspect of your product.",
      },
      {
        icon: "zap",
        title: "Closing the Gap",
        description:
          "Fighting the gap between innovative technology and consumer understanding to drive sales.",
      },
    ],
    showcaseImage: {
      src: "/assets/technology.png",
      alt: "Global communication bridge",
    },
    terminal: {
      initCommand: "npm start bridge",
      preparingMessage: "Syncing innovation...",
      optimizingLabel: "Active",
      successLines: ["Bridge established", "Language synchronized"],
      latencyLabel: "Support",
      latencyValue: "0.1",
      latencyUnit: "ms",
    },
  },

  stats: [
    {
      label: "Agent Network",
      value: "Hundreds",
    },
    {
      label: "Calls Handled",
      value: "Millions",
    },
    {
      label: "Customer Satisfaction",
      value: "98%",
    },
    {
      label: "Response Time",
      value: "< 30s",
    },
  ],

  // ✅ REQUIRED
  faq: {
    subtitle: "Support",
    title: "If You Have Questions, We Have Answers",
    items: [
      {
        id: 1,
        question: "Do you disrupt my brand image?",
        answer: "No, we align fully with your brand.",
      },
      {
        id: 2,
        question: "How can BPO support fast-growing tech companies?",
        answer:
          "We provide scalable teams that can quickly adapt to your growth. Whether you're launching a new product or expanding globally, our agents handle increased workloads without compromising quality.",
      },
      {
        id: 3,
        question: "Do your agents understand technical products?",
        answer:
          "Yes. Our agents are trained in technical concepts and continuously upskilled to understand your product, ensuring accurate communication with your customers.",
      },
      {
        id: 4,
        question: "Can you integrate with our existing tools and systems?",
        answer:
          "Absolutely. We seamlessly integrate with your CRM, helpdesk, and internal systems to ensure smooth workflows and consistent data handling.",
      },
      {
        id: 5,
        question: "How do you ensure data security for tech companies?",
        answer:
          "We follow strict security protocols, including data encryption, access control, and compliance standards to ensure your business and customer data remain protected.",
      },
    ],
  },

  cta: {
    headlineLine1: "Talk to Our",
    headlineAccent: "Experts",
    primaryLabel: "Book Your Consultation",
    secondaryLabel: "Calculate your Cost",
    footnote:
      "Help your company market effectively and close additional sales.",
  },
  imageSections: [
    {
      title: 'No More "Crunch" with Confie BPO',
      description:
        'One thing every tech industry has in common is "crunch." Unfortunately, sustained crunch always takes its toll on employees, sinking morale and increasing turnover.',
      bullets: [
        {
          label: "Employee Morale",
          detail:
            "Stop losing your best employees while trying to launch new products.",
        },
        {
          label: "Short-term/Long-term",
          detail: "Hire us on a flexible basis to handle your busiest periods.",
        },
      ],
      closingText:
        "With Confie BPO services, crunch can finally be a thing of the past. We provide assistance during busy periods so your workers don't feel the strain.",
      imageSrc: "/assets/technology-02.jpg",
      imageAlt: "Agents working with headsets",
      imagePosition: "right",
    },
    {
      title: "Fellow Technological Experts",
      description:
        'When your business is on the cutting-edge, it can be hard to find anyone who can keep up. At Confie BPO, we take pride in our ability to "speak the language."',
      bullets: [
        {
          label: "Business Side",
          detail:
            "We understand the latest developments and seamless integration.",
        },
        {
          label: "Consumer Side",
          detail:
            "Nearshore agents have the expert language skills for clear communication.",
        },
      ],
      closingText:
        "We integrate seamlessly into your current operation while communicating with your customers at the highest level.",
      imageSrc: "/assets/technology-01.webp",
      imageAlt: "Technical server room",
      imagePosition: "left",
    },
  ],
};

function RouteComponent() {
  return <BPOPage {...pageData} />;
}
