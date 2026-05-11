import {
  IconBrain,
  IconBrandAndroid,
  IconBrandFlutter,
  IconBrandReact,
  IconBuildingBank,
  IconCloud,
  IconCloudComputing,
  IconCode,
  IconDeviceMobile,
  IconRobot,
} from "@tabler/icons-react";

export interface ProjectFAQ {
  answer: string;
  question: string;
}

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectResult {
  description: string;
  stat: string;
  title: string;
}

export interface TimelinePhase {
  description: string;
  label: string;
  title: string;
}

export interface ProjectPageData {
  category: string;
  challenge: string;
  client: string;
  description: string;
  duration: string;
  faqs: ProjectFAQ[];
  features: string[];
  galleryImages: string[];
  heroImage: string;
  metrics: ProjectMetric[];
  overview: string;
  results: ProjectResult[];
  slug: string;
  solution: string;
  subtitle: string;
  techStack: string[];
  timeline: TimelinePhase[];
  title: string;
}

export interface ProjectListItem {
  category: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  image?: string;
  isActive: boolean;
  slug: string;
  subtitle: string;
  title: string;
}

const projectList = [
  {
    slug: "health-track-pro",
    title: "HealthTrack Pro",
    icon: <IconDeviceMobile className="size-6" />,
  },
  {
    slug: "finflow-dashboard",
    title: "FinFlow Dashboard",
    icon: <IconBuildingBank className="size-6" />,
  },
  {
    slug: "ai-support-bot",
    title: "AI Support Bot",
    icon: <IconRobot className="size-6" />,
  },
  {
    slug: "cloud-sync-platform",
    title: "CloudSync Platform",
    icon: <IconCloud className="size-6" />,
  },
  {
    slug: "ecommerce-replatform",
    title: "E-Commerce Replatform",
    icon: <IconCode className="size-6" />,
  },
  {
    slug: "ml-prediction-engine",
    title: "ML Prediction Engine",
    icon: <IconBrain className="size-6" />,
  },
  {
    slug: "real-time-collaboration",
    title: "Real-Time Collaboration",
    icon: <IconBrandReact className="size-6" />,
  },
  {
    slug: "datapulse-saas",
    title: "DataPulse SaaS",
    icon: <IconCode className="size-6" />,
  },
  {
    slug: "healthconnect-enterprise-portal",
    title: "HealthConnect Portal",
    icon: <IconCloudComputing className="size-6" />,
  },
  {
    slug: "fooddash-flutter",
    title: "FoodDash",
    icon: <IconBrandFlutter className="size-6" />,
  },
  {
    slug: "paymate-react-native",
    title: "PayMate",
    icon: <IconBuildingBank className="size-6" />,
  },
  {
    slug: "fitforce-android",
    title: "FitForce",
    icon: <IconBrandAndroid className="size-6" />,
  },
  {
    slug: "devops-pipeline-pro",
    title: "DevOps Pipeline Pro",
    icon: <IconCloud className="size-6" />,
  },
  {
    slug: "cloudwatch-pro",
    title: "CloudWatch Pro",
    icon: <IconCloudComputing className="size-6" />,
  },
];

export function getProjectList(currentSlug?: string) {
  return projectList.map((p) => ({
    ...p,
    href: `/projects/${p.slug}`,
    isActive: p.slug === currentSlug,
    category: getProjectData(p.slug)?.category ?? "",
    subtitle: getProjectData(p.slug)?.subtitle ?? "",
    description: getProjectData(p.slug)?.description ?? "",
    image: getProjectData(p.slug)?.heroImage ?? "",
  }));
}

