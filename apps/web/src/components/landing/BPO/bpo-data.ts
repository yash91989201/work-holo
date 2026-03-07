import type { ReactNode } from "react";

export interface BpoPageData {
  /** Page slug for routing */
  slug: string;
  /** Main heading, e.g. "Customer Retention" */
  title: string;
  /** Subtitle below the heading */
  subtitle: string;
  /** Hero image path */
  heroImage: string;
  /** Overview paragraph(s) */
  overview: string;
  /** 4 key capabilities with icon labels */
  keyCapabilities: string[];
  /** 4 business benefits */
  businessBenefits: string[];
  /** 3 proven result stats */
  provenResults: { value: string; label: string }[];
  /** Why Choose Workholo items (3) */
  whyChoose: { title: string; description: string }[];
}

/* ─────── Shared "Why Choose" items (same across all pages) ─────── */
const sharedWhyChoose: BpoPageData["whyChoose"] = [
  {
    title: "Expert Teams",
    description:
      "Highly trained professionals dedicated to your specific industry and service needs.",
  },
  {
    title: "Scalable Solutions",
    description:
      "Easily scale your operations up or down based on seasonal demands or business growth.",
  },
  {
    title: "Advanced Technology",
    description:
      "Powered by the latest AI and communication tools to ensure maximum efficiency.",
  },
];

/* ═══════════════════════════════════════════════════
   Individual BPO page data
   ═══════════════════════════════════════════════════ */

