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
  isActive: boolean;
  slug: string;
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
    description: getProjectData(p.slug)?.description ?? "",
  }));
}

const projectsData: Record<string, ProjectPageData> = {
  "health-track-pro": {
    slug: "health-track-pro",
    title: "HealthTrack Pro",
    subtitle: "Enterprise Health Monitoring Platform",
    category: "Mobile Development",
    client: "VitaCare Health",
    duration: "6 months",
    description:
      "A HIPAA-compliant mobile platform enabling real-time health monitoring, wearable device integration, and AI-powered health insights for enterprise clients.",
    heroImage: "/images/projects/health-track-pro-hero.jpg",
    overview:
      "HealthTrack Pro is a comprehensive health monitoring platform designed for healthcare enterprises. It integrates with multiple wearable devices, provides real-time health metrics, and uses AI to detect anomalies before they become critical. The platform serves 8,500+ patients across 6 hospital networks.",
    challenge:
      "VitaCare Health needed to consolidate fragmented health data from various wearables and hospital systems into a unified, secure platform. Compliance requirements, real-time data synchronization, and legacy system integration posed significant technical challenges.",
    solution:
      "Built a React Native cross-platform app with a robust Node.js backend. Implemented end-to-end encryption, OAuth 2.0 + SAML SSO for enterprise authentication, and a FHIR-compliant API layer for EHR integration. The AI engine processes 150K+ data points daily using TensorFlow Lite on-device inference.",
    galleryImages: [
      "/images/projects/health-track-pro-1.jpg",
      "/images/projects/health-track-pro-2.jpg",
    ],
    features: [
      "Real-time wearable integration (Apple Watch, Fitbit, Garmin)",
      "AI-powered anomaly detection with 94% accuracy",
      "FHIR-compliant EHR data synchronization",
      "HIPAA-compliant end-to-end encryption",
      "Customizable health dashboards for clinical staff",
      "Offline-first architecture with background sync",
      "Multi-language support (12 languages)",
      "Telehealth video integration",
    ],
    metrics: [
      { label: "Active Users", value: "8.5K+" },
      { label: "Data Points / Day", value: "150K+" },
      { label: "Uptime", value: "99.9%" },
      { label: "Anomaly Detection", value: "91%" },
    ],
    results: [
      {
        stat: "30%",
        title: "Reduction in Hospital Readmissions",
        description:
          "Early anomaly detection enabled proactive interventions, reducing 30-day readmission rates by 30% across participating hospital networks.",
      },
      {
        stat: "50%",
        title: "Faster Clinical Decision Making",
        description:
          "Unified dashboards gave clinicians instant access to patient history, reducing average diagnosis time from 45 minutes to 22 minutes.",
      },
      {
        stat: "SOC 2",
        title: "Type II & HIPAA Certified",
        description:
          "Achieved full compliance certification within 4 months, enabling enterprise sales in regulated healthcare markets.",
      },
    ],
    techStack: [
      "React Native",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "TensorFlow Lite",
      "FHIR R4 API",
      "AWS Lambda",
      "CloudFront",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Discovery & Audit",
        description:
          "Mapped legacy EHR systems, identified integration points, and established FHIR compliance requirements across 6 hospital networks.",
      },
      {
        label: "Phase 2",
        title: "Architecture & Design",
        description:
          "Designed offline-first architecture with real-time sync, built FHIR R4 API layer, and prototyped AI anomaly detection pipeline.",
      },
      {
        label: "Phase 3",
        title: "Development & Testing",
        description:
          "Built React Native app with TensorFlow Lite on-device inference. Ran HIPAA compliance audits and clinical user acceptance testing.",
      },
      {
        label: "Phase 4",
        title: "Launch & Scale",
        description:
          "Phased rollout across 6 hospitals. Achieved HIPAA compliance certification. Scaled to 8.5K+ active users within 2 months of launch.",
      },
    ],
    faqs: [
      {
        question: "How does the wearable device integration work?",
        answer:
          "Our platform uses Bluetooth Low Energy (BLE) to connect with compatible wearables. We support Apple HealthKit, Google Fit, and manufacturer-specific APIs, normalizing all data into our unified schema regardless of the source device.",
      },
      {
        question: "Is the platform HIPAA compliant?",
        answer:
          "Yes, HealthTrack Pro is fully HIPAA compliant. We implement end-to-end encryption, role-based access controls, audit logging, and regular third-party security audits. Our infrastructure is hosted on HIPAA-eligible AWS services.",
      },
      {
        question: "Can it integrate with our existing EHR system?",
        answer:
          "Absolutely. We built a FHIR R4-compliant API layer that integrates with Epic, Cerner, Allscripts, and other major EHR systems. Custom integration for legacy systems is also available through our professional services team.",
      },
      {
        question: "How does the AI anomaly detection work?",
        answer:
          "The AI engine uses a combination of rule-based thresholds and machine learning models trained on anonymized health data. It runs on-device using TensorFlow Lite for privacy, with cloud fallback for complex cases. Detection accuracy is 94% with a false positive rate under 2%.",
      },
      {
        question: "What is the typical deployment timeline?",
        answer:
          "A standard enterprise deployment takes 3-4 months. This includes sandbox environment setup, EHR integration, staff training, and phased rollout. We offer accelerated timelines for organizations with existing cloud infrastructure.",
      },
    ],
  },
  "finflow-dashboard": {
    slug: "finflow-dashboard",
    title: "FinFlow Dashboard",
    subtitle: "Next-Gen Financial Analytics Platform",
    category: "Web Development",
    client: "Meridian Capital Partners",
    duration: "8 months",
    description:
      "A high-performance financial analytics dashboard processing $180M+ in daily transactions, featuring real-time charts, risk scoring, and automated reporting for institutional traders.",
    heroImage: "/images/projects/finflow-dashboard-hero.jpg",
    overview:
      "FinFlow Dashboard replaces legacy Excel-based reporting with a real-time analytics platform. Built for high-frequency trading desks, it processes $180M+ in daily transactions, delivers sub-150ms latency, and provides portfolio managers with instant visibility across global markets.",
    challenge:
      "Meridian Capital Partners relied on manual Excel reports updated nightly, causing traders to miss critical intraday movements. Legacy systems, fragmented data sources, and strict regulatory compliance requirements made modernization risky and complex.",
    solution:
      "Designed a modular React + WebSocket architecture that streams data from Kafka-backed microservices. Built custom D3.js visualizations optimized for 5,000+ data points. Implemented column-level encryption and zero-trust architecture for regulatory compliance, achieving sub-150ms end-to-end latency.",
    galleryImages: [
      "/images/projects/finflow-dashboard-1.jpg",
      "/images/projects/finflow-dashboard-2.jpg",
    ],
    features: [
      "Real-time data streaming via WebSocket (sub-100ms latency)",
      "Interactive D3.js charts with 10,000+ point rendering",
      "Custom risk scoring algorithms with explainable AI",
      "Multi-asset portfolio management (Equities, FX, Derivatives)",
      "Automated regulatory reporting (MiFID II, Dodd-Frank)",
      "Role-based dashboards for traders, PMs, and compliance",
      "Audit trail with full data lineage tracking",
      "Mobile-responsive companion app for iOS and Android",
    ],
    metrics: [
      { label: "Daily Volume", value: "$180M+" },
      { label: "Latency", value: "<150ms" },
      { label: "Data Points Live", value: "75K+" },
      { label: "Uptime", value: "99.9%" },
    ],
    results: [
      {
        stat: "55%",
        title: "Faster Decision Making",
        description:
          "Real-time dashboards reduced the time from data availability to trading decision from 90 minutes to 40 minutes on average.",
      },
      {
        stat: "$2.1M",
        title: "Annual Cost Reduction",
        description:
          "Replaced manual processes and legacy infrastructure, delivering $2.1M in annual operational savings across the trading desk.",
      },
      {
        stat: "MiFID II",
        title: "Compliance Achieved",
        description:
          "Automated reporting reduced compliance preparation time from 2 weeks to 3 days while achieving full regulatory alignment.",
      },
    ],
    techStack: [
      "React",
      "TypeScript",
      "D3.js",
      "Node.js",
      "Kafka",
      "TimescaleDB",
      "WebSocket",
      "Kubernetes",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Discovery & Audit",
        description:
          "Analyzed legacy reporting workflows, identified data sources, and mapped regulatory requirements for MiFID II and Dodd-Frank.",
      },
      {
        label: "Phase 2",
        title: "Architecture & Design",
        description:
          "Designed modular React + WebSocket architecture, built custom D3.js visualizations, and implemented zero-trust security model.",
      },
      {
        label: "Phase 3",
        title: "Development & Testing",
        description:
          "Built Kafka-backed microservices, implemented column-level encryption, and ran performance tests for sub-100ms latency.",
      },
      {
        label: "Phase 4",
        title: "Launch & Scale",
        description:
          "Phased rollout across trading desks. Achieved MiFID II compliance. Scaled to $2B+ daily volume with sub-100ms latency.",
      },
    ],
    faqs: [
      {
        question: "How does the real-time data streaming work?",
        answer:
          "Data flows from source systems through Apache Kafka topics, processed by Node.js microservices, and pushed to the client via WebSocket connections. We use TimescaleDB for time-series storage with continuous aggregates for query performance.",
      },
      {
        question: "What is the data latency from source to dashboard?",
        answer:
          "End-to-end latency is under 100ms from the exchange feed to visible on the dashboard. This is achieved through optimized Kafka consumer groups, in-memory caching, and WebSocket push rather than polling.",
      },
      {
        question: "How does the risk scoring system work?",
        answer:
          "Our risk engine combines historical volatility models, sector correlation matrices, and real-time position Greeks. It's built on XGBoost with SHAP values for explainability, giving traders actionable insights with clear reasoning.",
      },
      {
        question: "Is the platform scalable for global deployments?",
        answer:
          "Yes, the architecture supports horizontal scaling. We deploy via Kubernetes across multiple regions with geo-distributed Kafka clusters ensuring data locality and compliance with regional data sovereignty requirements.",
      },
      {
        question: "What regulatory reporting standards are supported?",
        answer:
          "We support MiFID II, Dodd-Frank, EMIR, and Basel III reporting through configurable templates. The system auto-generates XML and JSON payloads from transaction data with full audit trail documentation.",
      },
    ],
  },
  "ai-support-bot": {
    slug: "ai-support-bot",
    title: "AI Support Bot",
    subtitle: "Intelligent Customer Service Platform",
    category: "AI & Automation",
    client: "LuxeCart",
    duration: "4 months",
    description:
      "An LLM-powered customer service platform handling 15K+ daily conversations with 85% resolution rate, integrating with existing CRM and knowledge bases for seamless human handoff.",
    heroImage: "/images/projects/ai-support-bot-hero.jpg",
    overview:
      "LuxeCart needed to scale customer support without adding headcount. We built an AI agent platform powered by fine-tuned LLMs that handles 15,000+ daily conversations across email, chat, and social channels. The system achieves 85% first-contact resolution while maintaining a 4.5/5 customer satisfaction score.",
    challenge:
      "LuxeCart faced 250% YoY support ticket growth during rapid expansion. Their existing team couldn't scale, response times exceeded 24 hours, and customer satisfaction dropped to 3.4/5. They needed AI that could understand context, maintain brand voice, and escalate gracefully.",
    solution:
      "Built a multi-agent orchestration system with specialized LLMs for intent detection, response generation, and sentiment analysis. Implemented RAG pipelines over their existing Zendesk and Shopify data with semantic search. Designed a human-in-the-loop escalation system with full conversation context transfer.",
    galleryImages: [
      "/images/projects/ai-support-bot-1.jpg",
      "/images/projects/ai-support-bot-2.jpg",
    ],
    features: [
      "Multi-channel support (Email, Live Chat, WhatsApp, Twitter)",
      "RAG-powered responses from CRM and knowledge bases",
      "Intent classification with 96% accuracy",
      "Sentiment detection with escalation triggers",
      "Real-time human agent handoff with context preservation",
      "Custom brand voice training on company data",
      "Analytics dashboard with CSAT and resolution metrics",
      "Multi-language support (25 languages)",
    ],
    metrics: [
      { label: "Daily Conversations", value: "15K+" },
      { label: "Resolution Rate", value: "85%" },
      { label: "Avg Response Time", value: "<45s" },
      { label: "Customer CSAT", value: "4.5/5" },
    ],
    results: [
      {
        stat: "250%",
        title: "Support Volume Increase, Same Team",
        description:
          "AI handled 75% of incoming tickets, allowing the human team to focus on complex cases while volume grew 2.5x without new hires.",
      },
      {
        stat: "45 seconds",
        title: "Response Time Reduced from 24hrs",
        description:
          "Instant AI responses eliminated the backlog, improving customer experience and reducing escalation rates by 55%.",
      },
      {
        stat: "$380K",
        title: "Annual Savings in Support Costs",
        description:
          "Automating routine inquiries delivered $380K in annual cost savings through reduced agent hours and faster resolution.",
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
      "Zendesk API",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Discovery & Audit",
        description:
          "Analyzed support ticket patterns, identified knowledge gaps, and mapped existing CRM and Zendesk data sources.",
      },
      {
        label: "Phase 2",
        title: "Architecture & Design",
        description:
          "Designed multi-agent orchestration system, built RAG pipelines over existing data, and created human-in-the-loop escalation workflow.",
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
          "Phased rollout across email, chat, and social channels. Achieved 89% first-contact resolution. Scaled to 100K+ daily conversations.",
      },
    ],
    faqs: [
      {
        question: "How does the AI maintain brand voice?",
        answer:
          "We fine-tune on your historical support conversations and brand guidelines. The model learns your terminology, tone, and response patterns, ensuring consistency across all AI-generated responses.",
      },
      {
        question: "How does the human handoff work?",
        answer:
          "When confidence drops below threshold or sentiment indicates frustration, the conversation is escalated to a human agent with full context including conversation history, customer profile, and recommended responses. This ensures no information loss during handoff.",
      },
      {
        question: "Can it integrate with our existing tools?",
        answer:
          "Yes, we have pre-built connectors for Zendesk, Salesforce, Intercom, Shopify, and HubSpot. For custom systems, we provide REST APIs and webhook support for seamless integration with your existing tech stack.",
      },
      {
        question: "How do you handle sensitive customer data?",
        answer:
          "We implement PII detection and redaction in real-time. All data is encrypted at rest and in transit. We offer SOC 2 Type II compliant deployment options including private cloud and on-premises for organizations with strict data sovereignty requirements.",
      },
      {
        question: "How long does implementation take?",
        answer:
          "A typical implementation takes 4-8 weeks. The first 2 weeks involve data audit and RAG pipeline setup. Weeks 3-4 are for model training and integration. Weeks 5-8 cover testing, fine-tuning, and phased rollout. Enterprise deployments with multiple channels may take longer.",
      },
    ],
  },
  "cloud-sync-platform": {
    slug: "cloud-sync-platform",
    title: "CloudSync Platform",
    subtitle: "Enterprise Cloud Migration & Sync Solution",
    category: "Cloud & DevOps",
    client: "NexaBridge Tech",
    duration: "5 months",
    description:
      "A comprehensive cloud sync platform enabling real-time data synchronization across multi-cloud environments with conflict resolution, monitoring, and automated failover.",
    heroImage: "/images/projects/cloud-sync-platform-hero.jpg",
    overview:
      "CloudSync Platform is a migration and synchronization solution built for enterprises managing data across AWS, GCP, and Azure. It handles 8TB+ daily data transfers with real-time conflict detection, automated disaster recovery failover, and comprehensive monitoring dashboards.",
    challenge:
      "NexaBridge Tech needed to migrate 120TB of legacy data to multi-cloud architecture while maintaining 24/7 operations. They faced data integrity risks, complex governance requirements, and zero-downtime constraints that their existing tools couldn't address.",
    solution:
      "Built a distributed sync engine using Apache Pulsar for ordered message delivery, with custom conflict resolution algorithms. Implemented a blue-green migration strategy with automated rollback capabilities. Created a real-time monitoring system using Prometheus and Grafana with custom SLA tracking.",
    galleryImages: [
      "/images/projects/cloud-sync-platform-1.jpg",
      "/images/projects/cloud-sync-platform-2.jpg",
    ],
    features: [
      "Real-time multi-cloud sync (AWS, GCP, Azure)",
      "Conflict detection and resolution algorithms",
      "Automated disaster recovery with <5min failover",
      "End-to-end data encryption with customer-managed keys",
      "Real-time monitoring and alerting via Prometheus/Grafana",
      "Audit logging and compliance reporting",
      "Bandwidth throttling and scheduling",
      "Data transformation and filtering pipelines",
    ],
    metrics: [
      { label: "Daily Transfer", value: "8TB+" },
      { label: "Failover Time", value: "<4min" },
      { label: "Data Integrity", value: "99.99%" },
      { label: "Uptime", value: "99.9%" },
    ],
    results: [
      {
        stat: "120TB",
        title: "Migrated with Zero Downtime",
        description:
          "Successfully completed a 5-month migration project 1 week ahead of schedule with no service interruption to production systems.",
      },
      {
        stat: "99.99%",
        title: "Data Integrity Achieved",
        description:
          "Comprehensive validation and checksum verification ensured zero data loss across 50+ billion records during migration.",
      },
      {
        stat: "40%",
        title: "Reduction in Cloud Costs",
        description:
          "Intelligent data tiering and bandwidth optimization reduced monthly cloud spend by $45K while improving performance.",
      },
    ],
    techStack: [
      "Go",
      "Apache Pulsar",
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
          "Analyzed legacy data sources, mapped governance requirements, and identified multi-cloud architecture constraints.",
      },
      {
        label: "Phase 2",
        title: "Architecture & Design",
        description:
          "Designed distributed sync engine using Apache Pulsar, built conflict resolution algorithms, and created blue-green migration strategy.",
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
          "Phased rollout across AWS, GCP, and Azure. Achieved 99.999% data integrity. Scaled to 50TB+ daily transfers with zero downtime.",
      },
    ],
    faqs: [
      {
        question: "How does the conflict resolution work?",
        answer:
          "We use a combination of timestamp-based last-write-wins, vector clocks for causal ordering, and custom business rules. Conflicts are detected in real-time and either auto-resolved or flagged for manual review depending on your configuration.",
      },
      {
        question: "What happens during a cloud provider outage?",
        answer:
          "Our automated failover system detects outages within 30 seconds and switches to a pre-configured secondary region. The sync engine queues incoming changes and replays them once the primary is restored, ensuring zero data loss.",
      },
      {
        question: "Can we use our own encryption keys?",
        answer:
          "Yes, we support customer-managed encryption keys (CMEK) for all major cloud providers. Your keys never leave your cloud environment, and we support bring-your-own-key (BYOK) for maximum security and compliance.",
      },
      {
        question: "How do you ensure data security during transfer?",
        answer:
          "All data is encrypted in transit using TLS 1.3 and at rest using AES-256. We also support VPN tunnels and private cloud connections for organizations with strict network security requirements.",
      },
      {
        question: "What monitoring and reporting is available?",
        answer:
          "We provide comprehensive dashboards showing sync status, throughput, latency, errors, and SLA compliance. Reports can be exported in PDF or integrated directly with your existing BI tools via our REST API.",
      },
    ],
  },
  "ecommerce-replatform": {
    slug: "ecommerce-replatform",
    title: "E-Commerce Replatform",
    subtitle: "High-Performance Headless Commerce Platform",
    category: "Web Development",
    client: "Urban Threads Co",
    duration: "7 months",
    description:
      "A headless commerce platform enabling 5x faster page loads, improved conversion rates, and seamless omnichannel integration for a fashion retailer processing 650K+ monthly visitors.",
    heroImage: "/images/projects/ecommerce-replatform-hero.jpg",
    overview:
      "Urban Threads Co migrated from a monolithic Magento platform to a modern headless architecture. The new platform delivers 5x faster page loads through edge caching, 30% higher conversion rates through optimized checkout flows, and unified inventory across 18 retail locations and 2PL partners.",
    challenge:
      "Urban Threads' legacy Magento platform couldn't handle peak traffic, with 6-second page load times during sales events causing 60% cart abandonment. They needed better mobile experience, faster iteration cycles, and integrated inventory management across channels.",
    solution:
      "Built a Next.js + GraphQL headless frontend with Cloudflare edge caching, achieving sub-second page loads globally. Implemented Shopify's backend for inventory and orders with custom integrations to their POS and 2PL systems. Optimized checkout flow reduced steps from 5 to 3, increasing completion rates by 25%.",
    galleryImages: [
      "/images/projects/ecommerce-replatform-1.jpg",
      "/images/projects/ecommerce-replatform-2.jpg",
    ],
    features: [
      "Sub-second page loads via edge caching and ISR",
      "Personalized product recommendations using ML",
      "Optimized checkout flow (5 to 3 steps)",
      "Real-time inventory across 18+ locations",
      "Multi-currency and multi-language support",
      "AB testing framework for continuous optimization",
      "Integrated loyalty and rewards program",
      "Mobile-first design with offline capability",
    ],
    metrics: [
      { label: "Monthly Visitors", value: "650K+" },
      { label: "Page Load", value: "<1.2s" },
      { label: "Conversion Lift", value: "+30%" },
      { label: "Cart Abandonment", value: "-50%" },
    ],
    results: [
      {
        stat: "5x",
        title: "Performance Improvement",
        description:
          "Page load times reduced from 6 seconds to under 1.2 seconds, directly correlating with 28% higher engagement and 30% better conversion on mobile.",
      },
      {
        stat: "$1.8M",
        title: "Revenue Increase in Year One",
        description:
          "Faster performance and optimized checkout delivered $1.8M in additional revenue through higher conversion rates and reduced abandonment.",
      },
      {
        stat: "55%",
        title: "Faster Feature Delivery",
        description:
          "Headless architecture reduced deployment cycles from 2 weeks to 4 days, enabling the team to ship 2x more features in the first year.",
      },
    ],
    techStack: [
      "Next.js",
      "GraphQL",
      "Shopify",
      "Cloudflare",
      "Tailwind CSS",
      "Node.js",
      "PostgreSQL",
      "Algolia",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Discovery & Audit",
        description:
          "Analyzed legacy Magento platform performance, identified traffic bottlenecks, and mapped inventory management requirements.",
      },
      {
        label: "Phase 2",
        title: "Architecture & Design",
        description:
          "Designed Next.js + GraphQL headless architecture, built edge caching strategy, and created checkout flow optimization plan.",
      },
      {
        label: "Phase 3",
        title: "Development & Testing",
        description:
          "Built Next.js frontend with Cloudflare edge caching. Implemented Shopify backend integrations and ran load tests for peak traffic.",
      },
      {
        label: "Phase 4",
        title: "Launch & Scale",
        description:
          "Phased rollout across retail locations. Achieved 10x performance improvement. Scaled to 5M+ monthly visitors with sub-second page loads.",
      },
    ],
    faqs: [
      {
        question: "Why did you choose a headless architecture?",
        answer:
          "Headless commerce decouples the frontend from the backend, allowing independent scaling and iteration. For StyleHub, this meant 10x faster performance through edge caching, faster development cycles, and the flexibility to add new touchpoints (apps, kiosks, social commerce) without backend changes.",
      },
      {
        question: "How does the inventory synchronization work?",
        answer:
          "We built a real-time inventory sync service that connects Shopify's inventory system with their POS systems and 3PL partners via webhooks and API integrations. The system handles 50+ concurrent updates per second with conflict resolution for oversells.",
      },
      {
        question: "Can the platform handle Black Friday scale?",
        answer:
          "Absolutely. We load tested to 50x normal traffic. Edge caching, auto-scaling Kubernetes clusters, and database read replicas handle traffic spikes gracefully. During last year's Black Friday, we served 2M visitors with zero downtime and sub-second response times.",
      },
      {
        question: "How does the personalization engine work?",
        answer:
          "We use collaborative filtering and content-based recommendation algorithms trained on browsing history, purchase data, and real-time behavior. Recommendations are served from edge with <10ms latency and A/B tested continuously for optimization.",
      },
      {
        question: "What is the migration approach?",
        answer:
          "We use a parallel migration strategy with feature flags. Traffic is gradually shifted from legacy to new platform, with instant rollback capability. Data migration runs in batches with validation at each step to ensure zero data loss.",
      },
    ],
  },
  "ml-prediction-engine": {
    slug: "ml-prediction-engine",
    title: "ML Prediction Engine",
    subtitle: "Real-Time Machine Learning Inference Platform",
    category: "AI & Data",
    client: "VantageMetrics",
    duration: "6 months",
    description:
      "A real-time ML inference platform enabling sub-10ms predictions at 100K requests/second, powering demand forecasting, fraud detection, and dynamic pricing for enterprise clients.",
    heroImage: "/images/projects/ml-prediction-engine-hero.jpg",
    overview:
      "PredictFlow needed a production ML platform that could serve predictions in real-time for fraud detection and demand forecasting. We built a distributed inference system that processes 100,000 predictions per second with sub-10ms latency, achieving 99.9% availability.",
    challenge:
      "PredictFlow's data science team had excellent models but no reliable way to serve them in production. Their batch prediction approach caused 24-hour delays, missing critical fraud events and causing inventory stockouts. They needed real-time inference at enterprise scale.",
    solution:
      "Built a model serving platform using NVIDIA Triton Inference Server with custom batching strategies. Deployed models across 5 regions with automatic load balancing. Implemented model versioning and A/B testing infrastructure for continuous improvement while maintaining 99.9% availability.",
    galleryImages: [
      "/images/projects/ml-prediction-engine-1.jpg",
      "/images/projects/ml-prediction-engine-2.jpg",
    ],
    features: [
      "Sub-15ms inference latency at 12K requests/second",
      "Multi-model serving with automatic load balancing",
      "Model versioning with zero-downtime deployments",
      "A/B testing and champion-challenger frameworks",
      "Real-time feature store with <8ms lookup",
      "Automatic model drift detection and alerting",
      "GPU and CPU inference optimization",
      "Comprehensive model monitoring and explainability",
    ],
    metrics: [
      { label: "Requests/Second", value: "12K+" },
      { label: "Latency", value: "<15ms" },
      { label: "Availability", value: "99.5%" },
      { label: "Models in Production", value: "8+" },
    ],
    results: [
      {
        stat: "94%",
        title: "Fraud Detection Rate, <60ms Response",
        description:
          "Real-time fraud scoring enabled detection and blocking of fraudulent transactions in under 60ms, catching 94% of fraud attempts and saving $650K monthly.",
      },
      {
        stat: "25%",
        title: "Reduction in Inventory Costs",
        description:
          "Accurate demand forecasting reduced overstock and stockouts by 25%, freeing up $1.2M in working capital previously tied up in excess inventory.",
      },
      {
        stat: "ML Lifecycle",
        title: "from Weeks to Days",
        description:
          "Self-service deployment tools reduced time-to-production for new models from 2 weeks to 2 days, accelerating data science impact by 5x.",
      },
    ],
    techStack: [
      "Python",
      "NVIDIA Triton",
      "TensorFlow",
      "PyTorch",
      "Kubernetes",
      "Redis",
      "Kafka",
      "Grafana",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Discovery & Audit",
        description:
          "Analyzed existing models, identified production serving bottlenecks, and mapped real-time inference requirements.",
      },
      {
        label: "Phase 2",
        title: "Architecture & Design",
        description:
          "Designed distributed inference system using NVIDIA Triton, built model versioning strategy, and created A/B testing infrastructure.",
      },
      {
        label: "Phase 3",
        title: "Development & Testing",
        description:
          "Built model serving platform with custom batching strategies. Ran load tests for sub-10ms latency and availability.",
      },
      {
        label: "Phase 4",
        title: "Launch & Scale",
        description:
          "Phased rollout across 5 regions. Achieved 99.9% availability. Scaled to 100K+ requests/second with sub-10ms latency.",
      },
    ],
    faqs: [
      {
        question: "How do you achieve sub-10ms latency?",
        answer:
          "We use several techniques: GPU inference with optimized kernels, intelligent batching to maximize throughput, feature store with in-memory caching for common features, and edge deployment of lightweight models. Pre-warming and connection pooling eliminate cold start delays.",
      },
      {
        question: "How do you handle model versioning and rollback?",
        answer:
          "Every model deployment gets a versioned endpoint. Traffic can be split between versions for A/B testing or instantly shifted back to a previous version with a single API call. Rollback completes in under 30 seconds with zero prediction interruption.",
      },
      {
        question: "Can you explain model predictions for compliance?",
        answer:
          "Yes, we integrate with SHAP and LIME for model explainability. Every prediction includes feature importance scores explaining which inputs drove the output. This supports GDPR article 22 compliance and regulatory requirements in financial services.",
      },
      {
        question: "How do you detect and handle model drift?",
        answer:
          "We continuously monitor prediction distributions, feature statistics, and business KPIs. When drift is detected (using statistical tests and custom thresholds), alerts fire and optional automatic rollback can trigger. Drift detection runs on every 100K predictions.",
      },
      {
        question: "What monitoring is available?",
        answer:
          "Comprehensive dashboards show request volume, latency percentiles, error rates, GPU utilization, and model accuracy metrics. Custom alerts can be configured for any metric, with integrations to PagerDuty, Slack, and email.",
      },
    ],
  },
  "real-time-collaboration": {
    slug: "real-time-collaboration",
    title: "Real-Time Collaboration",
    subtitle: "Enterprise Collaborative Workspace Platform",
    category: "Web Development",
    client: "Synapse Workspace",
    duration: "5 months",
    description:
      "A real-time collaborative workspace enabling 50,000+ concurrent users to edit documents, whiteboard, and video conference simultaneously with end-to-end encryption and enterprise SSO.",
    heroImage: "/images/projects/real-time-collaboration-hero.jpg",
    overview:
      "TeamSync's platform enables distributed teams to collaborate in real-time across documents, whiteboards, and video. The platform supports 50,000+ concurrent users with CRDT-based conflict resolution, sub-100ms sync latency, and end-to-end encryption for enterprise security.",
    challenge:
      "TeamSync's existing collaboration tools couldn't scale beyond 50 simultaneous users without severe lag. Their document sync used operational transforms that broke down with complex edits. They needed a solution that could handle their 50,000 user enterprise deployment with rock-solid reliability.",
    solution:
      "Implemented Yjs CRDT for conflict-free real-time editing across all document types. Built a WebSocket-based presence and sync infrastructure with global PoPs for low latency. Used end-to-end encryption with key management through AWS KMS, achieving SOC 2 compliance.",
    galleryImages: [
      "/images/projects/real-time-collaboration-1.jpg",
      "/images/projects/real-time-collaboration-2.jpg",
    ],
    features: [
      "CRDT-based real-time document editing (8K+ concurrent users)",
      "Sub-120ms sync latency via global edge network",
      "End-to-end encryption with customer-managed keys",
      "Real-time cursors and presence indicators",
      "Integrated video conferencing with screen sharing",
      "Version history with instant rollback",
      "Enterprise SSO (SAML, OIDC) integration",
      "Offline-first with automatic conflict resolution",
    ],
    metrics: [
      { label: "Concurrent Users", value: "8K+" },
      { label: "Sync Latency", value: "<120ms" },
      { label: "Availability", value: "99.9%" },
      { label: "Document Edits", value: "850K+/day" },
    ],
    results: [
      {
        stat: "50%",
        title: "Faster Team Collaboration",
        description:
          "Real-time editing and integrated communication reduced meeting time by 35% and document review cycles from 4 days to 2 days.",
      },
      {
        stat: "Zero",
        title: "Sync Conflicts in Year One",
        description:
          "CRDT-based architecture ensured 100% conflict-free collaboration across 850K+ daily edits with zero data loss incidents.",
      },
      {
        stat: "SOC 2",
        title: "Type II Certified",
        description:
          "End-to-end encryption and comprehensive security controls enabled SOC 2 certification within 3 months, unlocking enterprise sales.",
      },
    ],
    techStack: [
      "React",
      "Yjs",
      "WebSocket",
      "Node.js",
      "Redis",
      "PostgreSQL",
      "AWS KMS",
      "Cloudflare",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Discovery & Audit",
        description:
          "Analyzed existing collaboration tools, identified scaling bottlenecks, and mapped enterprise deployment requirements.",
      },
      {
        label: "Phase 2",
        title: "Architecture & Design",
        description:
          "Designed CRDT-based architecture, built WebSocket presence infrastructure, and created end-to-end encryption workflow.",
      },
      {
        label: "Phase 3",
        title: "Development & Testing",
        description:
          "Built Yjs CRDT editor with WebSocket sync. Ran load tests for 50K+ concurrent users and SOC 2 compliance.",
      },
      {
        label: "Phase 4",
        title: "Launch & Scale",
        description:
          "Phased rollout across enterprise deployment. Achieved SOC 2 Type II certification. Scaled to 50K+ concurrent users with sub-100ms sync latency.",
      },
    ],
    faqs: [
      {
        question: "How does CRDT-based collaboration work?",
        answer:
          "CRDTs (Conflict-free Replicated Data Types) allow multiple users to edit simultaneously without coordination. Each user's changes are merged deterministically, ensuring all clients converge to the same state regardless of network delays or conflicts. We use Yjs for text and custom CRDTs for structured data.",
      },
      {
        question: "How do you achieve such low latency globally?",
        answer:
          "We deploy WebSocket servers across 25 global PoPs using Cloudflare's network. User traffic is routed to the nearest server, with intelligent geo-routing for mobile users. Document state is replicated across regions for instant failover.",
      },
      {
        question: "How does end-to-end encryption work?",
        answer:
          "Documents are encrypted client-side using AES-256-GCM before transmission. Keys are managed through AWS KMS with customer-managed key support. The server only sees encrypted data and cannot decrypt content, ensuring privacy even during infrastructure breaches.",
      },
      {
        question: "What happens offline?",
        answer:
          "The platform works offline with local changes stored in IndexedDB. When connectivity returns, changes sync automatically using the CRDT merge algorithm. Conflict resolution happens seamlessly without user intervention.",
      },
      {
        question: "How do you handle security and compliance?",
        answer:
          "We implement defense-in-depth: end-to-end encryption, SAML/OIDC SSO, IP allowlisting, audit logging, and data residency controls. We maintain SOC 2 Type II, ISO 27001, and GDPR compliance with annual third-party audits.",
      },
    ],
  },
  "datapulse-saas": {
    slug: "datapulse-saas",
    title: "DataPulse SaaS",
    subtitle: "B2B Analytics & Business Intelligence Platform",
    category: "Web Development",
    client: "InsightFlow Analytics",
    duration: "9 months",
    description:
      "A multi-tenant SaaS analytics platform enabling 200+ enterprise clients to unify, visualize, and share business data across teams with real-time dashboards and white-label reporting.",
    heroImage: "/images/projects/datapulse-saas-hero.jpg",
    overview:
      "DataPulse SaaS is a white-label business intelligence platform designed for SaaS companies and enterprises. It supports 200+ concurrent tenants with row-level security, custom branding, and embedded analytics. The platform processes 10B+ events daily and serves insights to 500K+ end users across finance, sales, and operations teams.",
    challenge:
      "DataMetrics Corp needed to replace fragmented reporting tools with a unified platform that could handle massive data volumes while allowing each enterprise client to maintain their own data isolation and branding. They needed multi-tenancy with zero compromise on performance or security.",
    solution:
      "Built a React + TypeScript frontend with a GraphQL API layer over a Postgres + ClickHouse data warehouse. Implemented row-level security and tenant isolation at the database level. Created a white-label theming engine with CSS variable injection and custom domain support. Used materialized views and intelligent caching to achieve sub-second queries on 2B+ row datasets.",
    galleryImages: [
      "/images/projects/datapulse-saas-1.jpg",
      "/images/projects/datapulse-saas-2.jpg",
    ],
    features: [
      "Multi-tenant architecture with complete data isolation",
      "White-label branding engine with custom CSS injection",
      "Sub-second query performance on 2B+ row datasets",
      "Real-time data pipelines (CDC via Debezium + Kafka)",
      "Custom dashboard builder with drag-and-drop widgets",
      "Embedded analytics with iframe and API modes",
      "SSO integration (SAML, OIDC, Google Workspace)",
      "Role-based access with column and row-level security",
    ],
    metrics: [
      { label: "Enterprise Clients", value: "45+" },
      { label: "Daily Events", value: "1.2B+" },
      { label: "End Users", value: "65K+" },
      { label: "Query Latency", value: "<1.5s" },
    ],
    results: [
      {
        stat: "$1.2M",
        title: "ARR Growth in Year One",
        description:
          "White-label offering unlocked 12+ new enterprise deals worth $1.2M in ARR, growing the customer base by 150% without expanding the sales team.",
      },
      {
        stat: "99.9%",
        title: "Multi-Tenant Uptime",
        description:
          "Isolated tenant architecture with dedicated connection pools ensured 99.9% uptime even during peak query loads across 45+ clients.",
      },
      {
        stat: "75%",
        title: "Faster Report Generation",
        description:
          "Materialized views and intelligent caching reduced average report generation from 30 seconds to under 8 seconds, dramatically improving user adoption.",
      },
    ],
    techStack: [
      "React",
      "TypeScript",
      "GraphQL",
      "Node.js",
      "PostgreSQL",
      "ClickHouse",
      "Kafka",
      "Redis",
      "Kubernetes",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Discovery & Audit",
        description:
          "Analyzed data warehouse architecture, identified multi-tenancy requirements, and mapped security and branding needs for enterprise clients.",
      },
      {
        label: "Phase 2",
        title: "Architecture & Design",
        description:
          "Designed multi-tenant Postgres schema with row-level security, built GraphQL API layer, and created white-label theming engine.",
      },
      {
        label: "Phase 3",
        title: "Development & Testing",
        description:
          "Built React dashboard builder with drag-and-drop widgets. Implemented CDC pipelines with Debezium and Kafka. Ran multi-tenant load tests.",
      },
      {
        label: "Phase 4",
        title: "Launch & Scale",
        description:
          "Phased rollout across 200+ enterprise clients. Achieved white-label certification. Scaled to 500K+ end users with 99.99% uptime.",
      },
    ],
    faqs: [
      {
        question: "How does multi-tenancy work in the platform?",
        answer:
          "Each tenant gets a dedicated schema with row-level security policies. Connection pools are partitioned per tenant to prevent noisy neighbor issues. Data is never shared between tenants — even at the caching layer.",
      },
      {
        question: "Can we embed analytics in our own product?",
        answer:
          "Yes, we offer both iframe embedding and REST API modes. You can embed entire dashboards or individual widgets. SSO can be shared with your parent application for seamless user experience.",
      },
      {
        question: "How do you handle data freshness?",
        answer:
          "We use change data capture (CDC) via Debezium feeding into Apache Kafka, with near-real-time materialized view refreshes. Typical data freshness is under 30 seconds from source system change to dashboard update.",
      },
      {
        question: "What database systems are supported?",
        answer:
          "The platform can connect to PostgreSQL, MySQL, ClickHouse, BigQuery, Snowflake, Redshift, and any system with a JDBC/ODBC driver. We provide pre-built connectors with automatic schema discovery.",
      },
      {
        question: "What is the typical onboarding timeline?",
        answer:
          "A new tenant can be onboarded in under 2 hours including SSO configuration, data source connection, and initial dashboard setup. Our self-service onboarding wizard guides users through each step.",
      },
    ],
  },
  "healthconnect-enterprise-portal": {
    slug: "healthconnect-enterprise-portal",
    title: "HealthConnect Portal",
    subtitle: "Healthcare Provider Collaboration Platform",
    category: "Web Development",
    client: "CareNet Health Systems",
    duration: "7 months",
    description:
      "A HIPAA-compliant provider portal enabling 15,000+ doctors, nurses, and administrators to securely share patient records, coordinate care, and manage referrals across 80 hospital networks.",
    heroImage: "/images/projects/healthconnect-enterprise-portal-hero.jpg",
    overview:
      "HealthConnect Portal is a secure web platform for healthcare provider networks. It enables real-time patient record sharing, care coordination, and referral management across 80 hospital networks serving 15,000+ clinicians. Built with zero-trust security architecture and FHIR R4 compliance, the platform handles 500K+ daily clinical document exchanges.",
    challenge:
      "MedGroup Alliance operated 80 independent hospitals with incompatible EHR systems. Clinicians couldn't share patient records digitally, forcing fax-based communication that caused care delays and medical errors. They needed a secure platform that worked across all their hospital systems while maintaining HIPAA compliance.",
    solution:
      "Built a FHIR R4-compliant API gateway that normalizes data from Epic, Cerner, and Allscripts EHR systems. Implemented zero-trust security with mTLS client certificates and continuous re-authentication. Created a role-based document sharing system with full audit trails and consent management, achieving HIPAA and SOC 2 Type II compliance.",
    galleryImages: [
      "/images/projects/healthconnect-enterprise-portal-1.jpg",
      "/images/projects/healthconnect-enterprise-portal-2.jpg",
    ],
    features: [
      "FHIR R4-compliant API gateway for all major EHR systems",
      "Real-time patient record sharing across hospital networks",
      "Care coordination with task management and notifications",
      "Referral management with automated routing logic",
      "Zero-trust security with mTLS and continuous authentication",
      "Consent management with patient-controlled data sharing",
      "Full audit trail and clinical document versioning",
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
          "Digital record sharing eliminated fax-based communication delays, reducing average care coordination time from 2 days to 6 hours across all 12 hospital networks.",
      },
      {
        stat: "$1.8M",
        title: "Annual Savings in Admin Costs",
        description:
          "Automated referral routing and digital document exchange eliminated 8,000+ monthly fax transactions, saving $1.8M annually in administrative overhead.",
      },
      {
        stat: "Zero",
        title: "HIPAA Breaches in 2 Years",
        description:
          "Zero-trust architecture and continuous security monitoring ensured zero HIPAA data breaches since launch, with annual third-party penetration testing passing with no critical findings.",
      },
    ],
    techStack: [
      "Next.js",
      "TypeScript",
      "FHIR R4",
      "Node.js",
      "PostgreSQL",
      "Redis",
      "Kubernetes",
      "Vault",
      "Istio",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Discovery & Audit",
        description:
          "Analyzed all 12 hospital EHR systems, mapped data flows, and identified FHIR compliance requirements for HIPAA and SOC 2.",
      },
      {
        label: "Phase 2",
        title: "Architecture & Design",
        description:
          "Designed FHIR R4 API gateway, built zero-trust security architecture, and created consent management and audit trail systems.",
      },
      {
        label: "Phase 3",
        title: "Development & Testing",
        description:
          "Built FHIR-compliant API layer for Epic, Cerner, and Allscripts. Implemented mTLS and Istio service mesh. Ran HIPAA compliance audits.",
      },
      {
        label: "Phase 4",
        title: "Launch & Scale",
        description:
          "Phased rollout across 12 hospital networks. Achieved SOC 2 Type II certification. Scaled to 3.2K+ active clinicians with 85K+ daily exchanges.",
      },
    ],
    faqs: [
      {
        question: "Which EHR systems does the platform integrate with?",
        answer:
          "We have certified FHIR R4 integrations with Epic, Cerner, Allscripts, Athenahealth, and MEDITECH. For legacy systems, we offer custom HL7 FHIR converter development with our professional services team.",
      },
      {
        question: "How does the zero-trust security model work?",
        answer:
          "Every request is authenticated with mTLS client certificates, validated against short-lived JWTs, and authorized based on role and context. Sessions timeout after 15 minutes of inactivity, and all data access is logged to immutable audit trails.",
      },
      {
        question: "Can patients control who sees their records?",
        answer:
          "Yes, we implement a granular consent management system where patients can specify which providers can access specific record types. Consent is enforced at the FHIR gateway level and can be updated in real-time through the patient portal.",
      },
      {
        question: "How do you handle data sovereignty requirements?",
        answer:
          "We deploy isolated tenant databases per hospital network with configurable data residency. You can choose AWS, Azure, or Google Cloud regions, and we support bring-your-own-key (BYOK) encryption for maximum data sovereignty.",
      },
      {
        question: "What happens during an outage?",
        answer:
          "The platform is deployed with multi-region active-active failover. During an outage, traffic automatically routes to the secondary region with no user action required. Critical care coordination features have offline capability with local caching for essential clinical documents.",
      },
    ],
  },
  "fooddash-flutter": {
    slug: "fooddash-flutter",
    title: "FoodDash",
    subtitle: "Multi-Vendor Food Delivery Platform",
    category: "Mobile Development",
    client: "FlavorFleet",
    duration: "5 months",
    description:
      "A Flutter-powered food delivery app connecting 2M+ users with 15,000+ restaurants, featuring real-time order tracking, smart recommendations, and multi-vendor cart support across iOS and Android.",
    heroImage: "/images/projects/fooddash-flutter-hero.jpg",
    overview:
      "FoodDash is a Flutter cross-platform app for a growing food delivery marketplace. It handles 2M+ monthly active users ordering from 15,000+ restaurants across 12 cities. Key features include real-time driver tracking with live map, group ordering with multi-vendor cart, and ML-powered recommendations that increase average order value by 28%.",
    challenge:
      "QuickBite needed to launch a multi-vendor delivery platform competing with established players. They needed iOS and Android coverage within 5 months while supporting complex features like multi-vendor carts and real-time tracking. Their previous React Native approach had performance issues during peak hours.",
    solution:
      "Built a Flutter app with a BLoC architecture for clean separation of concerns. Implemented real-time order tracking using Firebase Realtime Database with WebSocket fallback. Created a sophisticated cart engine supporting multiple vendors with split delivery options. Used Cloud Functions for order processing and Stripe for multi-party payments.",
    galleryImages: [
      "/images/projects/fooddash-flutter-1.jpg",
      "/images/projects/fooddash-flutter-2.jpg",
    ],
    features: [
      "Real-time driver tracking with live map and ETA",
      "Multi-vendor cart with split delivery options",
      "ML-powered restaurant and menu recommendations",
      "Group ordering with shared cart and voting",
      "In-app chat between customers and drivers",
      "Push notifications with deep linking",
      "Apple Pay and Google Pay integration",
      "Offline mode for browsing menus and saved addresses",
    ],
    metrics: [
      { label: "Monthly Active Users", value: "320K+" },
      { label: "Restaurant Partners", value: "2.8K+" },
      { label: "Avg Order Value Lift", value: "+22%" },
      { label: "App Store Rating", value: "4.6/5" },
    ],
    results: [
      {
        stat: "30%",
        title: "Higher Order Value vs Competitors",
        description:
          "ML recommendations and multi-vendor cart features drove 30% higher average order value compared to single-vendor competitors, with 25% of orders spanning multiple restaurants.",
      },
      {
        stat: "4.6/5",
        title: "App Store Rating Across 12K+ Reviews",
        description:
          "Smooth 60fps animations, instant search results, and reliable real-time tracking earned 4.6/5 stars from over 12,000 App Store and Google Play reviews.",
      },
      {
        stat: "<4min",
        title: "Average Driver Assignment Time",
        description:
          "Intelligent driver matching with proximity algorithms reduced average driver assignment time from 7 minutes to under 4 minutes, improving customer satisfaction.",
      },
    ],
    techStack: [
      "Flutter",
      "Dart",
      "Firebase",
      "Cloud Functions",
      "Google Maps API",
      "Stripe Connect",
      "TensorFlow Lite",
      "GetX",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Discovery & Audit",
        description:
          "Analyzed competitor apps, identified multi-vendor cart requirements, and mapped real-time tracking and payment integration needs.",
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
          "Built Flutter app with real-time tracking and ML recommendations. Ran performance profiling for 60fps animations. Published to App Store and Play Store.",
      },
      {
        label: "Phase 4",
        title: "Launch & Scale",
        description:
          "Phased rollout across 12 cities. Scaled to 2M+ MAU. Achieved 4.8/5 app store rating with 50K+ reviews in first 6 months.",
      },
    ],
    faqs: [
      {
        question: "Why did you choose Flutter over React Native?",
        answer:
          "Flutter's native rendering engine provided consistent 60fps performance across all UI elements, especially for the complex map animations and real-time tracking features. We also saw 30% smaller APK sizes compared to the React Native bundle.",
      },
      {
        question: "How does the multi-vendor cart work?",
        answer:
          "Our cart engine groups items by restaurant and coordinates delivery scheduling. You can order from multiple restaurants in one checkout — items from each restaurant are packed and delivered separately by the assigned driver for that vendor.",
      },
      {
        question: "How does real-time driver tracking work?",
        answer:
          "Driver locations are pushed via Firebase Realtime Database with WebSocket fallback for reliability. The Flutter app subscribes to location updates and renders them on a Google Map with smooth interpolation between updates for fluid animation.",
      },
      {
        question: "How do you handle payments between multiple vendors?",
        answer:
          "We use Stripe Connect with application fees. Each restaurant has a connected account, and payments are automatically split with our platform taking a commission. This handles all tax calculations and payout schedules automatically.",
      },
      {
        question: "How does the recommendation engine work?",
        answer:
          "We use TensorFlow Lite for on-device inference, analyzing your order history, browsing patterns, time of day, and location. Recommendations are personalized and update in real-time based on your interactions within the session.",
      },
    ],
  },
  "paymate-react-native": {
    slug: "paymate-react-native",
    title: "PayMate",
    subtitle: "Mobile Banking App",
    category: "Mobile Development",
    client: "NovaPay",
    duration: "6 months",
    description:
      "A React Native mobile banking app serving 5M+ users with instant transfers, biometric authentication, AI-powered fraud detection, and real-time spend analytics across iOS and Android.",
    heroImage: "/images/projects/paymate-react-native-hero.jpg",
    overview:
      "PayMate is a modern mobile banking app replacing MetroBank's legacy 15-year-old mobile app. It serves 5M+ users with instant P2P transfers, biometric authentication, AI-powered fraud detection, and real-time spend analytics. The app achieved 4.9/5 rating with zero critical security incidents since launch.",
    challenge:
      "MetroBank's legacy app had a 2.1/5 rating and was losing customers to neobanks. Security was insufficient (SMS OTP only), the UX was confusing (32 screens to make a transfer), and technical debt made new feature development take 6+ months. They needed a complete rewrite while maintaining regulatory compliance.",
    solution:
      "Built a React Native app with a clean architecture (domain-driven design layers). Implemented biometric authentication (Face ID, fingerprint, PIN fallback) with device-bound key storage. Created an ML fraud detection engine running on-device for privacy. Designed a streamlined UX reducing transfer flow to 5 steps and achieving 4.9/5 App Store rating.",
    galleryImages: [
      "/images/projects/paymate-react-native-1.jpg",
      "/images/projects/paymate-react-native-2.jpg",
    ],
    features: [
      "Biometric authentication (Face ID, fingerprint, PIN)",
      "Instant P2P transfers with QR codes and UPI",
      "AI-powered on-device fraud detection",
      "Real-time spend analytics with category insights",
      "Digital card management with instant block/unblock",
      "Bill pay with automatic reminders",
      "Investment tracking and portfolio view",
      "Multilingual support (8 languages)",
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
          "Complete UX redesign with streamlined flows (5 steps vs 18) drove app store rating from 2.8 to 4.7, becoming the #1 rated banking app in the region within 2 months.",
      },
      {
        stat: "150%",
        title: "Increase in Mobile Transactions",
        description:
          "Frictionless UX and instant transfers drove mobile transaction volume from $45M to $110M monthly within 6 months of launch.",
      },
      {
        stat: "97.5%",
        title: "Fraud Prevention Rate",
        description:
          "On-device ML fraud detection prevented $2.4M in fraudulent transactions in the first year while maintaining a sub-0.3% false positive rate.",
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
          "Analyzed legacy app pain points, mapped regulatory requirements (PCI-DSS, PSD2), and identified security and UX improvement priorities.",
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
          "Built React Native app with streamlined UX and AI fraud detection. Ran PCI-DSS compliance testing and penetration testing with third-party security firm.",
      },
      {
        label: "Phase 4",
        title: "Launch & Scale",
        description:
          "Phased rollout with feature flags. Scaled to 5M+ users. Achieved 4.9/5 app store rating with zero critical security incidents.",
      },
    ],
    faqs: [
      {
        question: "How does on-device fraud detection work?",
        answer:
          "We use TensorFlow Lite models running entirely on the device. The model analyzes transaction patterns, device behavior, and contextual signals without sending raw data to the cloud. This provides privacy-first fraud prevention with sub-50ms inference time.",
      },
      {
        question: "What happens if biometric authentication fails?",
        answer:
          "We implement a fallback chain: biometric → device PIN → backup questions →人工客服. All fallbacks trigger additional verification steps (like one-time code via trusted channel) to maintain security.",
      },
      {
        question: "How do you ensure PCI-DSS compliance?",
        answer:
          "Card data is tokenized immediately on input using device-bound tokens. Raw card numbers never touch our servers — they go directly to our PCI-DSS certified payment processor via encrypted channel. We undergo annual QSA audits and penetration testing.",
      },
      {
        question: "Can the app work offline?",
        answer:
          "Core features like balance viewing, transaction history, and bill pay work offline with locally cached data. Transfers require connectivity for security verification. Card management (block/unblock) is available offline and executes on reconnection.",
      },
      {
        question: "How do you handle multi-language support?",
        answer:
          "We use i18n with react-intl, supporting 8 languages with RTL layouts. All strings are externalized to translation files with automatic fallback to English. Language preference syncs across devices via the backend.",
      },
    ],
  },
  "fitforce-android": {
    slug: "fitforce-android",
    title: "FitForce",
    subtitle: "AI Fitness Platform",
    category: "Mobile Development",
    client: "PulseFit",
    duration: "5 months",
    description:
      "A Jetpack Compose Android app with 1M+ downloads, featuring AI pose detection for real-time workout feedback, personalized training plans, and social challenges with leaderboards.",
    heroImage: "/images/projects/fitforce-android-hero.jpg",
    overview:
      "FitForce is a native Android fitness app built with Jetpack Compose. It uses ML Kit for real-time pose detection providing exercise form feedback, generates personalized training plans based on goals and progress, and gamifies fitness with social challenges and leaderboards. The app has 1M+ downloads with a 4.7/5 Play Store rating.",
    challenge:
      "FitLife's existing fitness apps had high churn — 70% of users stopped exercising within 30 days. The main issues were: generic workout plans that didn't adapt to user progress, no exercise form feedback causing injury fears, and lack of social accountability that would keep users engaged.",
    solution:
      "Built a native Android app with Jetpack Compose and MVVM architecture. Integrated ML Kit for real-time pose detection with 15ms inference time providing visual form corrections. Created a dynamic training plan engine that adapts difficulty based on completion rate and heart rate. Designed social features with group challenges, leaderboards, and streak-based gamification.",
    galleryImages: [
      "/images/projects/fitforce-android-1.jpg",
      "/images/projects/fitforce-android-2.jpg",
    ],
    features: [
      "Real-time AI pose detection with form feedback (15ms latency)",
      "Dynamic workout plans that adapt to user progress",
      "Heart rate zone tracking via Wear OS integration",
      "Social challenges with team leaderboards",
      "Streak system with milestone rewards",
      "Workout sharing with video recording",
      "Offline workout downloads for gym use",
      "Nutrition tracking integration with macro goals",
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
          "Personalized AI workout plans and social accountability features increased 30-day retention from 35% to 58%, making FitForce one of the top-retention fitness apps in its category.",
      },
      {
        stat: "4.6/5",
        title: "Play Store Rating with 15K+ Reviews",
        description:
          "Native Jetpack Compose UI with smooth animations and intuitive navigation achieved 4.6/5 stars from 15,000+ reviews, outperforming cross-platform alternatives.",
      },
      {
        stat: "25%",
        title: "Reduction in Workout-Related Injuries",
        description:
          "AI pose detection providing real-time form feedback reduced reported workout-related injuries by 25%, with users reporting higher confidence in their exercise technique.",
      },
    ],
    techStack: [
      "Jetpack Compose",
      "Kotlin",
      "ML Kit Pose Detection",
      "Wear OS",
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
          "Analyzed existing fitness app pain points, identified AI pose detection requirements, and mapped social feature and gamification needs.",
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
          "Achieved 1M+ downloads in 5 months. Maintained 4.7/5 rating with 80K+ reviews. Expanded to Wear OS integration for heart rate tracking.",
      },
    ],
    faqs: [
      {
        question: "How accurate is the AI pose detection?",
        answer:
          "ML Kit achieves 95%+ joint detection accuracy in controlled environments. We validate exercises against certified personal trainer guidance, and provide confidence scores to users so they know when detection is reliable. Accuracy degrades in low light or very tight clothing — we surface warnings in those conditions.",
      },
      {
        question: "How does the dynamic workout plan adaptation work?",
        answer:
          "Our algorithm analyzes completion rate, perceived exertion (self-reported), and optional heart rate data to adjust workout difficulty weekly. If you're consistently completing workouts early and feeling energized, difficulty increases. If you're struggling, it adjusts. The system learns your recovery patterns over time.",
      },
      {
        question: "Does the app work without internet?",
        answer:
          "Yes — downloaded workout plans, exercise videos, and tracking data are available offline. Social features (leaderboards, challenges) require connectivity. Data syncs automatically when connection is restored.",
      },
      {
        question: "Can I use the app with a fitness tracker?",
        answer:
          "Yes, we integrate with Wear OS devices for heart rate tracking during workouts. We also support Google Fit for importing data from Garmin, Fitbit, and other platforms, providing a unified view of your fitness activity.",
      },
      {
        question: "How do team challenges and leaderboards work?",
        answer:
          "You can create or join teams of up to 50 members. Challenges are time-bounded (weekly, monthly) with goals like total workout minutes or streak days. Leaderboards update in real-time during active challenges. Team members can encourage each other through in-app reactions and messages.",
      },
    ],
  },
  "devops-pipeline-pro": {
    slug: "devops-pipeline-pro",
    title: "DevOps Pipeline Pro",
    subtitle: "CI/CD & DevOps Automation Platform",
    category: "Cloud & DevOps",
    client: "DriftLine",
    duration: "6 months",
    description:
      "A comprehensive DevOps platform automating 500+ daily deployments across 200+ microservices, with custom pipeline builders, GitOps deployment, and intelligent rollback with ML-powered anomaly detection.",
    heroImage: "/images/projects/devops-pipeline-pro-hero.jpg",
    overview:
      "DevOps Pipeline Pro is an internal developer platform serving TechScale's 300+ engineering teams. It automates 500+ daily deployments across 200+ microservices with zero-downtime blue-green deployments. The platform includes a visual pipeline builder, GitOps workflow management, and ML-powered anomaly detection that reduces failed deployments by 70%.",
    challenge:
      "TechScale's engineering teams used 12 different CI/CD tools with no standardization, causing 3-hour average deployment times and 40% of deployments requiring manual rollback. Each team had different security configurations, and compliance audits took 2 weeks to prepare. They needed a unified platform that could govern all 200+ microservices while empowering developer velocity.",
    solution:
      "Built a unified DevOps platform with a visual pipeline builder (React + Go backend), GitOps workflow engine using ArgoCD, and custom deployment strategies (blue-green, canary, rolling). Implemented ML-powered anomaly detection on deployment metrics using Prometheus data. Created a self-service platform that reduced deployment time from 3 hours to 12 minutes while maintaining compliance and security guardrails.",
    galleryImages: [
      "/images/projects/devops-pipeline-pro-1.jpg",
      "/images/projects/devops-pipeline-pro-2.jpg",
    ],
    features: [
      "Visual CI/CD pipeline builder with 50+ pre-built steps",
      "GitOps workflow management with ArgoCD integration",
      "Blue-green and canary deployment strategies",
      "ML-powered deployment anomaly detection",
      "Automatic rollback with health check gates",
      "Self-service environment provisioning",
      "Policy-as-code with OPA integration",
      "Comprehensive deployment analytics and cost attribution",
    ],
    metrics: [
      { label: "Daily Deployments", value: "85+" },
      { label: "Microservices Managed", value: "45+" },
      { label: "Deployment Time", value: "15min" },
      { label: "Failed Deployment Reduction", value: "65%" },
    ],
    results: [
      {
        stat: "90%",
        title: "Reduction in Deployment Time",
        description:
          "Visual pipeline builder and self-service environments reduced average deployment time from 2.5 hours to 15 minutes, unlocking 35+ hours of engineering time weekly.",
      },
      {
        stat: "65%",
        title: "Fewer Failed Deployments",
        description:
          "ML-powered anomaly detection and automatic rollback reduced failed deployment rate from 12% to 4.2%, preventing production incidents and reducing on-call burden.",
      },
      {
        stat: "$850K",
        title: "Annual Infrastructure Savings",
        description:
          "Intelligent resource scaling and rightsizing recommendations delivered $850K in annual cloud infrastructure savings across 45+ microservices.",
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
      "Vault",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Discovery & Audit",
        description:
          "Audited 12 existing CI/CD tools, mapped 200+ microservice deployment patterns, and identified ML anomaly detection requirements.",
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
          "Built visual pipeline builder with Go backend. Implemented blue-green and canary deployment strategies. Ran deployment stress tests across 200+ microservices.",
      },
      {
        label: "Phase 4",
        title: "Launch & Scale",
        description:
          "Phased rollout across 300+ engineering teams. Achieved 500+ daily deployments with 70% fewer failures. Saved $6M in annual infrastructure costs.",
      },
    ],
    faqs: [
      {
        question: "How does the ML anomaly detection work?",
        answer:
          "We collect 50+ metrics per deployment (CPU, memory, latency, error rate, etc.) using Prometheus. Our ML model learns normal deployment patterns per service and flags deviations in real-time. Anomaly scores trigger automatic health checks, with rollback triggered if checks fail.",
      },
      {
        question: "Can we migrate from our existing CI/CD tools?",
        answer:
          "Yes, we provide migration tooling that converts Jenkinsfiles, GitHub Actions, GitLab CI, and CircleCI configs to our platform format. Migration can be done incrementally — one service at a time with parallel runs to validate behavior.",
      },
      {
        question: "How does GitOps integration work?",
        answer:
          "We integrate with ArgoCD for GitOps workflows. Your deployment manifests live in Git, and our platform syncs them to your clusters with full diff visibility and rollback capability. We support both push and pull-based GitOps models.",
      },
      {
        question: "What security controls are built in?",
        answer:
          "We implement policy-as-code using OPA, with pre-built policies for common compliance frameworks (SOC 2, PCI-DSS, HIPAA). All secrets are managed through HashiCorp Vault with automatic rotation. Network policies and service mesh integration provide defense-in-depth.",
      },
      {
        question: "How do you handle deployment rollbacks?",
        answer:
          "Rollbacks are triggered automatically when health checks fail or when ML anomaly score exceeds threshold. Rollback completes in under 60 seconds using our blue-green strategy with pre-staged healthy versions. All rollbacks are logged with full audit trail.",
      },
    ],
  },
  "cloudwatch-pro": {
    slug: "cloudwatch-pro",
    title: "CloudWatch Pro",
    subtitle: "Unified Cloud Observability Platform",
    category: "Cloud & DevOps",
    client: "SwiftBridge Cloud",
    duration: "5 months",
    description:
      "A unified observability platform ingesting 500GB/day of metrics, logs, and traces across AWS, GCP, and Azure, with ML-powered root cause analysis and intelligent alerting that reduced alert fatigue by 80%.",
    heroImage: "/images/projects/cloudwatch-pro-hero.jpg",
    overview:
      "CloudWatch Pro is a centralized observability platform for enterprises managing multi-cloud infrastructure. It ingests 500GB/day of metrics, logs, and traces from AWS, GCP, and Azure, providing unified dashboards, ML-powered root cause analysis, and intelligent alerting. The platform serves 1,500+ engineers across 40 teams, reducing alert fatigue by 80%.",
    challenge:
      "CloudFirst's engineers used 8 different monitoring tools across cloud providers, causing context-switching and missed correlations. Alert fatigue was severe — 10,000+ alerts per day with 95% false positive rate. Critical incidents were often detected by customers before the engineering team, causing reputation damage and revenue loss.",
    solution:
      "Built a unified observability platform with OpenTelemetry-native ingestion, storing data in ClickHouse for high-cardinality time-series and Elasticsearch for log analysis. Implemented ML-powered root cause analysis using distributed trace correlation. Created an intelligent alert engine with dynamic thresholds and noise reduction, reducing alert volume by 80% while catching 100% of real incidents.",
    galleryImages: [
      "/images/projects/cloudwatch-pro-1.jpg",
      "/images/projects/cloudwatch-pro-2.jpg",
    ],
    features: [
      "Unified metrics, logs, and traces across AWS, GCP, Azure",
      "OpenTelemetry-native ingestion with auto-instrumentation",
      "ML-powered root cause analysis with trace correlation",
      "Intelligent alerting with dynamic thresholds and noise reduction",
      "Distributed tracing with flame graph visualization",
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
          "ML-powered root cause analysis with distributed trace correlation reduced MTTR from 38 minutes to under 17 minutes, preventing an estimated $380K in annual incident-related losses.",
      },
      {
        stat: "100%",
        title: "Real Incident Detection",
        description:
          "Zero customer-reported incidents without internal detection in 12 months, compared to 6 per month before the platform, proving 100% real incident coverage.",
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
      "PyTorch",
      "Grafana",
    ],
    timeline: [
      {
        label: "Phase 1",
        title: "Discovery & Audit",
        description:
          "Audited 8 existing monitoring tools, mapped alert noise patterns, and identified ML root cause analysis requirements across 40 engineering teams.",
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
          "Phased rollout across 40 teams. Scaled to 500GB+ daily ingest. Achieved 80% alert reduction with 100% real incident coverage.",
      },
    ],
    faqs: [
      {
        question: "How does ML-powered root cause analysis work?",
        answer:
          "When an incident triggers, our system correlates metrics anomalies with distributed trace spans and log events using a multi-stage ML pipeline. It identifies the most probable root cause by analyzing temporal correlations, error propagation patterns, and historical incident data. Results are presented as a ranked list with supporting evidence.",
      },
      {
        question: "How does the intelligent alert engine reduce noise?",
        answer:
          "We use three techniques: (1) Dynamic thresholds that adapt to traffic patterns, (2) Multi-signal correlation that requires multiple signals to agree before alerting, and (3) Alert Suppression rules that automatically group related alerts into single incidents. The ML model is trained on your historical alert data to learn your normal patterns.",
      },
      {
        question: "Can we migrate from our existing monitoring tools?",
        answer:
          "Yes, we provide migration tooling for Datadog, CloudWatch, Prometheus, and Splunk. We can import dashboards, alerts, and historical data. Migration can be done incrementally with parallel operation to validate data consistency.",
      },
      {
        question: "What's the data retention policy?",
        answer:
          "Default retention is 30 days for high-resolution metrics and 90 days for logs. We offer configurable retention tiers with long-term archival to S3/GCS for compliance. Data can also be downsampled over time to reduce storage costs.",
      },
      {
        question: "How do you handle multi-cloud data sovereignty?",
        answer:
          "Each cloud provider's data stays in that provider's region by default. We offer global aggregation views without centralizing raw data. For strict data sovereignty requirements, we support fully distributed deployment where data never leaves its source cloud.",
      },
    ],
  },
};

export function getProjectData(slug: string) {
  return projectsData[slug] ?? null;
}

