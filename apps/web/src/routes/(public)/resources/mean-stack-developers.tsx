import {
  BrandAngular,
  BrandMongodb,
  BrandNodejs,
  Stack,
} from "@tabler/icons-react";
import { HireDeveloperTemplate } from "~/components/public/resources";

export default function MeanStackDevelopers() {
  return (
    <HireDeveloperTemplate
      ctaButtonHref="/contact"
      ctaButtonLabel="Hire Developers"
      ctaDescription="Hire our MEAN stack developers for cohesive apps."
      ctaTitle="Ready for MEAN Stack?"
      featuresDescription="Our MEAN stack developers create scalable JavaScript-based applications."
      featuresItems={[
        {
          icon: BrandMongodb,
          title: "MongoDB Expertise",
          desc: "Design NoSQL databases for flexible data storage.",
        },
        {
          icon: BrandAngular,
          title: "Angular Frontend",
          desc: "Build responsive SPAs with Angular framework.",
        },
        {
          icon: BrandNodejs,
          title: "Node.js Backend",
          desc: "Develop server-side logic with Node.js and Express.",
        },
        {
          icon: Stack,
          title: "Integrated Stack",
          desc: "Leverage JavaScript across the entire stack for consistency.",
        },
      ]}
      featuresTitle="Why Choose Our MEAN Stack Developers?"
      heroHighlight="MEAN Stack Developers"
      heroSubtitle="Build dynamic apps with MongoDB, Express, Angular, Node.js"
      heroTitle="Hire"
    />
  );
}
