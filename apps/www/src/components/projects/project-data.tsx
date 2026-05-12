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
  "cloudwatch-pro": {
  slug: "bpifrance-emergency-funding",
  title: "Bpifrance: National Crisis Response Platform",
  subtitle:
    "Workholo engineered a rapid-response financial platform to support large-scale emergency funding operations.",
  category: "Web Development",
  client: "Bpifrance",
  duration: "5 Days",

  description:
    "During a critical economic emergency, Workholo collaborated with financial and government stakeholders to rapidly build a scalable digital platform capable of processing massive volumes of loan assistance requests. The solution enabled fast, secure, and reliable access to state-backed funding for thousands of businesses.",

  heroImage: "/assets/bpifrance-hero.png",

  overview:
    "Workholo was tasked with developing a high-performance crisis-response platform designed to handle large-scale emergency funding applications under extreme time constraints. The platform needed to support concurrent submissions, real-time eligibility verification, and secure document management while maintaining enterprise-grade reliability.",

  challenge:
    "The biggest challenge was delivering a production-ready financial platform within just five days while ensuring scalability, security, and uninterrupted availability. The system also needed seamless integration with multiple third-party and legacy financial verification services.",

  solution:
    "Workholo assembled a dedicated rapid-delivery engineering squad and implemented a cloud-native serverless architecture on AWS. By leveraging scalable backend services, reusable UI systems, and automated deployment pipelines, the team successfully delivered a resilient and highly responsive platform within the deadline.",

  galleryImages: [
    "/assets/bpifrance-dashboard.png",
    "/assets/bpifrance-architecture.png",
  ],

  features: [
    "Automated Eligibility Verification",
    "Serverless Cloud Infrastructure",
    "Enterprise-Grade Security",
    "High-Concurrency Request Handling",
    "Real-time Application Tracking",
    "Secure Document Upload System",
    "Automated Approval Workflow",
    "Multi-System API Integration",
  ],

  metrics: [
    {
      label: "Funding Requests Processed",
      value: "50k+",
    },
    {
      label: "Project Delivery",
      value: "5 Days",
    },
    {
      label: "Platform Availability",
      value: "99.99%",
    },
    {
      label: "Concurrent User Capacity",
      value: "1M+",
    },
  ],

  results: [
    {
      stat: "5 Days",
      title: "Rapid Deployment",
      description:
        "Workholo successfully delivered and launched the emergency funding platform within an accelerated national deadline.",
    },
    {
      stat: "99.99%",
      title: "Platform Reliability",
      description:
        "The infrastructure maintained uninterrupted uptime even during peak application traffic periods.",
    },
    {
      stat: "85%",
      title: "Processing Optimization",
      description:
        "Automation significantly reduced manual verification and approval turnaround times.",
    },
  ],

  techStack: [
    "AWS Lambda",
    "Node.js",
    "React",
    "DynamoDB",
    "Terraform",
    "TypeScript",
    "Python",
  ],

  timeline: [
    {
      label: "Phase 1",
      title: "Requirement Analysis",
      description:
        "Workholo collaborated with stakeholders to identify critical workflows and integration requirements.",
    },
    {
      label: "Phase 2",
      title: "Architecture Planning",
      description:
        "Designed a scalable cloud-native infrastructure capable of handling nationwide traffic spikes.",
    },
    {
      label: "Phase 3",
      title: "Rapid Development Sprint",
      description:
        "Frontend, backend, infrastructure, and API integrations were developed simultaneously by parallel teams.",
    },
    {
      label: "Phase 4",
      title: "Production Launch",
      description:
        "Successfully deployed the platform with live monitoring, scaling automation, and operational support.",
    },
  ],

  faqs: [
    {
      question:
        "How was Workholo able to deliver the platform so quickly?",
      answer:
        "The team utilized reusable internal frameworks, parallel engineering squads, and automated deployment pipelines to accelerate delivery.",
    },
    {
      question:
        "Was the platform capable of handling large traffic spikes?",
      answer:
        "Yes, the cloud-native serverless infrastructure automatically scaled to support millions of requests during peak demand.",
    },
    {
      question:
        "How did Workholo ensure security during rapid development?",
      answer:
        "Security best practices, automated vulnerability scanning, and encrypted data workflows were implemented from the beginning of development.",
    },
    {
      question:
        "Could the platform be reused for future government initiatives?",
      answer:
        "Yes, the modular architecture allows the platform to be adapted for future financial programs and large-scale digital services.",
    },
  ],
},
 "healthhero-scaling-telehealth": {
  slug: "healthhero-scaling-telehealth",
  title: "HealthHero: Global Telemedicine Ecosystem",
  subtitle:
    "Workholo modernised healthcare infrastructure for a large-scale telemedicine platform serving millions of users.",
  category: "Web Development",
  client: "HealthHero",
  duration: "6 Months",

  description:
    "HealthHero required a scalable and unified healthcare platform capable of supporting rapid digital growth across multiple regions. Workholo led the modernization initiative by transforming fragmented legacy systems into a high-performance cloud-native ecosystem optimized for large-scale telemedicine operations.",

  heroImage: "/assets/healthhero-hero.png",

  overview:
    "As a rapidly growing telehealth provider, HealthHero faced operational complexity due to multiple disconnected legacy platforms. Workholo was responsible for building a unified digital ecosystem that streamlined patient management, consultation workflows, and healthcare operations while supporting international scalability.",

  challenge:
    "The major challenge involved migrating sensitive patient workflows and legacy healthcare systems into a modern microservices architecture without disrupting live medical services. The platform also needed to comply with strict healthcare security and regional data privacy regulations.",

  solution:
    "Workholo designed and implemented a federated GraphQL-based microservices architecture that allowed independent scaling and management of critical healthcare domains such as scheduling, prescriptions, billing, and patient records. The phased migration strategy ensured continuous service availability while significantly improving platform performance and flexibility.",

  galleryImages: [
    "/assets/healthhero-app.png",
    "/assets/healthhero-microservices.png",
  ],

  features: [
    "Federated GraphQL API",
    "Microservices Architecture",
    "HIPAA & GDPR Compliance",
    "Cross-Platform Video Consulting",
    "Automated Doctor Scheduling",
    "e-Prescription Management",
    "Multi-Language Support",
    "Unified Patient Health Records",
  ],

  metrics: [
    {
      label: "Total Patient Reach",
      value: "5M+",
    },
    {
      label: "Infrastructure Savings",
      value: "40%",
    },
    {
      label: "Deployment Velocity",
      value: "5x",
    },
    {
      label: "System Latency",
      value: "<120ms",
    },
  ],

  results: [
    {
      stat: "5x",
      title: "Release Frequency",
      description:
        "Workholo enabled independent service deployments, significantly accelerating feature delivery and platform innovation.",
    },
    {
      stat: "40%",
      title: "Operational Savings",
      description:
        "The new cloud-native infrastructure reduced operational overhead and simplified maintenance across healthcare systems.",
    },
    {
      stat: "100%",
      title: "Zero Downtime Migration",
      description:
        "Millions of healthcare records and live consultation services were migrated successfully without service interruption.",
    },
  ],

  techStack: [
    "NestJS",
    "React",
    "GraphQL",
    "AWS",
    "Kubernetes",
    "PostgreSQL",
    "Docker",
  ],

  timeline: [
    {
      label: "Phase 1",
      title: "System Audit & Planning",
      description:
        "Workholo analyzed legacy healthcare systems and defined the architecture roadmap for modernization.",
    },
    {
      label: "Phase 2",
      title: "Infrastructure Foundation",
      description:
        "Established scalable Kubernetes infrastructure and GraphQL gateway services for domain separation.",
    },
    {
      label: "Phase 3",
      title: "Service Migration",
      description:
        "Critical healthcare services including scheduling and patient management were migrated incrementally.",
    },
    {
      label: "Phase 4",
      title: "Regional Expansion",
      description:
        "The unified healthcare ecosystem was optimized and deployed across multiple international regions.",
    },
  ],

  faqs: [
    {
      question: "How did Workholo ensure healthcare data security?",
      answer:
        "The platform implemented encrypted storage, secure APIs, role-based access controls, and region-specific compliance measures.",
    },
    {
      question: "What was the advantage of the GraphQL architecture?",
      answer:
        "GraphQL enabled efficient communication between frontend applications and multiple backend services through a unified API layer.",
    },
    {
      question: "Was the platform designed for future scalability?",
      answer:
        "Yes, the microservices and Kubernetes-based architecture allows rapid horizontal scaling during high-demand periods.",
    },
    {
      question: "How were live healthcare services migrated safely?",
      answer:
        "Workholo used phased migrations and parallel system execution to prevent downtime during the transition process.",
    },
    {
      question: "Can additional healthcare partners be integrated later?",
      answer:
        "Yes, the modular architecture simplifies future integrations with hospitals, clinics, and external healthcare systems.",
    },
  ],
},
  "vueling-serverless-transformation": {
  slug: "vueling-serverless-transformation",
  title: "Vueling: Cloud-Native Airline Platform",
  subtitle:
    "Workholo modernised airline booking infrastructure using scalable cloud-native technologies.",
  category: "Cloud & DevOps",
  client: "Vueling",
  duration: "4 Months",

  description:
    "Vueling required a modern, scalable booking platform capable of handling massive seasonal traffic spikes without performance degradation. Workholo led the cloud transformation initiative by migrating critical booking workflows to a serverless architecture that improved scalability, reliability, and operational efficiency.",

  heroImage: "/assets/vueling-hero.png",

  overview:
    "Airline platforms experience highly dynamic traffic patterns, especially during holiday sales and promotional booking periods. Workholo redesigned Vueling’s digital booking infrastructure using cloud-native technologies to ensure high availability, faster booking experiences, and efficient resource utilization during peak demand.",

  challenge:
    "The primary challenge involved migrating high-volume booking services from traditional infrastructure to a scalable cloud environment while maintaining real-time flight availability accuracy, pricing consistency, and uninterrupted booking operations.",

  solution:
    "Workholo implemented a serverless-first architecture using AWS services to automatically scale infrastructure based on live booking demand. The frontend booking experience was also optimized with modern React technologies, significantly improving application speed, responsiveness, and customer experience for millions of users.",

  galleryImages: ["/assets/vueling-mobile.png", "/assets/vueling-cloud.png"],

  features: [
    "Auto-Scaling Booking Engine",
    "Event-Driven Architecture",
    "Infrastructure as Code (CDK)",
    "High-Performance API Gateway",
    "Real-time Fare Monitoring",
    "Serverless Side Rendering",
    "Deterministic Scaling Logic",
    "Multi-Region Failover",
  ],

  metrics: [
    {
      label: "Feature Velocity",
      value: "3x Faster",
    },
    {
      label: "Peak Capacity",
      value: "Infinite",
    },
    {
      label: "Operational Costs",
      value: "-50%",
    },
    {
      label: "Customer Users",
      value: "12M/Mo",
    },
  ],

  results: [
    {
      stat: "50%",
      title: "Infrastructure Cost Savings",
      description:
        "Workholo helped transition the platform to an efficient pay-per-usage cloud model, significantly reducing operational costs.",
    },
    {
      stat: "0",
      title: "Service Downtime",
      description:
        "The cloud-native infrastructure maintained uninterrupted booking operations during peak traffic events.",
    },
    {
      stat: "300%",
      title: "Development Acceleration",
      description:
        "Automated CI/CD workflows and scalable infrastructure dramatically improved deployment speed and engineering productivity.",
    },
  ],

  techStack: [
    "AWS Lambda",
    "TypeScript",
    "React",
    "CDK",
    "DynamoDB",
    "S3",
    "CloudFront",
  ],

  timeline: [
    {
      label: "Phase 1",
      title: "Infrastructure Assessment",
      description:
        "Workholo analyzed the legacy booking environment to identify scalability limitations and migration priorities.",
    },
    {
      label: "Phase 2",
      title: "Serverless Validation",
      description:
        "Developed and tested a serverless proof of concept to validate high-performance booking workflows at scale.",
    },
    {
      label: "Phase 3",
      title: "Production Migration",
      description:
        "Critical booking services were migrated incrementally to the new cloud-native architecture with minimal disruption.",
    },
    {
      label: "Phase 4",
      title: "Automation & Optimization",
      description:
        "Advanced CI/CD pipelines and automated cloud operations were implemented to support continuous innovation.",
    },
  ],

  faqs: [
    {
      question: "Why did Workholo recommend a serverless architecture?",
      answer:
        "Serverless infrastructure automatically scales with booking demand, reducing idle infrastructure costs while maintaining high availability.",
    },
    {
      question: "How were complex booking workflows managed?",
      answer:
        "Workholo implemented event-driven orchestration and managed workflow services to ensure reliable booking transaction processing.",
    },
    {
      question: "How was performance optimized for millions of users?",
      answer:
        "Optimized frontend rendering, edge caching, and scalable APIs ensured low-latency booking experiences globally.",
    },
    {
      question: "Was the new platform secure and reliable?",
      answer:
        "Yes, the architecture followed modern cloud security standards with strict access controls and resilient multi-region deployment strategies.",
    },
    {
      question: "Can the new system integrate with existing airline services?",
      answer:
        "Yes, Workholo developed integration layers that allowed seamless communication between legacy airline systems and the new cloud-native services.",
    },
  ],
},
  "colas-logistics-optimisation": {
  slug: "colas-logistics-optimisation",
  title: "Colas: Smart Logistics Framework",
  subtitle:
    "Workholo developed a real-time logistics platform to optimize large-scale construction supply chain operations.",
  category: "Mobile Development",
  client: "Colas",
  duration: "5 Months",

  description:
    "Colas required a modern logistics management solution capable of coordinating material deliveries and fleet operations across thousands of construction sites. Workholo built a high-performance mobile platform that improved operational visibility, reduced material waste, and enhanced field productivity.",

  heroImage: "/assets/colas-hero.png",

  overview:
    "Construction site operations at Colas relied heavily on manual coordination processes that often caused delays, inefficiencies, and material wastage. Workholo designed and implemented a real-time logistics ecosystem that enabled site managers to monitor fleet movement, delivery schedules, and operational workflows directly from mobile devices.",

  challenge:
    "The platform needed to function reliably in demanding construction environments with unstable internet connectivity and across various rugged mobile devices. Additionally, the system had to process and visualize large-scale fleet data in real time without compromising performance.",

  solution:
    "Workholo developed a React Native mobile application with offline-first architecture and real-time synchronization capabilities. Using Azure IoT-driven backend systems and advanced Mapbox visualizations, the platform enabled managers to track vehicles, optimize deliveries, and streamline logistics workflows across active construction sites.",

  galleryImages: [
    "/assets/colas-tablet-ui.png",
    "/assets/colas-site-manager.png",
  ],

  features: [
    "Offline-First Data Sync",
    "Real-time GPS Fleet Tracking",
    "Automated Delivery Queueing",
    "IoT Device Integration",
    "Custom Mapbox Visualisation",
    "Material Temperature Monitoring",
    "Dynamic Rerouting Engine",
    "Automated Shift Reporting",
  ],

  metrics: [
    {
      label: "Active Vehicles Tracked",
      value: "10k+",
    },
    {
      label: "Waste Reduction",
      value: "15%",
    },
    {
      label: "Site Manager Efficiency",
      value: "+25%",
    },
    {
      label: "Active Daily Sites",
      value: "2,000+",
    },
  ],

  results: [
    {
      stat: "25%",
      title: "Operational Productivity",
      description:
        "Workholo improved delivery coordination efficiency through real-time tracking and automated scheduling systems.",
    },
    {
      stat: "15%",
      title: "Material Waste Reduction",
      description:
        "Optimized delivery timing and monitoring capabilities significantly reduced material wastage during transportation.",
    },
    {
      stat: "100%",
      title: "Digital Workflow Adoption",
      description:
        "The platform replaced manual paperwork and enabled fully digitized logistics operations across construction sites.",
    },
  ],

  techStack: [
    "React Native",
    "Node.js",
    "Azure IoT Hub",
    "CosmosDB",
    "Redis",
    "Mapbox",
    "Docker",
  ],

  timeline: [
    {
      label: "Phase 1",
      title: "Operational Research",
      description:
        "Workholo conducted on-site workflow analysis to understand logistics coordination challenges in real construction environments.",
    },
    {
      label: "Phase 2",
      title: "Mobile Prototype Development",
      description:
        "An offline-capable prototype was developed and tested with field managers and logistics operators.",
    },
    {
      label: "Phase 3",
      title: "Backend & IoT Integration",
      description:
        "The mobile ecosystem was integrated with Azure IoT infrastructure and enterprise logistics systems.",
    },
    {
      label: "Phase 4",
      title: "Large-Scale Deployment",
      description:
        "The platform was deployed across thousands of construction sites and vehicles with region-specific configurations.",
    },
  ],

  faqs: [
    {
      question: "How does the platform function in low-network areas?",
      answer:
        "Workholo implemented offline-first synchronization logic that stores operational data locally until connectivity is restored.",
    },
    {
      question: "Can the system integrate with existing fleet hardware?",
      answer:
        "Yes, the platform supports integration with existing IoT telemetry systems and vehicle tracking devices.",
    },
    {
      question: "How scalable is the real-time tracking system?",
      answer:
        "The infrastructure is optimized to process and display thousands of live vehicle updates simultaneously with minimal latency.",
    },
    {
      question: "Was the application easy for field teams to adopt?",
      answer:
        "Yes, the mobile interface was intentionally designed to be simple, intuitive, and efficient for fast onboarding.",
    },
    {
      question: "What operational insights does the platform provide?",
      answer:
        "The system delivers real-time insights related to fleet movement, material conditions, fuel usage, and delivery efficiency.",
    },
  ],
},
 "simon-kucher-partners": {
  slug: "simon-kucher-partners",
  title: "Global Profit & Pricing Intelligence Engine",
  subtitle: "Workholo developed an enterprise pricing intelligence platform for advanced business decision-making.",
  category: "AI & Data",
  client: "Simon-Kucher & Partners",
  duration: "18 Months",

  description:
    "Workholo engineered a scalable pricing optimization and analytics platform for Simon-Kucher & Partners, enabling consultants to perform real-time pricing simulations, margin analysis, and strategic decision-making across global enterprise operations.",

  heroImage: "/assets/simon-kucher-partners.png",

  overview:
    "The project focused on replacing fragmented spreadsheet-based workflows with a centralized cloud-native analytics ecosystem. Workholo built a high-performance platform that enabled consultants to analyze massive datasets, simulate pricing strategies, and generate actionable business insights for enterprise clients worldwide.",

  challenge:
    "The primary challenge was consolidating large volumes of financial and operational data from multiple disconnected systems into a single secure platform accessible across global offices. The system also needed to support complex pricing simulations with near real-time processing performance.",

  solution:
    "Workholo designed and developed a distributed analytics platform powered by React and Node.js. The solution included advanced data visualization systems, high-concurrency simulation engines, automated reporting workflows, and scalable cloud infrastructure optimized for enterprise-grade performance.",

  galleryImages: [
    "/assets/simon-kucher-dashboard.png",
    "/assets/simon-kucher-analytics.png",
  ],

  features: [
    "Real-time margin impact simulator",
    "Dynamic price elasticity modeling",
    "Customizable consultant dashboards",
    "Global multi-currency support",
    "Automated reporting and PPT export",
    "Enterprise-grade role-based access",
    "Cross-regional data synchronization",
    "Legacy ERP data connectors",
  ],

  metrics: [
    {
      label: "Analysis Speed",
      value: "40% Increase",
    },
    {
      label: "Global Users",
      value: "2,500+",
    },
    {
      label: "Daily Data Points",
      value: "1B+",
    },
    {
      label: "Margin Impact",
      value: "+15% Avg",
    },
  ],

  results: [
    {
      stat: "25+",
      title: "Global Office Deployment",
      description:
        "Workholo successfully deployed the platform across international consulting offices with uninterrupted operations.",
    },
    {
      stat: "99.9%",
      title: "Platform Reliability",
      description:
        "The enterprise infrastructure maintained high availability for critical consulting and analytics workflows.",
    },
    {
      stat: "2x",
      title: "Consultant Productivity",
      description:
        "Automation and centralized analytics significantly reduced manual data preparation and reporting efforts.",
    },
  ],

  techStack: [
    "React",
    "TypeScript",
    "Node.js",
    "AWS",
    "PostgreSQL",
    "Redis",
    "Python",
  ],

  timeline: [
    {
      label: "Phase 1",
      title: "Business Discovery & Planning",
      description:
        "Workholo conducted in-depth analysis of existing pricing models and enterprise reporting workflows.",
    },
    {
      label: "Phase 2",
      title: "Analytics Engine Development",
      description:
        "Core pricing simulation logic and distributed data processing systems were engineered for large-scale analytics.",
    },
    {
      label: "Phase 3",
      title: "Dashboard & Visualization Design",
      description:
        "Interactive consultant dashboards and advanced visualization tools were developed for strategic decision-making.",
    },
    {
      label: "Phase 4",
      title: "Enterprise Rollout",
      description:
        "The platform was deployed globally with integrations into legacy ERP and reporting environments.",
    },
  ],

  faqs: [
    {
      question: "How does the pricing simulation engine operate?",
      answer:
        "The platform uses advanced analytics models to calculate pricing impact scenarios and profitability outcomes in real time.",
    },
    {
      question: "Was enterprise-level security implemented?",
      answer:
        "Yes, Workholo implemented encrypted data handling, secure authentication systems, and enterprise-grade access controls.",
    },
    {
      question: "Can the platform process extremely large datasets?",
      answer:
        "Yes, the distributed architecture was optimized to analyze billions of data points with high-performance processing pipelines.",
    },
    {
      question: "Did the system integrate with legacy enterprise software?",
      answer:
        "Yes, Workholo developed custom integrations for ERP systems, enterprise databases, and reporting tools.",
    },
    {
      question: "Can consultants access the platform globally?",
      answer:
        "Yes, the cloud-native infrastructure supports secure cross-regional access with synchronized enterprise data.",
    },
  ],
},
  "connecterra": {
  slug: "connecterra",
  title: "Ida: AI-Powered Agricultural Intelligence",
  subtitle: "Workholo developed an AI-driven agricultural intelligence platform for predictive livestock monitoring.",
  category: "AI & Data",
  client: "Connecterra",
  duration: "24 Months",

  description:
    "Workholo partnered with Connecterra to build a scalable AI-powered ecosystem that transforms livestock sensor data into actionable farming insights. The platform enabled predictive health monitoring, behavioral analysis, and operational optimization for modern dairy farming.",

  heroImage: "/assets/connecterra.png",

  overview:
    "Modern agriculture increasingly relies on data-driven decision-making to improve productivity and animal welfare. Workholo helped develop 'Ida', an intelligent agricultural platform capable of analyzing livestock activity data and delivering predictive insights to farmers through cloud and mobile technologies.",

  challenge:
    "The platform needed to process massive volumes of real-time sensor data from farms across multiple regions while maintaining high prediction accuracy for livestock health, fertility, and behavioral anomalies. The infrastructure also had to support global scalability and low-latency analytics.",

  solution:
    "Workholo engineered a scalable microservices-based ecosystem powered by cloud-native infrastructure and machine learning technologies. The platform leveraged AI-driven behavioral analysis models and delivered insights through a mobile-first experience optimized for field operations and remote environments.",

  galleryImages: [
    "/assets/connecterra-app.png",
    "/assets/connecterra-insights.png",
  ],

  features: [
    "Automated heat detection alerts",
    "Health and welfare monitoring",
    "Herd behavior analysis",
    "Milk yield prediction engine",
    "Bluetooth sensor integration",
    "Multi-farm management dashboard",
    "Localized climate adaptation",
    "Predictive veterinary scheduling",
  ],

  metrics: [
    {
      label: "Milk Yield",
      value: "10% Increase",
    },
    {
      label: "Antibiotic Use",
      value: "30% Decrease",
    },
    {
      label: "Accuracy Rate",
      value: "96%",
    },
    {
      label: "Global Deployment",
      value: "15+ Countries",
    },
  ],

  results: [
    {
      stat: "24/7",
      title: "Continuous Monitoring",
      description:
        "Workholo enabled fully automated livestock monitoring through real-time AI-powered alert systems.",
    },
    {
      stat: "15%",
      title: "Farm Efficiency Improvement",
      description:
        "Predictive insights helped optimize breeding, health management, and overall farm productivity.",
    },
    {
      stat: "1M+",
      title: "Sensors Managed",
      description:
        "The infrastructure successfully scaled to process data from millions of livestock sensor events globally.",
    },
  ],

  techStack: [
    "React Native",
    "Node.js",
    "TensorFlow",
    "Google Cloud",
    "BigQuery",
    "BLE",
    "Go",
  ],

  timeline: [
    {
      label: "Phase 1",
      title: "Sensor & Hardware Integration",
      description:
        "Workholo integrated wearable livestock sensors with cloud-based data ingestion systems.",
    },
    {
      label: "Phase 2",
      title: "AI & Machine Learning Development",
      description:
        "Behavioral analytics models were trained using historical farming and livestock activity datasets.",
    },
    {
      label: "Phase 3",
      title: "Mobile Platform Development",
      description:
        "A mobile-first farming application was developed to deliver predictive insights and operational alerts.",
    },
    {
      label: "Phase 4",
      title: "Scalability & Optimization",
      description:
        "Cloud infrastructure and analytics pipelines were optimized for global deployment and large-scale data processing.",
    },
  ],

  faqs: [
    {
      question: "What types of livestock sensors are supported?",
      answer:
        "The platform integrates with wearable livestock tracking devices that monitor movement, activity, and behavioral patterns.",
    },
    {
      question: "How does the AI identify potential health issues?",
      answer:
        "Machine learning models analyze behavioral deviations and activity trends to detect early warning signs of illness.",
    },
    {
      question: "Can the platform support different farming environments?",
      answer:
        "Yes, the AI models were optimized using diverse datasets covering multiple regions, climates, and livestock conditions.",
    },
    {
      question: "Does the application work in remote farm locations?",
      answer:
        "Yes, the mobile platform includes offline data access and synchronization capabilities for low-connectivity environments.",
    },
    {
      question: "How scalable is the platform infrastructure?",
      answer:
        "The cloud-native architecture was built to handle large-scale sensor data streams and global farm deployments efficiently.",
    },
  ],
},
  "raccoon-recovery": {
  slug: "raccoon-recovery",
  title: "Digital Physical Therapy Platform",
  subtitle: "Workholo developed a gamified rehabilitation ecosystem powered by real-time motion tracking.",
  category: "Healthcare",
  client: "Raccoon Recovery",
  duration: "12 Months",

  description:
    "Workholo engineered an advanced telerehabilitation platform that combines wearable motion sensors, gamified therapy experiences, and remote clinical monitoring to improve patient recovery after orthopedic treatments and surgeries.",

  heroImage: "/assets/raccoon-recovery.png",

  overview:
    "Traditional at-home rehabilitation programs often suffer from low patient engagement and inconsistent progress tracking. Workholo helped transform the recovery experience by building a digital rehabilitation ecosystem that motivates patients through interactive therapy exercises while delivering accurate recovery data to healthcare professionals.",

  challenge:
    "The platform needed to capture subtle body movements with high precision and translate them into real-time digital interactions without latency. Additionally, the system had to provide clinically reliable motion analytics while maintaining strict healthcare data privacy and compliance standards.",

  solution:
    "Workholo developed a cross-platform rehabilitation ecosystem using Unity and React technologies to create immersive, gamified therapy experiences. Integrated wearable sensor systems and secure healthcare dashboards enabled therapists to remotely monitor patient progress and personalize recovery programs based on live motion data.",

  galleryImages: [
    "/assets/raccoon-patient-ui.png",
    "/assets/raccoon-therapist-portal.png",
  ],

  features: [
    "Real-time motion tracking",
    "Gamified exercise protocols",
    "Clinical progress reports",
    "Remote treatment adjustment",
    "Video consultation module",
    "Patient compliance tracking",
    "Wearable sensor sync",
    "Personalized rehab pathways",
  ],

  metrics: [
    {
      label: "Recovery Speed",
      value: "50% Faster",
    },
    {
      label: "Patient Adherence",
      value: "90%",
    },
    {
      label: "Active Patients",
      value: "12,000+",
    },
    {
      label: "CSAT Score",
      value: "4.8/5",
    },
  ],

  results: [
    {
      stat: "60%",
      title: "Reduced Clinical Visits",
      description:
        "Workholo enabled efficient remote rehabilitation monitoring, significantly reducing unnecessary in-person clinic sessions.",
    },
    {
      stat: "HIPAA",
      title: "Healthcare Compliance",
      description:
        "The platform was developed with secure healthcare-grade encryption and compliance-focused infrastructure.",
    },
    {
      stat: "100%",
      title: "Motion Tracking Precision",
      description:
        "Advanced sensor integration delivered highly accurate rehabilitation movement tracking and progress analysis.",
    },
  ],

  techStack: [
    "React",
    "Unity",
    "C#",
    "Node.js",
    "MongoDB",
    "Azure",
    "Bluetooth SDK",
  ],

  timeline: [
    {
      label: "Phase 1",
      title: "Clinical Research & Validation",
      description:
        "Workholo collaborated with rehabilitation specialists to define accurate movement tracking benchmarks.",
    },
    {
      label: "Phase 2",
      title: "Gamified Therapy Development",
      description:
        "Interactive rehabilitation experiences were developed using real-time sensor-driven gameplay mechanics.",
    },
    {
      label: "Phase 3",
      title: "Healthcare Dashboard Engineering",
      description:
        "Secure therapist dashboards and patient analytics systems were implemented for remote treatment management.",
    },
    {
      label: "Phase 4",
      title: "Pilot Deployment",
      description:
        "The rehabilitation platform was deployed in selected clinics for real-world testing and patient feedback collection.",
    },
  ],

  faqs: [
    {
      question: "Does the platform replace physical therapists?",
      answer:
        "No, the platform supports therapists by enabling remote monitoring, progress tracking, and guided rehabilitation management.",
    },
    {
      question: "What hardware is required for motion tracking?",
      answer:
        "The system integrates with lightweight wearable motion sensors designed to capture rehabilitation movement data accurately.",
    },
    {
      question: "How is patient medical data secured?",
      answer:
        "Workholo implemented encrypted healthcare infrastructure and compliance-focused security measures to protect patient information.",
    },
    {
      question: "What types of rehabilitation programs are supported?",
      answer:
        "The platform is optimized for orthopedic rehabilitation including knee, shoulder, hip, and post-surgical recovery programs.",
    },
    {
      question: "Which devices are supported?",
      answer:
        "The ecosystem supports mobile devices, tablets, and web-based healthcare portals across major platforms.",
    },
  ],
},
 "apotka-pharmacy": {
  slug: "apotka-pharmacy",
  title: "Enterprise Healthcare Retail Ecosystem",
  subtitle: "Workholo transformed a large-scale pharmacy network into a modern omnichannel healthcare platform.",
  category: "Web Development",
  client: "Apotka",
  duration: "10 Months",

  description:
    "Workholo delivered a complete digital transformation for Apotka by building a scalable healthcare retail ecosystem that unified e-commerce operations, prescription workflows, and inventory management across hundreds of pharmacy locations.",

  heroImage: "/assets/apotka-pharmacy.png",

  overview:
    "Apotka required a modern digital platform capable of connecting physical pharmacy operations with online healthcare services. Workholo developed a seamless omnichannel ecosystem that allowed customers to search, purchase, and manage medications efficiently while enabling real-time inventory synchronization across all stores.",

  challenge:
    "The platform needed to manage tens of thousands of pharmaceutical products while meeting strict healthcare compliance requirements. Additional challenges included maintaining accurate real-time stock availability, integrating prescription verification workflows, and supporting large-scale concurrent traffic.",

  solution:
    "Workholo engineered a high-performance web platform using Next.js and GraphQL technologies integrated with enterprise inventory and logistics systems. Advanced search capabilities, scalable backend infrastructure, and optimized checkout experiences enabled fast and reliable healthcare commerce operations.",

  galleryImages: [
    "/assets/apotka-storefront.png",
    "/assets/apotka-checkout.png",
  ],

  features: [
    "Intelligent medicine search",
    "E-prescription upload & verify",
    "Omnichannel loyalty program",
    "Real-time store stock locator",
    "Automated medication reminders",
    "Pharmacist chat integration",
    "B2B hospital supply portal",
    "Click & Collect logistics",
  ],

  metrics: [
    {
      label: "Online Sales",
      value: "200% Growth",
    },
    {
      label: "Monthly Users",
      value: "1M+",
    },
    {
      label: "Load Time",
      value: "<1.2s",
    },
    {
      label: "Store Sync",
      value: "<60s",
    },
  ],

  results: [
    {
      stat: "450+",
      title: "Pharmacy Locations Connected",
      description:
        "Workholo unified inventory and operational workflows across hundreds of physical pharmacy stores.",
    },
    {
      stat: "35%",
      title: "Increased Order Value",
      description:
        "Smart recommendation systems and streamlined user experiences improved overall customer purchasing behavior.",
    },
    {
      stat: "92%",
      title: "Mobile Platform Adoption",
      description:
        "The mobile-optimized platform significantly increased customer engagement through smartphones and tablets.",
    },
  ],

  techStack: [
    "Next.js",
    "TypeScript",
    "GraphQL",
    "NestJS",
    "ElasticSearch",
    "Docker",
    "Kubernetes",
  ],

  timeline: [
    {
      label: "Phase 1",
      title: "Infrastructure & System Analysis",
      description:
        "Workholo evaluated existing pharmacy ERP systems and planned the digital migration architecture.",
    },
    {
      label: "Phase 2",
      title: "Core Commerce Platform Development",
      description:
        "The primary healthcare commerce engine, search systems, and prescription workflows were developed.",
    },
    {
      label: "Phase 3",
      title: "Enterprise Integrations",
      description:
        "Payment systems, healthcare databases, logistics providers, and loyalty systems were integrated.",
    },
    {
      label: "Phase 4",
      title: "Optimization & Scaling",
      description:
        "The platform was optimized for high traffic volumes, edge caching, and large-scale store synchronization.",
    },
  ],

  faqs: [
    {
      question: "How is sensitive prescription data protected?",
      answer:
        "Workholo implemented encrypted healthcare-grade security systems and compliance-focused data management processes.",
    },
    {
      question: "Can customers interact with physical pharmacy stores digitally?",
      answer:
        "Yes, the omnichannel ecosystem supports services such as in-store pickup, local inventory visibility, and store-based returns.",
    },
    {
      question: "How accurate is real-time inventory availability?",
      answer:
        "Inventory synchronization systems continuously update stock data across all connected pharmacy locations.",
    },
    {
      question: "Does the platform support healthcare institutions?",
      answer:
        "Yes, Workholo developed dedicated B2B procurement workflows for hospitals and institutional healthcare clients.",
    },
    {
      question: "How scalable is the platform infrastructure?",
      answer:
        "The cloud-native architecture was designed to support millions of users, high transaction volumes, and enterprise-level scalability.",
    },
  ],
},
"costa-express": {
slug: "costa-express",
title: "Costa Express",
subtitle: "Workholo accelerated digital innovation for a global self-service coffee infrastructure.",
category: "IoT & Automation",
client: "Costa Coffee",
duration: "Ongoing Partnership",

description: "Workholo partnered with Costa Express to modernize and scale the digital ecosystem powering thousands of self-service coffee kiosks globally. The collaboration focused on IoT connectivity, kiosk software modernization, cloud infrastructure, and operational automation.",

heroImage: "/assets/costa-express.png",

overview: "Costa Express required a scalable technology ecosystem capable of supporting rapid international expansion and continuous innovation across its self-service coffee network. Workholo provided a dedicated engineering model to enhance kiosk reliability, streamline operations, and improve real-time monitoring capabilities.",

challenge: "The major challenge was modernizing legacy kiosk infrastructure while ensuring uninterrupted service availability across thousands of deployed units worldwide. The platform also needed scalable IoT monitoring, secure payment integrations, and efficient remote device management.",

solution: "Workholo established a dedicated cross-functional engineering team that integrated directly with Costa Express operations. The team redesigned core kiosk software, improved IoT telemetry systems, and built scalable cloud-based APIs for diagnostics, monitoring, and inventory management.",

galleryImages: [
"/assets/costa-express-gallery-1.png",
"/assets/costa-express-gallery-2.png",
],

features: [
"Real-time IoT Telemetry Tracking",
"Predictive Maintenance Algorithms",
"Automated Inventory Management",
"Global Cloud Sync Architecture",
"Secure Payment Gateway Integration",
"Remote Diagnostic Dashboard",
"Multi-language Deployment Engine",
"Onyx Operating System Optimization",
],

metrics: [
{
label: "Global Units",
value: "13,000+",
},
{
label: "Dev Velocity",
value: "+45%",
},
{
label: "System Uptime",
value: "99.98%",
},
{
label: "Scale Capacity",
value: "10x",
},
],

results: [
{
stat: "40%",
title: "Faster Feature Deployment",
description: "Workholo accelerated software rollout cycles and enabled faster deployment of new kiosk capabilities globally.",
},
{
stat: "£250k",
title: "Operational Cost Efficiency",
description: "The dedicated engineering partnership reduced recruitment overhead and improved long-term development efficiency.",
},
{
stat: "Intelligent",
title: "Inventory Automation",
description: "Real-time monitoring and predictive systems improved stock visibility and reduced operational waste across locations.",
},
],

techStack: [
".NET 8",
"Azure IoT Hub",
"React",
"TypeScript",
"Docker",
"Redis",
"Azure Cosmos DB",
],

timeline: [
{
label: "Phase 1",
title: "Infrastructure Discovery",
description: "Workholo analyzed the existing kiosk architecture and aligned technical workflows with Costa Express operational requirements.",
},
{
label: "Phase 2",
title: "Cloud & IoT Foundation",
description: "A scalable Azure-based infrastructure was implemented to support high-volume IoT communication and remote operations.",
},
{
label: "Phase 3",
title: "Continuous Development Sprints",
description: "Agile engineering cycles focused on payment systems, diagnostics, kiosk performance, and customer experience enhancements.",
},
{
label: "Phase 4",
title: "Global Deployment",
description: "New platform capabilities and software updates were deployed remotely across the international kiosk network.",
},
],

faqs: [
{
question: "How did Workholo collaborate with Costa Express teams?",
answer: "Workholo operated as an integrated engineering extension, collaborating through Agile workflows, sprint planning, and shared delivery processes.",
},
{
question: "What was the most complex technical challenge?",
answer: "Managing stable synchronization and monitoring across thousands of kiosks operating in different connectivity conditions worldwide.",
},
{
question: "Did the partnership improve development speed?",
answer: "Yes, the dedicated engineering model accelerated feature delivery and reduced the delays associated with traditional recruitment processes.",
},
{
question: "How was system security maintained?",
answer: "The platform implemented secure cloud infrastructure, encrypted communications, and compliance-focused payment security standards.",
},
{
question: "Is Workholo still involved in the platform evolution?",
answer: "Yes, the partnership continues to support ongoing innovation, infrastructure scaling, and new feature development.",
},
],
},
"smith-nephew": {
slug: "smith-nephew",
title: "Smith+Nephew",
subtitle: "Workholo developed a healthcare analytics platform for surgical data visualization and operational insights.",
category: "AI & Data",
client: "Smith & Nephew PLC",
duration: "12 Months",

description: "Workholo engineered a scalable healthcare analytics ecosystem that transforms complex surgical and operational hospital data into actionable insights for clinicians, administrators, and healthcare decision-makers.",

heroImage: "/assets/smith-nephew.png",

overview: "Smith+Nephew required an advanced digital platform capable of consolidating surgical performance data across multiple healthcare systems. Workholo developed an intuitive analytics environment that enables healthcare providers to improve procedural planning, monitor clinical outcomes, and optimize operational efficiency through real-time visualization.",

challenge: "The primary challenge involved aggregating fragmented healthcare datasets from multiple hospital systems while maintaining strict healthcare compliance standards. The platform also needed to deliver highly interpretable analytics dashboards for medical professionals operating in time-sensitive clinical environments.",

solution: "Workholo built a high-performance analytics platform powered by .NET, Power BI, and cloud-native data processing systems. The solution included advanced data anonymization, scalable ETL pipelines, and interactive visualization dashboards optimized for real-time surgical analytics and healthcare reporting.",

galleryImages: [
"/assets/smith-nephew-gallery-1.png",
"/assets/smith-nephew-gallery-2.png",
],

features: [
"Surgical KPI Tracking",
"Clinical Outcome Analytics",
"Advanced Data Anonymization",
"Multi-hospital Data Sync",
"Regulatory Compliance Filter",
"Dynamic Reporting Engine",
"Role-based Access Control",
"Mobile Responsive View",
],

metrics: [
{
label: "Data Points",
value: "50M+",
},
{
label: "Load Time",
value: "<2s",
},
{
label: "Compliance",
value: "SOC2/GDPR",
},
{
label: "ROI Period",
value: "18 Mo",
},
],

results: [
{
stat: "30%",
title: "Operational Efficiency Improvement",
description: "Workholo enabled healthcare teams to make faster, data-driven clinical and operational decisions through advanced visualization systems.",
},
{
stat: "Real-time",
title: "Surgical Cost Visibility",
description: "Administrators gained immediate access to procedural analytics and cost-performance insights across healthcare operations.",
},
{
stat: "Scalable",
title: "Healthcare Analytics Infrastructure",
description: "The cloud-native platform successfully supported large-scale hospital data processing and multi-site deployment requirements.",
},
],

techStack: [
"Power BI",
".NET Core",
"Azure SQL",
"React",
"Azure Data Factory",
"TypeScript",
"D3.js",
],

timeline: [
{
label: "Phase 1",
title: "Compliance & Security Assessment",
description: "Workholo conducted healthcare compliance audits and defined secure data governance workflows.",
},
{
label: "Phase 2",
title: "Healthcare Data Architecture",
description: "Scalable ETL pipelines and centralized healthcare analytics infrastructure were engineered for multi-source data aggregation.",
},
{
label: "Phase 3",
title: "Clinical Dashboard Design",
description: "Interactive dashboards were designed in collaboration with clinicians to ensure rapid interpretation of surgical insights.",
},
{
label: "Phase 4",
title: "Cloud Deployment & Pilot Testing",
description: "The platform was deployed within a scalable cloud environment and validated through multi-hospital pilot programs.",
},
],

faqs: [
{
question: "How does Workholo ensure healthcare data compliance?",
answer: "The platform incorporates encrypted data workflows, anonymization mechanisms, and compliance-focused healthcare security practices.",
},
{
question: "Can the system process real-time healthcare analytics?",
answer: "Yes, the infrastructure supports near real-time processing and visualization of active surgical and operational data streams.",
},
{
question: "Who primarily uses the analytics platform?",
answer: "The platform is designed for clinicians, surgical teams, healthcare administrators, and operational management staff.",
},
{
question: "Does the platform integrate with hospital systems?",
answer: "Yes, Workholo developed flexible APIs and secure integrations for interoperability with major healthcare and EMR systems.",
},
{
question: "How scalable is the architecture?",
answer: "The cloud-native infrastructure is optimized to support expansion across multiple healthcare facilities and large-scale datasets.",
},
],
},
"infinitas-learning": {
slug: "infinitas-learning",
title: "Infinitas Learning",
subtitle: "Workholo scaled digital education infrastructure through enterprise-grade EdTech transformation.",
category: "Web Development",
client: "Infinitas Learning",
duration: "18 Months",

description: "Workholo partnered with Infinitas Learning to modernize and scale their educational technology ecosystem by simultaneously delivering a large-scale Learning Management System, digital commerce infrastructure, and integrated payment platform.",

heroImage: "/assets/infinitas-learning.png",

overview: "Infinitas Learning required a unified digital ecosystem capable of supporting large-scale educational operations across multiple countries. Workholo assembled and managed a dedicated engineering organization to accelerate development, migrate legacy educational content, and deliver highly scalable learning and commerce platforms.",

challenge: "The primary challenge involved delivering multiple enterprise-grade platforms within strict academic deadlines while migrating years of legacy educational data. The system also needed to support hundreds of thousands of students and educators with high availability and seamless user experiences.",

solution: "Workholo established a large-scale cross-functional engineering team that collaborated directly with Infinitas Learning stakeholders. Using a microservices-based architecture, the team developed scalable learning systems, integrated commerce workflows, and secure multi-currency payment infrastructure.",

galleryImages: [
"/assets/infinitas-gallery-1.png",
"/assets/infinitas-gallery-2.png",
],

features: [
"Enterprise Learning Management (LMS)",
"Omni-channel E-commerce",
"Integrated Multi-currency Payments",
"Student Progress Analytics",
"Classroom Management Tools",
"Content Authoring Pipeline",
"Legacy Data Migration Engine",
"Single Sign-On (SSO)",
],

metrics: [
{
label: "Student Users",
value: "500k+",
},
{
label: "Team Size",
value: "40+ Eng.",
},
{
label: "Uptime",
value: "99.95%",
},
{
label: "Platform Count",
value: "3 Major",
},
],

results: [
{
stat: "100%",
title: "On-time Academic Launch",
description: "Workholo successfully delivered all critical platforms ahead of the academic launch schedule.",
},
{
stat: "Unified",
title: "Educational Data Ecosystem",
description: "A centralized platform unified student data, educational content, and operational systems across regions.",
},
{
stat: "Scalable",
title: "Digital Commerce Growth",
description: "The modernized commerce infrastructure improved scalability and optimized digital educational sales workflows.",
},
],

techStack: [
".NET Core 8",
"React",
"TypeScript",
"Kubernetes",
"Stripe API",
"ElasticSearch",
"Azure DevOps",
],

timeline: [
{
label: "Phase 1",
title: "Engineering Team Expansion",
description: "Workholo rapidly assembled and onboarded a large-scale engineering team to support accelerated delivery timelines.",
},
{
label: "Phase 2",
title: "Platform Architecture Design",
description: "Scalable microservices architecture was designed to connect learning systems, payments, and commerce workflows.",
},
{
label: "Phase 3",
title: "Parallel Product Development",
description: "Multiple product streams including LMS, e-commerce, and payment services were developed simultaneously.",
},
{
label: "Phase 4",
title: "High-Scale Production Launch",
description: "Comprehensive performance testing and deployment preparations ensured stability during peak academic usage periods.",
},
],

faqs: [
{
question: "How did Workholo manage such a large engineering operation?",
answer: "The delivery organization was structured into Agile cross-functional pods focused on specific educational and platform domains.",
},
{
question: "How was legacy educational content migrated?",
answer: "Workholo developed automated migration systems to securely transfer years of educational data and learning assets.",
},
{
question: "Can the infrastructure support large student traffic volumes?",
answer: "Yes, the Kubernetes-based cloud infrastructure automatically scales during peak enrollment and examination periods.",
},
{
question: "Does the platform support multiple regions and languages?",
answer: "Yes, the system supports multilingual educational experiences and region-specific curriculum requirements.",
},
{
question: "How were payment systems secured?",
answer: "Secure payment workflows were implemented using trusted payment providers and compliance-focused transaction infrastructure.",
},
],
},
"fine-rare": {
slug: "fine-rare",
title: "Fine+Rare",
subtitle: "Workholo modernized a luxury e-commerce ecosystem for premium wine and rare collectibles.",
category: "Web Development",
client: "Fine+Rare Wines Ltd",
duration: "14 Months",

description: "Workholo transformed Fine+Rare’s digital commerce platform by replacing legacy infrastructure with a scalable, high-performance luxury e-commerce ecosystem optimized for premium customer experiences and global growth.",

heroImage: "/assets/fine-rare.png",

overview: "Fine+Rare required a modern digital platform capable of supporting luxury commerce operations, high-value transactions, and international collector experiences. Workholo designed a scalable architecture focused on performance, premium branding, and seamless inventory management for rare wines and spirits.",

challenge: "The platform needed to modernize complex legacy business workflows involving auctions, global logistics, inventory synchronization, and high-value purchases. Additionally, the system had to deliver fast performance, advanced search capabilities, and a mobile-optimized luxury shopping experience.",

solution: "Workholo engineered a headless e-commerce architecture powered by Node.js and React technologies. The platform included advanced search systems, real-time warehouse synchronization, personalized member experiences, and scalable cloud infrastructure optimized for premium digital commerce.",

galleryImages: [
"/assets/fine-rare-gallery-1.png",
"/assets/fine-rare-gallery-2.png",
],

features: [
"Headless E-commerce Engine",
"Real-time Inventory Sync",
"Personalized Member Portal",
"Advanced ElasticSearch",
"Auction Management System",
"Secure Payment Vault",
"Logistics & CRM Integration",
"Optimized SEO Architecture",
],

metrics: [
{
label: "Growth",
value: "403%",
},
{
label: "Conversions",
value: "+65%",
},
{
label: "Page Load",
value: "-1.2s",
},
{
label: "Mobile Traffic",
value: "+80%",
},
],

results: [
{
stat: "400%+",
title: "Digital Revenue Growth",
description: "Workholo delivered a scalable commerce platform that significantly accelerated online sales performance.",
},
{
stat: "Premium",
title: "Luxury Customer Experience",
description: "The redesigned digital experience enhanced brand perception through modern, high-performance interfaces.",
},
{
stat: "Scalable",
title: "Modernized Technology Stack",
description: "The new cloud-native architecture reduced technical complexity and enabled faster business operations.",
},
],

techStack: [
"Node.js",
"React",
"Next.js",
"AWS",
"PostgreSQL",
"Redis",
"ElasticSearch",
],

timeline: [
{
label: "Phase 1",
title: "Digital Experience Strategy",
description: "Workholo defined the premium digital commerce experience and modern platform architecture.",
},
{
label: "Phase 2",
title: "Commerce Platform Development",
description: "Core commerce systems, inventory workflows, and transaction infrastructure were engineered.",
},
{
label: "Phase 3",
title: "Search & Customer Experience",
description: "Advanced search systems and responsive luxury storefront interfaces were implemented.",
},
{
label: "Phase 4",
title: "Migration & Global Launch",
description: "Legacy customer records, inventory systems, and commerce workflows were securely migrated to the new platform.",
},
],

faqs: [
{
question: "Does the platform integrate with warehouse logistics systems?",
answer: "Yes, Workholo implemented real-time synchronization with global inventory and warehouse management systems.",
},
{
question: "Can the platform support auction-based sales?",
answer: "Yes, custom auction workflows and bidding systems were developed for premium collectible products.",
},
{
question: "What technologies power the platform?",
answer: "The ecosystem was built using a modern headless architecture powered by Node.js, React, and scalable AWS infrastructure.",
},
{
question: "How did the modernization improve SEO performance?",
answer: "The optimized frontend architecture significantly improved site speed, indexing performance, and search visibility.",
},
{
question: "Can the internal business team manage the platform easily?",
answer: "Yes, the platform was designed with operational flexibility and streamlined management workflows for internal teams.",
},
],
},
"david-lloyd-leisure": {
slug: "david-lloyd-leisure",
title: "David Lloyd Leisure Mobile App",
subtitle: "Workholo transformed the digital fitness experience for hundreds of thousands of active members.",
category: "Mobile Development",
client: "David Lloyd Leisure",
duration: "12 Months",

description: "Workholo partnered with David Lloyd Leisure to rebuild and modernize their mobile ecosystem, delivering a high-performance member application focused on seamless booking experiences, personalized fitness engagement, and scalable digital infrastructure.",

heroImage: "/assets/david-lloyd-leisure.png",

overview: "David Lloyd Leisure required a modern mobile platform capable of supporting large-scale member engagement across its European fitness clubs. Workholo developed a unified application that streamlined bookings, improved digital interactions, and enhanced the overall fitness journey through personalized experiences and real-time club services.",

challenge: "The existing legacy systems struggled with high booking traffic during peak class release periods, resulting in slow performance and inconsistent user experiences. Additionally, the outdated infrastructure lacked the scalability and premium design expected by modern fitness members.",

solution: "Workholo engineered a scalable React Native application backed by cloud-native microservices and GraphQL APIs. The platform was optimized for high-concurrency booking events, fast data synchronization, and responsive mobile experiences even during heavy traffic surges.",

galleryImages: [
"/assets/dl-app-interface.png",
"/assets/dl-class-booking.png",
],

features: [
"One-tap class and court booking system",
"Real-time gym capacity monitoring",
"Personalized workout recommendations",
"Integrated loyalty and rewards hub",
"In-app QR code for contactless club entry",
"Seamless Apple Health and Google Fit sync",
"Push notification engine for class reminders",
"Secure guest pass management",
],

metrics: [
{
label: "App Store Rating",
value: "4.8/5",
},
{
label: "Member Adoption",
value: "85%",
},
{
label: "Booking Speed",
value: "50% faster",
},
{
label: "Monthly Sessions",
value: "2M+",
},
],

results: [
{
stat: "99.99%",
title: "Peak-Time Platform Stability",
description: "Workholo successfully optimized the infrastructure to handle extreme booking traffic spikes without downtime.",
},
{
stat: "220k",
title: "Daily Active Users",
description: "The modernized mobile platform significantly increased daily digital engagement across fitness members.",
},
{
stat: "£1.2M",
title: "Operational Efficiency Gains",
description: "Automated self-service workflows reduced operational pressure on in-club staff and support teams.",
}
],

techStack: [
"React Native",
"Node.js",
"AWS Lambda",
"GraphQL",
"Terraform",
"PostgreSQL",
"Redis",
],

timeline: [
{
label: "Phase 1",
title: "Digital Experience Discovery",
description: "Workholo analyzed member journeys, booking behaviors, and existing infrastructure limitations.",
},
{
label: "Phase 2",
title: "Scalable Architecture Design",
description: "Cloud-native backend systems and high-availability APIs were designed for large-scale member usage.",
},
{
label: "Phase 3",
title: "Mobile Platform Development",
description: "Agile development cycles focused on booking workflows, personalization features, and UI/UX optimization.",
},
{
label: "Phase 4",
title: "Deployment & Optimization",
description: "The platform was gradually rolled out across fitness clubs with continuous monitoring and performance tuning.",
},
],

faqs: [
{
question: "How did Workholo handle booking traffic spikes?",
answer: "The platform utilized scalable serverless infrastructure, optimized caching layers, and distributed cloud services to maintain stable performance during peak booking periods.",
},
{
question: "Does the application support multiple regions and languages?",
answer: "Yes, the mobile platform includes localization support for multiple European markets and multilingual user experiences.",
},
{
question: "Can the app integrate with physical club systems?",
answer: "Yes, Workholo integrated the application with secure club access systems using encrypted QR-based authentication.",
},
{
question: "How is member information secured?",
answer: "The platform uses enterprise-grade encryption, secure authentication protocols, and protected cloud infrastructure for sensitive member data.",
},
{
question: "Does the app provide fitness progress tracking?",
answer: "Yes, interactive analytics and workout tracking features allow members to monitor fitness consistency and personal progress visually.",
},
],
},
"rspb-digital-transformation": {
  slug: "rspb-digital-transformation",
  title: "RSPB Nature on Your Doorstep",
  subtitle: "Engaging a new generation of conservationists via digital innovation.",
  category: "Web Development",
  client: "RSPB",
  duration: "18 Months",
  description: "Workholo lead a large-scale digital transformation to modernize the RSPB’s online presence, creating an interactive platform to encourage biodiversity in UK gardens.",
  heroImage: "/assets/rspb-digital-transformation.png",
  overview: "The RSPB needed to move beyond traditional donor management into a mission-driven digital platform. 'Nature on Your Doorstep' was designed to provide personalized, localized advice to millions of UK citizens.",
  challenge: "The organization had multiple siloed databases and an aging CMS that made personalization impossible and data management inefficient.",
  solution: "Workholo built a centralized data platform and a modern web experience using Python/Django and React. The system utilizes geolocation to provide weather-dependent gardening tips tailored to the user's specific region.",
  galleryImages: [
    "/assets/rspb-dashboard.png",
    "/assets/rspb-activity-tracker.png",
  ],
  features: [
    "Localized biodiversity activity engine",
    "Personalized impact dashboard for members",
    "Interactive wildlife tracking tools",
    "Centralized CRM and data lake integration",
    "Automated outreach and email campaigns",
    "Mobile-first responsive design",
    "Secure donation and subscription portal",
    "User-generated content hub for nature photos",
  ],
  metrics: [
    {
      label: "User Signups",
      value: "1M+",
    },
    {
      label: "Engagement",
      value: "+40%",
    },
    {
      label: "Activity Completion",
      value: "150k+",
    },
    {
      label: "Platform Uptime",
      value: "99.9%",
    },
  ],
  results: [
    {
      stat: "2.5M",
      title: "Unique Page Views",
      description: "Massive reach for the seasonal 'Big Garden Birdwatch' campaigns.",
    },
    {
      stat: "65%",
      title: "Donor Retention",
      description: "Improved retention through personalized digital storytelling.",
    },
    {
      stat: "£800k",
      title: "Cost Reduction",
      description: "Savings achieved through cloud migration and automated data processing.",
    }
  ],
  techStack: [
    "Python",
    "Django",
    "React",
    "AWS",
    "PostgreSQL",
    "Elasticsearch",
    "Docker",
  ],
  timeline: [
    {
      label: "Phase 1",
      title: "Data Audit",
      description: "Identifying and consolidating fragmented member data sources.",
    },
    {
      label: "Phase 2",
      title: "Platform MVP",
      description: "Building the core advocacy engine and personalized activity algorithm.",
    },
    {
      label: "Phase 3",
      title: "Scaling & CRM",
      description: "Integrating the web platform with the central RSPB CRM system.",
    },
    {
      label: "Phase 4",
      title: "Nationwide Launch",
      description: "Rolling out the platform ahead of peak spring conservation season.",
    },
  ],
  faqs: [
    {
      question: "How does the localization work?",
      answer: "The platform uses IP-based geolocation and postcode lookup to fetch local environmental data.",
    },
    {
      question: "Is the platform accessible to all users?",
      answer: "Absolutely, it was built to meet WCAG 2.1 AA standards for maximum inclusion.",
    },
    {
      question: "Can users upload their own data?",
      answer: "Yes, members can record sightings and activity completion which contributes to national research.",
    },
    {
      question: "How is donor privacy handled?",
      answer: "All data is managed in accordance with GDPR and Cyber Essentials Plus certifications.",
    },
    {
      question: "Is the tech stack scalable for TV campaigns?",
      answer: "Yes, the AWS infrastructure auto-scales to handle massive spikes during live broadcasts.",
    },
  ],
},
"bbc-academy-platform": {
  slug: "bbc-academy-platform",
  title: "BBC Academy Learning Platform",
  subtitle: "A professional educational ecosystem for global content creators.",
  category: "Web Development",
  client: "BBC",
  duration: "10 Months",
  description: "Workholo engineered a scalable, highly accessible learning management system to host the BBC's internal and partner training content across video, text, and interactive assessments.",
  heroImage: "/assets/bbc-academy-platform.png",
  overview: "The BBC Academy required a modern digital hub to deliver training to staff and external partners. The platform needed to be robust enough to serve thousands of concurrent users while maintaining strict accessibility standards.",
  challenge: "The previous system was difficult to navigate on mobile devices and struggled with high-bitrate video delivery across disparate global networks.",
  solution: "Workholo developed a serverless architecture using AWS and a React-based frontend. We leveraged AWS CloudFront and Elemental MediaConvert to ensure smooth video delivery regardless of user location or bandwidth.",
  galleryImages: [
    "/assets/bbc-learning-portal.png",
    "/assets/bbc-video-player.png",
  ],
  features: [
    "Adaptive bitrate video streaming",
    "Interactive quiz and assessment engine",
    "SCORM and xAPI content compatibility",
    "Multilingual support for global partners",
    "Detailed learning analytics for management",
    "Fully WCAG 2.2 compliant interface",
    "Offline-first mobile learning capabilities",
    "Social learning and discussion forums",
  ],
  metrics: [
    {
      label: "Active Learners",
      value: "50k+",
    },
    {
      label: "Courses Hosted",
      value: "200+",
    },
    {
      label: "Load Times",
      value: "30% faster",
    },
    {
      label: "Accessibility",
      value: "100%",
    },
  ],
  results: [
    {
      stat: "15k",
      title: "Monthly Certifications",
      description: "Significant throughput of staff completing regulated training.",
    },
    {
      stat: "78%",
      title: "Mobile Engagement",
      description: "Drastic increase in training completed on mobile devices via the new UI.",
    },
    {
      stat: "Zero",
      title: "Downtime Incidents",
      description: "Maintained perfect availability since the migration to serverless.",
    }
  ],
  techStack: [
    "React",
    "Java",
    "Spring Boot",
    "AWS Lambda",
    "Elemental Media",
    "CloudFront",
    "S3",
  ],
  timeline: [
    {
      label: "Phase 1",
      title: "User Research",
      description: "In-depth workshops with BBC trainers and global staff members.",
    },
    {
      label: "Phase 2",
      title: "UI Implementation",
      description: "Developing an accessible, high-performance frontend components library.",
    },
    {
      label: "Phase 3",
      title: "Media Backend",
      description: "Engineering the video transcoding and delivery pipeline on AWS.",
    },
    {
      label: "Phase 4",
      title: "Content Migration",
      description: "Migrating over 10 years of training content into the new system.",
    },
  ],
  faqs: [
    {
      question: "How do you handle high-definition video?",
      answer: "We use AWS Elemental to transcode video into multiple formats, serving the best one for the user's connection.",
    },
    {
      question: "Is the platform accessible to screen readers?",
      answer: "Yes, the entire platform is optimized for AT users and adheres to triple-A accessibility standards where possible.",
    },
    {
      question: "Can external partners access the training?",
      answer: "Yes, we implemented a tiered authentication system for internal and external users.",
    },
    {
      question: "How is progress tracked?",
      answer: "We use a custom xAPI implementation to track granular learning actions across the site.",
    },
    {
      question: "Does it support live webinars?",
      answer: "The platform integrates with major live-streaming tools for real-time educational events.",
    },
  ],
},
"moj-claims-digitisation": {
  slug: "moj-claims-digitisation",
  title: "Ministry of Justice Claims Portal",
  subtitle: "Digitising the UK justice system for efficient, secure public service.",
  category: "Cloud & DevOps",
  client: "Ministry of Justice",
  duration: "24 Months",
  description: "Workholo spearheaded the digital transformation of a critical legal claims portal, replacing legacy paper processes with a secure, user-centric cloud platform.",
  heroImage: "/assets/moj-claims-digitisation.png",
  overview: "The Ministry of Justice (MoJ) sought to modernize the way legal claims are submitted and processed. The goal was to reduce administrative overhead and increase transparency for both citizens and legal professionals.",
  challenge: "The system required extreme security due to the sensitive nature of legal data, along with strict adherence to GDS (Government Digital Service) standards.",
  solution: "Workholo deployed a Ruby on Rails application using a robust microservices architecture. By implementing Infrastructure as Code (IaC) with Terraform, we created a repeatable, highly secure environment across several AWS regions.",
  galleryImages: [
    "/assets/moj-portal-ui.png",
    "/assets/moj-data-security.png",
  ],
  features: [
    "GDS-compliant web interface",
    "Secure document upload and encryption",
    "Real-time case status tracking",
    "Automated legal rule-engine validation",
    "Multi-factor authentication for legal pros",
    "Integrated digital signature support",
    "Comprehensive audit logging and reporting",
    "High-availability multi-region active/active setup",
  ],
  metrics: [
    {
      label: "Cases Processed",
      value: "200k+",
    },
    {
      label: "Processing Speed",
      value: "60% faster",
    },
    {
      label: "Admin Savings",
      value: "£10M+",
    },
    {
      label: "Security Level",
      value: "Highest",
    },
  ],
  results: [
    {
      stat: "4.5/5",
      title: "Citizen Feedback Score",
      description: "Record-high satisfaction ratings for a UK government digital service.",
    },
    {
      stat: "£3.5M",
      title: "Annual Cloud Tech Savings",
      description: "Significant reduction in infrastructure costs via optimized cloud usage.",
    },
    {
      stat: "90%",
      title: "Reduced Error Rate",
      description: "Validation engines significantly reduced the number of invalid claim submissions.",
    }
  ],
  techStack: [
    "Ruby on Rails",
    "Terraform",
    "AWS",
    "Docker",
    "Kubernetes",
    "Redis",
    "Sidekiq",
  ],
  timeline: [
    {
      label: "Phase 1",
      title: "Alpha Phase",
      description: "Prototyping and testing core concepts with real users and legal experts.",
    },
    {
      label: "Phase 2",
      title: "Beta Development",
      description: "Building the full claims engine and implementing Gov.UK Design System.",
    },
    {
      label: "Phase 3",
      title: "Security Hardening",
      description: "Rigorous penetration testing and compliance auditing for legal data.",
    },
    {
      label: "Phase 4",
      title: "National Launch",
      description: "Successfully transitioning all live claims to the new digital platform.",
    },
  ],
  faqs: [
    {
      question: "How is the sensitive legal data secured?",
      answer: "We use field-level encryption and strict IAM policies combined with continuous automated scanning.",
    },
    {
      question: "Does it follow GDS design standards?",
      answer: "Yes, every component is mapped directly to the Gov.UK design patterns for consistency.",
    },
    {
      question: "How do legal pros verify their identity?",
      answer: "The platform integrates with several identity providers including secure government gateways.",
    },
    {
      question: "Can the system handle surges in litigation?",
      answer: "The Kubernetes-based infrastructure scales automatically based on queue depth and CPU usage.",
    },
    {
      question: "Is there an API for law firms?",
      answer: "Yes, we provide a RESTful API with automated documentation for large-scale legal integrations.",
    },
  ],
},
"virgin-money-pulse": {
  slug: "virgin-money-pulse",
  title: "Pulse: The Future of Digital Banking",
  subtitle: "Revolutionising mobile banking for millions of customers across the UK.",
  category: "Mobile Development",
  client: "Virgin Money",
  duration: "18 Months",
  description: "A comprehensive digital transformation project aimed at unifying the retail banking experience into a single, high-performance mobile application.",
  heroImage: "/assets/virgin-money-pulse.png",
  overview: "Workholo collaborated with Virgin Money to design, build, and deploy a next-generation mobile banking experience. The primary goal was to replace legacy systems with a modern, scalable architecture that could support millions of concurrent users while delivering a premium, intuitive UI.",
  challenge: "The existing mobile offering was hardware-limited and fragmented across different services. Virgin Money needed a solution that consolidated personal, savings, and credit accounts into one seamless interface while adhering to strict Open Banking regulations and high-security standards.",
  solution: "Workholo implemented a React Native architecture for rapid cross-platform deployment without compromising on native performance. Our teams focused on micro-frontend integration, biometrics (FaceID/TouchID), and real-time transaction processing using a robust AWS-backed infrastructure.",
  galleryImages: [
    "/assets/virgin-money-pulse-ui.png",
    "/assets/virgin-money-pulse-dash.png",
  ],
  features: [
    "Biometric Authentication & SCA",
    "Real-time Spending Analytics",
    "Instant Account-to-Account Transfers",
    "In-app Digital Customer Support",
    "Nectar Points Rewards Integration",
    "Personalized Financial Goal Tracking",
    "Secure Document Vault",
    "Advanced Encryption & Data Masking",
  ],
  metrics: [
    {
      label: "App Store Rating",
      value: "4.8/5.0",
    },
    {
      label: "Active Users",
      value: "2.5M+",
    },
    {
      label: "Engagement Increase",
      value: "42%",
    },
    {
      label: "System Uptime",
      value: "99.99%",
    },
  ],
  results: [
    {
      stat: "60%",
      title: "Cost Reduction",
      description: "Significant decrease in legacy system maintenance costs post-launch.",
    },
    {
      stat: "15s",
      title: "Fast Onboarding",
      description: "Average time for new customers to set up and verify their accounts.",
    },
    {
      stat: "3.2x",
      title: "UX Improvement",
      description: "Measured increase in user satisfaction scores compared to the legacy app.",
    },
  ],
  techStack: [
    "React Native",
    "TypeScript",
    "Node.js",
    "AWS Lambda",
    "Adobe Analytics",
    "Swift",
    "Kotlin",
  ],
  timeline: [
    {
      label: "Phase 1",
      title: "Discovery & Strategy",
      description: "Deep-dive workshops to align business goals with user needs and regulatory requirements.",
    },
    {
      label: "Phase 2",
      title: "Design & Prototyping",
      description: "Iterative UX/UI design focusing on accessibility and seamless financial journeys.",
    },
    {
      label: "Phase 3",
      title: "Agile Development",
      description: "Continuous integration and delivery of core banking features in two-week sprints.",
    },
    {
      label: "Phase 4",
      title: "Security & Scale",
      description: "Rigorous penetration testing and load testing to ensure enterprise-grade stability.",
    },
  ],
  faqs: [
    {
      question: "How did you ensure compliance with banking regulations?",
      answer: "We integrated automated compliance checks and strictly followed PSD2 and Open Banking standards throughout the development lifecycle.",
    },
    {
      question: "What was the approach to data security?",
      answer: "We utilized hardware-backed keystores, end-to-end encryption, and dynamic certificate pinning to prevent data intercepts.",
    },
    {
      question: "How does the app handle high traffic periods?",
      answer: "The backend is hosted on a serverless AWS infrastructure that auto-scales based on real-time demand peaks.",
    },
    {
      question: "Was user migration from legacy apps handled?",
      answer: "Yes, we developed a seamless migration bridge that moved user credentials and history without session loss.",
    },
    {
      question: "Is the app accessible for all users?",
      answer: "The application strictly adheres to WCAG 2.1 AA standards, ensuring full compatibility with screen readers.",
    },
  ],
},
"royal-london-pensions": {
  slug: "royal-london-pensions",
  title: "Modernizing Pension Management",
  subtitle: "Empowering 1.5 million members to take control of their retirement future.",
  category: "Mobile Development",
  client: "Royal London",
  duration: "14 Months",
  description: "A digital-first membership platform designed to simplify complex pension data and improve long-term financial engagement.",
  heroImage: "/assets/royal-london-pensions.png",
  overview: "Workholo engaged with Royal London to bridge the gap between traditional pension services and modern mobile expectations. The project involved creating a member-centric app that allows users to view, manage, and project their retirement savings in real-time.",
  challenge: "Pension data is historically complex and often siloed. The challenge was to create a unified API layer that could securely fetch data from various legacy engines and present it in a digestible, actionable format for non-expert users.",
  solution: "Workholo built a secure, mobile-optimized portal using a GraphQL middleware layer to aggregate data. The app features interactive projection tools, digital nomination forms, and a secure document library, all wrapped in a highly accessible UI.",
  galleryImages: [
    "/assets/royal-london-app.png",
    "/assets/royal-london-pension-view.png",
  ],
  features: [
    "Real-time Fund Tracking",
    "Interactive Retirement Forecaster",
    "Secure Digital Document Store",
    "Beneficiary Management",
    "Push Notification Alerts",
    "Biometric Face/Touch ID",
    "ESG Investment Preferences",
    "Direct Messaging with Support",
  ],
  metrics: [
    {
      label: "Members Onboarded",
      value: "1.5M",
    },
    {
      label: "Call Center Reduction",
      value: "50%",
    },
    {
      label: "User Happiness",
      value: "94%",
    },
    {
      label: "Daily Logins",
      value: "85k+",
    },
  ],
  results: [
    {
      stat: "25%",
      title: "Higher Retention",
      description: "Increased member stickiness through personalized retirement insights.",
    },
    {
      stat: "12min",
      title: "Efficiency Gain",
      description: "Reduced average time taken for users to find and download annual statements.",
    },
    {
      stat: "4.7/5",
      title: "Store Rating",
      description: "One of the highest-rated pension management apps in the UK market.",
    },
  ],
  techStack: [
    "React Native",
    "GraphQL",
    "Azure Cloud",
    "OpenID Connect",
    "TypeScript",
    "Python",
    "PostgreSQL",
  ],
  timeline: [
    {
      label: "Phase 1",
      title: "Data Audit & UX Audit",
      description: "Comprehensive review of legacy data structures and existing member pain points.",
    },
    {
      label: "Phase 2",
      title: "UI Framework Design",
      description: "Creation of a modular design system tailored for high trust and financial clarity.",
    },
    {
      label: "Phase 3",
      title: "Core Feature Build",
      description: "Developing the projection engine and secure data integration layers.",
    },
    {
      label: "Phase 4",
      title: "Member Beta & Launch",
      description: "Phased rollout to selected member groups followed by a full nationwide launch.",
    },
  ],
  faqs: [
    {
      question: "How accurate are the retirement projections?",
      answer: "The app uses live actuarial models synced hourly with the core Royal London policy engines for maximum precision.",
    },
    {
      question: "Is personal financial data stored on the device?",
      answer: "No, sensitive data is decrypted in memory and never persisted on the physical device storage.",
    },
    {
      question: "Can users switch their investment funds in-app?",
      answer: "Yes, the app provides a full fund-switching interface with real-time risk profiling.",
    },
    {
      question: "How are the push notifications used?",
      answer: "Notifications keep members informed about market changes, annual statements, and security alerts.",
    },
    {
      question: "Is the app available on tablet devices?",
      answer: "The UI is fully responsive and optimized for both iOS and Android smartphones and tablets.",
    },
  ],
},
"scottishpower-yourenergy": {
  slug: "scottishpower-yourenergy",
  title: "YourEnergy: Smart Home Management",
  subtitle: "Harnessing IoT and real-time data to revolutionize energy consumption.",
  category: "Mobile Development",
  client: "ScottishPower",
  duration: "24 Months",
  description: "An innovative smart home application that integrates with smart meters to provide real-time usage insights and carbon footprint tracking.",
  heroImage: "/assets/scottishpower-yourenergy.png",
  overview: "Workholo worked with ScottishPower to build an industry-leading utility app that moves beyond billing. YourEnergy allows users to monitor their live energy spend, manage smart home devices, and optimize their consumption for both cost and environmental impact.",
  challenge: "Integrating with the national Smart Meter infrastructure (DCC) while handling massive data throughput was the primary hurdle. The app needed to process billions of data points daily while maintaining a fast, responsive user experience.",
  solution: "Workholo developed a native mobile suite using Swift and Kotlin, backed by an AWS IoT Core infrastructure. The solution includes real-time data streaming, predictive cost algorithms, and a seamless billing integration via a modern API gateway.",
  galleryImages: [
    "/assets/scottishpower-home.png",
    "/assets/scottishpower-iot.png",
  ],
  features: [
    "Live Smart Meter Sync",
    "Predictive Billing Insights",
    "EV Charger Integration",
    "Solar Generation Tracking",
    "Carbon Footprint Calculator",
    "In-app Bill Payments",
    "Smart Alerts for High Usage",
    "Direct-to-Engineer Booking",
  ],
  metrics: [
    {
      label: "IoT Connectivity",
      value: "1.2M Devices",
    },
    {
      label: "Visibility Gain",
      value: "30%",
    },
    {
      label: "Peak Load handling",
      value: "50k req/sec",
    },
    {
      label: "Active Users",
      value: "800k+",
    },
  ],
  results: [
    {
      stat: "£120",
      title: "Annual Savings",
      description: "Average estimated saving per user through usage optimization alerts.",
    },
    {
      stat: "15%",
      title: "Carbon Reduction",
      description: "Measured reduction in average peak-time electricity demand among app users.",
    },
    {
      stat: "Sub-1s",
      title: "Data Latency",
      description: "Industry-leading time from smart meter reading to mobile UI update.",
    },
  ],
  techStack: [
    "Native iOS (Swift)",
    "Native Android (Kotlin)",
    "AWS IoT Core",
    "Python",
    "Redis",
    "Kinesis Data Streams",
    "Terraform",
  ],
  timeline: [
    {
      label: "Phase 1",
      title: "IoT Architecture Design",
      description: "Mapping the secure data flow between meters, cloud, and mobile clients.",
    },
    {
      label: "Phase 2",
      title: "Data Processing Engine",
      description: "Building the scalable backend capable of handling billions of telemetry pings.",
    },
    {
      label: "Phase 3",
      title: "Mobile Native Build",
      description: "Developing high-fidelity UI/UX with smooth charting and real-time updates.",
    },
    {
      label: "Phase 4",
      title: "Network Integration",
      description: "Final testing with national DCC infrastructure and rollout across the UK.",
    },
  ],
  faqs: [
    {
      question: "How does the app connect to my meter?",
      answer: "The app connects securely via the national smart meter network, requiring only your account details for verification.",
    },
    {
      question: "Does it work with electric vehicle chargers?",
      answer: "Yes, it integrates with major EV charger brands to allow for smart charging during off-peak hours.",
    },
    {
      question: "Is my usage data shared with third parties?",
      answer: "No, your data is used strictly for your own insights and billed accounts, protected by GDPR.",
    },
    {
      question: "Can I use the app if I don't have a smart meter?",
      answer: "You can still manage your account and bills, but live usage insights require a secondary smart meter.",
    },
    {
      question: "How frequent are the data updates?",
      answer: "Usage data is refreshed every 30 minutes for electricity and every hour for gas, as per industry standards.",
    },
  ],
},
"smith-nephew-orthopaedics": {
  slug: "smith-nephew-orthopaedics",
  title: "Precision Surgery: AI Knee Mapping",
  subtitle: "Revolutionizing surgical planning with computer vision and 3D topology.",
  category: "AI & Data",
  client: "Smith & Nephew",
  duration: "20 Months",
  description: "A groundbreaking clinical tool that uses AI to map patient-specific knee topology, assisting surgeons in high-precision procedure planning.",
  heroImage: "/assets/smith-nephew-orthopaedics.png",
  overview: "Workholo partnered with Smith & Nephew to digitize the surgical planning process. By leveraging advanced Computer Vision, we developed a system that analyzes DICOM medical imaging to create a perfect 1:1 digital twin of a patient's knee structure.",
  challenge: "Surgical planning for knee replacements was traditionally manual and prone to minor measurement errors. The system needed 99.9% accuracy and had to comply with strict medical device regulations (MDR Class II) while delivering real-time 3D performance.",
  solution: "Workholo built an AI-centric platform using TensorFlow for anatomical segmentation and specialized OpenGL wrappers for real-time 3D visualization on iPad Pro devices used in operating theaters.",
  galleryImages: [
    "/assets/smith-nephew-ai.png",
    "/assets/smith-nephew-clinical.png",
  ],
  features: [
    "AI Anatomical Segmentation",
    "Real-time 3D Model Viz",
    "DICOM Image Processing",
    "Pre-operative Plan Sync",
    "Surgical Guide Export",
    "Offline Data Processing",
    "HIPAA/MDR Compliance Layer",
    "Multi-planar Reconstruction",
  ],
  metrics: [
    {
      label: "Mapping Accuracy",
      value: "99.8%",
    },
    {
      label: "Planning Time",
      value: "-40%",
    },
    {
      label: "Procedures Assisted",
      value: "10,000+",
    },
    {
      label: "Cloud Latency",
      value: "<100ms",
    },
  ],
  results: [
    {
      stat: "20min",
      title: "Time Saved",
      description: "Average reduction in planning time per surgical case for clinicians.",
    },
    {
      stat: "Zero",
      title: "Data Errors",
      description: "Manual measurement errors were eliminated via automated AI mapping.",
    },
    {
      stat: "14 Countries",
      title: "Global Reach",
      description: "Successfully deployed to leading orthopaedic centers in 14 markets.",
    },
  ],
  techStack: [
    "Python",
    "TensorFlow",
    "React Native",
    "Azure Health Data",
    "OpenGL / WebGL",
    "C++ Engine",
    "Docker",
  ],
  timeline: [
    {
      label: "Phase 1",
      title: "Algorithm Training",
      description: "Training the AI models on 100k+ anonymized DICOM datasets for peak accuracy.",
    },
    {
      label: "Phase 2",
      title: "Regulatory Prototyping",
      description: "Building the MVP in accordance with ISO 13485 and MDR quality standards.",
    },
    {
      label: "Phase 3",
      title: "Clinical Validation",
      description: "Conducting trial runs with expert surgeons to refine the 3D interaction model.",
    },
    {
      label: "Phase 4",
      title: "Global Deployment",
      description: "Rolling out the finalized platform to medical centers across Europe and the US.",
    },
  ],
  faqs: [
    {
      question: "Is the AI approved for clinical use?",
      answer: "The platform has achieved MDR Class II certification for use in clinical environments.",
    },
    {
      question: "Can it handle low-quality MRI/CT scans?",
      answer: "The AI includes a pre-processing layer that enhances and denoises medical images before analysis.",
    },
    {
      question: "Is patient data stored in the cloud?",
      answer: "Data is processed on Azure Health Data Services with strict anonymization and encryption at rest.",
    },
    {
      question: "Can surgeons override the AI mapping?",
      answer: "Yes, the tool is a decision-support system; surgeons can manually adjust any mapping point.",
    },
    {
      question: "Does it integrate with hospital PACS?",
      answer: "It uses standard DICOM communication protocols to pull and push data directly from existing systems.",
    },
  ],
},
};

export function getProjectData(slug: string) {
  return projectsData[slug] ?? null;
}
