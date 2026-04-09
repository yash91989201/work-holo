import { Breadcrumb } from "~/components/ui/breadcrumb";

interface HireHeroProps {
  highlight: string;
  subtitle: string;
  title: string;
}

export function HireHero({ title, highlight, subtitle }: HireHeroProps) {
  return (
    <section className="bg-gradient-to-br from-slate-50 to-slate-100 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Resources", href: "/resources" },
            { label: "Hire Developers", href: "/resources/hire-developers" },
          ]}
        />
        <div className="mt-8 text-center">
          <h1 className="font-bold text-4xl text-slate-900 md:text-6xl">
            {title} <span className="text-green-500">{highlight}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-600 md:text-xl">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}
