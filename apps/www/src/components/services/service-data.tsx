import {
  IconBrain,
  IconCloud,
  IconCode,
  IconDatabase,
  IconDeviceMobile,
  IconPalette,
  IconRobot,
  IconRocket,
  IconServer,
  IconTestPipe,
} from "@tabler/icons-react";

export interface ServiceFAQ {
  answer: string;
  question: string;
}

export interface CustomerService {
  description: string;
  icon: string;
  title: string;
}

export interface ServicePageData {
  customerServices: CustomerService[];
  description: string;
  faqs: ServiceFAQ[];
  features: string[];
  galleryImages: string[];
  heroImage: string;
  slug: string;
  subtitle: string;
  title: string;
}

const serviceList = [
  { slug: "agentic-ai", title: "Agentic AI", icon: IconBrain },
  { slug: "ai-agents", title: "AI Agents", icon: IconRobot },
  { slug: "mvp", title: "MVP Development", icon: IconRocket },
  { slug: "web-app-development", title: "Web App Development", icon: IconCode },
  {
    slug: "mobile-app-development",
    title: "Mobile App Development",
    icon: IconDeviceMobile,
  },
  {
    slug: "qa-test-automation",
    title: "QA & Test Automation",
    icon: IconTestPipe,
  },
  { slug: "ux-ui-design", title: "UX/UI Design", icon: IconPalette },
  { slug: "data-engineering", title: "Data Engineering", icon: IconDatabase },
  { slug: "aws", title: "AWS", icon: IconCloud },
  {
    slug: "cloud-engineering-devops",
    title: "Cloud Engineering & DevOps",
    icon: IconServer,
  },
];

export function getServiceList(currentSlug?: string) {
  return serviceList.map((s) => ({
    ...s,
    href: `/services/${s.slug}`,
    isActive: s.slug === currentSlug,
  }));
}

