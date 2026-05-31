import { createFileRoute } from "@tanstack/react-router";
import BPOPage, {
  type WebPageProps,
} from "@/components/our-bpo-services/bpo-detail-page";

export const Route = createFileRoute(
  "/our-bpo-services/solution/technical-support"
)({
  component: RouteComponent,
});

const pageData: WebPageProps = {
  hero: {
    badge: "Home | Call Center Services | Technical Support",
    headlineLine1: "Call Center for the",
    headlineAccent: "Tech Industry",
    description:
      "Outsourcing your technology needs to a qualified call center has the potential to streamline your business and boost your performance. We provide the reassurance and expert guidance you need to keep your tech infrastructure operating smoothly.",
    primaryCta: {
      label: "Book Your Consultation",
      href: "/contact-us",
    },
    image: {
      src: "/assets/technology-01.webp",
      alt: "Technical support team",
    },
    terminalCommand: "npm run start",
    terminalMessage: "Talk to Our Experts",
  },
  stats: [
    {
      label: "Client Satisfaction",
      value: "97%",
    },
    {
      label: "Issue Resolution Rate",
      value: "92%",
    },
    {
      label: "Knowledgeable Agents",
      value: "74+",
    },
    {
      label: "Available Support",
      value: "24/7",
    },
  ],
  services: {
    subtitle: "Comprehensive Assistance",
    title: "Call Center Tech Support Services",
    description:
      "Modern businesses use technology in almost every aspect of their operations, so call center helpdesks must be able to handle several types of services.",
    items: [
      {
        id: "s1",
        number: "01",
        title: "Account Administration",
        description:
          "Setting up accounts for new employees, resetting passwords, and adjusting access levels.",
        features: ["New user setup", "Password resets", "Access control"],
        icon: "users",
      },
      {
        id: "s2",
        number: "02",
        title: "Software Support",
        description:
          "Assistance with installing, updating, or using various software applications.",
        features: ["Installation", "Updates", "Usage guidance"],
        icon: "zap",
      },
      {
        id: "s3",
        number: "03",
        title: "Hardware Questions",
        description:
          "Troubleshooting devices from printers to laptops to ensure tech works properly.",
        features: [
          "Device troubleshooting",
          "Peripheral setup",
          "Connectivity issues",
        ],
        icon: "shield",
      },
    ],
  },
  workflow: {
    subtitle: "Key Advantages",
    title: "6 Benefits of BPO in Technology",
    features: [
      {
        icon: "infinity",
        title: "More Consistent Processes",
        description:
          "Advanced quality control systems and reliable troubleshooting processes for same quality support.",
      },
      {
        icon: "zap",
        title: "Access to Tech Expertise",
        description:
          "Instant access to hundreds of knowledgeable agents with specialized technological experience.",
      },
      {
        icon: "globe",
        title: "Less Downtime",
        description:
          "24/7 tech support and agents to keep your system running and minimize network downtime.",
      },
    ],
    showcaseImage: {
      src: "/assets/technical-support-02.jpg",
      alt: "Technical support team at work",
    },
    terminal: {
      initCommand: "ssh admin@confie-bpo",
      preparingMessage: "Connecting to helpdesk systems...",
      optimizingLabel: "System Health",
      successLines: ["Support agents ready", "Ticket systems active"],
      latencyLabel: "Response Time",
      latencyValue: "15",
      latencyUnit: "ms",
    },
  },
  faq: {
    subtitle: "Common Questions",
    title: "Tech Support Call Center FAQs",
    items: [
      {
        id: 1,
        question:
          "What Is the Difference Between a BPO Team and a Call Center in Tech Support?",
        answer:
          "A call center primarily focuses on communication aspects like taking calls, while BPO teams can also handle back-office and administrative functions.",
      },
      {
        id: 2,
        question: "How Can Outsourcing Tech Support Grow My Business?",
        answer:
          "Hiring a third-party call center allows you to focus on core operations and reinvest time and energy into growing your business more efficiently.",
      },
      {
        id: 3,
        question: "How Does Remote Technical Support Work?",
        answer:
          "Teams use advanced techniques and approved software tools to remotely access devices and resolve complex issues directly over chat or phone.",
      },
      {
        id: 4,
        question: "What types of technical issues can your team handle?",
        answer:
          "Our agents handle a wide range of issues including software bugs, hardware troubleshooting, network connectivity problems, account access issues, and system performance optimization.",
      },
      {
        id: 5,
        question: "Do you provide multi-channel technical support?",
        answer:
          "Yes, we offer support across phone, email, live chat, and ticketing systems to ensure your customers receive help through their preferred channel.",
      },
      {
        id: 6,
        question: "How do you ensure data security during support sessions?",
        answer:
          "We follow strict security protocols, encrypted connections, and compliance standards to ensure all customer data and remote sessions are सुरक्षित and protected.",
      },
    ],
  },
  cta: {
    headlineLine1: "Plug in Customer Satisfaction with Our",
    headlineAccent: "Knowledgeable IT Solutions",
    primaryLabel: "Book Your Consultation",
    secondaryLabel: "Improve your ROI",
    footnote: "© 2023 Confie Holding II Co. All rights reserved.",
  },
  imageSections: [
    {
      title: "Confie’s Tech Support Experience Record",
      description:
        "The Confie team consists of over 1,000 knowledgeable agents who are ready to resolve your technical challenges and troubleshoot complex software.",
      bullets: [
        {
          label: "Agent Capacity",
          detail: "1,000+ knowledgeable agents",
        },
        {
          label: "Specialized Experience",
          detail: "Hundreds of agents with helpdesk process expertise",
        },
      ],
      closingText:
        "Whether you need to reset a password or upgrade security, our agents can get you where you need to go.",
      imageSrc: "/assets/technical-support.jpg",
      imageAlt: "Support agent helping customer",
      imagePosition: "right",
    },
  ],
};

function RouteComponent() {
  return <BPOPage {...pageData} />;
}
