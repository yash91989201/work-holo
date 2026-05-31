import { createFileRoute } from "@tanstack/react-router";
import BPOPage, {
  type WebPageProps,
} from "@/components/our-bpo-services/bpo-detail-page";

export const Route = createFileRoute(
  "/our-bpo-services/solution/facility-and-procurement"
)({
  component: RouteComponent,
});

const pageData: WebPageProps = {
  hero: {
    badge: "Home | Call Center Services",
    headlineLine1: "Facility and Procurement",
    headlineAccent: "Call Center Solutions",
    description:
      "Unlock your company's full potential with an expert team focused on facility and procurement management.",
    primaryCta: {
      label: "Book Your Consultation",
      href: "/contact-us",
    },
    image: {
      src: "/assets/facility-and-procurement-01.jpg",
      alt: "Facility and procurement services",
    },
    terminalCommand: "Talk to Our Experts",
    terminalMessage: "Improve your ROI",
  },
  stats: [
    { label: "Facilities Managed", value: "500+" },
    { label: "Procurement Requests", value: "10K+" },
    { label: "Cost Savings", value: "30%" },
    { label: "Vendor Network", value: "Global" },
  ],
  services: {
    subtitle: "Core Capabilities",
    title: "Facility & Procurement BPO Services",
    description:
      "We streamline your operations by managing facilities and procurement workflows efficiently.",
    items: [
      {
        id: "s1",
        number: "01",
        title: "Facility Management",
        description:
          "End-to-end management of infrastructure, maintenance, and operational efficiency.",
        features: [
          "Maintenance scheduling",
          "Asset tracking",
          "Vendor coordination",
        ],
        icon: "shield",
      },
      {
        id: "s2",
        number: "02",
        title: "Procurement Optimization",
        description:
          "Efficient sourcing and purchasing strategies to reduce costs and improve supply chains.",
        features: ["Vendor sourcing", "Cost negotiation", "Purchase tracking"],
        icon: "chart",
      },
      {
        id: "s3",
        number: "03",
        title: "Inventory Management",
        description:
          "Keep your supply chain flowing with accurate inventory monitoring and forecasting.",
        features: [
          "Stock monitoring",
          "Demand forecasting",
          "Supply optimization",
        ],
        icon: "zap",
      },
    ],
  },
  workflow: {
    subtitle: "Operational Flow",
    title: "How We Optimize Facility & Procurement",
    features: [
      {
        icon: "users",
        title: "Requirement Mapping",
        description:
          "We analyze your facility needs, procurement cycles, and vendor dependencies to build a custom workflow.",
      },
      {
        icon: "globe",
        title: "Vendor & Supply Integration",
        description:
          "Seamlessly connect with verified vendors and streamline sourcing, purchasing, and delivery pipelines.",
      },
      {
        icon: "chart",
        title: "Real-Time Monitoring",
        description:
          "Track procurement costs, inventory levels, and facility performance with live KPI dashboards.",
      },
    ],
    showcaseImage: {
      src: "/assets/facility-and-procurement-01.jpg",
      alt: "Facility and procurement workflow visualization",
    },
    terminal: {
      initCommand: "npm run facility-optimize",
      preparingMessage: "Syncing vendors and facilities...",
      optimizingLabel: "Operations",
      successLines: [
        "✓ Vendor network connected",
        "✓ Procurement pipelines active",
      ],
      latencyLabel: "Processing Time",
      latencyValue: "120",
      latencyUnit: "ms",
    },
  },
  faq: {
    subtitle: "Common Questions",
    title: "Frequently Asked Questions",
    items: [
      {
        id: 1,
        question: "What is facility management in BPO?",
        answer:
          "It involves outsourcing the maintenance, operations, and optimization of physical infrastructure to expert teams.",
      },
      {
        id: 2,
        question: "How does procurement outsourcing save money?",
        answer:
          "By leveraging vendor networks, bulk purchasing, and negotiation strategies, BPO providers reduce operational costs.",
      },
      {
        id: 3,
        question: "Can services scale with my business?",
        answer:
          "Yes, BPO solutions are highly scalable and adjust based on your company's growth and demand.",
      },
      {
        id: 4,
        question: "Is my data secure with procurement BPO?",
        answer:
          "Yes, advanced security protocols and compliance standards ensure your business data is protected.",
      },
    ],
  },
  cta: {
    headlineLine1: "Start Your Journey to Savings & Growth with Confie",
    headlineAccent: "BPO Today",
    primaryLabel: "Calculate your Cost",
    secondaryLabel: "",
    footnote: "",
  },
  imageSections: [
    {
      title: "A BPO Provider You Can Trust",
      description:
        "Confie BPO provides a team of agents who learn your business needs and become the subject matter experts you need. Our statistical knowledge and logistics experience means that we can provide a streamlined approach to management, upkeep, repair, and more.",
      bullets: [],
      closingText:
        "Ultimately, we bring technology, tools, and talent to the table. All of this means we are the optimal choice for all of your BPO provider needs!",
      imageSrc: "/assets/facility-and-procurement.webp",
      imageAlt: "BPO team collaborating in a meeting",
      imagePosition: "left",
    },
    {
      title: "Unlock Your Company's Full Potential",
      description:
        "When you hire Confie BPO services, you get an expert team to help take care of your different facility and procurement management needs. On top of that, you get an opportunity to unlock your company's full potential.",
      bullets: [],
      closingText:
        "With our BPO, you get additional human resources. We provide the tools and the talent, and we can take care of every aspect of facility and procurement management.",
      imageSrc: "/assets/facility-and-procurement-02.jpg",
      imageAlt: "Dart hitting bullseye representing growth potential",
      imagePosition: "right",
    },
    {
      title: "The Pulse of Your Company",
      description:
        "The pulse of your company is facility and procurement management. When employees arrive at work, they are confident that their buildings will be in good condition and that they will have all of the supplies they need.",
      bullets: [],
      closingText:
        "That's why you need Confie BPO. With our BPO, you can have qualified experts take care of all your facility and procurement needs, freeing up your time for more important things.",
      imageSrc: "/assets/facility-and-procurement-03.png",
      imageAlt: "Modern office and building management environment",
      imagePosition: "left",
    },
    {
      title: "What You Need, When You Need It",
      description:
        "Unfortunately, taking care of all facility management and procurement needs eats into your time. If you're not careful, you'll spend all of your time and energy just keeping things going instead of finding ways to grow.",
      bullets: [],
      closingText:
        "We understand how to take care of all your facility and procurement needs effectively and efficiently. By saving your company both time and money, our BPO can help your business grow.",
      imageSrc: "/assets/facility-and-procurement-04.jpeg",
      imageAlt: "Professionals in a meeting room environment",
      imagePosition: "right",
    },
  ],
};

function RouteComponent() {
  return <BPOPage {...pageData} />;
}
