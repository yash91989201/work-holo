import { Code, Database, Server, Shield } from "@tabler/icons-react";
import { HireDeveloperTemplate } from "~/components/public/resources";

export default function PhpDevelopers() {
  return (
    <HireDeveloperTemplate
      ctaButtonHref="/contact"
      ctaButtonLabel="Hire Developers"
      ctaDescription="Hire our PHP developers for reliable web applications."
      ctaTitle="Ready for PHP Development?"
      featuresDescription="Our PHP developers build scalable web applications using frameworks like Laravel and Symfony."
      featuresItems={[
        {
          icon: Code,
          title: "Framework Proficiency",
          desc: "Expertise in Laravel, Symfony, CodeIgniter, and other PHP frameworks.",
        },
        {
          icon: Database,
          title: "Database Integration",
          desc: "Seamless integration with MySQL, PostgreSQL, and other databases.",
        },
        {
          icon: Server,
          title: "Backend Development",
          desc: "Build robust server-side logic and APIs.",
        },
        {
          icon: Shield,
          title: "Secure Coding",
          desc: "Implement secure practices to protect against vulnerabilities.",
        },
      ]}
      featuresTitle="Why Choose Our PHP Developers?"
      heroHighlight="PHP Developers"
      heroSubtitle="Develop dynamic web applications with PHP expertise"
      heroTitle="Hire"
    />
  );
}
