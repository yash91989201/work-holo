import { createFileRoute } from "@tanstack/react-router";

import BPOPage, {
  type WebPageProps,
} from "@/components/our-bpo-services/bpo-detail-page";

export const Route = createFileRoute(
  "/our-bpo-services/industries/real-estate"
)({
  component: RouteComponent,
});

const pageData: WebPageProps = {
  hero: {
    badge: "Real Estate Call Center Services",
    headlineLine1: "Call Center for",
    headlineAccent: "Real Estate Services",
    description:
      "Business process outsourcing (BPO) teams provide call center services to streamline your work in the real estate sphere so you can focus on closing deals instead of spending time drumming up prospects and updating listings.",
    primaryCta: {
      label: "Book Your Consultation",
      href: "/contact-us",
    },
    image: {
      src: "/assets/real-estate-01.jpg",
      alt: "Real estate industry support",
    },
    terminalCommand: "npm run start",
    terminalMessage: "Talk to Our Experts",
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
  services: {
    subtitle: "Expert Support",
    title: "Call Center Services in Real Estate",
    description:
      "BPO call centers act as an extension of your business, handling the routine and administrative services you need to keep your company operating smoothly.",
    items: [
      {
        id: "s1",
        number: "01",
        title: "Lead generation",
        description:
          "Direct response marketing, cold calling, and other techniques to build your client list and find new homes to buy and sell.",
        features: ["Find Clients", "Qualify Leads", "Ongoing Pipeline"],
        icon: "users",
      },
      {
        id: "s2",
        number: "02",
        title: "Market research",
        description:
          "Understand the housing market in your region to offer competitive pricing and successfully promote your available properties.",
        features: [
          "Competitive Pricing",
          "Market Statistics",
          "Customer Feedback",
        ],
        icon: "chart",
      },
      {
        id: "s3",
        number: "03",
        title: "Inbound calls",
        description:
          "Capture as many clients as possible by ensuring agents are available to respond to inquiries and facilitate market research.",
        features: ["24/7 Availability", "Query Resolution", "Client Capture"],
        icon: "zap",
      },
    ],
  },
  workflow: {
    subtitle: "Steps to Success",
    title: "How To Choose a Call Center vendor",
    features: [
      {
        icon: "globe",
        title: "Assess industry experience",
        description:
          "Look for organizations that specifically cater to real estate businesses and professionals.",
      },
      {
        icon: "users",
        title: "Review agent training",
        description:
          "Inquire about how agents are hired and trained to ensure they offer a high standard of support.",
      },
      {
        icon: "zap",
        title: "Explore service offerings",
        description:
          "If you're looking to scale your business, you need a call center team that can handle a wide variety of services.",
      },
    ],
    showcaseImage: {
      src: "/assets/real-estate-02.jpg",
      alt: "Real Estate Operations",
    },
    terminal: {
      initCommand: "ssh admin@confiebpo.com",
      preparingMessage: "Initializing secure BPO channels...",
      optimizingLabel: "ROI Optimization",
      successLines: ["Support Connected", "Lead Pipeline Active"],
      latencyLabel: "Response Time",
      latencyValue: "99.9",
      latencyUnit: "%",
    },
  },
  faq: {
    subtitle: "Common Questions",
    title: "Frequently Asked Questions",
    items: [
      {
        id: 1,
        question: "Who Can Benefit From Real Estate Outsourcing?",
        answer:
          "Property agents, agencies, and businesses looking to streamline their back-office tasks and client outreach needs.",
      },
      {
        id: 2,
        question:
          "How Can I Get Started With Outsourcing for my Real Estate Company?",
        answer:
          "Book a consultation with our experts to assess your requirements and build a custom outsourcing strategy.",
      },
      {
        id: 3,
        question: "How Are Real Estate Call Center Representatives Trained?",
        answer:
          "Agents undergo extensive training on real estate industry standards, customer service, and specific brand communication protocols.",
      },
      {
        id: 4,
        question: "What Should I Look for in a Real Estate Call Center?",
        answer:
          "Industry-specific knowledge, scalable support, data security, and a proven track record of handling real estate leads.",
      },
    ],
  },
  cta: {
    headlineLine1: "Start Your Journey to Savings & Growth with",
    headlineAccent: "Confie BPO Today",
    primaryLabel: "Calculate your Cost",
    secondaryLabel: "Improve your ROI",
    footnote: "This is an advertisement. All rights reserved.",
  },
  imageSections: [
    {
      title: "The Future of Call Centers for Real Estate",
      description:
        "The property industry has already changed significantly, incorporating more automated, digital technologies and AI tools.",
      bullets: [
        {
          label: "AI & Machine Learning",
          detail:
            "Investing in technologies to respond to client inquiries and facilitate market research.",
        },
        {
          label: "Database Updates",
          detail:
            "Streamlining updates to real estate databases with the latest property information.",
        },
      ],
      closingText:
        "Keep up with this growth as BPO teams invest in the future of real estate services.",
      imageSrc: "/assets/real-estate-01.jpg",
      imageAlt: "Digital Real Estate Concepts",
      imagePosition: "left",
    },
    {
      title: "Challenges of BPO in Real Estate",
      description:
        "Switching to an outsourced solution involves addressing potential drawbacks to ensure a successful transition.",
      bullets: [
        {
          label: "Industry Knowledge",
          detail:
            "Finding a vendor with deep expertise in real estate nuances and processes.",
        },
        {
          label: "Brand Inconsistency",
          detail:
            "Ensuring your BPO partner abides by your specific communication standards and internal processes.",
        },
      ],
      closingText:
        "Being proactive about common issues helps you streamline your BPO transition.",
      imageSrc: "/assets/real-estate.jpg",
      imageAlt: "Real Estate Business Challenges",
      imagePosition: "right",
    },
  ],
};

function RouteComponent() {
  return <BPOPage {...pageData} />;
}
