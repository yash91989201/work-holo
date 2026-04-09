import { BrandVue, Component, State, TestPipe } from "@tabler/icons-react";
import { HireDeveloperTemplate } from "~/components/public/resources";

export default function VueJsDevelopers() {
  return (
    <HireDeveloperTemplate
      ctaButtonHref="/contact"
      ctaButtonLabel="Hire Developers"
      ctaDescription="Hire our Vue.js developers for progressive apps."
      ctaTitle="Ready for Vue.js?"
      featuresDescription="Our Vue.js developers create lightweight, performant web applications."
      featuresItems={[
        {
          icon: BrandVue,
          title: "Vue.js Framework",
          desc: "Expertise in Vue 3, Composition API, and Vue Router.",
        },
        {
          icon: Component,
          title: "Component Architecture",
          desc: "Build reusable components with Vue's reactive system.",
        },
        {
          icon: State,
          title: "State Management",
          desc: "Implement Pinia or Vuex for complex state handling.",
        },
        {
          icon: TestPipe,
          title: "Testing & Optimization",
          desc: "Ensure quality with Vue Test Utils and performance tuning.",
        },
      ]}
      featuresTitle="Why Choose Our Vue.js Developers?"
      heroHighlight="Vue.js Developers"
      heroSubtitle="Build progressive web apps with Vue.js expertise"
      heroTitle="Hire"
    />
  );
}