export const bpoPages: BpoPageData[] = [
  /* ── Outbound Services ── */
  {
    slug: "customer-retention",
    title: "Customer Retention",
    subtitle: "Keep your most valuable customers loyal and satisfied.",
    heroImage: "/bpo/customer-retention.webp",
    overview:
      "Our proactive customer retention strategies are designed to reduce churn, increase customer lifetime value, and turn your existing customers into brand advocates. We use data-driven insights and personalized engagement to keep your audience connected to your brand.",
    keyCapabilities: [
      "Proactive Outreach Campaigns",
      "Churn Prediction & Prevention",
      "Loyalty Program Management",
      "Customer Feedback & Surveys",
    ],
    businessBenefits: [
      "Increase customer lifetime value (CLV)",
      "Reduce customer churn rates significantly",
      "Enhance brand loyalty and advocacy",
      "Identify and resolve pain points early",
    ],
    provenResults: [
      { value: "25%", label: "Average Churn Reduction" },
      { value: "+15 pts", label: "CSAT Improvement" },
      { value: "300%", label: "ROI on Retention" },
    ],
    whyChoose: sharedWhyChoose,
  },
  {
    slug: "outbound-sales",
    title: "Outbound Sales",
    subtitle:
      "Targeted outreach campaigns designed to convert prospects.",
    heroImage: "/bpo/outbound-sales.webp",
    overview:
      "Accelerate your revenue growth with our expert outbound sales teams. We handle the entire sales cycle, from cold calling and email outreach to appointment setting and closing deals, acting as a seamless extension of your internal team.",
    keyCapabilities: [
      "Cold Calling & Email Outreach",
      "Appointment Setting",
      "Account-Based Marketing (ABM)",
      "Sales Pipeline Management",
    ],
    businessBenefits: [
      "Accelerate sales cycles",
      "Scale outreach without adding internal headcount",
      "Penetrate new markets quickly",
      "Consistent and predictable pipeline generation",
    ],
    provenResults: [
      { value: "3x", label: "MEETINGS BOOKED" },
      { value: "12%", label: "CONVERSION RATE" },
      { value: "+40%", label: "REVENUE GROWTH" },
    ],
    whyChoose: sharedWhyChoose,
  },
  {
    slug: "lead-generation",
    title: "Lead Generation",
    subtitle:
      "Build a robust pipeline of qualified opportunities.",
    heroImage: "/bpo/lead-generation.webp",
    overview:
      "Fuel your sales engine with high-quality, pre-qualified leads. Our lead generation specialists use advanced targeting and multi-channel strategies to identify and engage decision-makers who are ready to buy.",
    keyCapabilities: [
      "B2B & B2C Lead Generation",
      "Lead Qualification & Scoring",
      "Market Research & Profiling",
      "Multi-Channel Prospecting",
    ],
    businessBenefits: [
      "Focus your sales team on closing, not prospecting",
      "Higher quality, sales-ready leads",
      "Data-driven targeting for better ROI",
      "Scalable lead volume based on your capacity",
    ],
    provenResults: [
      { value: "+150%", label: "LEAD VOLUME" },
      { value: "-30%", label: "COST PER LEAD" },
      { value: "45%", label: "SALES QUALIFIED LEADS" },
    ],
    whyChoose: sharedWhyChoose,
  },

  /* ── Inbound Services ── */
  {
    slug: "customer-service",
    title: "Customer Service",
    subtitle:
      "Round-the-clock support delivering exceptional experiences.",
    heroImage: "/bpo/customer-service.webp",
    overview:
      "Provide your customers with 24/7, omnichannel support. Our highly trained agents deliver empathetic, efficient, and personalized assistance across phone, email, live chat, and social media, ensuring every interaction strengthens your brand.",
    keyCapabilities: [
      "24/7 Omnichannel Support",
      "Multilingual Capabilities",
      "Order Management & Tracking",
      "Issue Resolution & Escalation",
    ],
    businessBenefits: [
      "Always-on support for global customers",
      "Consistent brand voice across all channels",
      "Reduced wait times and faster resolutions",
      "Scalable team sizes for seasonal peaks",
    ],
    provenResults: [
      { value: "85%", label: "FIRST CALL RESOLUTION" },
      { value: "< 30s", label: "AVERAGE SPEED TO ANSWER" },
      { value: "95%", label: "CUSTOMER SATISFACTION" },
    ],
    whyChoose: sharedWhyChoose,
  },
  {
    slug: "technical-support",
    title: "Technical Support",
    subtitle:
      "Expert troubleshooting and issue resolution.",
    heroImage: "/bpo/technical-support.webp",
    overview:
      "Keep your users up and running with our tiered technical support services. From basic troubleshooting (Tier 1) to complex issue resolution (Tier 3), our tech-savvy agents provide fast and accurate solutions for software, hardware, and IT services.",
    keyCapabilities: [
      "Tier 1, 2, and 3 Support",
      "Helpdesk & Ticketing Management",
      "Remote Desktop Assistance",
      "Software & Hardware Troubleshooting",
    ],
    businessBenefits: [
      "Reduce downtime for your users",
      "Free up your internal engineering resources",
      "Detailed issue tracking and reporting",
      "Continuous knowledge base improvement",
    ],
    provenResults: [
      { value: "-40%", label: "RESOLUTION TIME" },
      { value: "< 10%", label: "ESCALATION RATE" },
      { value: "92%", label: "USER SATISFACTION" },
    ],
    whyChoose: sharedWhyChoose,
  },
  {
    slug: "payment-processing",
    title: "Payment Processing",
    subtitle:
      "Secure and efficient handling of transactions.",
    heroImage: "/bpo/payment-processing.webp",
    overview:
      "Ensure smooth and secure financial transactions with our payment processing support. We handle billing inquiries, process refunds, manage subscriptions, and assist customers with payment-related issues, all while maintaining strict PCI compliance.",
    keyCapabilities: [
      "Billing & Invoice Inquiries",
      "Refund & Dispute Management",
      "Subscription Management",
      "PCI Compliant Operations",
    ],
    businessBenefits: [
      "Reduce payment disputes and chargebacks",
      "Ensure strict compliance and data security",
      "Improve cash flow with faster resolutions",
      "Enhance customer trust during transactions",
    ],
    provenResults: [
      { value: "99.9%", label: "PROCESSING ACCURACY" },
      { value: "-50%", label: "DISPUTE RESOLUTION TIME" },
      { value: "100%", label: "PCI COMPLIANCE" },
    ],
    whyChoose: sharedWhyChoose,
  },

  /* ── Other Services ── */
  {
    slug: "accounting-and-collections",
    title: "Accounting and Collections",
    subtitle:
      "Professional financial management and debt recovery.",
    heroImage: "/bpo/accounting-collections.webp",
    overview:
      "Improve your cash flow and maintain positive customer relationships with our professional accounting and collections services. We handle accounts receivable, accounts payable, and respectful debt recovery with a focus on compliance and brand protection.",
    keyCapabilities: [
      "Accounts Receivable & Payable",
      "First & Third-Party Collections",
      "Payment Plan Negotiation",
      "Financial Reporting & Reconciliation",
    ],
    businessBenefits: [
      "Accelerate cash flow and reduce DSO",
      "Maintain positive customer relationships during recovery",
      "Reduce internal administrative burden",
      "Ensure compliance with collection regulations",
    ],
    provenResults: [
      { value: "+35%", label: "RECOVERY RATE" },
      { value: "-20 Days", label: "DAYS SALES OUTSTANDING" },
      { value: "100%", label: "COMPLIANCE RATE" },
    ],
    whyChoose: sharedWhyChoose,
  },
  {
    slug: "inbound-sales",
    title: "Inbound Sales",
    subtitle:
      "Converting incoming inquiries into revenue.",
    heroImage: "/bpo/inbound-sales.webp",
    overview:
      "Maximize the ROI of your marketing efforts by turning inbound calls, chats, and emails into sales. Our consultative sales agents are trained to cross-sell, up-sell, and guide prospects through the buying journey to close deals efficiently.",
    keyCapabilities: [
      "Order Taking & Processing",
      "Cross-selling & Up-selling",
      "Product Information & Guidance",
      "Lead Conversion",
    ],
    businessBenefits: [
      "Maximize ROI on marketing spend",
      "Increase average order value (AOV)",
      "Provide a seamless buying experience",
      "Capture sales opportunities 24/7",
    ],
    provenResults: [
      { value: "28%", label: "CONVERSION RATE" },
      { value: "+22%", label: "AVERAGE ORDER VALUE" },
      { value: "15%", label: "ABANDONED CART RECOVERY" },
    ],
    whyChoose: sharedWhyChoose,
  },
  {
    slug: "facility-and-procurement",
    title: "Facility and Procurement",
    subtitle:
      "Streamlined management of assets and vendors.",
    heroImage: "/bpo/facility-procurement.webp",
    overview:
      "Optimize your operational efficiency with our facility and procurement support. We assist with vendor management, purchase order processing, inventory tracking, and facility maintenance coordination, allowing you to focus on your core business.",
    keyCapabilities: [
      "Vendor & Supplier Management",
      "Purchase Order Processing",
      "Inventory & Asset Tracking",
      "Facility Maintenance Support",
    ],
    businessBenefits: [
      "Reduce operational overhead",
      "Improve vendor relationships and terms",
      "Ensure accurate inventory levels",
      "Streamline procurement workflows",
    ],
    provenResults: [
      { value: "-30%", label: "PROCUREMENT CYCLE TIME" },
      { value: "18%", label: "COST SAVINGS" },
      { value: "99%", label: "ORDER ACCURACY" },
    ],
    whyChoose: sharedWhyChoose,
  },
  {
    slug: "direct-response-marketing",
    title: "Direct Response Marketing",
    subtitle:
      "Handling high-volume responses with precision.",
    heroImage: "/bpo/direct-response-marketing.webp",
    overview:
      "Ensure no lead is left behind during your marketing campaigns. Our scalable teams are equipped to handle high volumes of calls, emails, and messages generated by TV, radio, digital, and print direct response campaigns.",
    keyCapabilities: [
      "Campaign Response Handling",
      "Scalable Staffing for Spikes",
      "Lead Capture & Qualification",
      "Campaign Performance Tracking",
    ],
    businessBenefits: [
      "Never miss a lead during campaign spikes",
      "Real-time campaign performance data",
      "Seamless integration with your CRM",
      "Rapid scaling up or down as needed",
    ],
    provenResults: [
      { value: "< 15s", label: "RESPONSE TIME" },
      { value: "98%", label: "LEAD CAPTURE RATE" },
      { value: "+45%", label: "CAMPAIGN ROI" },
    ],
    whyChoose: sharedWhyChoose,
  },
  {
    slug: "back-office-processing",
    title: "Back Office Processing",
    subtitle:
      "Efficient administrative and operational support.",
    heroImage: "/bpo/back-office-processing.webp",
    overview:
      "Streamline your operations and reduce overhead with our comprehensive back-office processing services. We handle data entry, document management, transcription, and other administrative tasks with high accuracy and quick turnaround times.",
    keyCapabilities: [
      "Data Entry & Processing",
      "Document Management & Digitization",
      "Transcription Services",
      "Quality Assurance & Compliance",
    ],
    businessBenefits: [
      "Reduce administrative bottlenecks",
      "Improve data accuracy and accessibility",
      "Lower operational costs significantly",
      "Free up core staff for strategic tasks",
    ],
    provenResults: [
      { value: "2x", label: "PROCESSING SPEED" },
      { value: "99.9%", label: "DATA ACCURACY" },
      { value: "40%", label: "COST REDUCTION" },
    ],
    whyChoose: sharedWhyChoose,
  },
  {
    slug: "claims-processing",
    title: "Claims Processing",
    subtitle:
      "Accurate and timely handling of claims.",
    heroImage: "/bpo/claims-processing.webp",
    overview:
      "Accelerate your claims processing cycle with our specialized back-office teams. We handle insurance, warranty, and rebate claims efficiently, ensuring accuracy, compliance, and a smooth experience for your customers.",
    keyCapabilities: [
      "Insurance & Warranty Claims",
      "Rebate Processing",
      "Document Verification",
      "Fraud Detection Support",
    ],
    businessBenefits: [
      "Faster claim resolution times",
      "Higher accuracy in claim adjudication",
      "Improved customer satisfaction during stressful times",
      "Robust fraud detection and prevention",
    ],
    provenResults: [
      { value: "-60%", label: "TURNAROUND TIME" },
      { value: "99.5%", label: "PROCESSING ACCURACY" },
      { value: "90%", label: "CUSTOMER SATISFACTION" },
    ],
    whyChoose: sharedWhyChoose,
  },
  {
    slug: "healthcare-life-sciences",
    title: "Healthcare & Life Sciences",
    subtitle: "Compliant and compassionate support.",
    heroImage: "/bpo/healthcare-life-sciences.webp",
    overview:
      "Deliver exceptional patient experiences with our HIPAA-compliant healthcare BPO services. We provide patient scheduling, medical billing support, telehealth assistance, and compassionate customer service for healthcare providers and life sciences organizations.",
    keyCapabilities: [
      "Patient Scheduling & Registration",
      "Medical Billing & Claims Support",
      "Telehealth Technical Assistance",
      "HIPAA Compliant Operations",
    ],
    businessBenefits: [
      "Ensure strict HIPAA compliance",
      "Improve patient satisfaction and care access",
      "Reduce administrative burden on medical staff",
      "Accelerate revenue cycle management",
    ],
    provenResults: [
      { value: "98%", label: "BILLING ACCURACY" },
      { value: "94%", label: "PATIENT SATISFACTION" },
      { value: "< 2%", label: "CALL ABANDONMENT" },
    ],
    whyChoose: sharedWhyChoose,
  },
  {
    slug: "banking-financial-services",
    title: "Banking & Financial Services",
    subtitle: "Secure, accurate, and highly regulated services.",
    heroImage: "/bpo/banking-financial-services.webp",
    overview:
      "Maintain trust and compliance with our specialized financial BPO services. We offer secure customer support, fraud detection assistance, loan processing support, and account management for banks, fintechs, and financial institutions.",
    keyCapabilities: [
      "Account Management & Support",
      "Fraud Detection & Prevention",
      "Loan Processing Assistance",
      "Regulatory Compliance Support",
    ],
    businessBenefits: [
      "Maintain strict regulatory compliance",
      "Enhance fraud detection capabilities",
      "Provide secure and reliable customer support",
      "Streamline loan and account processing",
    ],
    provenResults: [
      { value: "+40%", label: "FRAUD PREVENTION" },
      { value: "-35%", label: "PROCESSING TIME" },
      { value: "100%", label: "COMPLIANCE RATE" },
    ],
    whyChoose: sharedWhyChoose,
  },
  {
    slug: "retail-ecommerce",
    title: "Retail & E-commerce",
    subtitle: "Scalable solutions for seamless shopping experiences.",
    heroImage: "/bpo/retail-ecommerce.webp",
    overview:
      "Enhance your customer journey from browsing to unboxing. Our retail BPO services handle order inquiries, returns management, omnichannel support, and seasonal volume spikes to ensure your e-commerce operations run smoothly year-round.",
    keyCapabilities: [
      "Order & Returns Management",
      "Omnichannel Customer Support",
      "Seasonal Scalability",
      "Product Information Assistance",
    ],
    businessBenefits: [
      "Handle seasonal volume spikes effortlessly",
      "Provide a unified omnichannel experience",
      "Reduce return rates through better support",
      "Increase customer lifetime value",
    ],
    provenResults: [
      { value: "92%", label: "CSAT SCORE" },
      { value: "< 1 min", label: "RESPONSE TIME" },
      { value: "88%", label: "RESOLUTION RATE" },
    ],
    whyChoose: sharedWhyChoose,
  },
  {
    slug: "technology-telecom",
    title: "Technology & Telecom",
    subtitle: "Tech-savvy support for software and hardware.",
    heroImage: "/bpo/technology-telecom.webp",
    overview:
      "Support your users with expert technical assistance. We provide Tier 1-3 tech support, customer onboarding, subscription management, and billing support for SaaS companies, hardware manufacturers, and telecommunications providers.",
    keyCapabilities: [
      "Tiered Technical Support",
      "Customer Onboarding & Success",
      "Subscription & Billing Management",
      "Hardware Troubleshooting",
    ],
    businessBenefits: [
      "Improve user onboarding and adoption",
      "Reduce churn for SaaS products",
      "Provide expert technical troubleshooting",
      "Scale support alongside user growth",
    ],
    provenResults: [
      { value: "95%", label: "ONBOARDING SUCCESS" },
      { value: "20%", label: "CHURN REDUCTION" },
      { value: "75%", label: "FIRST CONTACT RESOLUTION" },
    ],
    whyChoose: sharedWhyChoose,
  },
  {
    slug: "travel-hospitality",
    title: "Travel & Hospitality",
    subtitle: "Multilingual, 24/7 assistance for travelers.",
    heroImage: "/bpo/travel-hospitality.webp",
    overview:
      "Provide world-class support for travelers around the globe. Our hospitality BPO services handle reservations, itinerary changes, loyalty program management, and disruption assistance with 24/7 multilingual capabilities.",
    keyCapabilities: [
      "Reservations & Booking Support",
      "Itinerary Management & Changes",
      "Loyalty Program Support",
      "24/7 Multilingual Assistance",
    ],
    businessBenefits: [
      "Provide 24/7 global support",
      "Handle travel disruptions efficiently",
      "Increase booking conversions",
      "Enhance loyalty program engagement",
    ],
    provenResults: [
      { value: "+18%", label: "BOOKING CONVERSION" },
      { value: "15+", label: "LANGUAGE SUPPORT" },
      { value: "93%", label: "CUSTOMER SATISFACTION" },
    ],
    whyChoose: sharedWhyChoose,
  },
  {
    slug: "manufacturing-logistics",
    title: "Manufacturing & Logistics",
    subtitle: "Supply chain support and B2B customer service.",
    heroImage: "/bpo/manufacturing-logistics.webp",
    overview:
      "Streamline your supply chain and improve B2B relationships. We offer order processing, logistics coordination, vendor management, and dedicated B2B customer support for manufacturing and logistics companies.",
    keyCapabilities: [
      "B2B Order Processing",
      "Logistics & Tracking Support",
      "Vendor & Supplier Coordination",
      "Supply Chain Helpdesk",
    ],
    businessBenefits: [
      "Streamline B2B order processing",
      "Improve supply chain visibility",
      "Enhance vendor and supplier relationships",
      "Reduce operational bottlenecks",
    ],
    provenResults: [
      { value: "99.8%", label: "ORDER ACCURACY" },
      { value: "-40%", label: "PROCESSING TIME" },
      { value: "90%", label: "VENDOR SATISFACTION" },
    ],
    whyChoose: sharedWhyChoose,
  },
];

/** Look up a BPO page by its slug */
export function getBpoPageBySlug(slug: string): BpoPageData | undefined {
  return bpoPages.find((p) => p.slug === slug);
}
