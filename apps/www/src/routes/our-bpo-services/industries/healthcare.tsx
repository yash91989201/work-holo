import { createFileRoute } from "@tanstack/react-router";
import BPOPage, {
  type WebPageProps,
} from "@/components/our-bpo-services/bpo-detail-page";

export const Route = createFileRoute("/our-bpo-services/industries/healthcare")(
  {
    component: RouteComponent,
  }
);

const pageData: WebPageProps = {
  hero: {
    badge: "Healthcare Call Center Services",
    headlineLine1: "Call Center for",
    headlineAccent: "Healthcare Services",
    description:
      "At Confie BPO, we have a proven track record. Our call center works with a variety of clients in healthcare and related fields to drive administrative and cost savings to the next level.",
    primaryCta: {
      label: "Book Your Consultation",
      href: "/contact-us",
    },
    image: {
      src: "/assets/healthcare-02.jpg",
      alt: "Healthcare industry support",
    },
    terminalCommand: "Talk to Our Experts",
    terminalMessage: "Improve your ROI",
  },
  stats: [
    {
      label: "Years Experience",
      value: "10+",
    },
    {
      label: "HIPAA Compliance",
      value: "100%",
    },
    {
      label: "Medical Accuracy",
      value: "99.9%",
    },
    {
      label: "Patients Supported",
      value: "1M+",
    },
  ],
  services: {
    subtitle: "BPO Functions",
    title: "BPO Functions in the Healthcare Industry",
    description:
      "BPO call center agents handle vital administrative tasks, freeing your staff for hands-on patient care.",
    items: [
      {
        id: "s1",
        number: "01",
        title: "Medical Coding and Billing",
        description:
          "Processing billing and answering calls about invoicing from patients and insurance companies.",
        features: [
          "Invoicing support",
          "Insurance coordination",
          "Billing processing",
        ],
        icon: "chart",
      },
      {
        id: "s2",
        number: "02",
        title: "Data Entry",
        description:
          "Process patient health assessments, lab reports, test results and prescription information.",
        features: ["Health assessments", "Lab reports", "Test results"],
        icon: "zap",
      },
      {
        id: "s3",
        number: "03",
        title: "Medical Transcription",
        description:
          "Transcribing audio files into text files to process information in an efficient and confidential manner.",
        features: [
          "Audio to text",
          "Confidential processing",
          "Professional transcription",
        ],
        icon: "users",
      },
    ],
  },
  workflow: {
    subtitle: "Process Guide",
    title: "How to Choose the Best Call Center",
    features: [
      {
        icon: "users",
        title: "Understand your needs",
        description:
          "Have your stakeholders map out what you want and expect from your call center.",
      },
      {
        icon: "shield",
        title: "Healthcare experience",
        description:
          "Target call centers with experience working in the healthcare industry.",
      },
      {
        icon: "chart",
        title: "Ask for quotes",
        description:
          "Ask relevant BPO companies for quotation models adapted to your specific company.",
      },
    ],
    showcaseImage: {
      src: "/assets/healthcare-02.jpg",
      alt: "Healthcare professionals collaborating",
    },
    terminal: {
      initCommand: "npm run start-bpo",
      preparingMessage: "Optimizing Patient Care Channels...",
      optimizingLabel: "ROI Optimization",
      successLines: ["Compliance: HIPAA Validated", "Accuracy: 99.9% Verified"],
      latencyLabel: "Response Time",
      latencyValue: "0.5",
      latencyUnit: "ms",
    },
  },
  faq: {
    subtitle: "Outsourcing Answers",
    title: "Healthcare Call Center FAQs",
    items: [
      {
        id: 1,
        question: "What is a Healthcare Call Center?",
        answer:
          "A call center for healthcare services handles many tasks in a medical facility not associated with direct patient care.",
      },
      {
        id: 2,
        question: "What Type of Medical Facility Benefits?",
        answer:
          "Clients include hospitals, medical practices, health insurance providers and more.",
      },
      {
        id: 3,
        question: "What are the Benefits to Outsourcing?",
        answer:
          "Focus on your most important priority: your patients. Includes saving money and staying up to date on compliance.",
      },
    ],
  },
  cta: {
    headlineLine1: "Find Out What Others Already Know About the",
    headlineAccent: "Benefits of Confie BPO",
    primaryLabel: "Calculate your Cost",
    secondaryLabel: "Improve your ROI",
    footnote: "Trade/service marks are the property of Confie Holding II Co.",
  },
  imageSections: [
    {
      title: "Why is Confie BPO Different?",
      description:
        "We know you have plenty of options. Our affordable services stand out through technology and human touch.",
      bullets: [
        {
          label: "Accuracy",
          detail:
            "Transactional and Financial Accuracy using latest automated technology.",
        },
        {
          label: "Service",
          detail:
            "Excellent Customer Service where human touch is still vitally important.",
        },
        {
          label: "Productivity",
          detail: "Optimized Productivity for claims, billing, and data entry.",
        },
      ],
      closingText:
        "Our mission is to drive your administrative and cost savings to the next level.",
      imageSrc: "/assets/healthcare.avif",
      imageAlt: "Streamlined medical services overview",
      imagePosition: "left",
    },
  ],
};

function RouteComponent() {
  return <BPOPage {...pageData} />;
}
