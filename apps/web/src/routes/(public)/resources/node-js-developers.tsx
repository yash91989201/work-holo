import { BrandNodejs, Database, Globe, Server } from "@tabler/icons-react";
import { HireDeveloperTemplate } from "~/components/public/resources";

export default function NodeJsDevelopers() {
  return (
    <HireDeveloperTemplate
      ctaButtonHref="/contact"
      ctaButtonLabel="Hire Developers"
      ctaDescription="Hire our Node.js developers for robust servers."
      ctaTitle="Need Node.js Backend?"
      featuresDescription="Our Node.js developers build fast, efficient backend services."
      featuresItems={[
        {
          icon: BrandNodejs,
          title: "Node.js Expertise",
          desc: "Proficiency in Node.js runtime and npm ecosystem.",
        },
        {
          icon: Server,
          title: "Server Development",
          desc: "Build RESTful APIs and microservices.",
        },
        {
          icon: Database,
          title: "Database Integration",
          desc: "Connect to SQL and NoSQL databases seamlessly.",
        },
        {
          icon: Globe,
          title: "Real-Time Applications",
          desc: "Develop chat apps, live updates with WebSockets.",
        },
      ]}
      featuresTitle="Why Choose Our Node.js Developers?"
      heroHighlight="Node.js Developers"
      heroSubtitle="Develop scalable server-side applications with Node.js"
      heroTitle="Hire"
    />
  );
}