export const servicesData: Record<string, ServicePageData> = {
  "agentic-ai": {
    slug: "agentic-ai",
    title: "Agentic AI",
    subtitle: "Autonomous AI for Smarter Workflows",
    description:
      "Agentic AI represents the next evolution in artificial intelligence, enabling systems to autonomously plan, reason, and execute complex tasks without constant human oversight. Our solutions help businesses automate decision-making processes, optimize operations, and unlock new levels of efficiency.",
    heroImage: "/assets/agentic-ai.webp",
    features: [
      "Autonomous task execution",
      "Multi-step reasoning & planning",
      "Real-time decision making",
      "Self-improving AI agents",
      "Integration with existing tools",
      "Scalable architecture",
    ],
    galleryImages: ["/assets/technology-01.webp", "/assets/technology-02.jpg"],
    customerServices: [
      {
        icon: "IconUsers",
        title: "Increased Customer Satisfaction",
        description:
          "By delivering personalized experiences, customers are more likely to feel valued and satisfied, which directly improves retention and loyalty metrics.",
      },
      {
        icon: "IconSettings",
        title: "Improved Operational Efficiency",
        description:
          "With our tools and strategies, your customer support teams can handle more requests while automated systems handle routine inquiries 24/7.",
      },
      {
        icon: "IconTrendingUp",
        title: "Insights for Continuous Improvement",
        description:
          "Our data-driven approach provides teams with valuable insights into customer behavior, enabling continuous optimization and growth strategies.",
      },
    ],
    faqs: [
      {
        question: "What are the main types of agentic AI?",
        answer:
          "Agentic AI encompasses several types including reactive agents, deliberative agents, hybrid agents, and multi-agent systems. Each type serves different use cases from simple automation to complex collaborative problem-solving.",
      },
      {
        question: "How secure is agentic AI?",
        answer:
          "Our agentic AI implementations include robust security measures such as encryption, access controls, audit trails, and compliance with industry standards like SOC 2 and GDPR.",
      },
      {
        question: "Can I move my existing business applications to agentic AI?",
        answer:
          "Yes, our agentic AI solutions are designed to integrate seamlessly with existing business applications through APIs, webhooks, and custom connectors.",
      },
      {
        question: "How does agentic AI help businesses save costs?",
        answer:
          "Agentic AI reduces operational costs by automating repetitive tasks, minimizing human error, optimizing resource allocation, and enabling 24/7 operations without additional staffing.",
      },
      {
        question: "How do you collect feedback on AI performance?",
        answer:
          "We implement comprehensive monitoring and feedback loops that track AI performance metrics, user satisfaction scores, and business outcomes to continuously improve the system.",
      },
      {
        question: "How do I choose the right agentic AI provider?",
        answer:
          "Consider factors such as technical expertise, industry experience, integration capabilities, security standards, and proven track record when selecting an agentic AI partner.",
      },
    ],
  },
  "ai-agents": {
    slug: "ai-agents",
    title: "AI Agents",
    subtitle: "AI Agents for Product Teams",
    description:
      "Deploy intelligent AI agents that work alongside your product teams to accelerate development, improve quality, and deliver exceptional user experiences. Our AI agents integrate into your existing workflows to augment human capabilities.",
    heroImage: "/assets/ai-agents.webp",
    features: [
      "Natural language processing",
      "Context-aware responses",
      "Multi-channel deployment",
      "Custom knowledge bases",
      "Real-time learning",
      "Human handoff capability",
    ],
    galleryImages: [
      "/assets/ai-support-bot.jpg",
      "/assets/digital-transformation-solutions.webp",
    ],
    customerServices: [
      {
        icon: "IconUsers",
        title: "Increased Customer Satisfaction",
        description:
          "AI agents provide instant, accurate responses to customer inquiries, reducing wait times and improving overall satisfaction scores significantly.",
      },
      {
        icon: "IconSettings",
        title: "Improved Operational Efficiency",
        description:
          "Automate routine customer interactions while your team focuses on complex issues, dramatically improving productivity and response times.",
      },
      {
        icon: "IconTrendingUp",
        title: "Insights for Continuous Improvement",
        description:
          "Gain deep insights into customer needs and pain points through AI-powered conversation analytics and sentiment analysis.",
      },
    ],
    faqs: [
      {
        question: "What types of AI agents do you offer?",
        answer:
          "We offer conversational agents, task-oriented agents, analytical agents, and collaborative multi-agent systems tailored to different business needs.",
      },
      {
        question: "How secure are AI agents?",
        answer:
          "Our AI agents implement enterprise-grade security including end-to-end encryption, role-based access control, and compliance with major data protection regulations.",
      },
      {
        question: "Can AI agents integrate with our existing tools?",
        answer:
          "Absolutely. Our AI agents are built with integration-first architecture, supporting connections with CRMs, helpdesks, knowledge bases, and custom APIs.",
      },
      {
        question: "How do AI agents reduce operational costs?",
        answer:
          "AI agents handle high volumes of routine inquiries simultaneously, reducing the need for large support teams while maintaining quality service around the clock.",
      },
      {
        question: "How is AI agent performance monitored?",
        answer:
          "We provide comprehensive dashboards tracking response accuracy, resolution rates, customer satisfaction, and other key performance indicators in real-time.",
      },
      {
        question: "What makes your AI agents different?",
        answer:
          "Our AI agents combine advanced LLM technology with domain-specific training, ensuring nuanced understanding of your business context and industry terminology.",
      },
    ],
  },
  mvp: {
    slug: "mvp",
    title: "MVP Development",
    subtitle: "Launch Fast, Scale with Confidence",
    description:
      "Transform your ideas into market-ready products with our rapid MVP development services. We help startups and enterprises validate concepts, reduce time-to-market, and build foundations for scalable growth.",
    heroImage: "/assets/mvp-developement.webp",
    features: [
      "Rapid prototyping",
      "Lean methodology",
      "User-centric design",
      "Scalable architecture",
      "Iterative development",
      "Market validation",
    ],
    galleryImages: [
      "/assets/business-transformation.webp",
      "/assets/diverse-team-planning-stockcake.webp",
    ],
    customerServices: [
      {
        icon: "IconUsers",
        title: "Increased Customer Satisfaction",
        description:
          "By focusing on core user needs from day one, we ensure your MVP delivers real value that keeps early adopters engaged and satisfied.",
      },
      {
        icon: "IconSettings",
        title: "Improved Operational Efficiency",
        description:
          "Our streamlined development process eliminates waste and focuses resources on features that matter most to your target audience.",
      },
      {
        icon: "IconTrendingUp",
        title: "Insights for Continuous Improvement",
        description:
          "Built-in analytics and user feedback mechanisms provide actionable insights from launch, guiding your product evolution strategy.",
      },
    ],
    faqs: [
      {
        question: "What is included in MVP development?",
        answer:
          "Our MVP development includes product strategy, UX/UI design, frontend and backend development, testing, deployment, and post-launch support.",
      },
      {
        question: "How long does MVP development take?",
        answer:
          "Typically 4-12 weeks depending on complexity. We use agile methodologies to deliver working increments every 2 weeks.",
      },
      {
        question: "Can you help validate my idea before building?",
        answer:
          "Yes, we offer discovery workshops, market research, and prototype testing to validate your concept before investing in full development.",
      },
      {
        question: "How do you ensure the MVP is scalable?",
        answer:
          "We architect solutions using cloud-native technologies and microservices patterns that allow seamless scaling as your user base grows.",
      },
      {
        question: "What happens after the MVP launch?",
        answer:
          "We provide ongoing support, analyze user feedback, and help prioritize features for subsequent iterations to maximize product-market fit.",
      },
      {
        question: "Do you offer equity partnerships for startups?",
        answer:
          "We offer flexible engagement models including equity partnerships for promising startups with strong market potential.",
      },
    ],
  },
  "web-app-development": {
    slug: "web-app-development",
    title: "Web App Development",
    subtitle: "High-Performance, Scalable Web Apps",
    description:
      "Build modern, responsive web applications that deliver exceptional user experiences. Our development team combines cutting-edge technologies with proven methodologies to create web apps that scale with your business.",
    heroImage: "/assets/web-app-development.avif",
    features: [
      "Progressive Web Apps",
      "Single Page Applications",
      "Server-side rendering",
      "API-first architecture",
      "Responsive design",
      "Performance optimization",
    ],
    galleryImages: [
      "/assets/cloudsync-platform.webp",
      "/assets/e-commerce-platform.png",
    ],
    customerServices: [
      {
        icon: "IconUsers",
        title: "Increased Customer Satisfaction",
        description:
          "Fast, intuitive web applications keep users engaged and satisfied, reducing bounce rates and increasing conversion metrics.",
      },
      {
        icon: "IconSettings",
        title: "Improved Operational Efficiency",
        description:
          "Automated workflows and streamlined interfaces help your team accomplish more in less time with fewer errors.",
      },
      {
        icon: "IconTrendingUp",
        title: "Insights for Continuous Improvement",
        description:
          "Integrated analytics provide real-time insights into user behavior, enabling data-driven decisions for continuous enhancement.",
      },
    ],
    faqs: [
      {
        question: "What technologies do you use for web development?",
        answer:
          "We use modern stacks including React, Next.js, Vue, Node.js, Python, and cloud-native technologies tailored to your specific requirements.",
      },
      {
        question: "How do you ensure web app security?",
        answer:
          "We implement OWASP guidelines, conduct regular security audits, use HTTPS/TLS, and follow secure coding practices throughout development.",
      },
      {
        question: "Can you rebuild our existing web application?",
        answer:
          "Yes, we specialize in modernizing legacy applications while preserving business logic and migrating data securely.",
      },
      {
        question: "How do you handle scalability?",
        answer:
          "We design with horizontal scaling in mind, using microservices, containerization, and auto-scaling cloud infrastructure.",
      },
      {
        question: "What is your approach to responsive design?",
        answer:
          "We follow mobile-first principles, ensuring optimal experiences across all devices using modern CSS frameworks and thorough testing.",
      },
      {
        question: "Do you provide ongoing maintenance?",
        answer:
          "Yes, we offer comprehensive maintenance packages including updates, security patches, performance monitoring, and feature enhancements.",
      },
    ],
  },
  "mobile-app-development": {
    slug: "mobile-app-development",
    title: "Mobile App Development",
    subtitle: "Seamless iOS & Android Experiences",
    description:
      "Create native and cross-platform mobile applications that users love. From concept to App Store deployment, we handle every aspect of mobile development with precision and creativity.",
    heroImage: "/assets/mobile-app-development.webp",
    features: [
      "Native iOS & Android",
      "Cross-platform development",
      "UI/UX design",
      "App Store optimization",
      "Push notifications",
      "Offline functionality",
    ],
    galleryImages: [
      "/assets/health-connect-portal.png",
      "/assets/health-track-pro.png",
    ],
    customerServices: [
      {
        icon: "IconUsers",
        title: "Increased Customer Satisfaction",
        description:
          "Intuitive, performant mobile apps create delightful experiences that keep users coming back and recommending your brand.",
      },
      {
        icon: "IconSettings",
        title: "Improved Operational Efficiency",
        description:
          "Mobile solutions streamline field operations, remote work, and real-time collaboration for distributed teams.",
      },
      {
        icon: "IconTrendingUp",
        title: "Insights for Continuous Improvement",
        description:
          "Mobile analytics reveal user engagement patterns, helping you optimize features and drive retention strategies.",
      },
    ],
    faqs: [
      {
        question: "Do you develop native or cross-platform apps?",
        answer:
          "Both. We recommend native development for performance-critical apps and cross-platform (React Native, Flutter) for faster time-to-market and budget efficiency.",
      },
      {
        question: "How long does mobile app development take?",
        answer:
          "A typical MVP takes 3-6 months. Complex applications with advanced features may take 6-12 months depending on requirements.",
      },
      {
        question: "Do you handle app store submissions?",
        answer:
          "Yes, we manage the entire submission process including App Store and Google Play guidelines compliance, screenshots, and metadata.",
      },
      {
        question: "How do you ensure app performance?",
        answer:
          "We implement performance budgets, conduct profiling, optimize assets, and test on real devices across different OS versions.",
      },
      {
        question: "Can you integrate with our backend systems?",
        answer:
          "Absolutely. We integrate with REST APIs, GraphQL, Firebase, and custom backend solutions to ensure seamless data flow.",
      },
      {
        question: "What about post-launch support?",
        answer:
          "We offer maintenance packages covering OS updates, bug fixes, feature additions, and performance monitoring.",
      },
    ],
  },
  "qa-test-automation": {
    slug: "qa-test-automation",
    title: "QA & Test Automation",
    subtitle: "Faster Releases, Zero-Bug Quality",
    description:
      "Implement comprehensive testing strategies that catch bugs early, reduce manual effort, and ensure consistent quality across releases. Our automation frameworks accelerate your delivery pipeline without compromising quality.",
    heroImage: "/assets/qa-testing.png",
    features: [
      "Automated test suites",
      "CI/CD integration",
      "Cross-browser testing",
      "Performance testing",
      "Security testing",
      "Test reporting & analytics",
    ],
    galleryImages: [
      "/assets/cyber-security-audit.jpg",
      "/assets/devops-pipeline.webp",
    ],
    customerServices: [
      {
        icon: "IconUsers",
        title: "Increased Customer Satisfaction",
        description:
          "Rigorous testing ensures stable, reliable applications that users can trust, reducing frustration and support tickets.",
      },
      {
        icon: "IconSettings",
        title: "Improved Operational Efficiency",
        description:
          "Automated testing reduces manual QA effort by up to 80%, allowing your team to focus on exploratory testing and feature development.",
      },
      {
        icon: "IconTrendingUp",
        title: "Insights for Continuous Improvement",
        description:
          "Detailed test reports and metrics identify patterns in defects, helping you address root causes and prevent future issues.",
      },
    ],
    faqs: [
      {
        question: "What types of testing do you automate?",
        answer:
          "We automate unit tests, integration tests, end-to-end tests, API tests, visual regression tests, and performance tests.",
      },
      {
        question: "Which tools do you use for test automation?",
        answer:
          "We use industry-leading tools including Playwright, Cypress, Selenium, Jest, and custom frameworks tailored to your tech stack.",
      },
      {
        question: "How do you integrate testing into CI/CD?",
        answer:
          "We configure automated test execution within your CI/CD pipeline, ensuring every code change is validated before deployment.",
      },
      {
        question: "Can you test existing applications?",
        answer:
          "Yes, we can implement testing strategies for existing codebases, including legacy applications, to improve reliability.",
      },
      {
        question: "How do you measure test coverage?",
        answer:
          "We provide detailed coverage reports tracking code coverage, requirement coverage, and risk-based coverage metrics.",
      },
      {
        question: "What is your approach to test maintenance?",
        answer:
          "We design tests with maintainability in mind, using page object models, data-driven approaches, and regular refactoring.",
      },
    ],
  },
  "ux-ui-design": {
    slug: "ux-ui-design",
    title: "UX/UI Design",
    subtitle: "User-First Design That Drives Adoption",
    description:
      "Create intuitive, beautiful interfaces that users love. Our design process combines research-driven insights with creative excellence to deliver experiences that drive engagement, satisfaction, and business results.",
    heroImage: "/assets/ux-ui-design.jpg",
    features: [
      "User research & testing",
      "Wireframing & prototyping",
      "Visual design systems",
      "Interaction design",
      "Accessibility compliance",
      "Design handoff & documentation",
    ],
    galleryImages: ["/assets/food-dash.webp", "/assets/fit-force.png"],
    customerServices: [
      {
        icon: "IconUsers",
        title: "Increased Customer Satisfaction",
        description:
          "Thoughtful, user-centered design creates intuitive experiences that delight users and exceed their expectations.",
      },
      {
        icon: "IconSettings",
        title: "Improved Operational Efficiency",
        description:
          "Well-designed interfaces reduce training time, minimize errors, and help teams accomplish tasks more efficiently.",
      },
      {
        icon: "IconTrendingUp",
        title: "Insights for Continuous Improvement",
        description:
          "User research and usability testing provide continuous feedback that drives iterative design improvements.",
      },
    ],
    faqs: [
      {
        question: "What does your UX/UI design process include?",
        answer:
          "Our process includes discovery, user research, information architecture, wireframing, visual design, prototyping, and usability testing.",
      },
      {
        question: "How do you ensure designs are user-friendly?",
        answer:
          "We conduct user interviews, create personas, build prototypes for testing, and iterate based on real user feedback.",
      },
      {
        question: "Do you create design systems?",
        answer:
          "Yes, we build comprehensive design systems with reusable components, style guides, and documentation for consistent scaling.",
      },
      {
        question: "How do you handle design handoff to developers?",
        answer:
          "We provide detailed specifications, interactive prototypes, and design tokens to ensure accurate implementation.",
      },
      {
        question: "Can you redesign our existing product?",
        answer:
          "Absolutely. We conduct UX audits of existing products and create redesign strategies that address pain points while preserving familiar workflows.",
      },
      {
        question: "What tools do you use?",
        answer:
          "We use Figma for design and prototyping, Miro for collaboration, and various user testing platforms for research.",
      },
    ],
  },
  "data-engineering": {
    slug: "data-engineering",
    title: "Data Engineering",
    subtitle: "AI-Ready Data Foundations for Growth",
    description:
      "Build robust data pipelines and infrastructure that power analytics, machine learning, and business intelligence. We help organizations transform raw data into strategic assets that drive informed decision-making.",
    heroImage: "/assets/data-engineering.webp",
    features: [
      "Data pipeline architecture",
      "ETL/ELT processes",
      "Data warehousing",
      "Real-time streaming",
      "Data quality & governance",
      "Machine learning ops",
    ],
    galleryImages: ["/assets/data-pulse.png", "/assets/finflow.webp"],
    customerServices: [
      {
        icon: "IconUsers",
        title: "Increased Customer Satisfaction",
        description:
          "Data-driven insights enable personalized customer experiences, proactive support, and products that truly meet user needs.",
      },
      {
        icon: "IconSettings",
        title: "Improved Operational Efficiency",
        description:
          "Automated data pipelines eliminate manual processing, reduce errors, and ensure teams have access to fresh, reliable data.",
      },
      {
        icon: "IconTrendingUp",
        title: "Insights for Continuous Improvement",
        description:
          "Comprehensive analytics and reporting dashboards provide visibility into KPIs and trends that guide strategic decisions.",
      },
    ],
    faqs: [
      {
        question: "What data engineering services do you offer?",
        answer:
          "We offer data pipeline development, data warehousing, ETL/ELT implementation, real-time streaming, and data governance solutions.",
      },
      {
        question: "Which cloud platforms do you support?",
        answer:
          "We work with AWS, Google Cloud, and Azure, designing cloud-native data architectures that leverage each platform's strengths.",
      },
      {
        question: "How do you ensure data quality?",
        answer:
          "We implement data validation, monitoring, and cleansing processes along with governance frameworks to maintain high data quality.",
      },
      {
        question: "Can you handle real-time data processing?",
        answer:
          "Yes, we design streaming architectures using Kafka, Kinesis, and other technologies for real-time analytics and processing.",
      },
      {
        question: "How do you approach data security?",
        answer:
          "We implement encryption, access controls, data masking, and compliance measures to protect sensitive information.",
      },
      {
        question: "What is your experience with big data?",
        answer:
          "We have extensive experience with Spark, Hadoop, and modern data lakes, handling petabyte-scale data processing.",
      },
    ],
  },
  aws: {
    slug: "aws",
    title: "AWS",
    subtitle: "Optimize Cost, Security & Scalability",
    description:
      "Leverage the full power of Amazon Web Services with our expert cloud solutions. We help businesses architect, migrate, and optimize AWS infrastructure for performance, security, and cost efficiency.",
    heroImage: "/assets/aws.webp",
    features: [
      "Cloud architecture design",
      "Migration & modernization",
      "Cost optimization",
      "Security & compliance",
      "Managed services",
      "Disaster recovery",
    ],
    galleryImages: [
      "/assets/amazon-cloudwatch.png",
      "/assets/cloud-migration-system.png",
    ],
    customerServices: [
      {
        icon: "IconUsers",
        title: "Increased Customer Satisfaction",
        description:
          "Reliable, high-performance AWS infrastructure ensures your applications are always available and responsive to user needs.",
      },
      {
        icon: "IconSettings",
        title: "Improved Operational Efficiency",
        description:
          "Automated infrastructure management and DevOps practices reduce manual overhead and accelerate deployment cycles.",
      },
      {
        icon: "IconTrendingUp",
        title: "Insights for Continuous Improvement",
        description:
          "Cloud monitoring and cost analytics provide visibility into resource utilization, enabling continuous optimization.",
      },
    ],
    faqs: [
      {
        question: "What AWS services do you specialize in?",
        answer:
          "We specialize in EC2, ECS/EKS, Lambda, RDS, S3, CloudFront, VPC, and comprehensive AWS Well-Architected reviews.",
      },
      {
        question: "How do you optimize AWS costs?",
        answer:
          "We analyze usage patterns, right-size instances, implement reserved capacity, and leverage serverless where appropriate.",
      },
      {
        question: "Can you migrate our on-premise infrastructure to AWS?",
        answer:
          "Yes, we provide end-to-end migration services including assessment, planning, execution, and post-migration optimization.",
      },
      {
        question: "How do you ensure AWS security?",
        answer:
          "We implement IAM best practices, security groups, encryption, monitoring, and compliance frameworks tailored to your industry.",
      },
      {
        question: "Do you offer AWS managed services?",
        answer:
          "Yes, we offer 24/7 monitoring, incident response, patching, and optimization as part of our managed services.",
      },
      {
        question: "What is your approach to AWS architecture?",
        answer:
          "We follow AWS Well-Architected Framework principles, designing for security, reliability, performance, and cost optimization.",
      },
    ],
  },
  "cloud-engineering-devops": {
    slug: "cloud-engineering-devops",
    title: "Cloud Engineering & DevOps",
    subtitle: "Automated Pipelines, Reliable Deployments",
    description:
      "Streamline your development and operations with modern DevOps practices. We build automated CI/CD pipelines, infrastructure as code, and monitoring solutions that accelerate delivery while maintaining reliability.",
    heroImage: "/assets/cloud-engineering-devops.jpg",
    features: [
      "CI/CD pipeline automation",
      "Infrastructure as Code",
      "Container orchestration",
      "Monitoring & observability",
      "Cloud-native architecture",
      "DevSecOps integration",
    ],
    galleryImages: [
      "/assets/devops-pipeline.webp",
      "/assets/cloudsync-platform.webp",
    ],
    customerServices: [
      {
        icon: "IconUsers",
        title: "Increased Customer Satisfaction",
        description:
          "Faster, more reliable deployments mean new features reach customers quicker and critical issues are resolved faster.",
      },
      {
        icon: "IconSettings",
        title: "Improved Operational Efficiency",
        description:
          "Automation eliminates manual deployment steps, reduces human error, and frees your team to focus on innovation.",
      },
      {
        icon: "IconTrendingUp",
        title: "Insights for Continuous Improvement",
        description:
          "Comprehensive monitoring and alerting provide real-time visibility into system health and performance trends.",
      },
    ],
    faqs: [
      {
        question: "What DevOps tools do you use?",
        answer:
          "We use Terraform, Kubernetes, Docker, Jenkins, GitHub Actions, GitLab CI, and cloud-native tools depending on your requirements.",
      },
      {
        question: "How do you implement CI/CD?",
        answer:
          "We design pipelines with automated testing, security scanning, and staged deployments to ensure quality at every step.",
      },
      {
        question: "Can you modernize our existing infrastructure?",
        answer:
          "Yes, we assess current infrastructure and create modernization roadmaps using containers, microservices, and cloud-native patterns.",
      },
      {
        question: "How do you handle monitoring?",
        answer:
          "We implement comprehensive observability with metrics, logs, and traces using tools like Prometheus, Grafana, and ELK stack.",
      },
      {
        question: "What is Infrastructure as Code?",
        answer:
          "IaC allows you to manage infrastructure through code, enabling version control, automated provisioning, and consistent environments.",
      },
      {
        question: "Do you provide DevOps training?",
        answer:
          "Yes, we offer training programs to help your team adopt DevOps practices and manage the infrastructure we build.",
      },
    ],
  },
};

export function getServiceData(slug: string): ServicePageData | undefined {
  return servicesData[slug];
}
