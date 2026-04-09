import {
  BrandMongodb,
  BrandNodejs,
  BrandReact,
  Stack,
} from "@tabler/icons-react";
import { HireDeveloperTemplate } from "~/components/public/resources";

export default function MernStackDevelopers() {
  return (
    <HireDeveloperTemplate
      ctaButtonHref="/contact"
      ctaButtonLabel="Hire Developers"
      ctaDescription="Hire our MERN stack developers for innovative apps."
      ctaTitle="Ready for MERN Development?"
      featuresDescription="Our MERN stack developers build fast, scalable web applications."
      featuresItems={[
        {
          icon: BrandMongodb,
          title: "MongoDB Database",
          desc: "Use NoSQL for flexible and scalable data management.",
        },
        {
          icon: BrandReact,
          title: "React Frontend",
          desc: "Develop interactive UIs with React components.",
        },
        {
          icon: BrandNodejs,
          title: "Node.js Backend",
          desc: "Build efficient server-side applications.",
        },
        {
          icon: Stack,
          title: "Full JavaScript Stack",
          desc: "Maintain consistency with JavaScript throughout.",
        },
      ]}
      featuresTitle="Why Choose Our MERN Stack Developers?"
      heroHighlight="MERN Stack Developers"
      heroSubtitle="Create modern apps with MongoDB, Express, React, Node.js"
      heroTitle="Hire"
    />
  );
}
