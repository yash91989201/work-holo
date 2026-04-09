import { BrandReact, Hooks, State, TestPipe } from "@tabler/icons-react";
import { HireDeveloperTemplate } from "~/components/public/resources";

export default function ReactDevelopers() {
  return (
    <HireDeveloperTemplate
      ctaButtonHref="/contact"
      ctaButtonLabel="Hire Developers"
      ctaDescription="Hire our React developers for engaging web experiences."
      ctaTitle="Ready to Build with React?"
      featuresDescription="Our React developers build dynamic user interfaces using modern React patterns."
      featuresItems={[
        {
          icon: BrandReact,
          title: "React Ecosystem",
          desc: "Proficiency in React, JSX, and related libraries like Redux.",
        },
        {
          icon: Hooks,
          title: "Hooks & Functional Components",
          desc: "Use modern React hooks for state management.",
        },
        {
          icon: State,
          title: "State Management",
          desc: "Implement efficient state management solutions.",
        },
        {
          icon: TestPipe,
          title: "Testing & Optimization",
          desc: "Write tests and optimize performance with React DevTools.",
        },
      ]}
      featuresTitle="Why Choose Our React Developers?"
      heroHighlight="React Developers"
      heroSubtitle="Create interactive UIs with React expertise"
      heroTitle="Hire"
    />
  );
}
