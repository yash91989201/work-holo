import { BrandJavascript, Code, Server, TestPipe } from "@tabler/icons-react";
import { HireDeveloperTemplate } from "~/components/public/resources";

export default function JavaScriptDevelopers() {
  return (
    <HireDeveloperTemplate
      ctaButtonHref="/contact"
      ctaButtonLabel="Hire Developers"
      ctaDescription="Hire our JavaScript developers for versatile solutions."
      ctaTitle="Ready for JavaScript Projects?"
      featuresDescription="Our JavaScript developers build dynamic applications for web and server-side."
      featuresItems={[
        {
          icon: BrandJavascript,
          title: "JavaScript Proficiency",
          desc: "Expertise in ES6+, asynchronous programming, and modern JS features.",
        },
        {
          icon: Code,
          title: "Frontend & Backend",
          desc: "Develop client-side interfaces and server-side logic.",
        },
        {
          icon: Server,
          title: "Node.js Development",
          desc: "Build scalable server applications with Node.js.",
        },
        {
          icon: TestPipe,
          title: "Testing & Debugging",
          desc: "Implement comprehensive testing and debugging strategies.",
        },
      ]}
      featuresTitle="Why Choose Our JavaScript Developers?"
      heroHighlight="JavaScript Developers"
      heroSubtitle="Master versatile web development with JavaScript expertise"
      heroTitle="Hire"
    />
  );
}
