import { BarChart, Cloud, Server, Shield } from "@tabler/icons-react";
import { HireDeveloperTemplate } from "~/components/public/resources";

export default function AwsDevelopers() {
  return (
    <HireDeveloperTemplate
      ctaButtonHref="/contact"
      ctaButtonLabel="Hire Developers"
      ctaDescription="Hire our AWS developers for cloud expertise."
      ctaTitle="Ready for AWS Cloud?"
      featuresDescription="Our AWS developers architect and deploy cloud-native applications."
      featuresItems={[
        {
          icon: Cloud,
          title: "Cloud Architecture",
          desc: "Design scalable infrastructure with EC2, S3, Lambda.",
        },
        {
          icon: Server,
          title: "Serverless Solutions",
          desc: "Build cost-effective apps with AWS Lambda and API Gateway.",
        },
        {
          icon: Shield,
          title: "Security & Compliance",
          desc: "Implement IAM, VPC, and security best practices.",
        },
        {
          icon: BarChart,
          title: "Monitoring & Optimization",
          desc: "Use CloudWatch and optimize for performance and cost.",
        },
      ]}
      featuresTitle="Why Choose Our AWS Developers?"
      heroHighlight="AWS Developers"
      heroSubtitle="Leverage Amazon Web Services for scalable cloud solutions"
      heroTitle="Hire"
    />
  );
}
