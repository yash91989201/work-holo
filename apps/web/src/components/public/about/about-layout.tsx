import { AboutHero } from "./about-hero";
import { AboutNav } from "./about-nav";

interface AboutLayoutProps {
  badge?: string;
  children: React.ReactNode;
  subtitle: string;
  title: string;
}

export function AboutLayout({
  title,
  subtitle,
  badge,
  children,
}: AboutLayoutProps) {
  return (
    <>
      <AboutHero badge={badge} subtitle={subtitle} title={title} />
      <div className="container py-12 md:py-16">
        <div className="flex flex-col space-y-8 md:flex-row md:space-x-12 md:space-y-0">
          <aside className="w-full md:w-1/4">
            <AboutNav />
          </aside>
          <main className="w-full flex-1">{children}</main>
        </div>
      </div>
    </>
  );
}
