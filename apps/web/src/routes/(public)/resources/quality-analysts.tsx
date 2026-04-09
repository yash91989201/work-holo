import { BarChart, Bug, CheckCircle, TestPipe } from "@tabler/icons-react";
import { HireDeveloperTemplate } from "~/components/public/resources";

export default function QualityAnalysts() {
  return (
    <HireDeveloperTemplate
      ctaButtonHref="/contact"
      ctaButtonLabel="Hire Developers"
      ctaDescription="Hire our quality analysts for reliable software."
      ctaTitle="Need Quality Assurance?"
      featuresDescription="Our quality analysts perform comprehensive testing to deliver bug-free software."
      featuresItems={[
        {
          icon: CheckCircle,
          title: "Comprehensive Testing",
          desc: "Conduct manual and automated testing across platforms.",
        },
        {
          icon: Bug,
          title: "Bug Tracking",
          desc: "Identify, report, and track defects efficiently.",
        },
        {
          icon: TestPipe,
          title: "Test Automation",
          desc: "Implement automated test suites for regression testing.",
        },
        {
          icon: BarChart,
          title: "Quality Metrics",
          desc: "Provide reports on code coverage and quality scores.",
        },
      ]}
      featuresTitle="Why Choose Our Quality Analysts?"
      heroHighlight="Quality Analysts"
      heroSubtitle="Ensure software quality with expert testing and analysis"
      heroTitle="Hire"
    />
  );
}
