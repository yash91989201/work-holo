import { BrandAngular, Component, Route, TestPipe } from "@tabler/icons-react";
import { HireDeveloperTemplate } from "~/components/public/resources";

export default function AngularDevelopers() {
  return (
    <HireDeveloperTemplate
      ctaButtonHref="/contact"
      ctaButtonLabel="Hire Developers"
      ctaDescription="Hire our Angular developers for modern web apps."
      ctaTitle="Ready for Angular Development?"
      featuresDescription="Our Angular developers create robust SPAs using the latest Angular features."
      featuresItems={[
        {
          icon: BrandAngular,
          title: "Angular Proficiency",
          desc: "Expertise in Angular framework, TypeScript, and RxJS.",
        },
        {
          icon: Component,
          title: "Component-Based Architecture",
          desc: "Build reusable components for maintainable code.",
        },
        {
          icon: Route,
          title: "Routing & Navigation",
          desc: "Implement complex routing for single-page applications.",
        },
        {
          icon: TestPipe,
          title: "Testing & Quality",
          desc: "Ensure code quality with unit and integration tests.",
        },
      ]}
      featuresTitle="Why Choose Our Angular Developers?"
      heroHighlight="Angular Developers"
      heroSubtitle="Build scalable web applications with Angular expertise"
      heroTitle="Hire"
    />
  );
}