const projectsData: Record<string, ProjectPageData> = {
  "health-track-pro": {
    slug: "health-track-pro",
    title: "HealthTrack Pro",
    subtitle: "Health Monitoring Mobile Platform",
    category: "Mobile Development",
    client: "VitaCare Health",
    duration: "4 months",
    description:
      "A HIPAA-inspired mobile platform enabling real-time health monitoring, wearable device integration, and AI-powered health insights for clinics and diagnostic centres across Tier 1 Indian cities.",
    heroImage: "/images/projects/health-track-pro-hero.jpg",
    overview:
      "HealthTrack Pro is a health monitoring platform designed for mid-sized healthcare providers in India. It integrates with common wearables, provides real-time health metrics, and uses AI to flag anomalies early. The platform currently serves 1,200+ patients across 3 clinic networks in Bengaluru and Hyderabad.",
    challenge:
      "VitaCare Health needed to consolidate fragmented patient data from various wearables and clinic systems into a unified, secure platform. Real-time data synchronisation and legacy system integration posed significant technical challenges on a lean budget.",
    solution:
      "Built a React Native cross-platform app with a Node.js backend. Implemented end-to-end encryption, OAuth 2.0 for authentication, and a FHIR-inspired API layer for clinic EHR integration. The AI engine processes 18,000+ data points daily using TensorFlow Lite on-device inference.",
    galleryImages: [
      "/images/projects/health-track-pro-1.jpg",
      "/images/projects/health-track-pro-2.jpg",
    ],
    features: [
      "Real-time wearable integration (Apple Watch, Mi Band, boAt)",
      "AI-powered anomaly detection with 88% accuracy",
      "Clinic EHR data synchronisation",
      "End-to-end encryption for patient data",
      "Customisable health dashboards for clinical staff",
      "Offline-first architecture with background sync",
      "Multi-language support (Hindi, Telugu, Kannada, English)",
      "Teleconsultation video integration",
    ],
    metrics: [
      { label: "Active Users", value: "1.2K+" },
      { label: "Data Points / Day", value: "18K+" },
      { label: "Uptime", value: "99.2%" },
      { label: "Anomaly Detection", value: "88%" },
    ],
    results: [
      {
        stat: "22%",
        title: "Reduction in Missed Follow-ups",
        description:
          "Early anomaly detection enabled proactive interventions, reducing missed follow-up appointments by 22% across participating clinic networks.",
      },
      {
        stat: "40%",
        title: "Faster Clinical Decision Making",
        description:
          "Unified dashboards gave clinicians instant access to patient history, reducing average consultation prep time from 20 minutes to 12 minutes.",
      },
      {
        stat: "₹3.2L",
        title: "Annual Savings in Admin Overhead",
        description:
          "Digitising patient record management eliminated manual paperwork, saving ₹3.2L annually in administrative costs across 3 clinic locations.",
      },
    ],
    techStack: [
      "React Native",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "TensorFlow Lite",
      "AWS Lambda",
      "CloudFront",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Discovery & Audit",
        description:
          "Mapped existing clinic workflows, identified integration points, and documented patient data management requirements across 3 clinic networks.",
      },
      {
        label: "Phase 2",
        title: "Architecture & Design",
        description:
          "Designed offline-first architecture with real-time sync, built API layer for clinic EHR integration, and prototyped AI anomaly detection pipeline.",
      },
      {
        label: "Phase 3",
        title: "Development & Testing",
        description:
          "Built React Native app with TensorFlow Lite on-device inference. Ran data security audits and clinical user acceptance testing.",
      },
      {
        label: "Phase 4",
        title: "Launch & Scale",
        description:
          "Phased rollout across 3 clinic networks. Scaled to 1.2K+ active users within 6 weeks of launch.",
      },
    ],
    faqs: [
      {
        question: "How does the wearable device integration work?",
        answer:
          "Our platform uses Bluetooth Low Energy (BLE) to connect with compatible wearables. We support Apple HealthKit, Google Fit, and common Indian fitness bands, normalising all data into our unified schema regardless of the source device.",
      },
      {
        question: "Is patient data kept secure?",
        answer:
          "Yes, all patient data is encrypted end-to-end. We implement role-based access controls, audit logging, and regular security reviews. Our infrastructure is hosted on AWS with data residency in the ap-south-1 (Mumbai) region.",
      },
      {
        question: "Can it integrate with our existing clinic software?",
        answer:
          "We have built integrations for common Indian clinic management systems. For legacy or custom setups, our team can build a tailored integration through our professional services offering.",
      },
      {
        question: "How does the AI anomaly detection work?",
        answer:
          "The AI engine uses a combination of rule-based thresholds and machine learning models trained on anonymised health data. It runs on-device using TensorFlow Lite for privacy, with cloud fallback for complex cases.",
      },
      {
        question: "What is the typical deployment timeline?",
        answer:
          "A standard deployment for a clinic network takes 4–6 weeks. This includes environment setup, EHR integration, staff training, and phased rollout.",
      },
    ],
  },
  "finflow-dashboard": {
    slug: "finflow-dashboard",
    title: "FinFlow Dashboard",
    subtitle: "Financial Analytics & Reporting Platform",
    category: "Web Development",
    client: "Meridian Capital Partners",
    duration: "5 months",
    description:
      "A financial analytics dashboard processing ₹45L+ in daily transactions, featuring real-time charts, risk scoring, and automated reporting for a Bengaluru-based investment advisory firm.",
    heroImage: "/images/projects/finflow-dashboard-hero.jpg",
    overview:
      "FinFlow Dashboard replaced manual Excel-based reporting for a growing Bengaluru investment advisory firm. It processes ₹45L+ in daily transactions, delivers sub-300ms latency, and provides portfolio managers with real-time visibility across domestic equity and debt instruments.",
    challenge:
      "The client relied on nightly Excel reports, causing advisors to miss critical intraday movements. Fragmented data sources and the need for SEBI-aligned reporting made modernisation complex on a startup-friendly budget.",
    solution:
      "Designed a modular React + WebSocket architecture streaming data from a Node.js backend. Built custom Recharts visualisations optimised for 1,000+ data points. Implemented role-based access and audit trails for regulatory alignment, achieving sub-300ms end-to-end latency.",
    galleryImages: [
      "/images/projects/finflow-dashboard-1.jpg",
      "/images/projects/finflow-dashboard-2.jpg",
    ],
    features: [
      "Real-time data streaming via WebSocket (sub-300ms latency)",
      "Interactive charts with 1,000+ point rendering",
      "Custom risk scoring with explainable outputs",
      "Multi-asset portfolio management (Equity, MF, Bonds)",
      "Automated SEBI-aligned reporting templates",
      "Role-based dashboards for advisors and compliance",
      "Full audit trail and data lineage tracking",
      "Mobile-responsive design for on-the-go access",
    ],
    metrics: [
      { label: "Daily Volume", value: "₹45L+" },
      { label: "Latency", value: "<300ms" },
      { label: "Data Points Live", value: "1K+" },
      { label: "Uptime", value: "99.1%" },
    ],
    results: [
      {
        stat: "70%",
        title: "Faster Decision Making",
        description:
          "Real-time dashboards reduced the time from data availability to advisory decision from 90 minutes to 25 minutes on average.",
      },
      {
        stat: "₹8.5L",
        title: "Annual Cost Reduction",
        description:
          "Replaced manual processes and legacy spreadsheet workflows, delivering ₹8.5L in annual operational savings across the advisory desk.",
      },
      {
        stat: "SEBI Ready",
        title: "Reporting Compliance Achieved",
        description:
          "Automated reporting reduced compliance preparation time from 2 weeks to 4 days while achieving full alignment with SEBI reporting standards.",
      },
    ],
    techStack: [
      "React",
      "TypeScript",
      "Recharts",
      "Node.js",
      "PostgreSQL",
      "WebSocket",
      "Redis",
      "Docker",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Discovery & Audit",
        description:
          "Analysed legacy reporting workflows, identified data sources, and mapped reporting requirements for SEBI alignment.",
      },
      {
        label: "Phase 2",
        title: "Architecture & Design",
        description:
          "Designed modular React + WebSocket architecture, built custom chart components, and implemented role-based security model.",
      },
      {
        label: "Phase 3",
        title: "Development & Testing",
        description:
          "Built Node.js backend with real-time data streaming, implemented audit trails, and ran performance tests for sub-300ms latency.",
      },
      {
        label: "Phase 4",
        title: "Launch & Scale",
        description:
          "Phased rollout across advisory teams. Achieved SEBI-aligned reporting compliance. Scaled to ₹45L+ daily volume.",
      },
    ],
    faqs: [
      {
        question: "How does the real-time data streaming work?",
        answer:
          "Data flows from source systems through a Node.js processing layer and is pushed to the client via WebSocket connections. We use Redis for in-memory caching and PostgreSQL for persistent storage.",
      },
      {
        question: "What is the data latency from source to dashboard?",
        answer:
          "End-to-end latency is under 300ms from data ingestion to display on the dashboard, achieved through optimised WebSocket push, in-memory caching, and efficient query design.",
      },
      {
        question: "Is the platform scalable as our AUM grows?",
        answer:
          "Yes, the architecture is designed for horizontal scaling via Docker containers. Adding new data sources or user roles requires minimal configuration changes.",
      },
      {
        question: "What regulatory reporting standards are supported?",
        answer:
          "We support SEBI MF reporting, PMS disclosure formats, and customisable templates for internal compliance reporting. New formats can be added through configuration.",
      },
      {
        question: "Can we self-host this platform?",
        answer:
          "Yes, the entire stack can be deployed on your own AWS or Azure infrastructure in the Mumbai region for data sovereignty compliance.",
      },
    ],
  },
  "ai-support-bot": {
    slug: "ai-support-bot",
    title: "AI Support Bot",
    subtitle: "Intelligent Customer Service Platform",
    category: "AI & Automation",
    client: "LuxeCart",
    duration: "3 months",
    description:
      "An LLM-powered customer service platform handling 500+ daily conversations with 84% resolution rate, integrating with existing CRM and knowledge bases for seamless human handoff.",
    heroImage: "/images/projects/ai-support-bot-hero.jpg",
    overview:
      "LuxeCart, a growing D2C fashion brand in India, needed to scale customer support without adding headcount. We built an AI agent platform that handles 500+ daily conversations across WhatsApp, email, and live chat. The system achieves 84% first-contact resolution while maintaining a 4.3/5 customer satisfaction score.",
    challenge:
      "LuxeCart faced rapid support ticket growth during festive season sales. Their small team couldn't scale, response times exceeded 18 hours, and customer satisfaction dropped. They needed AI that could understand context, maintain brand voice, and escalate gracefully to human agents.",
    solution:
      "Built a multi-agent system with LLMs for intent detection, response generation, and sentiment analysis. Implemented RAG pipelines over their existing Freshdesk and Shopify data. Designed a human-in-the-loop escalation system with full conversation context transfer.",
    galleryImages: [
      "/images/projects/ai-support-bot-1.jpg",
      "/images/projects/ai-support-bot-2.jpg",
    ],
    features: [
      "Multi-channel support (Email, WhatsApp, Live Chat)",
      "RAG-powered responses from CRM and knowledge bases",
      "Intent classification with 92% accuracy",
      "Sentiment detection with escalation triggers",
      "Real-time human agent handoff with context preservation",
      "Custom brand voice training on company data",
      "Analytics dashboard with CSAT and resolution metrics",
      "Multi-language support (Hindi, English, Tamil)",
    ],
    metrics: [
      { label: "Daily Conversations", value: "500+" },
      { label: "Resolution Rate", value: "84%" },
      { label: "Avg Response Time", value: "<90s" },
      { label: "Customer CSAT", value: "4.3/5" },
    ],
    results: [
      {
        stat: "3x",
        title: "Support Volume Handled, Same Team Size",
        description:
          "AI handled 70% of incoming tickets, allowing the 3-person support team to focus on complex cases while volume tripled during festive sales without new hires.",
      },
      {
        stat: "90 seconds",
        title: "Response Time Reduced from 18hrs",
        description:
          "Instant AI responses eliminated the backlog, improving customer experience and reducing escalation rates by 40%.",
      },
      {
        stat: "₹6.2L",
        title: "Annual Savings in Support Costs",
        description:
          "Automating routine inquiries delivered ₹6.2L in annual cost savings through reduced agent hours and faster resolution.",
      },
    ],
    techStack: [
      "Python",
      "LangChain",
      "OpenAI GPT-4",
      "Pinecone",
      "Redis",
      "FastAPI",
      "Next.js",
      "Freshdesk API",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Discovery & Audit",
        description:
          "Analysed support ticket patterns, identified knowledge gaps, and mapped existing Freshdesk and Shopify data sources.",
      },
      {
        label: "Phase 2",
        title: "Architecture & Design",
        description:
          "Designed multi-agent system, built RAG pipelines over existing data, and created human-in-the-loop escalation workflow.",
      },
      {
        label: "Phase 3",
        title: "Development & Testing",
        description:
          "Built LLM-powered agents with intent detection and sentiment analysis. Ran A/B tests on response quality and resolution rates.",
      },
      {
        label: "Phase 4",
        title: "Launch & Scale",
        description:
          "Rolled out across WhatsApp, email, and live chat. Achieved 84% first-contact resolution. Scaled through festive season peak traffic.",
      },
    ],
    faqs: [
      {
        question: "How does the AI maintain brand voice?",
        answer:
          "We fine-tune the model on your historical support conversations and brand guidelines. It learns your terminology, tone, and response patterns, ensuring consistency across all AI-generated responses.",
      },
      {
        question: "How does the human handoff work?",
        answer:
          "When confidence drops below threshold or sentiment indicates frustration, the conversation is escalated to a human agent with full conversation history, customer profile, and suggested responses — so no context is lost.",
      },
      {
        question: "Can it integrate with our existing tools?",
        answer:
          "Yes, we have built connectors for Freshdesk, Zoho CRM, Shopify, and WooCommerce. For custom systems, we provide REST API and webhook support.",
      },
      {
        question: "How do you handle sensitive customer data?",
        answer:
          "We implement PII detection and redaction in real-time. All data is encrypted at rest and in transit. Deployment can be done on AWS Mumbai region for data localisation compliance.",
      },
      {
        question: "How long does implementation take?",
        answer:
          "A typical implementation takes 3–5 weeks. The first week is data audit and RAG pipeline setup. Week 2–3 covers model training and integration. Week 4–5 is testing and phased rollout.",
      },
    ],
  },
  "cloud-sync-platform": {
    slug: "cloud-sync-platform",
    title: "CloudSync Platform",
    subtitle: "Cloud Migration & Data Sync Solution",
    category: "Cloud & DevOps",
    client: "NexaBridge Tech",
    duration: "4 months",
    description:
      "A cloud sync platform enabling real-time data synchronisation across hybrid cloud environments with conflict resolution, monitoring, and automated failover for an Indian SaaS company.",
    heroImage: "/images/projects/cloud-sync-platform-hero.jpg",
    overview:
      "CloudSync Platform is a migration and synchronisation solution built for a mid-sized Indian SaaS company managing data across AWS and on-premise infrastructure. It handles 500GB+ daily data transfers with real-time conflict detection, automated failover, and monitoring dashboards.",
    challenge:
      "NexaBridge Tech needed to migrate 8TB of legacy on-premise data to AWS while maintaining live operations. They faced data integrity risks, compliance requirements under India's data localisation norms, and zero-downtime constraints their existing tools couldn't address.",
    solution:
      "Built a distributed sync engine with custom conflict resolution algorithms. Implemented a blue-green migration strategy with automated rollback. Created a real-time monitoring system using Prometheus and Grafana with SLA tracking dashboards.",
    galleryImages: [
      "/images/projects/cloud-sync-platform-1.jpg",
      "/images/projects/cloud-sync-platform-2.jpg",
    ],
    features: [
      "Real-time sync between AWS and on-premise infrastructure",
      "Conflict detection and resolution algorithms",
      "Automated failover with <10min recovery time",
      "End-to-end data encryption with customer-managed keys",
      "Real-time monitoring and alerting via Prometheus/Grafana",
      "Audit logging and compliance reporting",
      "Bandwidth throttling and scheduling",
      "Data transformation and filtering pipelines",
    ],
    metrics: [
      { label: "Daily Transfer", value: "500GB+" },
      { label: "Failover Time", value: "<10min" },
      { label: "Data Integrity", value: "99.97%" },
      { label: "Uptime", value: "99.5%" },
    ],
    results: [
      {
        stat: "8TB",
        title: "Migrated with Zero Downtime",
        description:
          "Successfully completed the migration 5 days ahead of schedule with no service interruption to production systems.",
      },
      {
        stat: "99.97%",
        title: "Data Integrity Achieved",
        description:
          "Comprehensive validation and checksum verification ensured zero data loss across 4 billion+ records during migration.",
      },
      {
        stat: "₹4.8L",
        title: "Reduction in Annual Infrastructure Costs",
        description:
          "Intelligent data tiering and bandwidth optimisation reduced monthly cloud spend by ₹40K while improving overall system performance.",
      },
    ],
    techStack: [
      "Go",
      "Kubernetes",
      "Terraform",
      "Prometheus",
      "Grafana",
      "Redis",
      "PostgreSQL",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Discovery & Audit",
        description:
          "Analysed legacy data sources, mapped governance requirements, and identified hybrid cloud architecture constraints.",
      },
      {
        label: "Phase 2",
        title: "Architecture & Design",
        description:
          "Designed distributed sync engine, built conflict resolution algorithms, and created blue-green migration strategy.",
      },
      {
        label: "Phase 3",
        title: "Development & Testing",
        description:
          "Built sync engine with custom conflict resolution. Ran validation tests for data integrity and failover scenarios.",
      },
      {
        label: "Phase 4",
        title: "Launch & Scale",
        description:
          "Phased rollout across production systems. Achieved 99.97% data integrity. Completed full migration on schedule.",
      },
    ],
    faqs: [
      {
        question: "How does the conflict resolution work?",
        answer:
          "We use a combination of timestamp-based last-write-wins and custom business rules. Conflicts are detected in real-time and either auto-resolved or flagged for manual review depending on your configuration.",
      },
      {
        question: "What happens during a cloud provider outage?",
        answer:
          "Our automated failover system detects outages within 60 seconds and switches to the pre-configured standby environment. The sync engine queues incoming changes and replays them once the primary is restored.",
      },
      {
        question: "Can we use our own encryption keys?",
        answer:
          "Yes, we support customer-managed encryption keys (CMEK) on AWS. Your keys never leave your cloud environment, giving you full control over data access.",
      },
      {
        question: "How do you ensure data security during transfer?",
        answer:
          "All data is encrypted in transit using TLS 1.3 and at rest using AES-256. We also support VPN tunnels for organisations with strict network security requirements.",
      },
      {
        question: "What monitoring and reporting is available?",
        answer:
          "We provide Grafana dashboards showing sync status, throughput, latency, errors, and SLA compliance. Reports can be exported as PDF or consumed via REST API.",
      },
    ],
  },
  "ecommerce-replatform": {
    slug: "ecommerce-replatform",
    title: "E-Commerce Replatform",
    subtitle: "High-Performance Headless Commerce Platform",
    category: "Web Development",
    client: "Urban Threads Co",
    duration: "5 months",
    description:
      "A headless commerce platform delivering 4x faster page loads and improved conversion rates for an Indian D2C fashion brand processing 80,000+ monthly visitors.",
    heroImage: "/images/projects/ecommerce-replatform-hero.jpg",
    overview:
      "Urban Threads Co migrated from a slow WooCommerce setup to a modern headless architecture. The new platform delivers 4x faster page loads through edge caching, 25% higher conversion rates through an optimised checkout flow, and unified inventory across 4 retail locations and a 3PL partner.",
    challenge:
      "Urban Threads' legacy WooCommerce store struggled during sale events, with 5-second page loads causing high cart abandonment. They needed a better mobile experience, faster iterations, and integrated inventory management — all within a startup budget.",
    solution:
      "Built a Next.js + REST API headless frontend with Cloudflare edge caching, achieving sub-1.5s page loads. Integrated Shopify backend for inventory and orders with custom POS and 3PL sync. Optimised checkout flow reduced steps from 6 to 3, increasing completion rates by 22%.",
    galleryImages: [
      "/images/projects/ecommerce-replatform-1.jpg",
      "/images/projects/ecommerce-replatform-2.jpg",
    ],
    features: [
      "Sub-1.5s page loads via edge caching and ISR",
      "Personalised product recommendations",
      "Optimised checkout flow (6 to 3 steps)",
      "Real-time inventory across 4+ locations",
      "Multi-currency support (INR, USD)",
      "A/B testing framework for continuous optimisation",
      "Integrated loyalty and rewards program",
      "Mobile-first design with offline browsing",
    ],
    metrics: [
      { label: "Monthly Visitors", value: "80K+" },
      { label: "Page Load", value: "<1.5s" },
      { label: "Conversion Lift", value: "+25%" },
      { label: "Cart Abandonment", value: "-40%" },
    ],
    results: [
      {
        stat: "4x",
        title: "Performance Improvement",
        description:
          "Page load times reduced from 5 seconds to under 1.5 seconds, directly correlating with 25% higher conversion and lower bounce rates on mobile.",
      },
      {
        stat: "₹18L+",
        title: "Revenue Increase in Year One",
        description:
          "Faster performance and streamlined checkout delivered ₹18L+ in additional revenue through higher conversion rates and reduced abandonment.",
      },
      {
        stat: "45%",
        title: "Faster Feature Delivery",
        description:
          "Headless architecture reduced deployment cycles from 2 weeks to 5 days, allowing the team to ship new features twice as fast.",
      },
    ],
    techStack: [
      "Next.js",
      "REST API",
      "Shopify",
      "Cloudflare",
      "Tailwind CSS",
      "Node.js",
      "PostgreSQL",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Discovery & Audit",
        description:
          "Analysed legacy WooCommerce performance, identified traffic bottlenecks, and mapped inventory management requirements.",
      },
      {
        label: "Phase 2",
        title: "Architecture & Design",
        description:
          "Designed Next.js headless architecture, built edge caching strategy, and created checkout flow optimisation plan.",
      },
      {
        label: "Phase 3",
        title: "Development & Testing",
        description:
          "Built Next.js frontend with Cloudflare edge caching. Implemented Shopify backend integrations and ran load tests for peak sale traffic.",
      },
      {
        label: "Phase 4",
        title: "Launch & Scale",
        description:
          "Phased rollout across retail channels. Achieved 4x performance improvement. Scaled through festive season with zero downtime.",
      },
    ],
    faqs: [
      {
        question: "Why did you choose a headless architecture?",
        answer:
          "Headless commerce decouples the frontend from the backend, allowing independent scaling and faster iteration. For Urban Threads, this meant 4x faster performance through edge caching and the flexibility to add new touchpoints without backend changes.",
      },
      {
        question: "How does inventory synchronisation work?",
        answer:
          "We built a real-time inventory sync connecting Shopify with their POS systems and 3PL partner via webhooks and API integrations, handling concurrent updates with conflict resolution for oversells.",
      },
      {
        question: "Can the platform handle sale event traffic spikes?",
        answer:
          "Yes. Edge caching and auto-scaling handle traffic spikes gracefully. During the first Big Billion Days after launch, the site served peak traffic with zero downtime and sub-1.5s response times.",
      },
      {
        question: "What is the migration approach?",
        answer:
          "We use a parallel migration strategy with feature flags. Traffic is gradually shifted from the legacy store to the new platform, with instant rollback capability. Data migration runs in batches with validation at each step.",
      },
      {
        question: "Can you support regional languages?",
        answer:
          "Yes, the platform supports Hindi and other regional languages through i18n configuration. Language preference is stored per user and syncs across sessions.",
      },
    ],
  },
  "ml-prediction-engine": {
    slug: "ml-prediction-engine",
    title: "ML Prediction Engine",
    subtitle: "Real-Time Machine Learning Inference Platform",
    category: "AI & Data",
    client: "VantageMetrics",
    duration: "4 months",
    description:
      "A real-time ML inference platform enabling sub-50ms predictions at 2,000 requests/second, powering demand forecasting and fraud detection for a Pune-based fintech startup.",
    heroImage: "/images/projects/ml-prediction-engine-hero.jpg",
    overview:
      "VantageMetrics had excellent ML models but no reliable way to serve them in production. We built a distributed inference system that processes 2,000 predictions per second with sub-50ms latency, achieving 99.5% availability across their fraud detection and demand forecasting use cases.",
    challenge:
      "VantageMetrics' batch prediction approach caused 12-hour delays, missing critical fraud events and inventory stockouts. They needed real-time inference at a budget that made sense for an early-stage fintech startup.",
    solution:
      "Built a model serving platform using FastAPI with custom batching strategies. Deployed models on AWS with automatic load balancing. Implemented model versioning and A/B testing infrastructure for continuous improvement.",
    galleryImages: [
      "/images/projects/ml-prediction-engine-1.jpg",
      "/images/projects/ml-prediction-engine-2.jpg",
    ],
    features: [
      "Sub-50ms inference latency at 2K requests/second",
      "Multi-model serving with automatic load balancing",
      "Model versioning with zero-downtime deployments",
      "A/B testing and champion-challenger frameworks",
      "Real-time feature store with low-latency lookup",
      "Automatic model drift detection and alerting",
      "CPU inference optimisation",
      "Model monitoring and explainability dashboards",
    ],
    metrics: [
      { label: "Requests/Second", value: "2K+" },
      { label: "Latency", value: "<50ms" },
      { label: "Availability", value: "99.5%" },
      { label: "Models in Production", value: "5+" },
    ],
    results: [
      {
        stat: "89%",
        title: "Fraud Detection Rate, <50ms Response",
        description:
          "Real-time fraud scoring enabled detection and blocking of fraudulent transactions in under 50ms, catching 89% of fraud attempts and saving ₹12L monthly.",
      },
      {
        stat: "18%",
        title: "Reduction in Inventory Costs",
        description:
          "Accurate demand forecasting reduced overstock and stockouts by 18%, freeing up ₹8L in working capital previously tied up in excess inventory.",
      },
      {
        stat: "ML Lifecycle",
        title: "from Weeks to Days",
        description:
          "Self-service deployment tools reduced time-to-production for new models from 2 weeks to 3 days, accelerating data science iteration speed.",
      },
    ],
    techStack: [
      "Python",
      "FastAPI",
      "TensorFlow",
      "scikit-learn",
      "Kubernetes",
      "Redis",
      "PostgreSQL",
      "Grafana",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Discovery & Audit",
        description:
          "Analysed existing models, identified production serving bottlenecks, and mapped real-time inference requirements.",
      },
      {
        label: "Phase 2",
        title: "Architecture & Design",
        description:
          "Designed distributed inference system using FastAPI, built model versioning strategy, and created A/B testing infrastructure.",
      },
      {
        label: "Phase 3",
        title: "Development & Testing",
        description:
          "Built model serving platform with custom batching strategies. Ran load tests for sub-50ms latency and availability.",
      },
      {
        label: "Phase 4",
        title: "Launch & Scale",
        description:
          "Phased rollout across fraud detection and forecasting use cases. Achieved 99.5% availability. Scaled to 2K+ requests/second.",
      },
    ],
    faqs: [
      {
        question: "How do you achieve sub-50ms latency?",
        answer:
          "We use several techniques: optimised model serving with intelligent batching, feature store with in-memory caching for common features, and pre-warming to eliminate cold start delays.",
      },
      {
        question: "How do you handle model versioning and rollback?",
        answer:
          "Every model deployment gets a versioned endpoint. Traffic can be split between versions for A/B testing or instantly shifted back with a single API call. Rollback completes in under 60 seconds.",
      },
      {
        question: "Can you explain model predictions for compliance?",
        answer:
          "Yes, we integrate SHAP for model explainability. Every prediction includes feature importance scores explaining which inputs drove the output, supporting RBI and audit requirements.",
      },
      {
        question: "How do you detect and handle model drift?",
        answer:
          "We continuously monitor prediction distributions and business KPIs. When drift is detected using statistical tests and custom thresholds, alerts fire and optional automatic rollback can trigger.",
      },
      {
        question: "What monitoring is available?",
        answer:
          "Grafana dashboards show request volume, latency percentiles, error rates, and model accuracy metrics. Custom alerts can be configured with integrations to Slack and email.",
      },
    ],
  },
  "real-time-collaboration": {
    slug: "real-time-collaboration",
    title: "Real-Time Collaboration",
    subtitle: "Team Collaborative Workspace Platform",
    category: "Web Development",
    client: "Synapse Workspace",
    duration: "4 months",
    description:
      "A real-time collaborative workspace enabling 5,000+ concurrent users to co-edit documents and manage projects simultaneously, built for a Chennai-based SaaS startup.",
    heroImage: "/images/projects/real-time-collaboration-hero.jpg",
    overview:
      "Synapse Workspace needed a real-time collaboration platform for distributed Indian teams. The platform supports 5,000+ concurrent users with CRDT-based conflict resolution, sub-200ms sync latency, and enterprise SSO — all delivered within a lean startup timeline.",
    challenge:
      "Synapse's existing tools couldn't scale beyond 20 simultaneous editors without severe lag. Their document sync broke down with complex edits. They needed a solution reliable enough for their enterprise clients but buildable within a 4-month window.",
    solution:
      "Implemented Yjs CRDT for conflict-free real-time editing. Built a WebSocket-based presence and sync infrastructure. Used JWT-based auth with Google Workspace SSO integration, keeping infrastructure costs low by deploying on AWS Mumbai.",
    galleryImages: [
      "/images/projects/real-time-collaboration-1.jpg",
      "/images/projects/real-time-collaboration-2.jpg",
    ],
    features: [
      "CRDT-based real-time document editing (5K+ concurrent users)",
      "Sub-200ms sync latency",
      "Real-time cursors and presence indicators",
      "Version history with instant rollback",
      "Google Workspace and Microsoft SSO integration",
      "Offline-first with automatic conflict resolution",
      "Integrated task management and comments",
      "Role-based access with team permissions",
    ],
    metrics: [
      { label: "Concurrent Users", value: "5K+" },
      { label: "Sync Latency", value: "<200ms" },
      { label: "Availability", value: "99.5%" },
      { label: "Document Edits", value: "120K+/day" },
    ],
    results: [
      {
        stat: "45%",
        title: "Faster Team Collaboration",
        description:
          "Real-time editing reduced document review cycles from 3 days to under 1 day, saving teams significant back-and-forth communication overhead.",
      },
      {
        stat: "Zero",
        title: "Sync Conflicts in First 6 Months",
        description:
          "CRDT-based architecture ensured 100% conflict-free collaboration across 120K+ daily edits with zero data loss incidents.",
      },
      {
        stat: "₹5.4L",
        title: "Annual Savings vs SaaS Alternatives",
        description:
          "Building a custom platform eliminated per-seat SaaS licensing fees, saving ₹5.4L annually compared to equivalent third-party tools.",
      },
    ],
    techStack: [
      "React",
      "Yjs",
      "WebSocket",
      "Node.js",
      "Redis",
      "PostgreSQL",
      "Cloudflare",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Discovery & Audit",
        description:
          "Analysed existing collaboration pain points, identified scaling bottlenecks, and mapped enterprise deployment requirements.",
      },
      {
        label: "Phase 2",
        title: "Architecture & Design",
        description:
          "Designed CRDT-based architecture, built WebSocket presence infrastructure, and created SSO integration workflow.",
      },
      {
        label: "Phase 3",
        title: "Development & Testing",
        description:
          "Built Yjs CRDT editor with WebSocket sync. Ran load tests for 5K+ concurrent users and security review.",
      },
      {
        label: "Phase 4",
        title: "Launch & Scale",
        description:
          "Phased rollout across enterprise teams. Scaled to 5K+ concurrent users with sub-200ms sync latency.",
      },
    ],
    faqs: [
      {
        question: "How does CRDT-based collaboration work?",
        answer:
          "CRDTs allow multiple users to edit simultaneously without coordination. Each user's changes are merged deterministically, ensuring all clients converge to the same state regardless of network delays. We use Yjs for text and custom CRDTs for structured data.",
      },
      {
        question: "What happens offline?",
        answer:
          "The platform works offline with local changes stored in the browser. When connectivity returns, changes sync automatically using the CRDT merge algorithm. Conflict resolution happens seamlessly without user intervention.",
      },
      {
        question: "How do you handle SSO integration?",
        answer:
          "We support Google Workspace OAuth and Microsoft Azure AD OIDC out of the box. Custom SAML integrations for enterprise clients can be added within 1–2 weeks.",
      },
      {
        question: "What is the data residency?",
        answer:
          "By default, all data is stored on AWS Mumbai (ap-south-1) for compliance with Indian data localisation requirements.",
      },
      {
        question: "Can we self-host this platform?",
        answer:
          "Yes, the entire platform can be self-hosted on your own infrastructure. We provide Docker Compose and Kubernetes deployment manifests with documentation.",
      },
    ],
  },
  "datapulse-saas": {
    slug: "datapulse-saas",
    title: "DataPulse SaaS",
    subtitle: "B2B Analytics & Business Intelligence Platform",
    category: "Web Development",
    client: "InsightFlow Analytics",
    duration: "6 months",
    description:
      "A multi-tenant SaaS analytics platform enabling 32+ enterprise clients to unify, visualise, and share business data across teams with real-time dashboards and white-label reporting.",
    heroImage: "/images/projects/datapulse-saas-hero.jpg",
    overview:
      "DataPulse SaaS is a white-label business intelligence platform for Indian SaaS companies and SMEs. It supports 32+ concurrent tenants with row-level security, custom branding, and embedded analytics. The platform processes 120M+ events daily and serves insights to 8,000+ end users across finance, sales, and operations teams.",
    challenge:
      "InsightFlow Analytics needed to replace fragmented reporting tools with a unified platform that could handle growing data volumes while allowing each client to maintain data isolation and custom branding — all within a competitive per-seat pricing model.",
    solution:
      "Built a React + TypeScript frontend with a REST API over PostgreSQL + ClickHouse. Implemented row-level security and tenant isolation at the database level. Created a white-label theming engine with CSS variable injection and custom domain support. Used materialized views and intelligent caching for sub-2s queries on large datasets.",
    galleryImages: [
      "/images/projects/datapulse-saas-1.jpg",
      "/images/projects/datapulse-saas-2.jpg",
    ],
    features: [
      "Multi-tenant architecture with complete data isolation",
      "White-label branding engine with custom CSS injection",
      "Sub-2s query performance on large datasets",
      "Real-time data pipelines via Kafka",
      "Custom dashboard builder with drag-and-drop widgets",
      "Embedded analytics with iframe and API modes",
      "SSO integration (Google Workspace, Microsoft)",
      "Role-based access with row and column-level security",
    ],
    metrics: [
      { label: "Enterprise Clients", value: "32+" },
      { label: "Daily Events", value: "120M+" },
      { label: "End Users", value: "8K+" },
      { label: "Query Latency", value: "<2s" },
    ],
    results: [
      {
        stat: "₹38L+",
        title: "ARR Growth in Year One",
        description:
          "White-label offering unlocked 8 new enterprise deals worth ₹38L+ in ARR, growing the customer base by 110% without expanding the sales team.",
      },
      {
        stat: "99.5%",
        title: "Multi-Tenant Uptime",
        description:
          "Isolated tenant architecture with dedicated connection pools ensured 99.5% uptime even during peak query loads across 32+ clients.",
      },
      {
        stat: "65%",
        title: "Faster Report Generation",
        description:
          "Materialised views and intelligent caching reduced average report generation from 25 seconds to under 9 seconds, improving user adoption significantly.",
      },
    ],
    techStack: [
      "React",
      "TypeScript",
      "REST API",
      "Node.js",
      "PostgreSQL",
      "ClickHouse",
      "Kafka",
      "Redis",
      "Docker",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Discovery & Audit",
        description:
          "Analysed data warehouse architecture, identified multi-tenancy requirements, and mapped security and branding needs for enterprise clients.",
      },
      {
        label: "Phase 2",
        title: "Architecture & Design",
        description:
          "Designed multi-tenant PostgreSQL schema with row-level security, built REST API layer, and created white-label theming engine.",
      },
      {
        label: "Phase 3",
        title: "Development & Testing",
        description:
          "Built React dashboard builder with drag-and-drop widgets. Implemented Kafka data pipelines. Ran multi-tenant load tests.",
      },
      {
        label: "Phase 4",
        title: "Launch & Scale",
        description:
          "Phased rollout across 32+ enterprise clients. Scaled to 8K+ end users with 99.5% uptime.",
      },
    ],
    faqs: [
      {
        question: "How does multi-tenancy work in the platform?",
        answer:
          "Each tenant gets a dedicated schema with row-level security policies. Connection pools are partitioned per tenant to prevent noisy neighbour issues. Data is never shared between tenants — even at the caching layer.",
      },
      {
        question: "Can we embed analytics in our own product?",
        answer:
          "Yes, we offer both iframe embedding and REST API modes. You can embed entire dashboards or individual widgets with SSO shared from your parent application.",
      },
      {
        question: "How do you handle data freshness?",
        answer:
          "We use Kafka for near-real-time data ingestion with materialised view refreshes. Typical data freshness is under 60 seconds from source system change to dashboard update.",
      },
      {
        question: "What database systems are supported?",
        answer:
          "The platform connects to PostgreSQL, MySQL, ClickHouse, and any system with a REST or JDBC interface. We provide pre-built connectors with automatic schema discovery.",
      },
      {
        question: "What is the typical onboarding timeline?",
        answer:
          "A new tenant can be onboarded in under 3 hours including SSO configuration, data source connection, and initial dashboard setup via our self-service onboarding wizard.",
      },
    ],
  },
  "healthconnect-enterprise-portal": {
    slug: "healthconnect-enterprise-portal",
    title: "HealthConnect Portal",
    subtitle: "Healthcare Provider Collaboration Platform",
    category: "Web Development",
    client: "CareNet Health Systems",
    duration: "5 months",
    description:
      "A secure provider portal enabling 3,200+ doctors, nurses, and administrators to share patient records and coordinate care across 12 hospital networks in South India.",
    heroImage: "/images/projects/healthconnect-enterprise-portal-hero.jpg",
    overview:
      "HealthConnect Portal is a secure web platform for a South Indian hospital network. It enables real-time patient record sharing, care coordination, and referral management across 12 hospitals serving 3,200+ clinicians. Built with zero-trust security and designed for Indian healthcare compliance, the platform handles 85,000+ daily clinical document exchanges.",
    challenge:
      "CareNet Health Systems operated 12 independent hospitals with incompatible systems. Clinicians shared patient records via fax and WhatsApp, causing care delays and data risks. They needed a secure, compliant platform that worked across all their hospitals on a realistic budget.",
    solution:
      "Built a secure API gateway that normalises data from existing clinic systems. Implemented role-based access with mTLS and continuous re-authentication. Created a document sharing system with full audit trails and consent management.",
    galleryImages: [
      "/images/projects/healthconnect-enterprise-portal-1.jpg",
      "/images/projects/healthconnect-enterprise-portal-2.jpg",
    ],
    features: [
      "Secure API gateway for existing hospital systems",
      "Real-time patient record sharing across hospital networks",
      "Care coordination with task management and notifications",
      "Referral management with automated routing",
      "Role-based access with continuous authentication",
      "Consent management with patient-controlled data sharing",
      "Full audit trail and document versioning",
      "Mobile-responsive design for bedside access",
    ],
    metrics: [
      { label: "Active Clinicians", value: "3.2K+" },
      { label: "Hospital Networks", value: "12" },
      { label: "Daily Exchanges", value: "85K+" },
      { label: "Care Delays Reduced", value: "55%" },
    ],
    results: [
      {
        stat: "55%",
        title: "Reduction in Care Coordination Delays",
        description:
          "Digital record sharing eliminated fax and WhatsApp-based communication delays, reducing average care coordination time from 2 days to 6 hours.",
      },
      {
        stat: "₹9.6L+",
        title: "Annual Savings in Admin Costs",
        description:
          "Automated referral routing and digital document exchange eliminated thousands of monthly fax transactions, saving ₹9.6L+ annually in administrative overhead.",
      },
      {
        stat: "Zero",
        title: "Data Breaches in First Year",
        description:
          "Zero-trust architecture and continuous security monitoring ensured zero data breaches since launch, with regular third-party security reviews.",
      },
    ],
    techStack: [
      "Next.js",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "Redis",
      "Kubernetes",
      "Vault",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Discovery & Audit",
        description:
          "Analysed all 12 hospital systems, mapped existing data flows, and identified security and compliance requirements.",
      },
      {
        label: "Phase 2",
        title: "Architecture & Design",
        description:
          "Designed secure API gateway, built role-based access architecture, and created consent management and audit trail systems.",
      },
      {
        label: "Phase 3",
        title: "Development & Testing",
        description:
          "Built secure API layer for existing systems. Implemented role-based access and audit trails. Ran security reviews and user acceptance testing.",
      },
      {
        label: "Phase 4",
        title: "Launch & Scale",
        description:
          "Phased rollout across 12 hospital networks. Scaled to 3.2K+ active clinicians with 85K+ daily exchanges.",
      },
    ],
    faqs: [
      {
        question: "Which hospital systems does the platform integrate with?",
        answer:
          "We have built integrations for common Indian HIS systems. For legacy or custom setups, our team builds tailored integrations through our professional services offering.",
      },
      {
        question: "How does the role-based access model work?",
        answer:
          "Every request is authenticated with short-lived JWTs, authorised based on role and context. Sessions timeout after 15 minutes of inactivity, and all data access is logged to immutable audit trails.",
      },
      {
        question: "Can patients control who sees their records?",
        answer:
          "Yes, we implement a granular consent management system where patients specify which providers can access specific record types. Consent is enforced at the gateway level and can be updated in real-time.",
      },
      {
        question: "How do you handle data residency?",
        answer:
          "All data is stored on AWS Mumbai (ap-south-1) by default. We support bring-your-own-infrastructure deployment for hospitals with strict on-premise requirements.",
      },
      {
        question: "What happens during an outage?",
        answer:
          "The platform is deployed with multi-AZ failover on AWS. During an outage, traffic automatically routes to the standby instance. Critical coordination features have offline capability with local caching for essential clinical documents.",
      },
    ],
  },
  "fooddash-flutter": {
    slug: "fooddash-flutter",
    title: "FoodDash",
    subtitle: "Multi-Vendor Food Delivery Platform",
    category: "Mobile Development",
    client: "FlavorFleet",
    duration: "4 months",
    description:
      "A Flutter-powered food delivery app connecting 320,000+ users with 2,800+ restaurants, featuring real-time order tracking, smart recommendations, and multi-vendor cart support across iOS and Android.",
    heroImage: "/images/projects/fooddash-flutter-hero.jpg",
    overview:
      "FoodDash is a Flutter cross-platform app for a growing food delivery startup operating across 4 Tier 2 Indian cities. It serves 320K+ monthly active users ordering from 2,800+ restaurant partners. Key features include real-time driver tracking with live map, group ordering with multi-vendor cart, and ML-powered recommendations that increase average order value by 22%.",
    challenge:
      "FlavorFleet needed to launch a multi-vendor delivery platform and compete in their cities within 4 months. They needed iOS and Android coverage while supporting real-time tracking and multi-vendor carts. Their earlier React Native prototype had performance issues during peak hours.",
    solution:
      "Built a Flutter app with BLoC architecture. Implemented real-time order tracking using Firebase Realtime Database. Created a multi-vendor cart engine with split delivery options. Used Cloud Functions for order processing and Razorpay for Indian payment methods.",
    galleryImages: [
      "/images/projects/fooddash-flutter-1.jpg",
      "/images/projects/fooddash-flutter-2.jpg",
    ],
    features: [
      "Real-time driver tracking with live map and ETA",
      "Multi-vendor cart with split delivery options",
      "ML-powered restaurant and menu recommendations",
      "Group ordering with shared cart",
      "In-app chat between customers and delivery agents",
      "Push notifications with deep linking",
      "UPI, cards, and COD payment integration",
      "Offline menu browsing and saved addresses",
    ],
    metrics: [
      { label: "Monthly Active Users", value: "320K+" },
      { label: "Restaurant Partners", value: "2.8K+" },
      { label: "Avg Order Value Lift", value: "+22%" },
      { label: "App Store Rating", value: "4.6/5" },
    ],
    results: [
      {
        stat: "22%",
        title: "Higher Order Value vs Baseline",
        description:
          "ML recommendations and multi-vendor cart features drove 22% higher average order value, with 18% of orders spanning multiple restaurants.",
      },
      {
        stat: "4.6/5",
        title: "App Store Rating Across 15K+ Reviews",
        description:
          "Smooth animations, instant search, and reliable real-time tracking earned 4.6/5 stars from over 15,000 App Store and Play Store reviews.",
      },
      {
        stat: "<5min",
        title: "Average Driver Assignment Time",
        description:
          "Intelligent driver matching with proximity algorithms reduced average assignment time from 9 minutes to under 5 minutes, improving customer satisfaction.",
      },
    ],
    techStack: [
      "Flutter",
      "Dart",
      "Firebase",
      "Cloud Functions",
      "Google Maps API",
      "Razorpay",
      "TensorFlow Lite",
      "BLoC",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Discovery & Audit",
        description:
          "Analysed competitor apps, identified multi-vendor cart requirements, and mapped real-time tracking and payment integration needs.",
      },
      {
        label: "Phase 2",
        title: "Architecture & Design",
        description:
          "Designed BLoC architecture for Flutter, built multi-vendor cart engine, and created real-time tracking pipeline with Firebase.",
      },
      {
        label: "Phase 3",
        title: "Development & Testing",
        description:
          "Built Flutter app with real-time tracking and ML recommendations. Ran performance profiling for smooth animations. Published to App Store and Play Store.",
      },
      {
        label: "Phase 4",
        title: "Launch & Scale",
        description:
          "Phased rollout across 4 cities. Scaled to 320K+ MAU. Achieved 4.6/5 app store rating.",
      },
    ],
    faqs: [
      {
        question: "Why did you choose Flutter over React Native?",
        answer:
          "Flutter's native rendering engine provided consistent 60fps performance across all UI elements, especially for map animations and real-time tracking. We also saw smaller app bundle sizes compared to the React Native build.",
      },
      {
        question: "How does the multi-vendor cart work?",
        answer:
          "Our cart engine groups items by restaurant and coordinates delivery scheduling. You can order from multiple restaurants in one checkout — items from each are packed and delivered separately by the assigned delivery agent.",
      },
      {
        question: "How does real-time driver tracking work?",
        answer:
          "Driver locations are pushed via Firebase Realtime Database. The Flutter app subscribes to location updates and renders them on Google Maps with smooth interpolation between updates.",
      },
      {
        question: "Which payment methods are supported?",
        answer:
          "We integrate Razorpay, supporting UPI, credit/debit cards, net banking, wallets, and cash on delivery — covering all major Indian payment preferences.",
      },
      {
        question: "How does the recommendation engine work?",
        answer:
          "We use TensorFlow Lite for on-device inference, analysing order history, browsing patterns, time of day, and location. Recommendations update in real-time based on in-session interactions.",
      },
    ],
  },
  "paymate-react-native": {
    slug: "paymate-react-native",
    title: "PayMate",
    subtitle: "Mobile Banking & Payments App",
    category: "Mobile Development",
    client: "NovaPay",
    duration: "5 months",
    description:
      "A React Native mobile banking app serving 850,000+ users with instant UPI transfers, biometric authentication, AI-powered fraud detection, and real-time spend analytics across iOS and Android.",
    heroImage: "/images/projects/paymate-react-native-hero.jpg",
    overview:
      "PayMate is a modern mobile banking app built for NovaPay, a Hyderabad-based fintech startup. It serves 850K+ users with instant UPI and P2P transfers, biometric authentication, AI-powered fraud detection, and real-time spend analytics. The app achieved a 4.7/5 rating with zero critical security incidents since launch.",
    challenge:
      "NovaPay's initial app had a 2.8/5 rating and was losing users to competitors. Security relied only on OTP, the UX required 18 steps to complete a transfer, and technical debt slowed new feature development to a crawl. They needed a complete rewrite aligned with RBI guidelines.",
    solution:
      "Built a React Native app with clean architecture. Implemented biometric authentication (Face ID, fingerprint, PIN fallback) with device-bound key storage. Created an ML fraud detection engine running on-device for privacy. Streamlined UX reduced transfer flow to 5 steps.",
    galleryImages: [
      "/images/projects/paymate-react-native-1.jpg",
      "/images/projects/paymate-react-native-2.jpg",
    ],
    features: [
      "Biometric authentication (Face ID, fingerprint, PIN)",
      "Instant UPI and P2P transfers",
      "AI-powered on-device fraud detection",
      "Real-time spend analytics with category insights",
      "Digital card management with instant block/unblock",
      "Bill pay with automatic reminders",
      "Mutual fund and FD tracking",
      "Multilingual support (Hindi, Telugu, Tamil, English)",
    ],
    metrics: [
      { label: "Active Users", value: "850K+" },
      { label: "App Store Rating", value: "4.7/5" },
      { label: "Transfer Completion Rate", value: "97%" },
      { label: "Fraud Prevention Rate", value: "97.5%" },
    ],
    results: [
      {
        stat: "4.7/5",
        title: "App Store Rating (from 2.8)",
        description:
          "Complete UX redesign with streamlined flows (5 steps vs 18) drove the app store rating from 2.8 to 4.7, becoming the top-rated app in NovaPay's category within 3 months.",
      },
      {
        stat: "85%",
        title: "Increase in Monthly Transactions",
        description:
          "Frictionless UX and instant UPI transfers drove monthly transaction volume from ₹4.2Cr to ₹7.8Cr within 5 months of launch.",
      },
      {
        stat: "97.5%",
        title: "Fraud Prevention Rate",
        description:
          "On-device ML fraud detection prevented ₹18L+ in fraudulent transactions in the first year while maintaining a sub-0.5% false positive rate.",
      },
    ],
    techStack: [
      "React Native",
      "TypeScript",
      "TensorFlow Lite",
      "Secure Enclave",
      "Firebase",
      "GraphQL",
      "Node.js",
      "PostgreSQL",
      "Redis",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Discovery & Audit",
        description:
          "Analysed existing app pain points, mapped RBI compliance requirements, and identified security and UX improvement priorities.",
      },
      {
        label: "Phase 2",
        title: "Architecture & Design",
        description:
          "Designed clean architecture with domain-driven layers, built biometric auth pipeline with Secure Enclave, and created on-device ML fraud detection.",
      },
      {
        label: "Phase 3",
        title: "Development & Testing",
        description:
          "Built React Native app with streamlined UX and AI fraud detection. Ran security and penetration testing with a third-party firm.",
      },
      {
        label: "Phase 4",
        title: "Launch & Scale",
        description:
          "Phased rollout with feature flags. Scaled to 850K+ users. Achieved 4.7/5 app store rating with zero critical security incidents.",
      },
    ],
    faqs: [
      {
        question: "How does on-device fraud detection work?",
        answer:
          "We use TensorFlow Lite models running entirely on the device. The model analyses transaction patterns, device behaviour, and contextual signals without sending raw data to the cloud, providing privacy-first fraud prevention with sub-50ms inference time.",
      },
      {
        question: "What happens if biometric authentication fails?",
        answer:
          "We implement a fallback chain: biometric → device PIN → OTP via registered mobile number. All fallbacks trigger additional verification to maintain security.",
      },
      {
        question: "How do you ensure RBI compliance?",
        answer:
          "Card data is tokenised immediately using device-bound tokens aligned with RBI tokenisation guidelines. We undergo regular security audits and penetration testing.",
      },
      {
        question: "Can the app work offline?",
        answer:
          "Balance viewing and transaction history work offline with locally cached data. UPI transfers require connectivity for security verification. Card block/unblock queues offline and executes on reconnection.",
      },
      {
        question: "How do you handle multi-language support?",
        answer:
          "We use i18n with react-intl, supporting Hindi, Telugu, Tamil, and English. Language preference syncs across devices via the backend.",
      },
    ],
  },
  "fitforce-android": {
    slug: "fitforce-android",
    title: "FitForce",
    subtitle: "AI Fitness Platform",
    category: "Mobile Development",
    client: "PulseFit",
    duration: "4 months",
    description:
      "A Jetpack Compose Android app with 180,000+ downloads, featuring AI pose detection for real-time workout feedback, personalised training plans, and social challenges with leaderboards.",
    heroImage: "/images/projects/fitforce-android-hero.jpg",
    overview:
      "FitForce is a native Android fitness app built with Jetpack Compose for PulseFit, a Pune-based health startup. It uses ML Kit for real-time pose detection, generates personalised training plans, and gamifies fitness with social challenges and leaderboards. The app has 180K+ downloads with a 4.6/5 Play Store rating.",
    challenge:
      "PulseFit's existing app had high churn — 65% of users stopped exercising within 30 days. Generic workout plans, no form feedback, and no social accountability were the primary culprits. They needed a smarter, more engaging experience built natively for Android.",
    solution:
      "Built a native Android app with Jetpack Compose and MVVM architecture. Integrated ML Kit for real-time pose detection with fast inference providing visual form corrections. Created a dynamic training plan engine adapting to user progress. Designed social features with group challenges and streak-based gamification.",
    galleryImages: [
      "/images/projects/fitforce-android-1.jpg",
      "/images/projects/fitforce-android-2.jpg",
    ],
    features: [
      "Real-time AI pose detection with form feedback",
      "Dynamic workout plans that adapt to user progress",
      "Heart rate zone tracking via wearable integration",
      "Social challenges with team leaderboards",
      "Streak system with milestone rewards",
      "Workout sharing with video recording",
      "Offline workout downloads for gym use",
      "Calorie and macro tracking integration",
    ],
    metrics: [
      { label: "Downloads", value: "180K+" },
      { label: "App Rating", value: "4.6/5" },
      { label: "30-Day Retention", value: "58%" },
      { label: "Pose Detection Latency", value: "18ms" },
    ],
    results: [
      {
        stat: "58%",
        title: "30-Day Retention (from 35%)",
        description:
          "Personalised AI workout plans and social accountability features increased 30-day retention from 35% to 58%, one of the highest retention rates in the Indian fitness app category.",
      },
      {
        stat: "4.6/5",
        title: "Play Store Rating with 15K+ Reviews",
        description:
          "Native Jetpack Compose UI with smooth animations and intuitive navigation achieved 4.6/5 stars from 15,000+ reviews, outperforming cross-platform alternatives in the same category.",
      },
      {
        stat: "25%",
        title: "Reduction in Workout-Related Injuries",
        description:
          "AI pose detection providing real-time form feedback reduced reported workout injuries by 25%, with users reporting higher confidence in their exercise technique.",
      },
    ],
    techStack: [
      "Jetpack Compose",
      "Kotlin",
      "ML Kit Pose Detection",
      "Room Database",
      "Hilt DI",
      "Coroutines + Flow",
      "Firebase",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Discovery & Audit",
        description:
          "Analysed existing fitness app pain points, identified AI pose detection requirements, and mapped social feature and gamification needs.",
      },
      {
        label: "Phase 2",
        title: "Architecture & Design",
        description:
          "Designed MVVM architecture with Jetpack Compose, built ML Kit pose detection pipeline, and created dynamic training plan engine.",
      },
      {
        label: "Phase 3",
        title: "Development & Testing",
        description:
          "Built native Android app with real-time pose detection. Ran user testing for form feedback accuracy. Published to Play Store with staged rollout.",
      },
      {
        label: "Phase 4",
        title: "Launch & Scale",
        description:
          "Achieved 180K+ downloads in 4 months. Maintained 4.6/5 rating with 15K+ reviews.",
      },
    ],
    faqs: [
      {
        question: "How accurate is the AI pose detection?",
        answer:
          "ML Kit achieves 93%+ joint detection accuracy in standard lighting. We validate exercises against certified personal trainer guidance and provide confidence scores so users know when detection is reliable.",
      },
      {
        question: "How does the dynamic workout plan adaptation work?",
        answer:
          "Our algorithm analyses completion rate, self-reported exertion, and optional heart rate data to adjust workout difficulty weekly. The system learns your recovery patterns over time for increasingly personalised plans.",
      },
      {
        question: "Does the app work without internet?",
        answer:
          "Yes — downloaded workout plans, exercise videos, and tracking data are all available offline. Social features require connectivity. Data syncs automatically when connection is restored.",
      },
      {
        question: "Can I use the app with a fitness tracker?",
        answer:
          "Yes, we integrate with Google Fit for importing data from Garmin, Mi Band, boAt, and other platforms, providing a unified view of your fitness activity.",
      },
      {
        question: "How do team challenges and leaderboards work?",
        answer:
          "You can create or join teams of up to 30 members. Challenges are time-bounded with goals like total workout minutes or streak days. Leaderboards update in real-time during active challenges.",
      },
    ],
  },
  "devops-pipeline-pro": {
    slug: "devops-pipeline-pro",
    title: "DevOps Pipeline Pro",
    subtitle: "CI/CD & DevOps Automation Platform",
    category: "Cloud & DevOps",
    client: "DriftLine",
    duration: "5 months",
    description:
      "A DevOps platform automating 85+ daily deployments across 45+ microservices, with a visual pipeline builder, GitOps deployment, and intelligent rollback with ML-powered anomaly detection.",
    heroImage: "/images/projects/devops-pipeline-pro-hero.jpg",
    overview:
      "DevOps Pipeline Pro is an internal developer platform built for DriftLine's 50+ engineering team. It automates 85+ daily deployments across 45+ microservices with zero-downtime blue-green deployments. The platform includes a visual pipeline builder, GitOps workflow management, and ML-powered anomaly detection that reduces failed deployments by 65%.",
    challenge:
      "DriftLine's teams used 5 different CI/CD tools with no standardisation, causing 2-hour average deployment times and frequent manual rollbacks. Each team had different security configurations, slowing down compliance. They needed a unified platform without the cost of enterprise SaaS tools.",
    solution:
      "Built a unified DevOps platform with a visual pipeline builder (React + Go backend), GitOps workflow engine using ArgoCD, and blue-green/canary deployment strategies. Implemented ML-powered anomaly detection on Prometheus metrics. Reduced deployment time from 2 hours to 15 minutes.",
    galleryImages: [
      "/images/projects/devops-pipeline-pro-1.jpg",
      "/images/projects/devops-pipeline-pro-2.jpg",
    ],
    features: [
      "Visual CI/CD pipeline builder with 30+ pre-built steps",
      "GitOps workflow management with ArgoCD integration",
      "Blue-green and canary deployment strategies",
      "ML-powered deployment anomaly detection",
      "Automatic rollback with health check gates",
      "Self-service environment provisioning",
      "Policy-as-code with OPA integration",
      "Deployment analytics and cost attribution",
    ],
    metrics: [
      { label: "Daily Deployments", value: "85+" },
      { label: "Microservices Managed", value: "45+" },
      { label: "Deployment Time", value: "15min" },
      { label: "Failed Deployment Reduction", value: "65%" },
    ],
    results: [
      {
        stat: "87%",
        title: "Reduction in Deployment Time",
        description:
          "Visual pipeline builder and self-service environments reduced average deployment time from 2 hours to 15 minutes, saving 30+ hours of engineering time weekly.",
      },
      {
        stat: "65%",
        title: "Fewer Failed Deployments",
        description:
          "ML-powered anomaly detection and automatic rollback reduced failed deployment rate from 14% to 4.9%, reducing on-call incidents significantly.",
      },
      {
        stat: "₹12L",
        title: "Annual Infrastructure Savings",
        description:
          "Intelligent resource scaling and rightsizing recommendations delivered ₹12L in annual cloud infrastructure savings across 45+ microservices.",
      },
    ],
    techStack: [
      "Go",
      "React",
      "TypeScript",
      "ArgoCD",
      "Kubernetes",
      "Helm",
      "Prometheus",
      "OPA",
      "Terraform",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Discovery & Audit",
        description:
          "Audited 5 existing CI/CD tools, mapped 45+ microservice deployment patterns, and identified ML anomaly detection requirements.",
      },
      {
        label: "Phase 2",
        title: "Architecture & Design",
        description:
          "Designed unified pipeline builder, built GitOps workflow engine with ArgoCD, and created ML anomaly detection pipeline using Prometheus metrics.",
      },
      {
        label: "Phase 3",
        title: "Development & Testing",
        description:
          "Built visual pipeline builder with Go backend. Implemented blue-green and canary deployment strategies. Ran deployment stress tests across 45+ microservices.",
      },
      {
        label: "Phase 4",
        title: "Launch & Scale",
        description:
          "Phased rollout across all engineering teams. Achieved 85+ daily deployments with 65% fewer failures. Delivered ₹12L in annual infrastructure savings.",
      },
    ],
    faqs: [
      {
        question: "How does the ML anomaly detection work?",
        answer:
          "We collect 30+ metrics per deployment using Prometheus. Our ML model learns normal deployment patterns per service and flags deviations in real-time, triggering automatic health checks and rollback if checks fail.",
      },
      {
        question: "Can we migrate from our existing CI/CD tools?",
        answer:
          "Yes, we provide migration tooling that converts Jenkins, GitHub Actions, and GitLab CI configs to our platform format. Migration can be done service by service with parallel runs to validate behaviour.",
      },
      {
        question: "How does GitOps integration work?",
        answer:
          "We integrate with ArgoCD. Your deployment manifests live in Git, and our platform syncs them to your clusters with full diff visibility and rollback capability.",
      },
      {
        question: "What security controls are built in?",
        answer:
          "We implement policy-as-code using OPA with pre-built policies for common compliance needs. All secrets are managed through HashiCorp Vault with automatic rotation.",
      },
      {
        question: "How do you handle deployment rollbacks?",
        answer:
          "Rollbacks trigger automatically when health checks fail or ML anomaly score exceeds threshold. Rollback completes in under 90 seconds using our blue-green strategy. All rollbacks are logged with a full audit trail.",
      },
    ],
  },
  "cloudwatch-pro": {
    slug: "cloudwatch-pro",
    title: "CloudWatch Pro",
    subtitle: "Unified Cloud Observability Platform",
    category: "Cloud & DevOps",
    client: "SwiftBridge Cloud",
    duration: "4 months",
    description:
      "A unified observability platform ingesting 85GB/day of metrics, logs, and traces across AWS and on-premise infrastructure, with ML-powered root cause analysis and intelligent alerting that reduced alert fatigue by 75%.",
    heroImage: "/images/projects/cloudwatch-pro-hero.jpg",
    overview:
      "CloudWatch Pro is a centralised observability platform built for SwiftBridge Cloud, a Bengaluru-based SaaS company. It ingests 85GB/day of metrics, logs, and traces, providing unified dashboards, ML-powered root cause analysis, and intelligent alerting. The platform serves 320+ engineers across 8 teams, reducing alert fatigue by 75%.",
    challenge:
      "SwiftBridge's engineers used 4 different monitoring tools, causing context-switching and missed correlations. Alert fatigue was severe — 1,200+ daily alerts with an 80% false positive rate. Critical incidents were often detected by customers first, damaging reputation and causing churn.",
    solution:
      "Built a unified observability platform with OpenTelemetry-native ingestion, storing data in ClickHouse for high-cardinality metrics and Elasticsearch for log analysis. Implemented ML-powered root cause analysis using distributed trace correlation. Created an intelligent alert engine with dynamic thresholds and noise reduction.",
    galleryImages: [
      "/images/projects/cloudwatch-pro-1.jpg",
      "/images/projects/cloudwatch-pro-2.jpg",
    ],
    features: [
      "Unified metrics, logs, and traces across AWS and on-premise",
      "OpenTelemetry-native ingestion with auto-instrumentation",
      "ML-powered root cause analysis with trace correlation",
      "Intelligent alerting with dynamic thresholds and noise reduction",
      "Distributed tracing with flame graph visualisation",
      "Real-time log aggregation with full-text search",
      "SLO tracking with burn rate alerting",
      "Custom dashboards with drag-and-drop widgets",
    ],
    metrics: [
      { label: "Daily Data Ingest", value: "85GB+" },
      { label: "Alert Reduction", value: "75%" },
      { label: "Engineers Served", value: "320+" },
      { label: "MTTR Reduction", value: "55%" },
    ],
    results: [
      {
        stat: "75%",
        title: "Reduction in Alert Volume",
        description:
          "Intelligent alert engine with ML noise reduction cut daily alert volume from 1,200+ to under 300 while maintaining 100% coverage of genuine incidents, eliminating alert fatigue.",
      },
      {
        stat: "55%",
        title: "Faster Incident Resolution",
        description:
          "ML-powered root cause analysis reduced MTTR from 38 minutes to under 17 minutes, preventing an estimated ₹32L in annual incident-related losses.",
      },
      {
        stat: "100%",
        title: "Real Incident Detection",
        description:
          "Zero customer-reported incidents without internal detection in the first 12 months, compared to 5 per month before the platform.",
      },
    ],
    techStack: [
      "Go",
      "React",
      "TypeScript",
      "ClickHouse",
      "Elasticsearch",
      "Kafka",
      "OpenTelemetry",
      "Kubernetes",
      "Grafana",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Discovery & Audit",
        description:
          "Audited 4 existing monitoring tools, mapped alert noise patterns, and identified ML root cause analysis requirements across 8 engineering teams.",
      },
      {
        label: "Phase 2",
        title: "Architecture & Design",
        description:
          "Designed OpenTelemetry ingestion pipeline, built ClickHouse + Elasticsearch storage layer, and created ML alert noise reduction engine.",
      },
      {
        label: "Phase 3",
        title: "Development & Testing",
        description:
          "Built unified observability platform with trace correlation. Implemented ML root cause analysis. Ran false positive rate benchmarking against existing tools.",
      },
      {
        label: "Phase 4",
        title: "Launch & Scale",
        description:
          "Phased rollout across 8 teams. Scaled to 85GB+ daily ingest. Achieved 75% alert reduction with 100% real incident coverage.",
      },
    ],
    faqs: [
      {
        question: "How does ML-powered root cause analysis work?",
        answer:
          "When an incident triggers, our system correlates metric anomalies with distributed trace spans and log events using a multi-stage ML pipeline. It identifies the most probable root cause by analysing temporal correlations and error propagation patterns, presented as a ranked list with supporting evidence.",
      },
      {
        question: "How does the intelligent alert engine reduce noise?",
        answer:
          "We use three techniques: dynamic thresholds that adapt to traffic patterns, multi-signal correlation requiring multiple signals to agree before alerting, and automatic alert grouping that clusters related alerts into single incidents.",
      },
      {
        question: "Can we migrate from our existing monitoring tools?",
        answer:
          "Yes, we provide migration tooling for Datadog, Prometheus, and CloudWatch. We can import dashboards, alerts, and historical data incrementally with parallel operation to validate consistency.",
      },
      {
        question: "What is the data retention policy?",
        answer:
          "Default retention is 30 days for high-resolution metrics and 60 days for logs. We offer configurable retention tiers with long-term archival to S3 for compliance. Data can be downsampled over time to reduce storage costs.",
      },
      {
        question: "How do you handle data sovereignty?",
        answer:
          "All data is stored on AWS Mumbai (ap-south-1) by default. For strict on-premise requirements, we support fully self-hosted deployment where data never leaves your infrastructure.",
      },
    ],
  },
};

export function getProjectData(slug: string) {
  return projectsData[slug] ?? null;
}