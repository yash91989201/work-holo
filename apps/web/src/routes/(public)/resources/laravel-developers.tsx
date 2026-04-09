import { BrandLaravel, Database, Server, Shield } from "@tabler/icons-react";
import { HireDeveloperTemplate } from "~/components/public/resources";

export default function LaravelDevelopers() {
  return (
    <HireDeveloperTemplate
      ctaButtonHref="/contact"
      ctaButtonLabel="Hire Developers"
      ctaDescription="Hire our Laravel developers for scalable web apps."
      ctaTitle="Ready for Laravel Development?"
      featuresDescription="Our Laravel developers create robust PHP applications with clean, maintainable code."
      featuresItems={[
        {
          icon: BrandLaravel,
          title: "Laravel Framework",
          desc: "Expertise in Laravel's features like Eloquent ORM and Blade templating.",
        },
        {
          icon: Database,
          title: "Database Management",
          desc: "Handle migrations, seeders, and complex queries efficiently.",
        },
        {
          icon: Server,
          title: "API Development",
          desc: "Build RESTful APIs with Laravel's routing and middleware.",
        },
        {
          icon: Shield,
          title: "Security & Authentication",
          desc: "Implement secure authentication and authorization.",
        },
      ]}
      featuresTitle="Why Choose Our Laravel Developers?"
      heroHighlight="Laravel Developers"
      heroSubtitle="Build elegant web applications with Laravel framework"
      heroTitle="Hire"
    />
  );
}
